<template>
  <div class="vrrp-instance-wrapper">
    <div class="vrrp-instance">
      <img src="@/assets/working-group/high-availability/icon-gaokeyong.png" />
      <span>高可用vrrp_instance组</span>
      <img
        class="add-config"
        src="@/assets/working-group/load-balancing/icom-tianjia.png"
        @click="addSyncConfigA"
      />
    </div>
    <hr />
    <div class="click-back">
      <i class="el-icon-back" style="font-size: 10px; color: #2277da; font-weight: bold; cursor: pointer"><span @click="clickBack()">返回</span></i>
      <span class="vrrp-back-text">服务器节点host：{{this.$route.query.host}}</span>
    </div>
    <el-table class="table1" :data="vrrpinstances" :header-cell-style="{ background: '#fafafa', color: '#606266' }" size="mini" border :row-class-name="tableRowClassName" @row-click="onRowClick">
      <el-table-column
        prop="port"
        label="操作"
        align="center"
        fixed="left"
      >
        <template slot-scope="scope">
          <div class="button-wrapper">
            <el-button
              v-if="!scope.row.add_flag"
              type="text"
              size="mini"
              @click="removeInstanceConfig(scope.row,scope.$index)"
            >删除</el-button>
            <el-button
              v-if="!scope.row.add_flag"
              type="text"
              size="mini"
              @click="updateInstanceConfig(scope.row,scope.$index)"
            >修改</el-button>
            <el-button
              v-if="scope.row.add_flag"
              type="text"
              size="mini"
              @click="addSyncConfig(scope.row)"
            >新增</el-button>
            <el-button
              v-if="scope.row.add_flag"
              type="text"
              size="mini"
              @click="addSyncConfigRemove()"
            >移除</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="virtual_router_id" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.virtual_router_id"
            size="mini"
            placeholder="非必填"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="id" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.id"
            size="mini"
            placeholder="只读"
            readonly="readonly"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="name" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            size="mini"
            placeholder="必填"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="advert" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.advert"
            size="mini"
            placeholder="必填"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="no_preempt" align="center" width="120px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.no_preempt" placeholder="on">
            <el-option
              v-for="item in no_preemptSelected"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="state" align="center" width="120px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.state" placeholder="BACKUP">
            <el-option
              v-for="item in stateSelect"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="priority" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.priority"
            size="mini"
            placeholder="非必填"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="authentication" align="center" width="200px">
        <template slot-scope="scope">
          <span>auth_type:</span>
          <el-input
            v-model="scope.row.auth_type"
            size="mini"
            placeholder="必填"
          ></el-input>
          <br />
          <span>auth_pass:</span>
          <el-input
            v-model="scope.row.auth_pass"
            size="mini"
            placeholder="必填"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="virtual_ipaddress" align="center" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="checkIP(scope.row,scope.$index)">查看虚拟IP</el-button>
        </template>
      </el-table-column>
      <el-table-column label="network_interface" align="center" width="150px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.network_interface"
            size="mini"
            placeholder="非必填"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <!-- Dialog -->
    <el-dialog title="添加虚拟IP" :visible.sync="dialogFormVisible" center width="700px">
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :label="'IP' + (index+1)"
          :prop="'domains.' + index + '.vip'"
        >
          <el-input v-model="domain.vip" placeholder="10.251.69.30/24  dev team0" class="vipInput"></el-input>
          <el-button @click.prevent="addIP('dynamicValidateForm',domain.vip)">添加</el-button>
          <el-button @click.prevent="updateIP('dynamicValidateForm',domain)">修改</el-button>
          <el-button type="danger" @click.prevent="removeIP(domain)">删除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createIP">新建</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVip,
  addVip,
  updateVip,
  removeVip,
  addSyncConfig,
  updateAsyncConfig,
  removeInstanceConfig
} from "@/api/high-availability";
export default {
  name: "VrrpInstance",
  props: {
    vrrpinstances: Array
  },
  data() {
    return {
      dialogFormVisible: false,
      outerVip: [],
      form: {
        vip: []
      },
      no_preemptSelected: [
        {
          value: "on"
        },
        {
          value: "off"
        }
      ],
      stateSelect: [
        {
          value: "BACKUP"
        },
        {
          value: "MASTER"
        }
      ],
      formLabelWidth: "90px",
      params: {},
      addAsyncDialog: false,
      addSyncDialog: false,
      sync_config: {},
      async_config: {},
      configLabelWidth: "180px",
      dynamicValidateForm: {
        domains: [
          {
            vip: ""
          }
        ],
        email: ""
      },
      instanceRules: {
        name: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        network_interface: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        auth_pass: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        auth_type: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        no_preempt: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        priority: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("该配置项不能为空"));
              } else if (!Number.isInteger(+value)) {
                callback(new Error("只能为整数"));
              } else if (value < 0 || value > 255) {
                callback(new Error("取值为 0~255 之间"));
              }
              callback();
            }
          }
        ],
        virtual_router_id: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("该配置项不能为空"));
              } else if (!Number.isInteger(+value)) {
                callback(new Error("只能为整数"));
              } else if (value < 0 || value > 255) {
                callback(new Error("取值为 0~255 之间"));
              }
              callback();
            }
          }
        ],
        advert: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ]
      },
      update_instanceRules: {
        name: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        network_interface: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        auth_pass: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        auth_type: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        no_preempt: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ],
        priority: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("该配置项不能为空"));
              } else if (!Number.isInteger(+value)) {
                callback(new Error("只能为整数"));
              } else if (value < 0 || value > 255) {
                callback(new Error("取值为 0~255 之间"));
              }
              callback();
            }
          }
        ],
        virtual_router_id: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("该配置项不能为空"));
              } else if (!Number.isInteger(+value)) {
                callback(new Error("只能为整数"));
              } else if (value < 0 || value > 255) {
                callback(new Error("取值为 0~255 之间"));
              }
              callback();
            }
          }
        ],
        advert: [
          { required: true, message: "该配置项不能为空", trigger: "blur" }
        ]
      },
      updateSyncDialog: false,
      update_sync_config: {}
    };
  },
  methods: {
    // 获取当前点击行的 index
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index;
    },
    // 添加一条同步配置
    addSyncConfigA() {
      this.vrrpinstances.splice(this.vrrpinstances.length, 0, {
        virtual_router_id: undefined,
        id: undefined,
        name: undefined,
        advert: undefined,
        no_preempt: "off",
        state: "BACKUP",
        priority: undefined,
        auth_type: undefined,
        auth_pass: undefined,
        network_interface: undefined,
        add_flag: true
      });
    },
    // 移除
    addSyncConfigRemove() {
      this.vrrpinstances.splice(this.vrrpinstances.length - 1, 1);
    },
    // 返回
    clickBack() {
      history.go(-1)
    },
    // 新增
    addSyncConfig(row) {
      if (
        row.name === undefined || row.name === "" ||
        row.advert === undefined || row.advert === "" ||
        row.auth_type === undefined || row.auth_type === "" ||
        row.auth_pass === undefined || row.auth_pass === ""
      ) {
        return;
      }
      const _row = JSON.parse(JSON.stringify(row));
      delete _row["add_flag"];
      addSyncConfig(this.$route.query.groupid, this.$route.query.nodeid, _row).then((res) => {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.vrrpinstances.splice(_row.row_index, 1);
        this.bus.$emit('addConfigSuccess');
      }
      );
    },
    // 删除
    removeInstanceConfig(item, index) {
      this.getParams(item, index);
      this.$confirm("你确定要删除该条实例配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeInstanceConfig(this.params).then((res) => {
            this.$message({
              type: "success",
              message: "删除实例配置成功"
            });
          });
          this.bus.$emit("removeConfigSuccess");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改
    updateInstanceConfig(row, index) {
      if (
        row.virtual_router_id === undefined || row.virtual_router_id === "" ||
        row.name === undefined || row.name === "" ||
        row.advert === undefined || row.advert === "" ||
        row.priority === undefined || row.priority === "" ||
        row.auth_type === undefined || row.auth_type === "" ||
        row.auth_pass === undefined || row.auth_pass === "" ||
        row.network_interface === undefined || row.network_interface === ""
      ) {
        return;
      }
      const _row = JSON.parse(JSON.stringify(row));
      updateAsyncConfig({ groupid: this.$route.query.groupid, nodeid: this.$route.query.nodeid, instanceid: this.vrrpinstances[index].id }, _row).then((res) => {
        this.$message({
          type: "success",
          message: "修改实例配置成功"
        });
      });
    },
    verifyIP(IP) {
      const reg = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
      const re = new RegExp(reg);
      if (!re.test(IP)) {
        return false;
      } else {
        return true;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加IP
    addIP(formName, item) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addVip(this.params, { vip: item }).then((res) => {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.requestVip();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新IP
    updateIP(formName, item) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateVip(this.params, item.id, item).then((res) => {
            this.$message({
              type: "success",
              message: "修改成功"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除IP
    removeIP(item) {
      console.log(item.value, "---");
      if (item.value === "") {
        var index = this.dynamicValidateForm.domains.indexOf(item);
        this.dynamicValidateForm.domains.splice(index, 1);
        return;
      }
      this.$confirm("你确定要删除该虚拟IP吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var index = this.dynamicValidateForm.domains.indexOf(item);
          if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1);
          }
          item.id &&
            removeVip(this.params, item.id).then((res) => {
              this.$message({
                type: "success",
                message: "删除成功"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 创建IP
    createIP() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    checkIP(item, index) {
      if (
        item.name === undefined || item.name === "" ||
        item.advert === undefined || item.advert === "" ||
        item.auth_type === undefined || item.auth_type === "" ||
        item.auth_pass === undefined || item.auth_pass === "") {
        this.$message({
          type: "warning",
          message: "请先点击新增"
        });
      } else {
        this.getParams(item, index);
        this.requestVip();
      }
    },
    getParams(item, index) {
      this.params = {
        groupid: this.$route.query.groupid,
        nodeid: this.$route.query.nodeid,
        instanceid: this.vrrpinstances[index].id
      };
      return this.params;
    },
    // 获取IP
    requestVip() {
      getVip(this.params).then((res) => {
        this.dynamicValidateForm.domains = res.data;
        this.dialogFormVisible = true;
        console.log(this.dynamicValidateForm)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
* >>> .el-select .el-input .el-select__caret {
  color: #c0c4cc;
}
>>> .el-select {
  border: none;
  .el-input {
    width: 105px;
    }
  .el-input--suffix .el-input__inner {
    border: none;
    background: inherit;
    }
  .el-icon-arrow-up:before {
    color: blue;
    }
  }
>>> .el-input__inner {
  text-align: center;
  border: none;
}
>>> .el-input {
  width: 80px;
}
.vipInput{
  border: 1px solid #DCDFE6;
  width: 244.69px;
}
>>> .el-table {
  width: 100%;
}
.click-back{
  margin-left:2%;
}
.table1{
  margin-left:5%;
  width:90%;
}
.button-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  >>> .el-button + .el-button {
  margin-left: 0px;
  }
}
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
.vrrp-instance-wrapper {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  margin: 6px 0;
  background: #ffffff;
  display: flow-root;
  min-height: 400px;
  position: relative;
  .vrrp-back-text{
    font-size: 12px;
    letter-spacing: 1px;
    color: #2277da;
    font-weight: bold;
  }
  .button {
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
  .add-config {
    cursor: pointer;
  }
  .vrrp-instance {
    margin-left: 50px;
    margin-top: 26px;
    img {
      position: relative;
      top: 5px;
    }
  }
}
</style>
