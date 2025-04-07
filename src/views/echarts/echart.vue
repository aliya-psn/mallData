<template>
  <div class="dashboard-container">
    <div class="current-shop">
      <div>当前商品：</div>
      <el-input v-model="selectType" placeholder="请输入商品名称" />
    </div>

    <!-- 店铺销量图 -->
    <barShop v-if="echartsData.length > 0" id="bar-shop" :echarts-data="echartsData" />
    <!-- 发货地饼图 -->
    <chinaArea v-if="echartsData.length > 0" id="area-chart" :echarts-data="echartsData" />
  </div>
</template>

<script>
import { getProductsList } from '@/api/common'
import barShop from './components/barShop.vue' // 店铺销量柱状图
import chinaArea from './components/areaChart.vue' // 发货地饼图

export default {
  name: 'Echart',
  components: {
    barShop,
    chinaArea
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
          console.log('==GetData')
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
