<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import "./assets/css/common";
  @import "./assets/css/GlobalCSS";

  #app {
    width: 100%;
    height: 100%;
  }
</style>
