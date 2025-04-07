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
        1: '拼多多',
        2: '京东',
        3: '淘宝'
      }

      // 处理数据，按照价格排序
      const sortedData = [...this.echartsData].sort((a, b) => b.price - a.price)

      const category = sortedData.map((item) => {
        let label = item.shopName || '未知店铺'
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
            formatter: '{c}'
          }
        })
      })

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          confine: true, // 确保提示框不会超出屏幕边缘
          position: function(point, params, dom, rect, size) {
            // 根据窗口大小和鼠标位置动态调整tooltip位置
            const viewWidth = document.documentElement.clientWidth
            const viewHeight = document.documentElement.clientHeight
            const contentSize = size.contentSize
            let x = point[0]
            let y = point[1]

            // 防止tooltip超出右侧边界
            if (x + contentSize[0] > viewWidth) {
              x = x - contentSize[0]
            }

            // 防止tooltip超出底部边界
            if (y + contentSize[1] > viewHeight) {
              y = y - contentSize[1]
            }

            return [x, y]
          },
          formatter: (params) => {
            const dataIndex = params[0].dataIndex
            const item = sortedData[dataIndex]
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
        // 限制最多显示10条数据
        dataZoom: [
          {
            type: 'inside', // 内置的数据区域缩放
            xAxisIndex: [0], // 仅对横轴进行缩放
            start: 0, // 缩放范围的起始百分比
            end: category.length <= 10 ? 100 : 100 * (10 / category.length) // 如果数据超过10条，则只显示前10条
          },
          {
            type: 'slider', // 数据窗口漫游
            xAxisIndex: [0], // 仅对横轴进行漫游
            start: 0, // 数据窗口的起始百分比
            end: category.length <= 10 ? 100 : 100 * (10 / category.length) // 如果数据超过10条，则只显示前10条
          }
        ]
      }
      return option
    }
  }
}
</script>

<style lang="less"></style>
