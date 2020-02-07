<template>
  <div>
    <div v-if="step === 'deleting'">
      Deleting <strong>{{ change.path }}</strong>
    </div>
    <div v-if="step === 'downloading'">
      <div>{{ change.path }}</div>
      <progress class="progress is-primary" :value="downloadPercentage" :max="1">
        {{ downloadPercentage * 100 }}%
      </progress>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CancelToken } from "axios";
import Component from "vue-class-component";
import { LocalRepository } from "../../Core/LocalRepository";
import { Prop } from "vue-property-decorator";
import { Change } from "../../Core/Task/Change";
import { ItemState } from "../../Core/ItemState";
import { unlinkSync, stat, createWriteStream, mkdirSync, ReadStream, statSync, write } from "fs";
import { promisify } from "util";
import { FileInfo } from "../../Core/FileInfo";
import { net, remote, ipcRenderer } from "electron";
import { RepositoryUtils } from "../../Core/RepositoryUtils";
import { DownloadRequest } from "../../Core/DownloadRequest";
import { DownloadUpdate } from "../../Core/DownloadUpdate";
import { DownloadDone } from "../../Core/DownloadDone";

@Component
export default class ItemUpdateHandler extends Vue {
  @Prop()
  private repository!: LocalRepository;
  @Prop()
  private change!: Change;

  private step: string = "";
  private downloadPercentage = 0;
  private downloadedBytes = 0;
  private source = this.axios.CancelToken.source();

  public created() {
    console.log("Created for change: " + this.change.path);
    switch (this.change.type) {
      case ItemState.PENDING_DELETE:
        this.delete().then(() => {
          this.$emit("done", this.change);
        });
        break;

      case ItemState.PENDING_UPDATE:
        this.update();
        break;

      case ItemState.PENDING_CREATION:
        this.step = "downloading";
        this.download().then(() => {
          this.$emit("done", this.change);
        });
        break;
    }
  }

  private async delete() {
    unlinkSync(this.repository.filesPath + "/" + this.change.path);
  }

  private async download(from = 0) {
    const item = new FileInfo();
    const requestUrl = this.repository.getPrimaryUrlForFile(this.change.path);
    this.downloadedBytes = from;

    item.state = ItemState.DOWNLOADING;
    item.name = this.change.path.substring(this.change.path.lastIndexOf("/"));

    this.repository.items[this.change.path] = item;

    const fullPath = this.repository.filesPath + "/" + this.change.path;

    mkdirSync(fullPath.substring(0, fullPath.lastIndexOf("/")), {
      recursive: true
    });

    ipcRenderer.send("download-request", {
      url: requestUrl + "?offset=" + from,
      path: fullPath
    } as DownloadRequest);

    ipcRenderer.on("download-update", this.onDownloadUpdate.bind(this));
    ipcRenderer.on("download-done", this.onDownloadDone.bind(this));
  }

  private onDownloadUpdate(event: Electron.IpcRendererEvent, message: DownloadUpdate) {
    if (message.path === this.change.path) {
      this.downloadedBytes += message.bytesDownloaded;
      this.downloadPercentage = this.downloadedBytes / this.change.size;
    }
  }

  private onDownloadDone(event: Electron.IpcRendererEvent, message: DownloadDone) {
    if (message.path === this.change.path) {
      ipcRenderer.removeListener("download-update", this.onDownloadUpdate);
      ipcRenderer.removeListener("download-done", this.onDownloadDone);

      this.$emit("done", this.change);
    }
  }

  // private nodeRequest() {
  //   const request = remote.net.request({
  //     method: "GET",
  //     url: requestUrl + "?offset=" + from
  //   });

  //   console.log(requestUrl + "?offset=" + from);

  //   request.on("abort", () => {
  //     console.log("ABORT");
  //   });
  //   request.on("error", error => {
  //     throw error;
  //   });

  //   request.on("response", response => {
  //     response.on("data", chunk => {
  //       console.log("DATA");
  //       writeStream.write(chunk);
  //       downloaded += chunk.length;
  //       this.downloadPercentage = downloaded / this.change.size;
  //     });

  //     response.on("end", async () => {
  //       console.log("Finished for " + this.change.path);
  //       writeStream.close();
  //       item.size = statSync(fullPath).size;
  //       item.hash = await RepositoryUtils.calculateFileMD5(fullPath);
  //       resolve();
  //     });
  //   });

  //   request.end();
  // }

  private async update() {
    const item = this.repository.items[this.change.path];
    let startFrom = 0;
    // DOWNLOADING means we saved the item during the middle of a download
    if (item.state != ItemState.DOWNLOADING) {
      // We need to delete the item to download it again
      this.step = "deleting";
      await this.delete();
    } else {
      const statAsync = promisify(stat);
      startFrom = (await statAsync(this.repository.filesPath + "/" + this.change.path)).size;
    }

    this.step = "downloading";
    await this.download(startFrom);

    this.$emit("done", this.change);
  }

  public stop() {
    if (this.step === "downloading") {
      this.source.cancel();
      const fullPath = this.repository.filesPath + "/" + this.change.path;
      const item = this.repository.items[this.change.path];
      item.size = statSync(fullPath).size;
    }
  }
}
</script>
