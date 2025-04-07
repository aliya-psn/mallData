<!--echarts的 line 类型图-->
<template>
  <div :id="id" style="height:500px; width:100%;" />
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
          return item.sold
        })
      }
      const name = this.echartsData.map((item) => {
        let label = item.shopName || '未知店铺'
        // 如果标签文字长度大于 16，进行省略
        if (label.length > 16) {
          label = label.substring(0, 16) + '...'
        }
        return label
      })

      const platformMap = {
        1: '拼多多',
        2: '京东',
        3: '淘宝'
      }

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
          },
          formatter: (params) => {
            const dataIndex = params[0].dataIndex
            const item = this.echartsData[dataIndex]
            if (!item) return ''

            return `
              <div>
                <p><strong>${item.name || '未知商品'}</strong></p>
                <p>店铺：${item.shopName || '未知店铺'}</p>
                <p>价格：${item.price}元</p>
                <p>销量：${item.sold || 0}</p>
                <p>平台：${platformMap[item.platform] || '未知平台'}</p>
                <p>地区：${item.province || '未知地区'}</p>
                <p>颜色：${item.colour || '-'}</p>
                <p>内存：${item.memory || '-'}</p>
                <p>CPU：${item.cpu || '-'}</p>
                <p>前置像素：${item.frontPixel || '-'}</p>
                <p>后置像素：${item.realPixel || '-'}</p>
                <p>屏幕尺寸：${item.screenSize || '-'}</p>
                <p>刷新率：${item.refreshRate || '-'}</p>
                <p>分辨率：${item.resolution || '-'}</p>
                <p>电池容量：${item.batteryCapacity || '-'}</p>
                <p>充电接口：${item.chargerPort || '-'}</p>
                <p>充电功率：${item.chargerPower || '-'}</p>
              </div>
            `
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
            start: 0, // 缩放范围的起始百分比
            end: name.length <= 10 ? 100 : 100 * (10 / name.length) // 如果数据超过10条，则只显示前10条
          },
          {
            type: 'slider', // 数据窗口漫游
            xAxisIndex: [0], // 仅对横轴进行漫游
            start: 0, // 数据窗口的起始百分比
            end: name.length <= 10 ? 100 : 100 * (10 / name.length) // 如果数据超过10条，则只显示前10条
          }
        ]
      }
      return data
    }
  }
}
</script>

<style lang="less"></style>
