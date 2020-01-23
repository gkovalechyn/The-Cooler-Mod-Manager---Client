<template>
  <div>
    <AppHeader></AppHeader>
    <div class="display-flex width-100">
      <div class="width-40">
        <RepositoryComponent></RepositoryComponent>
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

@Component({
  components: {
    AppHeader,
    RepositoryComponent
  }
})
export default class RepositoriesView extends Vue {}
</script>
