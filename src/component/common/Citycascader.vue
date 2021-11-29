<template>
  <el-cascader
    v-model="selectKey"
    :options="cityData"
    expand-trigger="hover"
    clearable
    @change="handleChange"
  ></el-cascader>
</template>

<script>
import cityData from '@/utils/citydata'
export default {
  data() {
    return {
      cityData,
      selectKey: [],
    }
  },
  methods: {
    handleChange() {
      this.$emit('handleChange', this.selectKey)
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>