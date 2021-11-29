<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="searchOrder"
            @keyup.enter.native="searchOrder"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrder"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border stripe :data="orderTableData" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px">
        </el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80px"
        ></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ formData(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
          ><template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editOrder"
              >编辑</el-button
            >
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgress"
              >物流信息</el-button
            ></template
          ></el-table-column
        >
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      width="50%"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <Citycascader @handleChange="handleChange"></Citycascader
        ></el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="activity in progressInfo"
          :key="activity"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrder, getProgress } from '@/network/orders'
import { parseTime } from '@/utils'
import Citycascader from '@/component/common/Citycascader'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      total: 0,
      orderTableData: [],
      editDialogVisible: false,
      progressDialogVisible: false,
      editOrderForm: {
        address1: [],
        address2: '',
      },
      editOrderFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'change' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      progressInfo: [],
    }
  },
  components: {
    Citycascader,
  },
  created() {
    this.getOrderList()
  },
  computed: {
    formData(data) {
      return function (data) {
        return parseTime(data)
      }
    },
  },
  methods: {
    async getOrderList() {
      const res = await getOrder(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      )
      if (res.meta.status != 200)
        return this.$message.error('获取订单列表数据失败')
      this.total = res.data.total
      this.orderTableData = res.data.goods
    },
    searchOrder() {
      if (this.queryInfo.query.trim() != '') {
        this.getOrderList()
      }
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getOrderList()
    },
    editOrder() {
      this.editDialogVisible = true
    },
    handleChange(data) {
      this.editOrderForm.address1 = data
    },
    editDialogClose() {
      this.$refs.editOrderFormRef.resetFields()
    },
    async showProgress() {
      this.progressDialogVisible = true
      const res = await getProgress(1106975712662)
      if (res.meta.status != 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
    },
  },
}
</script>

<style lang="less" scoped>
@import '~/plugins/timeline/timeline.css';
@import '~/plugins/timeline-item/timeline-item.css';
</style>