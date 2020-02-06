<template>
  <div>
    <div class="display-flex width-100">
      <div class="width-40">
        <RepositoryComponent
          v-for="(repository, index) in repositories"
          :key="index"
          :repository="repository"
          @click="selectedRepository = repository"
        ></RepositoryComponent>
        <button class="button has-background-black has-text-white width-100" @click="onAddRepositoryClicked">
          <div class="padding-x-1">
            <span class="fas fa-plus"></span>
          </div>
          Add repository
        </button>
      </div>
      <div class="width-60">
        <RepositoryDetailsComponent
          v-if="selectedRepository"
          :repository="selectedRepository"
          @updateDownloadRequested="downloadRepositoryModal.open()"
        ></RepositoryDetailsComponent>
      </div>
    </div>
    <AddRepositoryModal ref="addRepositoryModal" @repositoryAdded="onRepositoryadded"></AddRepositoryModal>
    <DownloadRepositoryModal
      ref="downloadRepositoryModal"
      :localRepository="selectedRepository"
    ></DownloadRepositoryModal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AppHeader from "../Components/AppHeader.vue";
import RepositoryComponent from "../Components/RepositoryComponent.vue";
import { remote } from "electron";
import { readFile, existsSync } from "fs";
import { promisify } from "util";
import { RepositoryDetails } from "../../Core/RepositoryDetails";
import { LocalRepository } from "../../Core/LocalRepository";
import { RepositoryState } from "../../Core/RepositoryState";
import RepositoryDetailsComponent from "../Components/RepositoryDetailsComponent.vue";
import AddRepositoryModal from "../Components/AddRepositoryModal.vue";
import RepositoryManager from "@/Core/RepositoryManager";
import DownloadRepositoryModal from "../Components/DownloadRepositoryModal.vue";

@Component({
  components: {
    AppHeader,
    RepositoryComponent,
    RepositoryDetailsComponent,
    AddRepositoryModal,
    DownloadRepositoryModal
  }
})
export default class RepositoriesView extends Vue {
  private repositories: LocalRepository[] = [];
  private selectedRepository: LocalRepository | null = null;

  public created() {
    this.updateRepositories();
  }

  private onRepositoryadded() {
    this.addRepositoryModal.close();
    this.updateRepositories();
  }

  private onDownloadUpdatesClicked() {
    console.log("Open download");
    this.downloadRepositoryModal.open();
  }

  private updateRepositories() {
    this.repositories = RepositoryManager.LocalRepositories;
  }

  private get addRepositoryModal() {
    return this.$refs.addRepositoryModal as AddRepositoryModal;
  }

  private onAddRepositoryClicked() {
    this.addRepositoryModal.open();
  }

  private get downloadRepositoryModal() {
    return this.$refs.downloadRepositoryModal as DownloadRepositoryModal;
  }
}
</script>
