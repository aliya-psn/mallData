<template>
  <div :id="id" style="height:500px;width:100%;" />
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
      default: 'histogram1'
    }
  },
  data() {
    return {
      myChart: null
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
        this.myChart = echarts.init(document.getElementById(this.id))
        this.myChart.setOption(this.initOption())
      })
    },
    initOption() {
      // 确保价格是数字类型
      const prices = this.echartsData.map(item => parseFloat(item.price))

      // 创建价格区间
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const step = Math.ceil((maxPrice - minPrice) / 20) // 将价格范围分为约20个区间

      // 创建价格区间数组
      const priceRanges = []
      for (let i = minPrice; i <= maxPrice; i += step) {
        priceRanges.push(i)
      }

      // 统计每个价格区间的商品数量
      const priceCounts = {}
      priceRanges.forEach(range => {
        priceCounts[range] = 0
      })

      prices.forEach(price => {
        // 找到价格所属的区间
        const rangeIndex = Math.floor((price - minPrice) / step)
        const range = minPrice + rangeIndex * step
        priceCounts[range] = (priceCounts[range] || 0) + 1
      })

      const xAxisData = Object.keys(priceCounts).map(price => parseFloat(price))
      const seriesData = Object.values(priceCounts)

      const data = {
        title: {
          text: '价格分布直方图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const price = params[0].value[0]
            const count = params[0].value[1]
            return `价格区间: ${price} - ${price + step}<br/>商品数量: ${count}`
          }
        },
        xAxis: {
          type: 'value',
          name: '价格',
          nameLocation: 'middle',
          nameGap: 30,
          axisLabel: {
            formatter: '{value}元'
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          nameLocation: 'middle',
          nameGap: 30
        },
        series: [{
          data: xAxisData.map((price, index) => [price, seriesData[index]]),
          type: 'bar',
          barWidth: '60%', // 调整柱子宽度
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
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
    }
  }
}
</script>

<style lang="less"></style>
