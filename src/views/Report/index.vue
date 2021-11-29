<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import { getReport } from '@/network/report'
import _ from 'lodash'
let echarts = require('echarts')

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  // 此时页面上的元素已经被渲染完毕
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const res = await getReport()
    if (res.meta.status != 200) return this.$message.error('获取报表数据失败')

    // 准备数据和配置项
    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  },
}
</script>

<style>
</style>

<style>
#main,
html,
body {
  width: 100%;
}
#main {
  height: 400px;
}
</style>