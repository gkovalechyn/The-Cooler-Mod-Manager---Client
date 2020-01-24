<template>
  <div>
    <AppHeader></AppHeader>
    <div class="display-flex width-100">
      <div class="width-40">
        <RepositoryComponent
          v-for="(repository, index) in repositories"
          :key="index"
          :repository="repository"
        ></RepositoryComponent>
      </div>
      <div class="width-60">
        Right side
      </div>
    </div>
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

@Component({
  components: {
    AppHeader,
    RepositoryComponent
  }
})
export default class RepositoriesView extends Vue {
  private repositories: LocalRepository[] = [
    {
      name: "Test repository",
      state: RepositoryState.READY,
      remoteUrls: ["http://gkovalechyn.net/repositories/test asdasjd;ladjpoawjdpoajdpowajd"],
      items: {}
    }
  ];

  public created() {
    this.loadRepositories();
  }

  private async loadRepositories() {
    const path = remote.app.getAppPath() + "/repositories.json";
    const readFileAsync = promisify(readFile);

    if (existsSync(path)) {
      const repositoryList = JSON.parse(await readFileAsync(path, { encoding: "utf8" })) as RepositoryDetails[];

      for (const detail of repositoryList) {
        this.loadSingleRepository(detail).then(repository => {
          if (repository) {
            this.repositories.push(repository);
          }
        });
      }
    }
  }

  private async loadSingleRepository(details: RepositoryDetails) {
    const filePath = details.path + "/repository.json";
    const readFileAsync = promisify(readFile);

    if (existsSync(filePath)) {
      return JSON.parse(await readFileAsync(filePath, { encoding: "utf8" })) as LocalRepository;
    }

    return null;
  }
}
</script>
