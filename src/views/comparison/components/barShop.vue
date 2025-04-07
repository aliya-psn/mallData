<template>
  <div style="height:500px; width:100%;">
    <div :id="id" style="height:480px; width:100%;" />
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
        .sort((a, b) => parseInt(b.sold) - parseInt(a.sold))
        .slice(0, this.number)
      const chartData = sortedData.map(item => ({
        name: item.shopName,
        value: parseInt(item.sold)
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
          },
          formatter: (params) => {
            const dataIndex = params[0].dataIndex
            const item = sortedData[dataIndex]
            if (!item) return ''

            const platformMap = {
              1: '拼多多',
              2: '京东',
              3: '淘宝'
            }

            return `
              <div>
                <p><strong>${item.name || '未知商品'}</strong></p>
                <p>店铺：${item.shopName || '未知店铺'}</p>
                <p>销量：${item.sold || 0}</p>
                <p>价格：${item.price}元</p>
                <p>平台：${platformMap[item.platform] || '未知平台'}</p>
                <p>地区：${item.province || '未知地区'}</p>
              </div>
            `
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
          inverse: true, // 逆序排列
          axisLabel: {
            width: 90,
            overflow: 'truncate',
            interval: 0,
            formatter: function(value) {
              return value.length > 10 ? value.substring(0, 10) + '...' : value
            },
            tooltip: {
              show: true
            }
          }
        },
        grid: {
          left: '15%',
          right: '6%',
          containLabel: true
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

