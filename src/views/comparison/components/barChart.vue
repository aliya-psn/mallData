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
      // 按平台分组数据
      const platforms = [...new Set(this.echartsData.map(item => item.platform))]
      const platformMap = {
        'taobao': '淘宝',
        'jd': '京东',
        'pdd': '拼多多'
      }
      
      // 处理数据，按照价格排序
      const sortedData = [...this.echartsData].sort((a, b) => b.price - a.price)
      
      const category = sortedData.map((item) => {
        let label = item.productName
        if (label.length > 16) {
          label = label.substring(0, 16) + '...'
        }
        return label
      })
      
      // 准备系列数据
      const series = []
      
      // 添加价格系列（按平台分组）
      platforms.forEach(platform => {
        const platformData = sortedData.map(item => {
          // 如果平台不匹配，返回'-'而不是0，这样不会显示柱子
          return item.platform === platform ? item.price : '-'
        })
        
        series.push({
          name: `${platformMap[platform]}`,
          type: 'bar',
          data: platformData,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}元'
          }
        })
      })
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [
            ...platforms.map(p => `${platformMap[p]}`)
          ]
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
        series: series,
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
