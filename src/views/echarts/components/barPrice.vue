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
      const prices = this.echartsData.map(item => parseFloat(item.price))
      const priceCounts = prices.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1
        return acc
      }, {})

      const xAxisData = Object.keys(priceCounts).map(price => parseFloat(price))
      const seriesData = Object.values(priceCounts)

      const data = {
        title: {
          text: '价格分布直方图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value',
          name: '价格',
          nameLocation: 'middle',
          nameGap: 30
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
          barWidth: '2px' // 设置柱子宽度
        }],
        dataZoom: [
          {
            type: 'inside', // 内置的数据区域缩放
            xAxisIndex: [0], // 仅对横轴进行缩放
            start: 50, // 缩放范围的起始百分比
            end: 100 // 缩放范围的结束百分比
          },
          {
            type: 'slider', // 数据窗口漫游
            xAxisIndex: [0], // 仅对横轴进行漫游
            start: 50, // 数据窗口的起始百分比
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
