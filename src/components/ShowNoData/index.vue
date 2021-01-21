<template>
  <div class="no-data">
    <slot />
  </div>
</template>

<script>
export default {
  name: "ShowNoData"
};
</script>

<style lang="scss" scoped>
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  letter-spacing: 2px;
  color: #aaa5a5;
}
</style>
