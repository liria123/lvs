<template>
  <div class="high-availability-container">
    <ButtonMenu />
    <main>
      <VrrpInstance :vrrpinstances="vrrpinstances" />
    </main>
  </div>
</template>

<script>
import ButtonMenu from "@/components/ButtonMenu";
import VrrpInstance from "./components/VrrpInstance";
import { getInstanceundernode } from "@/api/high-availability";
import fetchAddFlagArray from "@/utils/add-flag-array";
export default {
  name: "HighAvailabilityVrrpinstances",
  components: {
    ButtonMenu,
    VrrpInstance
  },
  data() {
    return {
      vrrpinstances: []
    };
  },
  created() {
    // 根据nodeid查询节点下所有vrrp实例配置信息
    this.getInstanceundernode();
    this.bus.$on("addConfigSuccess", () => {
      this.getInstanceundernode();
    });
    this.bus.$on("removeConfigSuccess", () => {
      this.getInstanceundernode();
    });
    this.bus.$on("removeNodeSuccess", () => {
      this.getInstanceundernode();
    });
    this.bus.$on("createNodeSuccess", () => {
      this.getInstanceundernode();
    });
  },
  methods: {
    getInstanceundernode() {
      getInstanceundernode(this.$route.query.groupid, this.$route.query.nodeid).then(res => {
        // this.vrrpinstances = res.data;
        const flagArr = fetchAddFlagArray(this.vrrpinstances);
        this.vrrpinstances = [...res.data, ...flagArr];
        console.log(this.vrrpinstances)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  margin: 0 232px;
  font-size: 24px;
  padding-bottom: 50px;
}
</style>
