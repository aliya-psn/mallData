<template>
  <div :id="id" style="height: 500px; width: 100%" />
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
      default: 'area-chart'
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
  beforeDestroy() {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      // 合并具有相同地区的销量数据
      this.myChart = echarts.init(document.getElementById(this.id))
      this.myChart.setOption(this.initOption())
      // 监听点击事件
      this.myChart.on('click', this.handleClick)
    },
    initOption() {
      const mergedData = this.mergeDataByArea(this.echartsData)
      const option = {
        title: {
          text: '发货地销量饼图',
          left: 'center'
        },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '发货地销量',
            type: 'pie',
            radius: [50, 200],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: mergedData
          }
        ]
      }
      return option
    },
    handleClick(params) {
      // 点击事件处理逻辑，您可以根据params参数来获取点击的数据信息
      console.log(params)
    },
    mergeDataByArea(data) {
      const mergedData = []
      const areaMap = {}
      const dataCopy = JSON.parse(JSON.stringify(data))
      // 合并具有相同地区的销量
      dataCopy.forEach(item => {
        const area = item.province || '未知地区'
        const value = parseInt(item.sold) || 0

        if (!areaMap[area]) {
          areaMap[area] = value
        } else {
          areaMap[area] += value
        }
      })

      // 转换为饼图所需格式
      for (const area in areaMap) {
        mergedData.push({
          name: area,
          value: areaMap[area]
        })
      }

      return mergedData
    }
  }
}
</script>

<style>
/* Add your styles here */
</style>
