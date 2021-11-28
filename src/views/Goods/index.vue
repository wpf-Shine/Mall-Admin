<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加 -->
      <Searchadd
        @btnAdd="goAddPage"
        @getList="getGoodsList"
        type="商品"
        ref="searchRefs"
      ></Searchadd>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量（kg）"
          width="130px"
        >
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            <span>{{ formData(scope.row.add_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="goEditPage(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="btnDelGoods(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, delGood } from '@/network/goods'
import Searchadd from '@/component/common/Searchadd'
import { parseTime } from '@/utils'
export default {
  name: 'Goods',
  data() {
    return {
      goodsList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 8,
      },
      total: 0,
    }
  },
  components: {
    Searchadd,
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList(query) {
      const res = await getGoodsList(
        query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      )
      if (res.meta.status != 200)
        return this.$message.error('获取商品列表数据失败：' + res.meta.msg)
      this.total = res.data.total
      this.goodsList = res.data.goods
      console.log(res)
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 删除商品
    async btnDelGoods(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmRes != 'confirm') return this.$message.info('已取消删除')
      const res = await delGood(id)
      if (res.meta.status != 200)
        return this.$message.error('删除商品失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 跳转添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    goEditPage(id) {
      this.$router.push({
        path: '/goods/edit',
        query: {
          id,
        },
      })
    },
  },
  computed: {
    formData(data) {
      return function (data) {
        return parseTime(data)
      }
    },
  },
}
</script>

<style>
</style>