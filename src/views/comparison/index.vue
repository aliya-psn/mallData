<template>
  <div class="dashboard-container">
    <div class="header-section">
      <div class="title-area">
        <h2 class="main-title">多平台商品对比</h2>
        <p class="sub-title">对淘宝、京东、拼多多平台商品数据进行分析对比</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="input-wrapper">
        <div class="label">商品名称：</div>
        <el-input v-model="searchName" placeholder="请输入商品名称" class="product-select" />

        <div class="platform-select">
          <span class="label">选择平台：</span>
          <el-checkbox-group v-model="selectedPlatforms" @change="filterByPlatforms">
            <el-checkbox :label="1">拼多多</el-checkbox>
            <el-checkbox :label="2">京东</el-checkbox>
            <el-checkbox :label="3">淘宝</el-checkbox>
          </el-checkbox-group>
        </div>

        <el-button type="primary" style="margin-left: 20px" @click="getData">查询</el-button>
      </div>
      <div class="data-limit-tip">
        <i class="el-icon-info" /> 注意：系统仅处理前1000条数据，筛选出来的数据按价格从高到低展示
      </div>
    </div>

    <div v-if="filteredData.length > 0" class="charts-container">
      <!-- 价格与销量 柱状图 -->
      <barChart v-if="filteredData.length > 0" id="barChart" :echarts-data="filteredData" />
      <!-- 店铺销量图和发货地饼图一行展示 -->
      <div class="chart-row">
        <!-- 店铺销量图 -->
        <div class="chart-half">
          <barShop v-if="filteredData.length > 0" id="bar-shop" :echarts-data="filteredData" />
        </div>
        <!-- 发货地饼图 -->
        <div class="chart-half">
          <chinaArea v-if="filteredData.length > 0" id="area-chart" :echarts-data="filteredData" />
        </div>
      </div>

      <!-- 价格分布直方图和散点图一行展示 -->
      <!-- <div class="chart-row">
        <div class="chart-half">
          <barPrice v-if="filteredData.length > 0" id="barPrice" :echarts-data="filteredData" />
        </div>
        <div class="chart-half">
          <scatterChart v-if="filteredData.length > 0" id="scatter" :echarts-data="filteredData" />
        </div>
      </div> -->

      <!-- 价格折线图和销量折线图一行展示 -->
      <div class="chart-row">
        <!-- 价格折线图 -->
        <div class="chart-half">
          <lineChart v-if="filteredData.length > 0" id="line1" :echarts-data="filteredData" />
        </div>
        <!-- 销量折线图 -->
        <div class="chart-half">
          <lineChart v-if="filteredData.length > 0" id="line2" :echarts-data="filteredData" />
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <i class="el-icon-warning" />
      <span>请输入商品名称进行查询</span>
    </div>

  </div>
</template>

<script>
import { getGoodsRank } from '@/api/common'
import barShop from './components/barShop.vue' // 店铺销量柱状图
import chinaArea from './components/areaChart.vue' // 发货地饼图

import barChart from './components/barChart.vue' // 柱状图
import barPrice from './components/barPrice.vue' // 柱状图
import lineChart from './components/lineChart.vue' // 折线图
import scatterChart from './components/scatter.vue' // 散点图

export default {
  name: 'Echart',
  components: {
    barShop,
    chinaArea,
    barChart,
    barPrice,
    lineChart,
    scatterChart
  },
  data() {
    return {
      echartsData: [],
      filteredData: [],
      searchName: '',
      selectedPlatforms: [1, 2, 3], // 默认选中所有平台
      loading: false
    }
  },
  methods: {
    // 获取数据
    async getData() {
      this.loading = true
      try {
        await this.getEchartsData()
      } catch (error) {
        this.$message.error('获取商品类型失败')
      } finally {
        this.loading = false
      }
    },
    // 获取echarts数据
    getEchartsData() {
      this.loading = true
      // 获取表统计数量
      return getGoodsRank({
        name: this.searchName,
        pageNo: 1,
        pageSize: 1000
      }).then((res) => {
        if (res.code === '000') {
          this.echartsData = res.content
          this.filterByPlatforms()
        } else {
          this.$message({
            type: 'warning',
            message: '服务器错误，请稍后再试'
          })
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('获取数据失败')
        this.loading = false
      })
    },
    filterByPlatforms() {
      if (this.selectedPlatforms.length === 0) {
        // 如果没有选择平台，显示空数据
        this.filteredData = []
      } else {
        // 根据选中的平台进行筛选
        this.filteredData = this.echartsData.filter(item =>
          this.selectedPlatforms.includes(item.platform)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 600px;
  padding: 20px;
  border-radius: 8px;
}

.header-section {
  width: 100%;
  margin-bottom: 20px;

  .title-area {
    text-align: center;

    .main-title {
      font-size: 24px;
      color: #303133;
      margin-bottom: 8px;
    }

    .sub-title {
      font-size: 14px;
      color: #909399;
    }
  }
}

.content-wrapper {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .label {
    font-size: 15px;
    font-weight: 500;
    color: #303133;
  }

  .product-select {
    width: 200px;
  }
}

.data-limit-tip {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  color: #409EFF;
  font-size: 13px;
  display: flex;
  align-items: center;

  i {
    margin-right: 5px;
    font-size: 16px;
  }
}

.platform-select {
  display: flex;
  align-items: center;
  margin-left: 30px;

  :deep(.el-checkbox) {
    margin-right: 20px;
    padding: 8px 15px;
    border-radius: 4px;
    transition: all 0.3s;

    &.is-checked {
      background: rgba(64, 158, 255, 0.1);
    }

    &:hover {
      background: rgba(64, 158, 255, 0.05);
    }
  }
}

.charts-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-row {
  display: flex;
  width: 100%;
  gap: 20px;
  margin-bottom: 10px;
}

.chart-half {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.no-data {
  margin: 50px 0;
  color: #909399;
  font-size: 14px;
  text-align: center;
  i {
    margin-right: 5px;
  }
}
</style>
