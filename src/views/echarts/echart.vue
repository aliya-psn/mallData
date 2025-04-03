<template>
  <div class="dashboard-container">
    <div class="current-shop">
      <div>当前商品：</div>
      <el-select v-model="selectType" placeholder="请选择" @change="getEchartsData">
        <el-option
          v-for="item in types"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>

    <!-- 店铺销量图 -->
    <barShop v-if="echartsData.length > 0" id="bar-shop" :echarts-data="echartsData" />
    <!-- 发货地饼图 -->
    <chinaArea v-if="echartsData.length > 0" id="area-chart" :echarts-data="echartsData" />
  </div>
</template>

<script>
import { getProductType, getProductsListByType } from '@/api/common'
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
      types: [],
      selectType: ''
    }
  },
  async created() {
    const res = await getProductType()
    this.types = res.data.map((item) => {
      return item.type
    })
    this.selectType = this.types[0]
    this.getEchartsData()
  },
  methods: {
    getEchartsData() {
      // 获取表统计数量
      getProductsListByType(this.selectType).then((res) => {
        if (res.code === 200) {
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
