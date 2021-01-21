<template>
  <div>
    <ButtonMenu />
    <div class="task-wrapper">
      <div class="date-wrapper">
        <span class="task-text">选择查看任务列表的时间：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="---"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          size="small"
          @change="selectTime"
        >
        </el-date-picker>
        <!-- <el-button type="primary" class="date-sure">确定</el-button> -->
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        :data="current_task_list"
        border
        :header-cell-style="{ background: '#fafafa', color: '#606266' }"
      >
        <el-table-column prop="hostname" label="主机名" width="145px" align="center"></el-table-column>
        <el-table-column prop="id" label="任务ID" width="70px" align="center"></el-table-column>
        <el-table-column prop="node_id" label="节点ID" width="70px" align="center"></el-table-column>
        <el-table-column prop="task_type" label="任务类型" width="90px" align="center"></el-table-column>
        <el-table-column prop="status" label="任务状态" align="center"></el-table-column>
        <el-table-column label="任务数据" width="180px" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.data"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              :disabled="true"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="返回信息" align="center">
          <template slot-scope="scope">{{scope.row.msg || "无数据"}}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" align="center" width="160px"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="details(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right; margin-top: 20px;"
        background
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="prev, pager, next, total, sizes, jumper"
        :total="task_list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 查看详情对话框 -->
      <el-dialog title="任务详情" :visible.sync="detailsVisible" center width="700px">
        <el-form v-model="rowDetails">
          <el-row>
            <el-col :span="8">
              <el-form-item label="主机名：">{{rowDetails.hostname}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="节点ID：">{{rowDetails.node_id}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="任务ID：">{{rowDetails.id}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="任务类型：">{{rowDetails.task_type}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="任务状态：">{{rowDetails.status}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="返回信息：">{{rowDetails.msg || '无数据'}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间：">{{rowDetails.create_time}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新时间：">{{rowDetails.update_time}}</el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="任务数据：">
            <el-input
              v-model="rowDetails.data"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailsVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ButtonMenu from "@/components/ButtonMenu";
import { getTaskList } from "@/api/task-list";
import timeFormat from "@/utils/time-format.js";
export default {
  name: "TaskList",
  components: {
    ButtonMenu
  },
  data() {
    return {
      date: "",
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '三天内',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '一周内',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      rowDetails: [],
      detailsVisible: false,
      workgroup_id: this.$route.params.groupid,
      currentPage: 1,
      task_list: [],
      current_task_list: [],
      times: 5,
      loading: false
    };
  },
  methods: {
    // 通过日期获得数据
    selectTime(val) {
      this.date = val;
      // console.log(this.date);
      this.loading = true;
      getTaskList(
        this.$route.query.groupid,
        this.date[0],
        this.date[1]
      ).then(res => {
        // console.log(res.data);
        this.task_list = res.data;
        for (let i = 0; i < this.task_list.length; i++) {
          this.task_list[i].create_time = timeFormat(
            this.task_list[i].create_time
          );
          this.task_list[i].update_time = timeFormat(
            this.task_list[i].update_time
          );
        }
        this.current_task_list = this.task_list.slice(0, this.times);
        this.loading = false;
      });
    },
    // 查看详情
    details(row) {
      this.detailsVisible = true;
      this.rowDetails = row;
    },
    // 每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.times = val;
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.current_task_list = this.task_list.slice((val - 1) * this.times, this.times * val);
    }
  }
};
</script>

<style lang="scss" scoped>
.task-wrapper {
  background: #ffffff;
  min-height: 800px;
  padding-bottom: 50px;
  margin: 15px 110px;
  display: flow-root;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  text-align: center;
  .date-wrapper {
    display: inline-block;
    margin-top:1%;
  }
  .task-text{
    font-size: 14px;
    letter-spacing: 1px;
    /* font-weight: bold; */
  }
  .el-table{
    margin-left:5%;
    margin-top:1%;
    width:90%;
  }
  .el-pagination{
    margin-right: 5%;
  }
  >>> .el-pagination__jump {
    margin-left: 0px;
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
}
</style>
