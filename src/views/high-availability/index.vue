<template>
  <div class="high-availability-container">
    <ButtonMenu />
    <main>
      <ServerNode :server-node="serverNode" />
    </main>
  </div>
</template>

<script>
import ButtonMenu from "@/components/ButtonMenu";
import ServerNode from "./components/ServerNode";
import { getServerNode } from "@/api/high-availability";
export default {
  name: "HighAvailability",
  components: {
    ButtonMenu,
    ServerNode
  },
  data() {
    return {
      serverNode: []
    };
  },
  created() {
    // 获取服务器节点
    this.getAllNode();
    this.bus.$on("addConfigSuccess", () => {
      this.getAllNode();
    });
    this.bus.$on("removeConfigSuccess", () => {
      this.getAllNode();
    });
    this.bus.$on("removeNodeSuccess", () => {
      this.getAllNode();
    });
    this.bus.$on("createNodeSuccess", () => {
      this.getAllNode();
    });
  },
  methods: {
    getAllNode() {
      getServerNode(this.$route.query.groupid).then(res => {
        this.serverNode = res.data.reverse();
        console.log(this.serverNode);
      });
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
