<template>
  <div style="position: relative;">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </section>
  </div>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style scoped>
.app-main {
  /*60 = navbar  */
  min-height: calc(100vh - 60px);
  /* width: 90%; */
  /* width: calc(100vw - 84px - 50px); 距离左侧84px 距离右侧50px */
  /* left: 84px; 左侧导航栏宽度 + 20px = 84px */
  position: relative;
  overflow: hidden;
  background: #fafafa;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
