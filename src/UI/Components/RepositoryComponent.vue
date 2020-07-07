<template>
  <div class="repository" @click="onClicked">
    <i class="repository-image has-background-danger">Icon</i>
    <div class="repository-details">
      <div class="repository-title">
        {{ repository.name }}
      </div>
      <!--
      <div class="repository-url">
        {{ repository.remoteUrls[0] }}
      </div>
      -->
      <RepositoryStateComponent :state="repository.state"></RepositoryStateComponent>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { LocalRepository } from "../../Core/LocalRepository";
import { RepositoryState } from "../../Core/RepositoryState";
import RepositoryStateComponent from "./RepositoryStateComponent.vue";

@Component({
  components: {
    RepositoryStateComponent
  }
})
export default class RepositoryComponent extends Vue {
  @Prop()
  private repository!: LocalRepository;

  private onClicked(event: MouseEvent) {
    this.$emit("click", event);
  }
}
</script>

<style lang="scss">
.repository {
  display: flex;
  padding: 0.5rem;

  border-bottom: 1px solid black;

  &:hover {
    background-color: #cccccc;
    cursor: pointer;
  }
}

.repository-image {
  min-height: 64px;
  max-height: 64px;
  min-width: 64px;
  max-width: 64px;
}

.repository-details {
  width: 100%;
  overflow: hidden;
  padding-left: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.repository-title {
  text-align: left;
  font-weight: bold;
}

.repository-url {
  text-align: left;
  font-size: 0.7rem;
  white-space: nowrap;
}
</style>
