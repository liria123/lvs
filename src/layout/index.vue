<template>
  <div class="main">
    <app-main />
  </div>
</template>

<script>
import { AppMain } from "./components";

export default {
  name: "Layout",
  components: {
    AppMain
  },
  mixins: [],
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.main {
  min-width: 1300px;
}
</style>
