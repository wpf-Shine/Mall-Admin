<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddDialog"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id, scope.row.cat_name)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delRole(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRule"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <Cascader @parentCateChange="parentCateChange"></Cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, addCate, delCate, editCate } from '@/network/goods'
import Cascader from '@/component/common/Cascader'

export default {
  name: 'Cate',
  data() {
    return {
      cateList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      addCateForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 要添加的分类等级
        cat_level: 0,
      },
      editCateForm: {
        id: '',
        cat_name: '',
      },
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加分类验证
      addCateFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'opt',
        },
      ],
    }
  },
  components: {
    Cascader,
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const res = await getCategories(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      )
      if (res.meta.status != 200)
        return this.$message.error('分类列表获取失败：' + res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    // 添加分类
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 子组件自定义事件
    parentCateChange(data) {
      this.selectedKeys = data
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 监听添加对话框的close事件
    addDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 添加分类确认按钮
    btnAddCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const res = await addCate(this.addCateForm)
        if (res.meta.status != 201)
          return this.$message.error('添加失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    // 删除分类
    async delRole(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        err
      })
      if (confirmRes != 'confirm') return this.$message.info('已取消删除')
      const res = await delCate(id)
      if (res.meta.status != 200)
        return this.$message.error('删除失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCateList()
    },
    // 修改分类
    showEditDialog(id, cat_name) {
      this.editDialogVisible = true
      this.editCateForm.cat_name = cat_name
      this.editCateForm.id = id
    },
    editDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    btnEditCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await editCate(this.editCateForm.id, {
          cat_name: this.editCateForm.cat_name,
        })
        if (res.meta.status != 200)
          return this.$message.error('更新失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.editDialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>