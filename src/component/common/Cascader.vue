<template>
  <el-cascader
    expand-trigger="hover"
    v-model="selectedKeys"
    :props="cascaderProps"
    :options="parentCateList"
    clearable
    change-on-select
    @change="parentCateChange"
  >
    ></el-cascader
  >
</template>

<script>
import { getCategories } from '@/network/goods'
export default {
  name: 'Cascader',
  data() {
    return {
      // 父级分类列表
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
    }
  },
  created() {
    this.getParentCateList()
  },
  methods: {
    // 获取父级分类的数据
    async getParentCateList() {
      const res = await getCategories()
      if (res.meta.status != 200)
        return this.$message.error('获取父级分类失败：' + res.meta.msg)
      this.parentCateList = res.data
    },
    parentCateChange() {
      this.$emit('parentCateChange', this.selectedKeys)
    },
  },
}
</script>

<style>
</style>