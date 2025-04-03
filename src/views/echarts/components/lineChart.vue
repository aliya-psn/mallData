<!--echarts的 line 类型图-->
<template>
  <div :id="id" style="height:600px;width:100%;" />
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
      default: 'line1'
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
      let data1 = []
      let legend = '价格折线图'
      if (this.id === 'line1') {
        data1 = this.echartsData.map((item) => {
          return item.price
        })
      } else {
        data1 = this.echartsData.map((item) => {
          legend = '销量折线图'
          return item.realSales
        })
      }
      const name = this.echartsData.map((item) => {
        let label = item.productName
        // 如果标签文字长度大于 16，进行省略
        if (label.length > 16) {
          label = label.substring(0, 16) + '...'
        }
        return label
      })
      const data = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [legend]
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
            boundaryGap: false,
            data: name,
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
            name: legend,
            type: 'line',
            data: data1
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
      return data
    }
  }
}
</script>

<style lang="less"></style>
