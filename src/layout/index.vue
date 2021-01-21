<template>
  <div class="main">
    <navbar />
    <app-main />
  </div>
</template>

<script>
import { Navbar, AppMain } from "./components";

export default {
  name: "Layout",
  components: {
    Navbar,
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
