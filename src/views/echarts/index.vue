<template>
  <div class="dashboard-container">
    <div class="current-shop">
      <div>当前商品：</div>
      <el-input v-model="selectType" placeholder="请输入商品类型" />
    </div>

    <!-- 价格与销量 散点图 -->
    <scatterChart v-if="echartsData.length > 0" id="scatter" :echarts-data="echartsData" />
    <!-- 价格与销量 柱状图 -->
    <barChart v-if="echartsData.length > 0" id="barChart" :echarts-data="echartsData" />
    <!-- 价格分布直方图 -->
    <barPrice v-if="echartsData.length > 0" id="barPrice" :echarts-data="echartsData" />
    <!-- 价格折线图 -->
    <lineChart v-if="echartsData.length > 0" id="line1" :echarts-data="echartsData" />
    <!-- 销量折线图 -->
    <lineChart v-if="echartsData.length > 0" id="line2" :echarts-data="echartsData" />
  </div>
</template>

<script>
import { getProductsList } from '@/api/common'
import barChart from './components/barChart.vue' // 柱状图
import barPrice from './components/barPrice.vue' // 柱状图
import lineChart from './components/lineChart.vue' // 折线图
import scatterChart from './components/scatter.vue' // 散点图

export default {
  name: 'Dashboard',
  components: {
    barChart,
    barPrice,
    lineChart,
    scatterChart
  },
  data() {
    return {
      echartsData: [],

      selectType: ''
    }
  },
  async created() {
    this.selectType = '手机'
    this.getEchartsData()
  },
  methods: {
    getEchartsData() {
      // 获取表统计数量
      getProductsList(this.selectType).then((res) => {
        if (res.code === '000') {
          this.echartsData = res.data
        } else {
          this.$message({
            type: 'warning',
            message: '服务器错误，请稍后再试'
          })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  gap: 35px;
  min-height: 500px;
}
.current-shop {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
