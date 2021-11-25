<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <Cascader
            @parentCateChange="parentCateChange"
            ref="cascaderRef"
          ></Cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isSeletNull"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <Expandtag :scope="scope"></Expandtag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isSeletNull"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <Expandtag :scope="scope"></Expandtag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
      width="50%"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      width="50%"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getParams,
  addParams,
  getParamById,
  editParams,
  delParams,
} from '@/network/goods'
import Cascader from '@/component/common/Cascader'
import Expandtag from './children/Expandtag.vue'

export default {
  name: 'Params',
  data() {
    return {
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 被选中的页签
      activeTabName: 'many',
      manyTableDate: [],
      onlyTableDate: [],
      // 添加参数
      addDialogVisible: false,
      addParamsForm: {
        attr_name: '',
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      // 修改参数
      editDialogVisible: false,
      editParamsForm: {
        attr_name: '',
        cat_id: '',
        attr_id: '',
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
    }
  },
  components: { Cascader, Expandtag },
  methods: {
    // 子组件自定义事件
    parentCateChange(data) {
      this.selectedKeys = data
      // 证明选中的不是三级分类
      if (this.selectedKeys.length != 3) {
        this.$refs.cascaderRef.selectedKeys = []
        this.selectedKeys = []
        this.manyTableDate = []
        this.onlyTableDate = []
        return
      }
      this.getParams()
    },
    // tab页签点击事件
    handleTabClick() {
      if (!this.isSeletNull) {
        this.getParams()
      }
    },
    // 获取参数数据
    async getParams() {
      // 根据所选id和当前所处的tab获取参数
      const res = await getParams(this.cateId, this.activeTabName)
      if (res.meta.status != 200)
        return this.$message.error('获取参数数据失败：' + res.meta.msg)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeTabName == 'many') {
        this.manyTableDate = res.data
      } else {
        this.onlyTableDate = res.data
      }
    },
    // 监听添加参数的dialog关闭
    addDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    btnAddParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await addParams(this.cateId, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeTabName,
        })
        if (res.meta.status != 201)
          return this.$message.error('创建失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParams()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮
    async editDialog(data) {
      this.editDialogVisible = true
      const res = await getParamById(
        data.cat_id,
        data.attr_id,
        this.activeTabName
      )
      if (res.meta.status != 200)
        return this.$message.error('获取参数失败：' + res.meta.msg)
      this.editParamsForm.attr_name = res.data.attr_name
      this.editParamsForm.cat_id = res.data.cat_id
      this.editParamsForm.attr_id = res.data.attr_id
    },
    // 监听添加参数的dialog关闭
    editDialogClose() {
      this.$refs.editParamsFormRef.resetFields()
    },
    btnEditParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await editParams(
          this.editParamsForm.cat_id,
          this.editParamsForm.attr_id,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeTabName,
          }
        )
        if (res.meta.status != 200)
          return this.$message.error('更新失败：' + res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParams()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    async delParams(data) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const res = await delParams(data.cat_id, data.attr_id)
      if (res.meta.status != 200)
        return this.$message.error('删除失败：' + res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParams()
    },
  },
  computed: {
    isSeletNull() {
      return this.selectedKeys == ''
    },
    // 当前选择的三级id
    cateId() {
      if (this.selectedKeys) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeTabName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>