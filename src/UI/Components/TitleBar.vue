<template>
  <div class="width-100 title-bar padding-left-1">
    <div class="has-text-black">The Cooler Mod Manager</div>

    <div>
      <div class="tiny-button" @click="minimize">
        <span class="fas fa-window-minimize"></span>
      </div>

      <div class="tiny-button" @click="toggleMaximization">
        <span :class="maximizeIconClasses"></span>
      </div>

      <div class="tiny-button tiny-button-exit" @click="closeWindow">
        <span class="fas fa-times"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { remote } from "electron";

@Component
export default class TitleBar extends Vue {
  private minimize() {
    remote.getCurrentWindow().minimize();
  }

  private toggleMaximization() {
    if (this.isMaximized) {
      remote.getCurrentWindow().unmaximize();
    } else {
      remote.getCurrentWindow().maximize();
    }
  }

  private closeWindow() {
    remote.getCurrentWindow().close();
  }

  private get maximizeIconClasses() {
    const temp: any = {
      fas: true
    };

    temp[this.maximizeIcon] = true;

    return temp;
  }
  private get maximizeIcon() {
    return this.isMaximized ? "fa-window-restore" : "fa-window-maximize";
  }
  private get isMaximized() {
    return remote.getCurrentWindow().isMaximized();
  }
}
</script>

<style lang="scss">
.title-bar {
  display: flex;
  color: black;
  justify-content: space-between;
  align-items: stretch;
  -webkit-app-region: drag;
  height: 1.5rem;
  font-size: 0.9rem;
}

.tiny-button {
  border-radius: 0;
  padding: 0 !important;
  -webkit-app-region: no-drag;
  display: inline-block;
  cursor: pointer;
  width: 1.25rem;

  &:hover {
    background-color: #bbbbbb;
  }
}

.tiny-button-exit {
  &:hover {
    color: white;
    background-color: red;
  }
}
</style>
