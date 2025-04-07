<template>
  <div class="app-container">
    <div style="padding: 12px;display: flex;gap:10px;align-items: center;">
      <el-input
        ref="keywords"
        v-model="keywords"
        placeholder="搜索商品名称"
        type="text"
        tabindex="1"
        auto-complete="on"
        style="width: 300px"
        clearable
      />
      <el-button type="primary" style="margin-left: 20px" :loading="listLoading" @click="handleFetch">搜索</el-button>
      <el-button type="primary" @click="handleReset">重置</el-button>

      <div class="platform-select">
        <span class="label">选择平台：</span>
        <el-radio-group v-model="selectedPlatform">
          <el-radio :label="1">
            <span class="platform-icon" />拼多多
          </el-radio>
          <el-radio :label="2">
            <span class="platform-icon" />京东
          </el-radio>
          <el-radio :label="3">
            <span class="platform-icon" />淘宝
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="goods-list-box">
      <el-table v-loading="listLoading" :data="dataList" fit highlight-current-row style="width: 100%">
        <el-table-column label="商品名称" prop="name" min-width="200">
          <template slot-scope="scope">
            <span class="goods-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" width="100" align="center">
          <template slot-scope="scope">
            <div class="goods-price">
              <svg-icon icon-class="price" />
              <span class="seckill-price">{{ scope.row.price }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="shopName" width="120" align="center">
          <template slot-scope="scope">
            <span class="shop-name">{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" prop="province" width="100" align="center">
          <template slot-scope="scope">
            <span class="area">{{ scope.row.province }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" prop="sold" width="100" align="center">
          <template slot-scope="scope">
            <span class="sold">已售：{{ scope.row.sold }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品编码" prop="code" width="200" align="center">
          <template slot-scope="scope">
            <span class="goods-code" @click="copyToClipboard(scope.row.code)">
              {{ scope.row.code }}
              <i class="el-icon-document-copy copy-icon" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="colour" width="90" align="center">
          <template slot-scope="scope">
            <span class="colour">{{ scope.row.colour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内存" prop="memory" width="90" align="center">
          <template slot-scope="scope">
            <span class="memory">{{ scope.row.memory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理器" prop="cpu" width="90" align="center">
          <template slot-scope="scope">
            <span class="cpu">{{ scope.row.cpu }}</span>
          </template>
        </el-table-column>
        <el-table-column label="前置像素" prop="frontPixel" width="90" align="center">
          <template slot-scope="scope">
            <span class="pixel">{{ scope.row.frontPixel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="后置像素" prop="realPixel" width="90" align="center">
          <template slot-scope="scope">
            <span class="pixel">{{ scope.row.realPixel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="屏幕尺寸" prop="screenSize" width="90" align="center">
          <template slot-scope="scope">
            <span class="screen">{{ scope.row.screenSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="刷新率" prop="refreshRate" width="90" align="center">
          <template slot-scope="scope">
            <span class="refresh">{{ scope.row.refreshRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分辨率" prop="resolution" width="90" align="center">
          <template slot-scope="scope">
            <span class="resolution">{{ scope.row.resolution }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电池容量" prop="batteryCapacity" width="90" align="center">
          <template slot-scope="scope">
            <span class="battery">{{ scope.row.batteryCapacity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充电接口" prop="chargerPort" width="90" align="center">
          <template slot-scope="scope">
            <span class="charger">{{ scope.row.chargerPort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充电功率" prop="chargerPower" width="90" align="center">
          <template slot-scope="scope">
            <span class="charger">{{ scope.row.chargerPower }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProductsList
} from '@/api/common'

export default {
  data() {
    return {
      keywords: '', // 关键字
      selectedPlatform: 1, // 默认选择平台

      dataList: null,
      totalSize: 0,

      listLoading: true,
      currentPage: 1, // 当前页码
      pageSize: 10 // 每页显示数量
    }
  },
  watch: {
    // 监听平台变化
    selectedPlatform() {
      this.currentPage = 1
      this.fetchData()
    }
  },
  async created() {
    // 请求列表
    this.fetchData()
  },
  methods: {
    // 请求列表数据
    fetchData() {
      this.listLoading = true
      const params = {
        platform: this.selectedPlatform,
        name: this.keywords,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      getProductsList(params).then((res) => {
        this.dataList = res.content
        this.totalSize = res.totalSize
        this.listLoading = false
      })
    },

    // 搜索数据
    handleFetch() {
      if (!this.selectedPlatform) {
        this.$message.warning('请选择一个平台')
        return
      }
      this.fetchData()
    },
    handleReset() {
      this.keywords = ''
      this.selectedPlatform = 1
      this.currentPage = 1
      this.fetchData()
    },

    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    // 获取平台名称 1拼多多 2京东 3淘宝
    getPlatformName(platform) {
      const platformMap = {
        1: '拼多多',
        2: '京东',
        3: '淘宝'
      }
      return platformMap[platform] || platform
    },

    // 复制商品编码到剪贴板
    copyToClipboard(text) {
      const input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('商品编码已复制到剪贴板')
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

.goods-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.goods-code {
  color: #666;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #409EFF;

    .copy-icon {
      opacity: 1;
    }
  }

  .copy-icon {
    margin-left: 5px;
    font-size: 14px;
    opacity: 0.5;
    transition: opacity 0.3s;
  }
}

.goods-price {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 16px;
  }

  .seckill-price {
    font-weight: bold;
    font-size: 16px;
    color: #e4393c;
  }
}

.shop-name {
  color: #333;
}

.area {
  color: rgb(255, 132, 0);
}

.platform {
  color: #409EFF;
}

.sold {
  color: #009688;
}

.colour,
.memory,
.cpu,
.pixel,
.screen,
.refresh,
.resolution,
.battery,
.charger,
.time {
  color: #606266;
  font-size: 13px;
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
