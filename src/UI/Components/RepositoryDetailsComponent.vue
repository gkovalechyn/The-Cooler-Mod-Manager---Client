<template>
  <div class="details-container">
    <i class="repository-banner has-background-danger">Banner</i>
    <div class="has-text-weight-bold">{{ repository.name }}</div>
    <div class="buttons-container">
      <button class="button has-background-success flex-grow-1">Launch</button>
      <button class="button has-background-info flex-grow-1">Join</button>
    </div>

    <hr class="margin-top-1 margin-bottom-1" />
    <div class="has-text-left has-text-weight-bold">Mods</div>
    <ModListComponent :repository="repository"></ModListComponent>

    <hr class="margin-top-1 margin-bottom-1" />
    <div class="has-text-left has-text-weight-bold">URLs</div>
    <RepositoryUrlsComponent :urls="repository.remoteUrls"></RepositoryUrlsComponent>

    <hr class="margin-top-1 margin-bottom-1" />
    <button class="button is-info" @click="forceRecheck" :disabled="isRechecking">
      <template v-if="!isRechecking">
        <span class="fas fa-wrench margin-right-1"></span>
        Force recheck
      </template>
      <template v-else>
        <span class="fas fa-cog fa-spin margin-right-1"></span>
        Rechecking
      </template>
    </button>
    <div v-if="isRechecking">{{ lastMessage }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { LocalRepository } from "../../Core/LocalRepository";
import RepositoryUrlsComponent from "./RepositoryUrlsComponent.vue";
import ModListComponent from "./ModListComponent.vue";
import { ScanRepositoryTask } from "../../Core/Task/ScanRepositoryTask";
import { VerifyRepositoryTask } from "../../Core/Task/VerifyRepositoryTask";
import RepositoryManager from "../../Core/RepositoryManager";

@Component({
  components: {
    RepositoryUrlsComponent,
    ModListComponent
  }
})
export default class RepositoryDetailsComponent extends Vue {
  @Prop()
  repository!: LocalRepository;
  private isRechecking = false;
  private lastMessage = "";

  private async forceRecheck() {
    this.isRechecking = true;

    try {
      await new ScanRepositoryTask(this.repository, this.onMessage.bind(this)).run();
      await new VerifyRepositoryTask(this.repository).run();
      await RepositoryManager.saveRepositories();
      this.isRechecking = false;
    } catch (error) {
      this.onMessage(error);
    }
  }

  private onMessage(message: any) {
    this.lastMessage = message;
  }
}
</script>

<style>
.details-container {
  display: flex;
  flex-direction: column;
}

.buttons-container {
  display: flex;
  width: 100%;
  justify-content: stretch;
}

.repository-banner {
  width: 100%;
  height: 96px;
}
</style>
