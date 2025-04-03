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
        <div class="label">商品名称型号：</div>
        <el-input v-model="selectType" placeholder="请输入商品名称和型号" class="product-select" />

        <div class="platform-select">
          <span class="label">选择平台：</span>
          <el-checkbox-group v-model="selectedPlatforms" @change="filterByPlatforms">
            <el-checkbox label="taobao">淘宝</el-checkbox>
            <el-checkbox label="jd">京东</el-checkbox>
            <el-checkbox label="pdd">拼多多</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <div v-if="filteredData.length > 0" class="charts-container">
      <!-- 价格与销量 柱状图 -->
      <barChart v-if="filteredData.length > 0" id="barChart" :echarts-data="filteredData" />
      <!-- 店铺销量图 -->
      <!-- <barShop v-if="filteredData.length > 0" id="bar-shop" :echarts-data="filteredData" /> -->
      <!-- 发货地饼图 -->
      <!-- <chinaArea v-if="filteredData.length > 0" id="area-chart" :echarts-data="filteredData" /> -->
    </div>

    <div v-else class="no-data">
      <el-empty description="暂无数据，请选择其他商品类型或平台"></el-empty>
    </div>

    <!-- 价格与销量 散点图 -->
    <!-- <scatterChart v-if="filteredData.length > 0" id="scatter" :echarts-data="filteredData" /> -->
    <!-- 价格分布直方图 -->
    <!-- <barPrice v-if="filteredData.length > 0" id="barPrice" :echarts-data="filteredData" /> -->
    <!-- 价格折线图 -->
    <!-- <lineChart v-if="filteredData.length > 0" id="line1" :echarts-data="filteredData" /> -->
    <!-- 销量折线图 -->
    <!-- <lineChart v-if="filteredData.length > 0" id="line2" :echarts-data="filteredData" /> -->
  </div>
</template>

<script>
import { getProductType, getProductsListByType } from '@/api/common'
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
      types: [],
      selectType: '',
      selectedPlatforms: ['taobao', 'jd', 'pdd'], // 默认选中所有平台
      loading: false
    }
  },
  async created() {
    this.loading = true
    try {
      const res = await getProductType()
      this.types = res.data.map((item) => {
        return item.type
      })
      this.selectType = this.types[0]
      await this.getEchartsData()
    } catch (error) {
      this.$message.error('获取商品类型失败')
    } finally {
      this.loading = false
    }
  },
  methods: {
    getEchartsData() {
      this.loading = true
      // 获取表统计数量
      return getProductsListByType(this.selectType).then((res) => {
        if (res.code === 200) {
          this.echartsData = res.data
          this.echartsData = [
    {
        "productName": "RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "3497.00",
        "realSales": "13",
        "img": "https://img.alicdn.com/imgextra/i4/452030163/O1CN012IrITu1D4hUHdW4dt_!!0-saturn_solar.jpg_360x360q90.jpg_.webp",
        "shopName": "戴尔华行垣创专卖店",
        "area": "四川",
        "type": "电脑",
        "platform": "pdd"
    },
    {
        "productName": "小米英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "5699.00",
        "realSales": "6",
        "img": "https://img.alicdn.com/imgextra/i3/3703895035/O1CN01EMVVwc1n453rTN4R2_!!0-saturn_solar.jpg_360x360q90.jpg_.webp",
        "shopName": "华硕崇硕专卖店",
        "area": "北京",
        "type": "电脑",
        "platform": "pdd"
    },
    {
        "productName": "小米英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "5099.00",
        "realSales": "2",
        "img": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/2616970884/O1CN01QwjAPY1IOv3iKX0SI_!!0-item_pic.jpg_360x360q90.jpg_.webp",
        "shopName": "苏宁易购官方旗舰店",
        "area": "江苏",
        "type": "电脑",
        "platform": "taobao"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "5000.00",
        "realSales": "9",
        "img": "https://gw.alicdn.com/imgextra/O1CN019fL7wJ1JgbyZyJzsm_!!2651871058-0-picasso.jpg_360x360q90.jpg_.webp",
        "shopName": "七彩虹官方旗舰店",
        "area": "上海",
        "type": "电脑",
        "platform": "taobao"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "5499.00",
        "realSales": "2",
        "img": "https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/2616970884/O1CN01PFrKKB1IOv3lo2CFF_!!2-item_pic.png_360x360q90.jpg_.webp",
        "shopName": "苏宁易购官方旗舰店",
        "area": "北京",
        "type": "电脑",
        "platform": "jd"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4899.00",
        "realSales": "7",
        "img": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2549841410/O1CN01HQ144a1MHpOCauMzJ_!!2549841410-0-tmg_sticker_hand.jpg_360x360q90.jpg_.webp",
        "shopName": "天猫国际自营全球超级店",
        "area": "浙江",
        "type": "电脑",
        "platform": "taobao"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4499.00",
        "realSales": "15",
        "img": "https://g-search2.alicdn.com/img/bao/uploaded/i4/i2/6000000000356/O1CN014TVtaG1EV5wC9u8HD_!!6000000000356-0-sm.jpg_360x360q90.jpg_.webp",
        "shopName": "天猫超市",
        "area": "上海",
        "type": "电脑",
        "platform": "jd"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4699.00",
        "realSales": "12",
        "img": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/6000000002392/O1CN01MjoQHQ1TXaKMCy6FK_!!6000000002392-0-sm.jpg_360x360q90.jpg_.webp",
        "shopName": "天猫超市",
        "area": "上海",
        "type": "电脑",
        "platform": "taobao"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4999.00",
        "realSales": "24",
        "img": "https://gw.alicdn.com/imgextra/O1CN01rGeTdl2LY1xfubA2i_!!3937219703-0-C2M.jpg_360x360q90.jpg_.webp",
        "shopName": "天天特卖工厂店",
        "area": "浙江",
        "type": "电脑",
        "platform": "taobao"
    },
    {
        "productName": "小米14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4779.00",
        "realSales": "24",
        "img": "https://gw.alicdn.com/imgextra/O1CN01rGeTdl2LY1xfubA2i_!!3937219703-0-C2M.jpg_360x360q90.jpg_.webp",
        "shopName": "天天特卖工厂店",
        "area": "浙江",
        "type": "电脑",
        "platform": "jd"
    },
    {
        "productName": "小米/RedmiBook Pro 14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "5299.00",
        "realSales": "24",
        "img": "https://gw.alicdn.com/imgextra/O1CN01rGeTdl2LY1xfubA2i_!!3937219703-0-C2M.jpg_360x360q90.jpg_.webp",
        "shopName": "天天特卖工厂店",
        "area": "浙江",
        "type": "电脑",
        "platform": "pdd"
    },
    {
        "productName": "小米14 12代英特尔酷睿i7高性能轻薄本笔记本电脑",
        "price": "4579.00",
        "realSales": "24",
        "img": "https://gw.alicdn.com/imgextra/O1CN01rGeTdl2LY1xfubA2i_!!3937219703-0-C2M.jpg_360x360q90.jpg_.webp",
        "shopName": "天天特卖工厂店",
        "area": "浙江",
        "type": "电脑",
        "platform": "jd"
    }
]
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

.no-data {
  margin: 50px 0;
}
</style>
