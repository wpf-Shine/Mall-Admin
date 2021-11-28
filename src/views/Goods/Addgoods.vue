<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="parseInt(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 基本信息表单区 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-position="top"
        label-width="100px"
      >
        <!-- tab栏 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0"
            ><el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <Cascader
                @parentCateChange="getCateList"
                ref="cascaderCatRef"
              ></Cascader></el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
              ><el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemcb"
                  v-for="itemcb in item.attr_vals"
                  :key="itemcb"
                  border
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2"
            ><el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
              ><el-input v-model="item.attr_vals"></el-input></el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <Quilledit @editorChange="editorChange"></Quilledit>
            <el-button type="primary" @click="btnAddGoods"
              >添加商品</el-button
            ></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="picDialogVisible" width="50%">
      <img :src="picURL" class="picurl" />
    </el-dialog>
  </div>
</template>
  
  <script>
import Cascader from '@/component/common/Cascader'
import Quilledit from '@/component/common/Quilledit'
import { getParams, addGoods } from '@/network/goods'
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        // 图片数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: [],
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 上传图片请求API
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      picDialogVisible: false,
      // 预览图片的地址
      picURL: '',

      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
    }
  },
  components: {
    Cascader,
    Quilledit,
  },
  created() {},
  methods: {
    getCateList(data) {
      if (data.length != 3) {
        this.$refs.cascaderCatRef.selectedKeys = []
        return
      }
      this.addGoodsForm.goods_cat = data
    },
    // tab切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == '0' && this.addGoodsForm.goods_cat.length != 3) {
        this.$message.warning('请先选择商品分类')
        return false
      }
    },
    async tabClick(tag) {
      // 点击商品参数tab
      if (this.activeIndex == '1') {
        // 获取参数
        const res = await getParams(this.cateId, 'many')
        if (res.meta.status != 200)
          return this.$message.error('获取商品参数失败：' + res.meta.msg)
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
      // 点击商品属性tab
      else if (this.activeIndex == '2') {
        // 获取属性
        const res = await getParams(this.cateId, 'only')
        if (res.meta.status != 200)
          return this.$message.error('获取商品属性失败：' + res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.picDialogVisible = true
      this.picURL = file.response.data.url
    },
    // 处理图片移除
    handleRemove(file) {
      // 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中找到这个图片的索引值
      const fileIndex = this.addGoodsForm.pics.findIndex((x) => {
        x.pic == filePath
      })
      // 调用数组的splice方法，将图片信息对象从数组中移除
      this.addGoodsForm.pics.splice(fileIndex, 1)
    },
    // 图片上传成功
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 富文本编辑器改变事件
    editorChange(data) {
      this.addGoodsForm.goods_introduce = data
    },
    // 添加商品按钮
    btnAddGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项目')
        }
        // 处理动态参数和静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          console.log(newInfo)
          this.addGoodsForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 深拷贝
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        const res = await addGoods(form)
        if (res.meta.status != 201) {
          console.log(res)
          return this.$message.error('添加商品失败：' + res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length == 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>
  
  <style <style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.picurl {
  width: 100%;
}
</style>