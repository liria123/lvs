<template>
  <div>
    <div class="server-node-wrapper">
      <div class="server-node">
        <img src="@/assets/working-group/high-availability/icon-fuwuqijiedian.png" />
        <span>服务器节点</span>
        <div class="add-server" @click="dialogAdd = true">添加服务器</div>
        <div class="add-server" @click="checkGlobalConfig">查看全局配置</div>
      </div>
      <ShowNoData v-if="!serverNode.length">无数据</ShowNoData>
      <div class="server-wrapper">
        <div v-for="item in serverNode" :key="item.id" class="server">
          <img src="@/assets/working-group/high-availability/image-fuwuqi.png" @click="getInstance(item.id,item.group_id,item.host)" />
          <i class="el-icon-edit" @click="findUpdateNode(item.id)" />
          <span @click="getInstance(item.id,item.group_id,item.host)">{{item.host}}</span>
        </div>
      </div>
    </div>
    <!-- Dialog -->
    <template>
      <el-dialog title="添加服务器" :visible.sync="dialogAdd" width="500px" class="addServerDialog" center>
        <el-form ref="serverNode" :model="addServerNode" :rules="nodeRules">
          <el-form-item label="主机地址" :label-width="formLabelWidth" prop="host">
            <el-input v-model="addServerNode.host" autocomplete="off" placeholder="请输入主机地址" />
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addServerNode.name" autocomplete="off" placeholder="请输入实例名称" />
          </el-form-item>
          <el-form-item label="描述信息" :label-width="formLabelWidth" prop="info">
            <el-input v-model="addServerNode.info" autocomplete="off" placeholder="请输入实例描述信息" />
          </el-form-item>
          <el-form-item label="实例状态" :label-width="formLabelWidth" prop="state">
            <el-select v-model="addServerNode.state" placeholder="请选择实例状态">
              <el-option label="MASTER" value="MASTER" />
              <el-option label="BACKUP" value="BACKUP" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button type="primary" @click="submitNodeForm('serverNode')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="操作节点" :visible.sync="dialogUpdate" width="500px" center>
        <el-form ref="updateNodeInstance" :model="updateServerNode" :rules="updateNodeRules">
          <el-form-item label="实例ID" :label-width="formLabelWidth">
            <el-input v-model="updateServerNode.id" autocomplete="off" :disabled="edit" />
          </el-form-item>
          <el-form-item label="实例名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="updateServerNode.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="实例HOST" :label-width="formLabelWidth">
            <el-input v-model="updateServerNode.host" autocomplete="off" :disabled="edit" />
          </el-form-item>
          <el-form-item label="实例状态" :label-width="formLabelWidth">
            <el-input v-model="updateServerNode.state" autocomplete="off" :disabled="edit" />
          </el-form-item>
          <el-form-item label="实例信息" :label-width="formLabelWidth" prop="info">
            <el-input v-model="updateServerNode.info" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="deleteServer">删 除</el-button>
          <el-button type="primary" @click="updateServer('updateNodeInstance')">修改</el-button>
        </div>
      </el-dialog>
      <!-- 全局配置 dialog -->
      <el-dialog title="全局配置" :visible.sync="globalConfigDialog" width="500px" center>
        <el-form ref="ruleBasicConfig" :model="globalConfig" status-icon :rules="basicRules">
          <el-form-item label="Router ID" :label-width="configLabelWidth" prop="router_id">
            <el-input
              v-model="globalConfig.router_id"
              autocomplete="off"
              placeholder="请输入Router ID"
            />
          </el-form-item>
          <el-form-item label="连接同步信息的网络接口" :label-width="configLabelWidth" prop="lvs_sync_daemon">
            <el-input
              v-model="globalConfig.lvs_sync_daemon"
              autocomplete="off"
              placeholder="请输入网络接口"
            />
          </el-form-item>
          <el-form-item label="连接同步的实例" :label-width="configLabelWidth" prop="lvs_sync_instance">
            <el-input
              v-model="globalConfig.lvs_sync_instance"
              autocomplete="off"
              placeholder="请输入实例"
            />
          </el-form-item>
          <el-form-item label="空闲TCP连接存活时间" :label-width="configLabelWidth" prop="lvs_timeout">
            <el-input v-model="globalConfig.lvs_timeout" autocomplete="off" placeholder="请输入超时时间" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="globalConfigDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateGlobalConfig('ruleBasicConfig')">修 改</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import ShowNoData from "@/components/ShowNoData";
