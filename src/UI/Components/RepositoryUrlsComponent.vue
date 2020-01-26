<template>
  <div class="urls-container has-text-left">
    <div class="has-text-weight-bold no-wrap">{{ primaryURL }}</div>
    <div class="no-wrap" v-for="(url, index) in secondaryUrls" :key="index">{{ url }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class RepositoryUrlsComponent extends Vue {
  @Prop()
  private urls!: string[];

  private get primaryURL() {
    return this.urls[0];
  }

  private get secondaryUrls() {
    return this.urls.slice(1);
  }
}
</script>

<style>
.urls-container {
  font-size: 0.9em;
  padding-left: 0.5rem;
  overflow: hidden;
}
</style>
