<template>
  <div class="mod-list">
    <div v-for="(mod, index) in repository.enabledMods" :key="index" class="tag is-info margin-right-1 margin-bottom-1">
      {{ mod }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { LocalRepository } from "../../Core/LocalRepository";
import { Prop } from "vue-property-decorator";

@Component
export default class ModListComponent extends Vue {
  @Prop()
  private repository!: LocalRepository;
}
</script>

<style>
.mod-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
