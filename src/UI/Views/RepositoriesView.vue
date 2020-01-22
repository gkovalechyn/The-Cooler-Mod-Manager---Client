<template>
  <div>
    <AppHeader></AppHeader>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AppHeader from "../Components/AppHeader.vue";

@Component({
  components: {
    AppHeader
  }
})
export default class RepositoriesView extends Vue {}
</script>
