<template>
  <section class="has-background-black header-padding">
    <div class="title has-text-white">
      Repositories
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AppHeader extends Vue {}
</script>

<style>
.header-padding {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
