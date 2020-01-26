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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { LocalRepository } from "../../Core/LocalRepository";
import RepositoryUrlsComponent from "./RepositoryUrlsComponent.vue";
import ModListComponent from "./ModListComponent.vue";

@Component({
  components: {
    RepositoryUrlsComponent,
    ModListComponent
  }
})
export default class RepositoryDetailsComponent extends Vue {
  @Prop()
  repository!: LocalRepository;
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
