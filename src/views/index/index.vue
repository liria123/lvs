<template>
  <div class="content">
    <el-input
      v-model="inputSearchValue"
      placeholder
      class="input-with-select"
      style="width:420px;margin-bottom:30px;"
      size="medium"
      suffix-icon="el-icon-search"
      @keyup.enter.native="searchGroup"
    >
      <el-select slot="prepend" v-model="selectSearchType" placeholder>
        <el-option label="工作组名称" value="1"></el-option>
        <el-option label="工作组 ID" value="2"></el-option>
        <el-option label="节点 IP" value="3"></el-option>
      </el-select>
    </el-input>
    <el-row v-loading="loading" :gutter="30">
      <el-col
        v-for="(item, index) in groupList"
        :key="item.groupid"
        :span="12"
        style="margin-bottom:46px;"
      >
        <div v-if="index%2===0" class="group1">
          <div class="group_operate">
            <i class="el-icon-delete group_operate_delete" @click="deleteGroup(item.groupid)"></i>
            <i class="el-icon-edit group_operate_edit" @click="updateGroup(item.groupid,item.workgroupname)"></i>
          </div>
          <div class="group_title">{{item.workgroupname}}</div>
          <div class="group_data">
            <span>节点数： {{nodeipNum(item.nodeip)}}</span>
            <span style="margin-left: 30px;">vip数： {{item.vip}}</span>
          </div>
          <div class="group_go">
            <el-button size="mini" class="group_button" @click="goGroup(item.groupid)">点击进入</el-button>
          </div>
        </div>
        <div v-else class="group2">
          <div class="group_operate">
            <i class="el-icon-delete group_operate_delete" @click="deleteGroup(item.groupid)"></i>
            <i class="el-icon-edit group_operate_edit" @click="updateGroup(item.groupid,item.workgroupname)"></i>
          </div>
          <div class="group_title">{{item.workgroupname}}</div>
          <div class="group_data">
            <span>节点数： {{nodeipNum(item.nodeip)}}</span>
            <span style="margin-left: 30px;">vip数： {{item.vip}}</span>
          </div>
          <div class="group_go">
            <el-button size="mini" class="group_button" @click="goGroup(item.groupid)">点击进入</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="addGroup" style="margin-bottom:46px;" @click="dialogVisibleGroup = true">
          <img
            class="addGroupImg"
            src="../../assets/index/icon-zhengjia.png"
            alt="添加"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 创建工作组 -->
    <el-dialog
      title="创建工作组"
      :visible.sync="dialogVisibleGroup"
      width="30%"
      :close-on-click-modal="false"
      center
    >
      <el-input v-model="inputGroup" placeholder="工作组名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleGroup = false">取 消</el-button>
        <el-button type="primary" @click="addGroup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更新工作组 -->
    <el-dialog
      title="更新工作组"
      :visible.sync="dialogVisibleGroup_update"
      width="30%"
      :close-on-click-modal="false"
      center
      @close="dialogVisibleGroup_update_close"
    >
      <el-input v-model="inputGroup_update.name" placeholder="工作组名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleGroup_update = false">取 消</el-button>
        <el-button type="primary" @click="updateGroup('submit')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWorkGroupAll,
  addWorkGroup,
  deleteWorkGroup,
  updateWorkGroup,
  // eslint-disable-next-line no-unused-vars
  modifyConfig
} from "@/api/index";
export default {
  name: "Index",
  data() {
    return {
      inputSearchValue: "",
      selectSearchType: "1",
      groupList: [],
      groupOldList: [],
      sum: [],
      dialogVisibleGroup: false,
      dialogVisibleGroup_update: false,
      inputGroup: "",
      inputGroup_update: {
        id: "",
        name: ""
      },
      loading: true
    };
  },
  created() {
    // 获取所有工作组
    this.getAllWorkGroup();
    this.bus.$on("selectWorkGroup", () => {
      this.getAllWorkGroup();
    });
    this.bus.$on("renameWorkGroup", () => {
      this.getAllWorkGroup();
    });
    this.bus.$on("removeWorkGroup", () => {
      this.getAllWorkGroup();
    });
  },
  methods: {
    nodeipNum(item) {
      if (item !== undefined) {
        return Object.keys(item).length;
      } else {
        return 0;
      }
    },
    getAllWorkGroup() {
      getWorkGroupAll().then(res => {
        console.log(res)
        this.groupOldList = res.data;
        this.groupList = res.data;
        this.loading = false;
        const nodeipKeys = this.groupList.map((item, index, array) => {
          return item.nodeip;
        })
        // console.log(nodeipKeys)
        const nodeipValues = nodeipKeys.map((item, index, array) => {
          if (item !== undefined) {
            return Object.values(nodeipKeys[index])
          }
        })
        // console.log(nodeipValues)
        nodeipValues.forEach((item, index, array) => {
          if (item !== undefined) {
            var itemLength = [];
            item.forEach((item, index, array) => {
              if (item !== null && item !== undefined) {
                itemLength.push(item.length)
              } else {
                itemLength.push(0)
              }
            })
            this.sum.push(itemLength.reduce((x, y) => x + y))
          }
        })
        // console.log(this.sum)
        res.data.forEach((value, index) => {
          for (var i = 0; i < index + 1; i++) {
            value['vip'] = this.sum[i]
          }
          if (value['vip'] === undefined) {
            value['vip'] = 0;
          }
        })
      });
    },
    // 添加工作组
    addGroup() {
      if (this.inputGroup === "") {
        this.$message({
          message: "名称不能为空",
          type: "warning"
        });
      } else {
        this.dialogVisibleGroup = false;
        const param = {
          data: {
            name: this.inputGroup
          }
        };
        // console.log(param)
        addWorkGroup(param).then(res => {
          this.bus.$emit("selectWorkGroup");
          this.$message({
            type: "success",
            message: "新增工作组成功"
          });
        });
      }
    },
    // 删除工作组
    deleteGroup(groupid) {
      this.$confirm("此操作将删除该工作组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          const param = {
            id: groupid
          };
          deleteWorkGroup(param)
            .then(res => {
              this.bus.$emit("removeWorkGroup");
              this.$message({
                type: "success",
                message: "删除工作组成功"
              });
            })
            .catch(err => {
              err &&
                this.$message({
                  type: "error",
                  message: "删除失败，工作组不为空"
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
    // 更新工作组
    updateGroup(p, workgroupname) {
      if (p === "submit") {
        const param = {
          id: this.inputGroup_update.id,
          data: {
            name: this.inputGroup_update.name
          }
        };
        updateWorkGroup(param).then(res => {
          this.dialogVisibleGroup_update = false;
          this.bus.$emit("renameWorkGroup");
          this.$message({
            type: "success",
            message: "修改名称成功"
          });
        });
      } else {
        this.inputGroup_update.id = p;
        this.inputGroup_update.name = workgroupname;
        this.dialogVisibleGroup_update = true;
      }
    },
    // 关闭更新工作组对话框
    dialogVisibleGroup_update_close() {
      this.dialogVisibleGroup_update = {
        id: "",
        name: ""
      };
      this.dialogVisibleGroup_update = false;
    },
    // 进入工作组
    goGroup(groupid) {
      console.log("进入工作组" + groupid);
      this.$router.push({ name: "LoadBalancing", query: { groupid }});
    },
    // 查询
    searchGroup() {
      this.groupList = this.groupOldList;
      // console.log(this.groupList)
      const inputSearchValue = this.inputSearchValue;
      if (inputSearchValue === "") {
        this.$message({
          message: "查询内容不能为空",
          type: "warning"
        });
      } else {
        const reg = new RegExp(["", ...inputSearchValue, ""].join(".*"));
        const newGroupList = [];
        if (this.selectSearchType === "1") {
          // 按工作组名称查询
          for (let i = 0; i < this.groupList.length; i++) {
            if (reg.test(this.groupList[i].workgroupname)) {
              newGroupList.push(this.groupList[i]);
              console.log(newGroupList);
            }
          }
        } else if (this.selectSearchType === "2") {
          // 按工作组ID查询
          for (let i = 0; i < this.groupList.length; i++) {
            // console.log(inputSearchValue, this.groupList[i].id)
            if (+inputSearchValue === this.groupList[i].groupid) {
              // console.log(inputSearchValue, this.groupList[i].id)
              newGroupList.push(this.groupList[i]);
            }
          }
        } else if (this.selectSearchType === "3") {
          // 按节点IP查询
        }
        if (newGroupList.length === 0) {
          this.$message({
            message: "查询结果不存在",
            type: "warning"
          });
        } else {
          this.groupList = newGroupList;
        }
      }
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
.content {
  // width: 100vw;
  padding-top: 40px;
  padding-left: 236px;
  padding-right: 236px;
  // background-color: rgb(250, 250, 250)
}
.group1 {
  // width: 704px;
  height: 200px;
  border-radius: 5px;
  background: url("../../assets/index/beijing.png"),
    linear-gradient(to right, #68a6cb, #7cc0e6);
  background-size: 100% 100%;
  padding: 15px 30px 30px 30px;
  box-shadow: 0 0 16px 0 rgba(0,0,0,.1);
}
.group2 {
  // width: 704px;
  height: 200px;
  border-radius: 5px;
  background: url("../../assets/index/beijing02.png"),
    linear-gradient(to right, #68a6cb, #7cc0e6);
  background-size: 100% 100%;
  padding: 15px 30px 30px 30px;
  box-shadow: 0 0 16px 0 rgba(0,0,0,.1);
}
.group_operate {
  width: 100%;
  margin-bottom: 15px;
  color: white;
  font-size: 18px;
  overflow: hidden;
}
.group_operate_delete {
  float: right;
  margin-left: 15px;
  cursor: pointer;
}
.group_operate_edit {
  float: right;
  cursor: pointer;
}
.group_title {
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
}
.group_data {
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
}
.group_go {
  width: 100%;
}
.group_button {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #ffffff;
  color: #ffffff;
  border-radius: 10px;
  width: 90px;
  height: 34px;
  font-size: 15px;
  float: right;
  font-family: "Microsoft YaHei";
}
.group_button:hover {
  background-color: rgba(252, 135, 122, 1);
  border: 1px solid rgb(252, 132, 122);
  color: #ffffff;
}
.addGroup {
  height: 200px;
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0,0,0,.1);
}
</style>
