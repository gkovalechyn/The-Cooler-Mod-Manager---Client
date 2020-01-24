<template>
  <div>
    <div v-if="state === 'pending-scan'" class="has-background-danger has-text-white w-100 h-100">
      <span class="fas fa-exclamation"></span>
      Pending scan
    </div>

    <div v-if="state === 'scanning'" class="has-background-info has-text-white w-100 h-100">
      <span class="fas fa-cog fa-spin"></span>
      Scanning
    </div>

    <div v-if="state === 'ready'" class="has-background-success has-text-white w-100 h-100">
      <span class="fas fa-check"></span>
      Ready
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { RepositoryState } from "../../Core/RepositoryState";

// Maybe change this into a functional component?
@Component
export default class RepositoryStateComponent extends Vue {
  @Prop()
  private state!: RepositoryState;
}
</script>
