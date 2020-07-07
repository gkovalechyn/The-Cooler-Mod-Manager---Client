<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import TitleBar from "./UI/Components/TitleBar.vue";

@Component({
  components: {
    TitleBar
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "~bulma/css/bulma.css";
@import "./UI/Main";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html {
  overflow: auto;
}
</style>
