<template>
  <div class="modal" ref="modalContainer">
    <div class="modal-background"></div>
    <div class="modal-content box">
      <div v-if="!isUpdating">
        <div v-if="isCalculatingChanges">
          <span class="fas fa-cog fa-spin"></span>
          Calculating changes
        </div>

        <div v-for="(change, index) in changes" :key="index">
          {{ change.path }} - <strong>{{ change.type }}</strong>
        </div>

        <hr />

        <div class="has-text-left">
          <div>
            <strong>{{ additions.length }}</strong> files will be downloaded. ({{ additionsSize }})
          </div>

          <div>
            <strong>{{ updates.length }}</strong> files will be updated. ({{ updatesSize }})
          </div>

          <div>
            <strong>{{ deletions.length }}</strong> files will be deleted. ({{ deletionsSize }})
          </div>
        </div>

        <hr />

        <button class="button is-primary" @click="startUpdate">Confirm changes</button>
      </div>
      <div v-else>
        <ItemUpdateHandler
          v-for="change in inProgress"
          ref="handlers"
          :key="change.path"
          :repository="localRepository"
          :change="change"
          @done="onChangeDone"
        ></ItemUpdateHandler>
      </div>
    </div>
    <button class="modal-close is-large" @click="close"></button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LocalRepository } from "../../Core/LocalRepository";
import { Prop, Component } from "vue-property-decorator";
import { Change } from "../../Core/Task/Change";
import { RemoteRepository } from "../../Core/RemoteRepository";
import { ComputeChangesTask } from "../../Core/Task/ComputeChangesTask";
import { ItemState } from "../../Core/ItemState";
import { RepositoryUtils } from "../../Core/RepositoryUtils";
import ItemUpdateHandler from "./ItemUpdateHandler.vue";

@Component({
  components: {
    ItemUpdateHandler
  }
})
export default class DownloadRepositoryModal extends Vue {
  private changes: Change[] = [];
  private isCalculatingChanges = false;
  private isUpdating = false;
  private inProgress: Change[] = [];
  @Prop()
  private localRepository!: LocalRepository;
  private remoteRepository!: RemoteRepository;

  private get modalContainer() {
    return this.$refs.modalContainer as HTMLDivElement;
  }

  private get additions() {
    return this.changes.filter(change => change.type == ItemState.PENDING_CREATION);
  }

  private get additionsSize() {
    return RepositoryUtils.sizeToHumanReadableString(this.sumChangeSizes(this.additions));
  }

  private get updates() {
    return this.changes.filter(change => change.type == ItemState.PENDING_UPDATE);
  }

  private get updatesSize() {
    return RepositoryUtils.sizeToHumanReadableString(this.sumChangeSizes(this.updates));
  }

  private get deletions() {
    return this.changes.filter(change => change.type == ItemState.PENDING_DELETE);
  }

  private get deletionsSize() {
    return RepositoryUtils.sizeToHumanReadableString(this.sumChangeSizes(this.deletions));
  }

  private sumChangeSizes(changes: Change[]) {
    let sum = 0;
    for (const change of changes) {
      sum += change.size;
    }

    return sum;
  }

  private async getChanges() {
    this.isCalculatingChanges = true;
    this.remoteRepository = RemoteRepository.fromPlain(
      await this.axios.get(this.localRepository.remoteUrls[0]).then(response => response.data)
    );
    this.changes = await new ComputeChangesTask(this.localRepository, this.remoteRepository).run();
    this.isCalculatingChanges = false;
  }

  private startUpdate() {
    this.isUpdating = true;

    for (let i = 0; i < 1; i++) {
      this.stageChange();
    }
  }

  private onChangeDone(change: Change) {
    this.inProgress.splice(this.inProgress.indexOf(change), 1);
    this.stageChange();

    if (this.inProgress.length === 0) {
      this.isUpdating = false;
      this.localRepository.version = this.remoteRepository.version;
    }
  }

  private stageChange() {
    if (this.changes.length > 0) {
      const change = this.changes.splice(0, 1)[0];
      this.inProgress.push(change);
    }
  }

  public open() {
    this.modalContainer.classList.add("is-active");
    this.getChanges();
  }

  public close() {
    if (this.isUpdating) {
      const handlers = this.$refs.handlers as ItemUpdateHandler[];
      for (const handler of handlers) {
        handler.stop();
      }

      this.isUpdating = false;
    }
    this.modalContainer.classList.remove("is-active");
  }
}
</script>
