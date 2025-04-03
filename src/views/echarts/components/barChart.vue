<!--echarts的 bar 类型图-->
<template>
  <div
    :id="id"
    style="height: 450px; width: 100%"
  />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChat',
  props: {
    echartsData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'barChart'
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  watch: {
    echartsData() {
      this.myChart = null
      this.renderChart()
    }
  },
  mounted() {
    this.renderChart()
  },
  beforeDestroy() {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },
  methods: {
    renderChart() {
      this.$nextTick(() => {
        this.myChart = echarts.init(
          document.getElementById(this.id)
        )
        this.myChart.setOption(this.initOption())
      })
    },
    initOption() {
      const data1 = this.echartsData.map((item) => {
        return item.price
      })
      const data2 = this.echartsData.map((item) => {
        return item.realSales
      })
      const category = this.echartsData.map((item) => {
        let label = item.productName
        if (label.length > 16) {
          label = label.substring(0, 16) + '...'
        }
        return label
      })
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['价格', '销量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: category,
            axisLabel: {
              rotate: 45 // 将横坐标标签旋转 45 度
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '价格',
            type: 'bar',
            data: data1
          },
          {
            name: '销量',
            type: 'bar',
            data: data2
          }
        ],
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
      return option
    }
  }
}
</script>

<style lang="less"></style>
