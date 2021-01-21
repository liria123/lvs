<template>
  <el-container class="container">
    <el-header class="header">
      <el-col
        v-if="!collapsed"
        :span="10"
        class="logo"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >
        <i class="header_icon"></i>
        <strong>{{sysName}}</strong>
      </el-col>
      <el-col
        v-if="collapsed"
        :span="10"
        class="logo_collapse"
        :class="collapsed?'logo-collapse-width':'logo-width'"
      >
        <i class="header_icon_collapse"></i>
      </el-col>
      <el-col :span="10">
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#030a0f"
          text-color="#bbb"
          trigger="hover"
          active-text-color="#fff"
        >
          <el-menu-item index="1">
            <a :href="Jump('main')">总览</a>
          </el-menu-item>
          <el-menu-item
            index="2"
            style="width:120px;"
            @mouseenter.native="handleMouseEnter"
            @mouseleave.native="handleMouseLeave"
          >
            服务列表
            <i class="el-icon-arrow-down el-icon--right" style="margin-left: -5px;"></i>
          </el-menu-item>
          <el-menu-item index="3">
            <a :href="Jump('user')" style="vertical-align: baseline">用户与授权</a>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="3" class="userinfo">
        <el-dropdown trigger="hover">
          <span style="font-size: 18px;" class="el-dropdown-link userinfo-inner">
            {{loginName}}
            <i class="el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="config_password">设置密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-header>
    <el-main
      ref="ps_server"
      class="ps_menu"
      @mouseenter.native="handleMouseEnter"
      @mouseleave.native="handleMouseLeave"
    >
      <el-aside width="240px" style="border-right: #282828 1px solid;">
        <el-menu
          :default-active="activeIndex3"
          background-color="#191919"
          text-color="#fff"
          active-text-color="#2274e6;"
          style="border-right: #282828 1px solid;"
        >
          <el-menu-item index="1" style="font-size:18px; font-weight: bold;">
            服务列表
            <i class="el-icon-tickets" style="float:right;margin-top:20px;"></i>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="width: 85%;height: 100%;">
        <el-card class="box-card">
          <div class="clearfix">
            <span>
              <em style="font-style: normal;font-weight: 400;">基础服务</em>
            </span>
          </div>
          <div class="text item">
            <a :href="Jump('plugins')">{{"Plugin插件服务"}}</a>
          </div>

          <div class="clearfix">
            <span>
              <em style="font-style: normal;font-weight: 400;">网络</em>
            </span>
          </div>

          <div class="text item">
            <a :href="Jump('unlayer_workgroup')">{{"UNLAYER负载均衡(旧版)"}}</a>
            <a href="../unlayer/index.html" target="_self">{{"UNLAYER负载均衡(新版)"}}</a>
          </div>

          <div class="text item">
            <a href="javascript: ;" target="_self">{{"UNLVS负载均衡"}}</a>
          </div>

          <div class="clearfix">
            <span>
              <em style="font-style: normal;font-weight: 400;">数据库</em>
            </span>
          </div>

          <div class="text item">
            <a :href="Jump('uncache_workgroup')">{{"UNCACHE缓存"}}</a>
          </div>

          <div class="text item">
            <a :href="Jump('undb_workgroup')">{{"UNDB关系数据库"}}</a>
          </div>

          <div class="clearfix">
            <span>
              <em style="font-style: normal;font-weight: 400;">存储</em>
            </span>
          </div>

          <div class="text item">
            <a :href="Jump('oss_user')">{{"OSS对象存储"}}</a>
          </div>
        </el-card>
      </el-main>
    </el-main>
    <el-dialog
      v-model="editFormVisible"
      title="设置密码"
      :close-on-click-modal="false"
      :visible.sync="editFormVisible"
      width="35%"
    >
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证密码" prop="new_password">
          <el-input v-model="editForm.new_password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/auth";
