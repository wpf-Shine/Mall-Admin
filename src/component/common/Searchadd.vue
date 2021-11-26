<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7"
        ><el-input
          placeholder="请输入内容"
          clearable
          v-model="query"
          @clear="getList"
          @keyup.enter.native="getList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getList"
          ></el-button> </el-input
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="btnAdd()"
          >添加{{ type }}</el-button
        ></el-col
      ></el-row
    >
  </div>
</template>

<script>
export default {
  name: 'Searchadd',
  props: {
    type: { type: String },
  },
  data() {
    return {
      query: '',
    }
  },
  methods: {
    btnAdd() {
      this.$emit('btnAdd', true)
    },
    getList() {
      this.$emit('getList', this.query)
    },
  },
}
</script>

<style>
</style>