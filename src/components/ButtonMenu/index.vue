<template>
  <div class="menu-wrapper">
    <router-link :to="{ name: 'Index'}">
      <el-button class="workgroup" type="primary">工作组</el-button>
    </router-link>
    <router-link :to="{ name: 'LoadBalancing', query: { groupid:this.$route.query.groupid }}">
      <el-button class="loadBalancing" type="primary">负载均衡</el-button>
    </router-link>
    <router-link :to="{ name: 'HighAvailability', query: { groupid:this.$route.query.groupid }}">
      <el-button class="highAvailability" type="primary">高可用</el-button>
    </router-link>
    <router-link :to="{ name: 'TaskList', query: { groupid:this.$route.query.groupid }}">
      <el-button class="taskList" type="primary">任务列表</el-button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ButtonMenu",
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  padding:10px;
  height: 60px;
  background: #ffffff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  display:flex;
  justify-content:center;
  align-items:center;
  .el-button{
    margin-top: 12px;
    padding: 9px 44px;
    letter-spacing: 1px;
  }
  .workgroup{
     margin-right:30px;
   }
  .loadBalancing{
     margin-right:30px;
   }
  .highAvailability{
     margin-right:30px;
   }
}
</style>