import {
  addMasterNode,
  addBackupNode,
  updateServerNode,
  deleteServerNode,
  getNodeConfig,
  updateGlobalConfig
} from "@/api/high-availability";
export default {
  name: "ServerNode",
  components: {
    ShowNoData
  },
  props: {
    serverNode: Array,
    vrrpinstances: Array,
    hosts: Array
  },
  data() {
    return {
      dialogAdd: false,
      dialogUpdate: false,
      dialogConfig: false,
      globalConfigDialog: false,
      addServerNode: {
        name: "",
        host: "",
        state: "",
        info: ""
      },
      globalConfig: {},
      instanceConfig: {
        name: "",
        network_interface: "",
        priority: "",
        no_preempt: "on",
        state: "MASTER",
        virtual_router_id: "",
        advert: ""
      },
      edit: true,
      updateServerNode: {},
      formLabelWidth: "90px",
      configLabelWidth: "180px",
      currentNodeId: Number,
      task: {},
      activeName: "basics",
      // 表单验证
      nodeRules: {
        host: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("主机地址不能为空"));
              } else if (!this.verifyIP(this.addServerNode.host)) {
                callback(new Error("无效的 IP"));
              }
              callback();
            }
          }
        ],
        name: [
          { required: true, message: "节点名称不能为空", trigger: "blur" }
        ],
        info: [{ required: true, message: "消息不能为空", trigger: "blur" }],
        state: [
          { required: true, message: "实例状态不能为空", trigger: "blur" }
        ]
      },
      basicRules: {
        router_id: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ]
      },
      updateNodeRules: {
        name: [
          { required: true, message: "实例名称不能为空", trigger: "blur" }
        ],
        info: [
          { required: true, message: "实例信息不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 查看全局配置
    checkGlobalConfig() {
      getNodeConfig(this.$route.query.groupid).then((res) => {
        this.globalConfig = res.data;
      });
      this.globalConfigDialog = true;
    },
    // 验证 IP 格式
    verifyIP(IP) {
      const reg = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
      const re = new RegExp(reg);
      if (IP === null || IP === "") {
        return false;
      } else if (!re.test(IP)) {
        return false;
      } else {
        return true;
      }
    },
    // 添加服务器节点
    submitNodeForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addServerNode.state === "MASTER") {
            addMasterNode(this.$route.query.groupid, this.addServerNode)
              .then((res) => {
                this.addServerNode = {};
                this.dialogAdd = false;
                this.$message({
                  type: "success",
                  message: "创建MASTER节点成功"
                });
                this.bus.$emit("createNodeSuccess");
                history.go(0);
              })
              .catch((err) => {
                err &&
                  this.$message({
                    type: "error",
                    message: "创建节点失败，只能有一个MASTER节点"
                  });
              });
          } else if (this.addServerNode.state === "BACKUP") {
            addBackupNode(
              this.$route.query.groupid,
              this.addServerNode
            ).then((res) => {
              this.addServerNode = {};
              this.dialogAdd = false;
              this.$message({
                type: "success",
                message: "创建BACKUP节点成功"
              });
              history.go(0);
              this.bus.$emit("createNodeSuccess");
            });
          } else {
            // 什么也不做
          }
          return true;
        } else {
          return false;
        }
      });
    },
    //  查找当前点击的节点
    findUpdateNode(id) {
      for (let i = 0; i < this.serverNode.length; i++) {
        if (id === this.serverNode[i].id) {
          this.updateServerNode = this.serverNode[i];
        }
      }
      this.dialogUpdate = true;
      this.currentNodeId = id;
    },
    resetForm(formName) {
      // 异步更新
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 更新服务器节点
    updateServer(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("sucess");
          updateServerNode(
            this.$route.query.groupid,
            this.currentNodeId,
            this.updateServerNode
          ).then((res) => {
            this.dialogUpdate = false;
            this.$message({
              type: "success",
              message: "修改实例成功"
            });
            console.log(res.data);// true
            history.go(0);
            // 将更新后的 serverNode 赋给原始的 serverNode
          });
          return true;
        } else {
          console.log("submit");
          return false;
        }
      });
    },
    getTask(action) {
      return { ...this.updateServerNode, task_type: action };
    },
    // 获取实例，进入高可用vrrp_instance组
    getInstance(nodeid, groupid, host) {
      // console.log(nodeid, groupid, host)
      this.$router.push({ name: "HighAvailabilityVrrpinstances", query: { nodeid, groupid, host }});
    },
    // 删除服务器
    deleteServer() {
      this.$confirm("确定要删除该实例吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dialogUpdate = false;
          // 确认删除后发起请求
          deleteServerNode(
            this.$route.query.groupid,
            this.currentNodeId
          ).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            history.go(0);
            this.bus.$emit("removeNodeSuccess");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 进入节点配置
    enterConfig(nodeId) {
      getNodeConfig(nodeId).then((res) => {
        this.dialogConfig = true;
      });
    },
    // 更新节点配置
    updateGlobalConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("sucess");
          updateGlobalConfig(
            this.$route.query.groupid,
            this.globalConfig.id,
            this.globalConfig
          ).then((res) => {
            this.globalConfigDialog = false;
            this.$message({
              type: "success",
              message: "更新全局配置成功"
            });
          });
          return true;
        } else {
          console.log("error");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-dialog__header {
  background: #f0f4f7;
  border-bottom: 1px solid #dcdfe6;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
>>> .el-dialog__footer {
  background: #f0f4f7;
  border-top: 1px solid #dcdfe6;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}
>>> .el-dialog {
  border-radius: 8px;
}
.addServerDialog {
  >>> .el-select .el-input {
    width: 274.69px;
    .el-select__caret {
      color: #dcdfe6;
    }
  }
}
.configDialog {
  >>> .el-input {
    width: 274.69px;
  }
}
.server-node-wrapper {
  display: flow-root;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  margin: 6px 0;
  padding-bottom: 12px;
  background: #ffffff;
  min-height: 400px;
  position: relative;
  .server-node {
    margin-left: 50px;
    margin-top: 26px;
    img {
      position: relative;
      top: 5px;
    }
    .add-server {
      margin-left: 10px;
      font-size: 18px;
      color: rgb(70, 158, 236);
      height: 40px;
      line-height: 40px;
      border: 1px solid rgb(70, 158, 236);
      border-radius: 6px;
      padding-left: 13px;
      padding-right: 13px;
      letter-spacing: 2px;
      display: inline-block;
      cursor: pointer;
    }
  }
  .server-wrapper {
    margin: 20px auto;
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    .server {
      text-align: center;
      width: 120px;
      margin: 10px 25px;
      position: relative;
      img {
        margin-top: 5px;
        cursor: pointer;
      }
      .el-icon-edit {
        position: absolute;
        color: #84bdff;
        top: 5px;
        right: 0;
        visibility: hidden;
        cursor: pointer;
      }
      span {
        font-size: 18px;
        display: block;
        cursor: pointer;
      }
      &:hover {
        .el-icon-edit {
          visibility: visible;
        }
        span {
          color: #84bdff;
        }
      }
    }
  }
}
</style>
