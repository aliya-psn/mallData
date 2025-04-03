<template>
  <div style="height:520px; width:100%;">
    <div :id="id" style="height:500px; width:100%;" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BarShop',
  props: {
    echartsData: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'bar-shop'
    }
  },
  data() {
    return {
      myChart: null,
      number: 10
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
      this.myChart = echarts.init(
        document.getElementById(this.id)
      )
      this.myChart.setOption(this.initOption())
    },
    initOption() {
      const dataCopy = JSON.parse(JSON.stringify(this.echartsData))
      const sortedData = dataCopy
        .sort((a, b) => parseInt(b.realSales) - parseInt(a.realSales))
        .slice(0, this.number)
      const chartData = sortedData.map(item => ({
        name: item.shopName,
        value: parseInt(item.realSales)
      }))
      const option = {
        title: {
          text: '前十名店铺销量图表',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          name: '销量'
        },
        yAxis: {
          type: 'category',
          data: chartData.map(item => item.name),
          inverse: true // 逆序排列
        },
        series: [{
          type: 'bar',
          data: chartData,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}件'
          }
        }]
      }
      return option
    }
  }
}
</script>

<style>
.filter-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
</style>
