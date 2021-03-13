<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="头像" align="center" width="180">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
                v-imageerror="defaultImg"
              />
            </template>
          </el-table-column>
          <el-table-column label="序号" sortable="" type="index" width="80" />
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
            width="180"
          />
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
            width="120"
          />
          <el-table-column
            label="聘用形式"
            sortable
            :formatter="formatEmployment"
            width="80"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
            width="100"
          />
          <el-table-column
            label="入职时间"
            sortable=""
            align="center"
            width="280"
          >
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
            width="80"
          />
          <el-table-column
            label="账户状态"
            align="center"
            sortable=""
            prop="enableState"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
               <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from "@/api/modules/employees";
import EmployeeEnum from "@/api/constant/employees";
export default {
  data() {
    return {
      defaultImg: require("@/assets/common/head.jpg"),
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
  },
};
</script>

<style>
</style>