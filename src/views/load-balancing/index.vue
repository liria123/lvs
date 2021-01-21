<template>
  <div class="load-balancing-container">
    <ButtonMenu />
    <div class="content">
      <div class="title">
        <span>
          <img src="@/assets/working-group/load-balancing/icon-fuzaijunhengvip.png" />
        </span>
        <span>负载均衡VIP</span>
        <span><el-button type="primary" class="deploy" @click="releaseConfig">发布</el-button></span>
      </div>
      <div class="table">
        <div class="table1-wrapper">
          <div class="title">
            <span>虚拟服务配置</span>
            <img
              class="add-config"
              src="@/assets/working-group/load-balancing/icom-tianjia.png"
              @click="addVirtualConfig"
            />
          </div>
          <el-table
            size="mini"
            border
            :data="tableData1"
            :header-cell-style="{ background: '#fafafa', color: '#606266' }"
            :row-class-name="tableRowClassName"
            @row-click="onRowClick"
          >
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
                    @click="removeVirtualConfig(scope.row,scope.$index)"
                  >删除</el-button>
                  <el-button
                    v-if="!scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="updateVirtualConfigSure(scope.row,scope.$index)"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="addVirtualConfigSure(scope.row)"
                  >新增</el-button>
                  <el-button
                    v-if="scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="handleVirtualRemove()"
                  >移除</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="虚拟IP"
              align="center"
              width="145px"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ip"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="port" label="负载端口" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.port"
                  size="mini"
                  placeholder="必填"
                  width="90px"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="persistence_timeout"
              label="调度一致性时间"
              align="center"
              width="110px"
            >
              <template slot="header">
                <el-tooltip
                  content="persistence_timeout"
                  placement="top"
                  effect="light"
                >
                  <span>调度一致性时间</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.persistence_timeout"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="protocol"
              label="协议"
              align="center"
              min-width="96px"
            >
              <template slot="header">
                <el-tooltip content="protocol" placement="top" effect="light">
                  <span>协议</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.protocol" placeholder="TCP">
                  <el-option
                    v-for="item in protocolSelected"
                    :key="item.value"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="delay"
              label="健康检查间隔"
              width="100"
              align="center"
            >
              <template slot="header">
                <el-tooltip content="delay_loop" placement="top" effect="light">
                  <span>健康检查间隔</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.delay"
                  size="mini"
                  placeholder="必填"
                  width="110px"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="lb_algo" label="轮询算法" align="center" width="90px">
              <template slot="header">
                <el-tooltip content="lb_algo" placement="top" effect="light">
                  <span>轮询算法</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.lb_algo">
                  <el-option value="rr" selected />
                  <el-option value="sh" />
                  <el-option value="dh" />
                  <el-option value="lc" />
                  <el-option value="wlc" />
                  <el-option value="wrr" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="展开负载列表" align="center" width="95px">
              <template slot-scope="scope">
                <img src="@/assets/working-group/load-balancing/icon-zankai.png" @click="ZhanKai(scope.row, scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table2-wrapper">
          <div class="title">
            <el-tooltip content="点击展开负载列表后才可添加真实服务配置" placement="top" effect="light">
              <span>真实服务配置</span>
            </el-tooltip>
            <span>
              <img
                :class="addShow === false ? 'add-disabled':'add-config'"
                src="@/assets/working-group/load-balancing/icom-tianjia.png"
                @click="addRealConfig"
              />
            </span>
          </div>
          <el-table
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            size="mini"
            border
            :data="tableData2"
            :header-cell-style="{ background: '#fafafa', color: '#606266' }"
            :row-class-name="tableRowClassName"
            @row-click="onRowClick"
          >
            <el-table-column prop="port" label="端口" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.port"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="ip"
              label="real_server"
              align="center"
              width="145px"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ip"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="weight"
              label="权重"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.weight"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="connect_timeout"
              label="连接超时时间"
              align="center"
              width="120px"
            >
              <template slot="header">
                <el-tooltip
                  content="connect_timeout"
                  placement="top"
                  effect="light"
                >
                  <span>连接超时时间</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.connect_timeout"
                  size="mini"
                  placeholder="必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="retry" label="失败重试次数" align="center" width="120px">
              <template slot="header">
                <el-tooltip content="retry" placement="top" effect="light">
                  <span>失败重试次数</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.retry"
                  size="mini"
                  placeholder="非必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="delay_before_retry"
              label="失败重试的间隔时间"
              align="center"
              width="130px"
            >
              <template slot="header">
                <el-tooltip
                  content="delay_before_retry"
                  placement="top"
                  effect="light"
                >
                  <span>失败重试的间隔时间</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.delay_before_retry"
                  size="mini"
                  placeholder="非必填"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <div class="button-wrapper">
                  <el-button
                    v-if="!scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                  <el-button
                    v-if="!scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="updateRealConfigSure(scope.row)"
                  >修改</el-button>
                  <el-button
                    v-if="scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="addRealConfigSure(scope.row)"
                  >新增</el-button>
                  <el-button
                    v-if="scope.row.add_flag"
                    type="text"
                    size="mini"
                    @click="handleRealRemove()"
                  >移除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonMenu from "@/components/ButtonMenu";
