<template>
  <div class="modal" ref="modalContainer">
    <div class="modal-background"></div>
    <div class="modal-content box">
      <div class="control margin-bottom-2" :class="controlClasses">
        <input class="input" placeholder="Repository URL" v-model="repositoryUrl" />
      </div>

      <div class="field has-addons">
        <div class="control is-expanded">
          <input class="input" placeholder="Destination folder" v-model="destinationFolder" />
        </div>

        <div class="control">
          <button class="button is-primary" @click="onBrowseClicked">Browse</button>
        </div>
      </div>

      <div class="has-text-left">
        <div class="has-text-weight-bold has-text-centered">Repository details</div>

        <div class="columns">
          <div class="column padding-bottom-0">
            <span class="has-text-weight-bold">Repository name:</span> {{ remoteRepositoryName }}
          </div>
          <div class="column padding-bottom-0">
            <span class="has-text-weight-bold">Repository state:</span> {{ remoteRepositoryState }}
          </div>
        </div>

        <div class="columns">
          <div class="column padding-top-0">
            <span class="has-text-weight-bold">Repository size:</span> {{ repositorySize }}
          </div>
        </div>
      </div>

      <div>
        <button class="button is-primary" @click="addRepository">Add repository</button>
      </div>
    </div>
    <button class="modal-close is-large" @click="close"></button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { remote, net, IncomingMessage, Remote } from "electron";
import { Watch } from "vue-property-decorator";
import { RemoteRepository } from "../../Core/RemoteRepository";
import { RepositoryUtils } from "../../Core/RepositoryUtils";
import RepositoryManager from "../../Core/RepositoryManager";

@Component
export default class AddRepositoryModal extends Vue {
  private repositoryUrl = "";
  private destinationFolder = "";
  private repositorySize = "";
  private remoteRepository: RemoteRepository | null = null;
  private debounceTimeout: NodeJS.Timeout | null = null;
  private isLoading = false;

  private get modalContainer() {
    return this.$refs.modalContainer as HTMLDivElement;
  }

  private get controlClasses() {
    return {
      "is-loading": this.isLoading
    };
  }

  @Watch("repositoryUrl")
  private onRepositoryUrlChanged() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(this.getRepositoryInformation.bind(this), 500);
  }

  private addRepository() {
    if (this.remoteRepository) {
      RepositoryManager.createFromRemoteRepository(this.remoteRepository, [this.repositoryUrl], this.destinationFolder);
      this.$emit("repositoryAdded");
    }
  }

  private get remoteRepositoryName() {
    return this.remoteRepository ? this.remoteRepository.name : "";
  }

  private get remoteRepositoryState() {
    return this.remoteRepository ? this.remoteRepository.state : "";
  }

  private async getRepositoryInformation() {
    this.debounceTimeout = null;
    this.isLoading = true;

    this.axios
      .get(this.repositoryUrl)
      .then(response => {
        this.remoteRepository = response.data as RemoteRepository;
        RepositoryUtils.calculateRepositorySize(this.remoteRepository).then(size => {
          this.repositorySize = RepositoryUtils.sizeToHumanReadableString(size);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private onBrowseClicked() {
    remote.dialog
      .showOpenDialog({
        title: "Choose destination folder",
        properties: ["openDirectory", "createDirectory", "promptToCreate"]
      })
      .then(value => {
        if (!value.canceled) {
          this.destinationFolder = value.filePaths![0];
        }
      });
  }

  public open() {
    this.modalContainer.classList.add("is-active");
  }
  public close() {
    this.modalContainer.classList.remove("is-active");
  }
}
</script>
