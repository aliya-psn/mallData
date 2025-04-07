<template>
  <div style="height: 430px; width: 100%; text-align: center;">
    <div :id="id" style="height: 380px; width: 100%;" />
    <span v-if="result1" class="result">分析结果：<br>{{ result1 }} <br> {{ result2 }}</span>
    <el-button v-else type="primary" @click="handleAnalyze">分析散点图数据</el-button>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    echartsData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'scatter'
    }
  },
  data() {
    return {
      myChart: null,
      // 分析结果
      result1: null,
      result2: null
    }
  },
  watch: {
    echartsData(val) {
      if (val.length > 0) {
        this.loadChart()
      }
    }
  },
  mounted() {
    this.loadChart()
  },
  beforeDestroy() {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },
  methods: {
    loadChart() {
      this.$nextTick(() => {
        this.myChart = echarts.init(
          document.getElementById(this.id)
        )
        this.myChart.setOption(this.initOption())
      })
    },
    initOption() {
      const prices = this.echartsData.map(product => product.price)
      const sales = this.echartsData.map(product => product.sold)
      const productNames = this.echartsData.map(product => product.name)

      const data = {
        title: {
          text: '价格与销量散点图'
        },
        tooltip: {
          trigger: 'axis',
          // 鼠标悬停时显示的提示信息
          formatter: function(params) {
            return '商品: ' + params[0].name + '<br/>价格: ' + params[0].value[0] + '<br/>销量: ' + params[0].value[1]
          },
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'value',
          name: '价格'
        },
        yAxis: {
          type: 'value',
          name: '销量'
        },
        series: [{
          data: productNames.map((name, index) => ({
            name,
            value: [prices[index], sales[index]]
          })),
          type: 'scatter'
        }],
        dataZoom: [
          {
            type: 'inside', // 内置的数据区域缩放
            xAxisIndex: [0], // 仅对横轴进行缩放
            start: 0, // 缩放范围的起始百分比
            end: 100 // 缩放范围的结束百分比
          },
          {
            type: 'slider', // 数据窗口漫游
            xAxisIndex: [0], // 仅对横轴进行漫游
            start: 0, // 数据窗口的起始百分比
            end: 100 // 数据窗口的结束百分比
          }
        ]
      }
      return data
    },

    // 分析
    handleAnalyze() {
      this.analyzeSalesAndDistributionByPriceRange()
    },

    // 分析销量与价格的关系
    analyzeSalesAndDistributionByPriceRange() {
      const prices = this.echartsData.map(product => parseFloat(product.price))
      const sales = this.echartsData.map(product => parseInt(product.sold))

      // 设置价格区间和区间销量、区间产品数量的初始值
      const priceRanges = []
      const salesByPriceRange = {}
      const distributionByPriceRange = {}

      // 根据数据中的最小价格和最大价格确定价格区间
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const priceRangeSize = 500 // 每个价格区间的大小
      let currentPrice = minPrice

      // 初始化价格区间和区间销量、区间产品数量
      while (currentPrice < maxPrice) {
        const priceRange = `${currentPrice.toFixed(2)} - ${(currentPrice + priceRangeSize).toFixed(2)}`
        priceRanges.push(priceRange)
        salesByPriceRange[priceRange] = 0
        distributionByPriceRange[priceRange] = 0
        currentPrice += priceRangeSize
      }

      // 将每个产品的销量加到对应的价格区间
      prices.forEach((price, index) => {
        const priceRange = priceRanges.find(range => {
          const [min, max] = range.split(' - ').map(parseFloat)
          return price >= min && price < max
        })
        if (priceRange) {
          salesByPriceRange[priceRange] += sales[index]
          distributionByPriceRange[priceRange]++
        }
      })

      // 找出销量最高的价格区间
      let maxSales = 0
      let maxSalesPriceRange = ''
      for (const priceRange in salesByPriceRange) {
        if (salesByPriceRange[priceRange] > maxSales) {
          maxSales = salesByPriceRange[priceRange]
          maxSalesPriceRange = priceRange
        }
      }

      // 找出分布最多点的价格区间
      let maxDistribution = 0
      let maxDistributionPriceRange = ''
      for (const priceRange in distributionByPriceRange) {
        if (distributionByPriceRange[priceRange] > maxDistribution) {
          maxDistribution = distributionByPriceRange[priceRange]
          maxDistributionPriceRange = priceRange
        }
      }

      console.log('销量最高的价格区间:', maxSalesPriceRange, '该区间销量:', maxSales)
      console.log('分布最多点的价格区间:', maxDistributionPriceRange, '该区间产品数量:', maxDistribution)

      this.result1 = '销量最高的价格区间为:' + maxSalesPriceRange + '  该区间销量为:' + maxSales
      this.result2 = '分布最多点的价格区间为:' + maxDistributionPriceRange + '  该区间产品数量为:' + maxDistribution
    }
  }
}
</script>

<style>
.result {
  font-size: 14px;
  color: #f7a63d;
}
</style>