import fetchAddFlagArray from "@/utils/add-flag-array";
import { modifyConfig } from "@/api/index";
import {
  addVirtualConfig,
  removeVirtualConfig,
  updateVirtualConfig,
  addRealConfig,
  getAllRealserver,
  updateRealConfig,
  removeRealConfig,
  AllselectVirtualServer
} from "@/api/load-balancing";
export default {
  name: "LoadBalancing",
  components: {
    ButtonMenu
  },
  data() {
    return {
      virtualServerId: "",
      selected: [],
      protocolSelected: [
        {
          value: "TCP"
        },
        {
          value: "UDP"
        }
      ],
      addShow: false,
      tableData1: [],
      tableData2: [],
      virtualServer: [],
      flagArr: [],
      configLabelWidth: "120px",
      addVirtualDialog: false,
      updateVirtualDialog: false,
      addRealDialog: false,
      updateRealDialog: false,
      currentRowIndex: Number,
      currentClickId: Number,
      loading: false
    };
  },
  created() {
    this.AllselectVirtualServer();
  },
  methods: {
    // 发布
    releaseConfig() {
      this.$confirm("确定要发布配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        modifyConfig(this.$route.query.groupid)
          .then((res) => {
            this.$message({
              type: "success",
              message: "发布成功"
            });
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "发布失败"
            });
          });
      });
    },
    // 获取当前点击行的 index
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex;
    },
    onRowClick(row, event, column) {
      this.currentRowIndex = row.row_index;
    },
    // 所有vrrp
    AllselectVirtualServer() {
      AllselectVirtualServer(this.$route.query.groupid).then((res) => {
        console.log(res.data)
        // this.tableData1 = res.data;
        const flagArr = fetchAddFlagArray(this.tableData1);
        this.tableData1 = [...res.data, ...flagArr];
      });
    },
    // 添加一条vrrp
    addVirtualConfig() {
      this.tableData1.splice(this.tableData1.length, 0, {
        port: undefined,
        protocol: "TCP",
        delay: undefined,
        persistence_timeout: undefined,
        ip: undefined,
        lb_algo: "rr",
        add_flag: true
      });
    },
    // vrrp移除
    handleVirtualRemove() {
      this.tableData1.splice(this.tableData1.length - 1, 1);
    },
    // vrrp新增
    addVirtualConfigSure(row) {
      if (
        row.ip === undefined ||
        row.ip === "" ||
        row.port === undefined ||
        row.port === "" ||
        row.protocol === undefined ||
        row.protocol === "" ||
        row.delay === undefined ||
        row.delay === "" ||
        row.persistence_timeout === undefined ||
        row.persistence_timeout === "" ||
        row.lb_algo === undefined ||
        row.lb_algo === ""
      ) {
        return;
      }
      const _row = JSON.parse(JSON.stringify(row));
      delete _row["add_flag"];
      addVirtualConfig(this.$route.query.groupid, _row).then((res) => {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.tableData1.splice(_row.row_index, 1);
        this.AllselectVirtualServer();
      });
    },
    // vrrp删除
    removeVirtualConfig(row, index) {
      this.$confirm("确定要删除该条配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认删除后发起请求
          removeVirtualConfig(this.$route.query.groupid, this.tableData1[index].id).then(
            (res) => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.AllselectVirtualServer();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // vrrp修改
    updateVirtualConfigSure(row, index) {
      // console.log(this.tableData1[index].id)
      if (
        row.ip === undefined ||
        row.ip === "" ||
        row.port === undefined ||
        row.port === "" ||
        row.protocol === undefined ||
        row.protocol === "" ||
        row.delay === undefined ||
        row.delay === "" ||
        row.persistence_timeout === undefined ||
        row.persistence_timeout === "" ||
        row.lb_algo === undefined ||
        row.lb_algo === ""
      ) {
        return;
      }
      const _row = JSON.parse(JSON.stringify(row));
      updateVirtualConfig(
        this.$route.query.groupid,
        this.tableData1[index].id,
        _row
      ).then((res) => {
        this.$message({
          type: "success",
          message: "修改配置成功"
        });
      });
    },
    // vrrp展开
    ZhanKai(row, index) {
      this.loading = true;
      if (
        row.ip === undefined ||
        row.ip === "" ||
        row.port === undefined ||
        row.port === "" ||
        row.protocol === undefined ||
        row.protocol === "" ||
        row.delay === undefined ||
        row.delay === "" ||
        row.persistence_timeout === undefined ||
        row.persistence_timeout === "" ||
        row.lb_algo === undefined ||
        row.lb_algo === ""
      ) {
        this.addShow = false;
        this.$message({
          type: "warning",
          message: "请先点击新增"
        });
      } else {
        this.addShow = true;
        this.virtualServerId = this.tableData1[index].id;
        getAllRealserver(this.$route.query.groupid, this.virtualServerId).then((res) => {
        // console.log(res.data)
          this.tableData2 = res.data;
          this.loading = false;
        })
      }
      // this.addShow = true;
      // console.log(this.tableData1[index].id)
      // 获取对应vrrp的realserver
      // this.virtualServerId = this.tableData1[index].id;
      // getAllRealserver(this.$route.query.groupid, this.virtualServerId).then((res) => {
      //   // console.log(res.data)
      //   this.tableData2 = res.data;
      // })
    },
    // 获取realServer
    getAllRealserver() {
      getAllRealserver(this.$route.query.groupid, this.virtualServerId).then((res) => {
        // console.log(res.data)
        // this.tableData2 = res.data;
        const flagArr = fetchAddFlagArray(this.tableData2);
        this.tableData2 = [...res.data, ...flagArr];
      })
    },
    // 添加一条realServer
    addRealConfig() {
      const lastData = this.tableData2[this.tableData2.length - 1];
      if (lastData === undefined) {
        this.tableData2.splice(this.tableData2.length, 0, { add_flag: true });
        return;
      }
      this.tableData2.splice(this.tableData2.length, 0, {
        ip: lastData.ip,
        weight: lastData.weight,
        connect_timeout: lastData.connect_timeout,
        port: lastData.port,
        retry: lastData.retry,
        delay_before_retry: lastData.delay_before_retry,
        add_flag: true
      });
    },
    // realserver移除
    handleRealRemove() {
      this.tableData2.splice(this.tableData2.length - 1, 1);
    },
    // realServer删除
    handleDelete(row) {
      this.$confirm("确定要删除该条配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认删除后发起请求
          this.loading = true;
          removeRealConfig(
            this.$route.query.groupid,
            this.virtualServerId,
            row.id
          ).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.tableData2.splice(this.currentRowIndex, 1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // realServer新增
    addRealConfigSure(row) {
      if (
        row.ip === undefined ||
        row.ip === "" ||
        row.port === undefined ||
        row.port === "" ||
        row.weight === undefined ||
        row.weight === "" ||
        row.connect_timeout === undefined ||
        row.connect_timeout === ""
      ) {
        return;
      }
      const _row = JSON.parse(JSON.stringify(row));
      delete _row["add_flag"];
      addRealConfig(
        this.$route.query.groupid,
        this.virtualServerId,
        _row
      ).then((res) => {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.tableData2.splice(_row.row_index, 1);
        this.getAllRealserver();
      });
    },
    // realServer修改
    updateRealConfigSure(row) {
      if (
        row.ip === undefined ||
        row.ip === "" ||
        row.port === undefined ||
        row.port === "" ||
        row.weight === undefined ||
        row.weight === "" ||
        row.connect_timeout === undefined ||
        row.connect_timeout === ""
      ) {
        return;
      }
      this.loading = true;
      const _row = JSON.parse(JSON.stringify(row));
      updateRealConfig(
        this.$route.query.groupid,
        this.virtualServerId,
        _row.id,
        _row
      ).then((res) => {
        this.$message({
          type: "success",
          message: "修改成功"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-input__inner {
  text-align: center;
  border: none;
}
>>> .el-select .el-input {
  width: 244.69px;
  .el-select__caret {
    color: #dcdfe6;
  }
}
.deploy{
    position:absolute;
    right:10%;
    padding: 9px 44px;
    letter-spacing: 1px;
}
.add-disabled{
  pointer-events: none;
}
.content {
  background: #ffffff;
  min-height: 800px;
  padding-bottom: 50px;
  margin: 15px 110px;
  display: flow-root;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  > .title {
    font-size: 24px;
    font-family: MyriadPro Regular;
    color: rgb(22, 22, 22);
    display: flex;
    height: 50px;
    line-height: 50px;
    margin: 50px;
    .add-config {
      cursor: pointer;
    }
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
    }
    >>> .el-select {
      margin-left: auto;
      width: 200px;
    }
    >>> .el-select .el-input {
      width: 100%;
    }
    >>> .el-input__inner {
      border: 1px solid rgb(70, 158, 236);
      border-radius: 6px;
      height: 36px;
    }
    >>> .el-icon-arrow-up:before {
      color: blue;
    }
  }
  > .table {
    display: flow-root;
    >>> .el-table {
      width: 100%;
    }
    .table1-wrapper {
      float: left;
      margin-left: 2%;
      width: 47.5%;
      .title {
        line-height: 50px;
        font-weight: 400;
        font-size: 20px;
        img {
          vertical-align: middle;
          cursor: pointer;
        }
      }
      img {
        cursor: pointer;
      }
      >>> .el-select {
        border: none;
        .el-input {
          width: 100%;
        }
        .el-input--suffix .el-input__inner {
          border: none;
          background: inherit;
        }
        .el-icon-arrow-up:before {
          color: blue;
        }
      }
    }
    .table2-wrapper {
      >>> .el-loading-mask {
        right: 1px;
        bottom: 1px;
      }
      float: right;
      margin-right: 2%;
      width: 47.5%;
      .title {
        font-size: 20px;
        font-weight: 400;
        line-height: 50px;
        img {
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .add-real-config {
        margin-top: 15px;
        display: inline-block;
        cursor: pointer;
      }
    }
    .button-wrapper {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      >>> .el-button + .el-button {
        margin-left: 0px;
      }
    }
  }
}
</style>