import { updateUser } from "@/api/update-user";
export default {
  data() {
    return {
      collapsed: false,
      sysName: "TRIANGLE",
      activeIndex: "1",
      activeIndex2: "1",
      activeIndex3: "1",
      editForm: {
        name: "",
        password: "",
        new_password: "",
      },
      editFormVisible: false,
      editLoading: false,
      loginName: "",
    };
  },
  created() {
    this.loginName = window.localStorage.getItem("loginName");
  },
  methods: {
    Jump(content) {
      return `../index.html#/${content}`;
    },
    handleMouseEnter(e) {
      this.$refs.ps_server.$el.style.display = "flex";
    },
    handleMouseLeave(e) {
      this.$refs.ps_server.$el.style.display = "none";
    },
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning",
      })
        .then(
          () => {
            removeToken("access_token");
            window.location.href = "../index.html#/login";
          },
          () => {}
        )
        .catch(() => {});
    },
    config_password() {
      this.editFormVisible = true;
      this.editForm.name = window.localStorage.getItem("loginName");
    },
    // 设置密码
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        this.editLoading = true;
        const regUpper = /[A-Z]/;
        const regLower = /[a-z]/;
        const regNum = /[0-9]/;
        const regTeShu = new RegExp(
          "[`~!@%#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+-]"
        );
        let complex = 0;
        const patt1 = new RegExp(window.localStorage.getItem("loginName"));
        if (regLower.test(this.editForm.password)) {
          ++complex;
        }
        if (regUpper.test(this.editForm.password)) {
          ++complex;
        }
        if (regNum.test(this.editForm.password)) {
          ++complex;
        }
        if (regTeShu.test(this.editForm.password)) {
          ++complex;
        }
        if (
          complex < 3 ||
          this.editForm.password.length < 8 ||
          patt1.test(this.editForm.password)
        ) {
          this.$message.info(
            "密码长度不小于8位，包含数字、字母大小写、符号中的至少3种"
          );
          this.editLoading = false;
          return false;
        } else {
          if (valid) {
            if (this.editForm.password !== this.editForm.new_password) {
              this.$message.error("输入密码不一致");
              this.editLoading = false;
              return;
            }
            this.$confirm("确认提交吗？", "提示", {}).then(
              () => {
                const sha256 = require("js-sha256").sha256; // 引入sha256库
                this.editForm.password = sha256(this.editForm.password); // has
                const param = {
                  username: window.localStorage.getItem("loginName"),
                  password: this.editForm.password,
                  info: this.editForm.info,
                };
                updateUser(param)
                  .then(() => {
                    this.editLoading = false;
                    this.$message({
                      message: "修改用户成功",
                      type: "success",
                    });
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                  })
                  .catch(() => {
                    this.editLoading = false;
                    this.$message.error("修改用户失败");
                  });
              },
              () => {}
            );
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoed>
.container {
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
  .el-main {
    padding: 0 !important;
  }
  .header {
    height: 60px;
    line-height: 60px;
    background: #030a0f;
    color: #fff;
    strong {
      background: -webkit-linear-gradient(-45deg, #f8ffc0, #88f4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header_icon {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: inline-block;
      vertical-align: middle;
      background-image: url("../../assets/logo.png");
    }
    .header_icon_collapse {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: inline-block;
      vertical-align: middle;
      background-image: url("../../assets/logo.png");
    }
    .el-menu-item {
      width: 100px;
      text-align: center;
      line-height: 60px;
      font-size: 16px;
      font-weight: 800;
      border-bottom: none;
      box-sizing: border-box;
    }
    .el-menu-item:hover {
      color: #2274e6 !important;
      i {
        color: #2274e6 !important;
      }
    }
    .is-active {
      border-bottom: none;
    }
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      // width:200px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo_collapse {
      height: 60px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
    }
    .logo-width {
      width: 220px;
      font-family: STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑";
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .ps_menu {
    top: 60px;
    left: 0;
    right: 0;
    z-index: 9999;
    height: 100%;
    width: 100%;
    min-height: 520px;
    overflow: hidden;
    background-color: #191919;
    display: none;
    position: absolute;
    align-content: center;
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 15px;
    }
    a {
      text-decoration: none;
      color: #bbb;
      line-height: 24px;
      height: 24px;
      display: block;
      padding: 0;
      box-sizing: border-box;
      white-space: nowrap;
      font-size: 14px;
      color: #a6a6a6;
      width: 100%;
    }
    a:hover {
      color: #2274e6;
      font-weight: 500;
    }
    .clearfix:after,
    .clearfix:before {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both;
    }

    .box-card {
      width: 20%;
      height: 100%;
      background-color: #191919;
      border: 0;
      color: #bbb;
      margin-left: 14px;
      div .clearfix {
        font-size: 16px;
        color: #fff;
        padding-bottom: 10px;
        cursor: default;
        line-height: 20px;
      }
    }
    .el-card__header {
      border-bottom: none;
    }
  }
}
</style>
