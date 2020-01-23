<template>
  <div class="repository">
    <div class="repository-image">
      <div class="has-background-danger width-100" style="height: 100%;"></div>
    </div>
    <div class="padding-left-1">
      <div class="repository-title">
        Repository name
      </div>
      <div class="repository-url">
        gkovalechyn.net/mods/repoas
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class RepositoryComponent extends Vue {}
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
  height: 64px;
  width: 64px;
}
.repository-title {
  text-align: left;
  font-weight: bold;
}

.repository-url {
  text-align: left;
  font-size: 0.7rem;
}
</style>
