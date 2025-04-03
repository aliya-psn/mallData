<template>
  <div class="app-container">
    <div style="padding: 12px;display: flex;gap:10px;align-items: center;">
      <el-input
        ref="keywords"
        v-model="keywords"
        placeholder="搜索关键字（手机）"
        type="text"
        tabindex="1"
        auto-complete="on"
        style="width: 300px"
      />
      <div class="platform-select">
        <span class="label">选择平台：</span>
        <el-checkbox-group v-model="selectedPlatforms">
          <el-checkbox label="taobao">
            <span class="platform-icon"></span>淘宝
          </el-checkbox>
          <el-checkbox label="jd">
            <span class="platform-icon"></span>京东
          </el-checkbox>
          <el-checkbox label="pdd">
            <span class="platform-icon"></span>拼多多
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button
        type="primary"
        style="margin-left: 20px"
        :loading="listLoading"
        @click="handleFetch"
      >搜索</el-button>
    </div>
    <div class="goods-list-box">
      <div class="goods-list">
        <div
          v-for="(item, index) in paginatedData"
          :key="index"
          class="goods-show-info"
        >
          <div class="goods-show-img">
            <img :src="item.img">
          </div>
          <div class="goods-show-price">
            <svg-icon icon-class="price" />
            <span class="seckill-price">{{ item.price }}</span>
          </div>
          <div class="goods-show-num">
            <span>已售：{{ item.realSales }}</span>
          </div>
          <div class="goods-show-seller">
            <span>{{ item.productName }}</span>
          </div>
          <div class="goods-show-detail">
            <span>{{ item.shopName }}</span>
            <span class="area">{{ item.area }}</span>
            <span class="platform">{{ getPlatformName(item.platform) }}</span>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataList ? dataList.length : 0"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProductsListByType,
  spiderShop,
  getProductType
} from '@/api/common'

export default {
  data() {
    return {
      keywords: '', // 关键字
      types: [],
      selectType: '',
      dataList: null,
      count: 0,
      listLoading: true,
      queryPage: 5, // 截止
      startPage: null, // 开始
      currentPage: 1, // 当前页码
      pageSize: 12, // 每页显示数量
      selectedPlatforms: ['taobao'] // 默认选择淘宝平台
    }
  },
  computed: {
    paginatedData() {
      if (!this.dataList) return []
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = startIndex + this.pageSize
      return this.dataList.slice(startIndex, endIndex)
    }
  },
  async created() {
    // 获取分类
    const res = await getProductType()
    this.types = res.data.map((item) => {
      return item.type
    })
    if (this.types.length === 0) {
      this.listLoading = false
      return
    }
    this.selectType = this.types[0]
    // 请求当前分类下商品列表
    this.fetchData()
  },
  methods: {
    // 请求分类商品列表数据
    fetchData() {
      if (!this.selectType) return
      this.listLoading = true
      // this.$message.warning('加载中，请稍等...')
      getProductsListByType(this.selectType).then((res) => {
        this.dataList = res.data
        this.count = res.count
        this.listLoading = false
        // 重置分页
        this.currentPage = 1
      })
    },

    // 采集数据
    handleFetch() {
      if (this.selectedPlatforms.length === 0) {
        this.$message.warning('请至少选择一个平台')
        return
      }
      
      this.listLoading = true
      // 对每个选中的平台进行数据采集
      const fetchPromises = this.selectedPlatforms.map(platform => {
        return spiderShop(this.keywords, this.queryPage, this.startPage, platform)
      })
      
      Promise.all(fetchPromises).then(() => {
        setTimeout(async() => {
          const res = await getProductType()
          this.types = res.data.map((item) => {
            return item.type
          })
          this.selectType = this.keywords
          this.fetchData()
          this.listLoading = false
        }, 3000)
      }).catch(error => {
        this.listLoading = false
      })
    },
    
    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
    },
    
    // 获取平台名称
    getPlatformName(platform) {
      const platformMap = {
        'taobao': '淘宝',
        'jd': '京东',
        'pdd': '拼多多'
      }
      return platformMap[platform] || platform
    }
  }
}
</script>

<style scoped lang="scss">
/* ---------------商品栏开始------------------- */
.goods-list-box {
  margin-left: 15px;
  width: 100%;
}
.goods-list-tool {
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}
.goods-list-tool ul {
  padding-left: 15px;
  list-style: none;
}
.goods-list-tool li {
  cursor: pointer;
  float: left;
}
.goods-list-tool span {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-left: none;
  line-height: 36px;
  background-color: #fff;
}
.goods-list-tool span:hover {
  border: 1px solid #e4393c;
}
.goods-list-tool i:hover {
  color: #e4393c;
}
.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: #e4393c !important;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.goods-show-info {
  width: 210px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid rgb(240, 237, 237);
  box-shadow: 0px 0px 1px #ccc;
  transition: all 0.3s ease;
}
.goods-show-info:hover {
  border: 1px solid #ccc;
  box-shadow: 0px 0px 15px #ccc;
}
.goods-show-img {
  img {
    width: 180px;
    height: 180px;
  }
}
.goods-show-price {
  margin-top: 6px;
  display: flex;
  align-items: center;
  svg {
    font-size: 18px;
  }
  .seckill-price {
    font-size: bold;
    font-size: 18px;
  }
}
.goods-show-detail {
  font-size: 12px;
  margin: 6px 0px;
  .area {
    color: rgb(255, 132, 0);
    margin-left: 20px;
  }
  .platform {
    color: #409EFF;
    margin-left: 10px;
  }
}
.goods-show-num {
  font-size: 12px;
  margin: 6px 0;
  color: #009688;
}
.goods-show-num span {
  color: #005aa0;
  font-weight: bold;
}
.goods-show-seller {
  font-size: 12px;
  color: #e4393c;
}
/* ---------------商品栏结束------------------- */

.pagination-container {
  margin: 30px 30px 0px 0px;
  display: flex;
  justify-content: flex-end;
}

.platform-select {
  display: flex;
  align-items: center;
  margin-left: 15px;
  .label {
    margin-right: 10px;
  }
}
</style>
