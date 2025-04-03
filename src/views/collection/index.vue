<template>
  <div class="app-container">
    <div class="header-section">
      <div class="title-area">
        <h2 class="main-title">数据采集中心</h2>
        <p class="sub-title">从多平台快速获取商品数据</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="input-wrapper">
        <div class="label">商品名：</div>
        <el-input ref="keywords" v-model="keywords" placeholder="输入关键字（如：手机、电脑）" type="text" tabindex="1"
          auto-complete="on" prefix-icon="el-icon-search" class="search-input" />

        <div class="page-range">
          <div class="label">爬取页码：</div>
          <el-input-number v-model="startPage" placeholder="开始" class="page-input" />
          <span class="page-separator">至</span>
          <el-input-number v-model="queryPage" placeholder="结束" class="page-input" />
        </div>
      </div>

      <div class="settings-section">
        <div class="platform-select">
          <span class="label">选择平台：</span>
          <el-radio-group v-model="selectedPlatform">
            <el-radio label="taobao">
              <span class="platform-icon"></span>淘宝
            </el-radio>
            <el-radio label="jd">
              <span class="platform-icon"></span>京东
            </el-radio>
            <el-radio label="pdd">
              <span class="platform-icon"></span>拼多多
            </el-radio>
          </el-radio-group>
        </div>

        <el-button type="primary" class="fetch-btn" :loading="listLoading" @click="handleFetch">
          <i class="el-icon-download"></i> 开始采集
        </el-button>
      </div>
    </div>

    <div v-if="collectStatus" class="collect-result">
      <!-- 采集成功提示 -->
      <el-alert :title="`采集成功，共${collectCount}条数据`" type="success" show-icon :closable="false" class="success-alert" />

      <div class="data-summary">
        <div class="summary-card">
          <div class="summary-icon"><i class="el-icon-s-data"></i></div>
          <div class="summary-content">
            <div class="summary-value">{{ collectCount }}</div>
            <div class="summary-label">采集数据总量</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon"><i class="el-icon-time"></i></div>
          <div class="summary-content">
            <div class="summary-value">{{ new Date().toLocaleTimeString() }}</div>
            <div class="summary-label">完成时间</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon"><i class="el-icon-s-platform"></i></div>
          <div class="summary-content">
            <div class="summary-value">{{ selectedPlatform === 'taobao' ? '淘宝' : selectedPlatform === 'jd' ? '京东' :
              '拼多多' }}</div>
            <div class="summary-label">数据来源</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <h3><i class="el-icon-info"></i> 采集提示</h3>
      <ul>
        <li>关键词越精确，采集结果越准确</li>
        <li>采集过程可能需要几分钟，请耐心等待</li>
        <li>采集结果将自动保存到数据库</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      keywords: '', // 关键字
      listLoading: false,
      selectedPlatform: 'taobao', // 默认选择淘宝

      queryPage: 5, // 截止
      startPage: 1, // 开始

      collectStatus: false, // 采集成功
      collectCount: 0,
    }
  },
  methods: {
    // 采集数据
    handleFetch() {
      if (!this.selectedPlatform) {
        this.$message.warning('请选择采集平台');
        return;
      }

      if (!this.keywords.trim()) {
        this.$message.warning('请输入关键词');
        return;
      }

      this.listLoading = true
      // spiderShop(this.keywords, this.queryPage, this.startPage, this.selectedPlatform).then((res) => {
      //   console.log('==res', res)
      //   setTimeout(async() => {
      //     const res = await getProductType()

      //     // 采集成功
      //     this.collectStatus = true
      //     this.collectCount = res.data.length

      //     this.listLoading = false
      //   }, 3000)
      // })

      // TODO:
      setTimeout(async () => {
        // 采集成功
        this.collectStatus = true
        this.collectCount = 9999

        this.listLoading = false
      }, 3000)
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .title-area {
    .main-title {
      font-size: 24px;
      color: #303133;
      margin: 0 0 8px 0;
    }

    .sub-title {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }
}

.label {
  font-size: 15px;
  font-weight: 500;
  margin-right: 10px;
}

.content-wrapper {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;

  .input-wrapper {
    display: flex;
    align-items: center;

    .search-input {
      width: 350px;

      :deep(.el-input__inner) {
        border-radius: 20px;
        height: 42px;
        padding-left: 20px;
        transition: all 0.3s;

        &:focus {
          box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }

  .page-range {
    display: flex;
    align-items: center;
    margin-left: 40px;

    .page-input {
      width: 120px;
    }

    .page-separator {
      margin: 0 10px;
      color: #606266;
    }
  }
}

.settings-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.platform-select {
  :deep(.el-radio) {
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

.fetch-btn {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }

  i {
    margin-right: 5px;
  }
}

.collect-result {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;

  .success-alert {
    margin-bottom: 20px;
  }

  .data-summary {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;

    .summary-card {
      flex: 1;
      display: flex;
      align-items: center;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      margin: 0 10px;
      transition: all 0.3s;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }

      .summary-icon {
        font-size: 30px;
        color: #409EFF;
        margin-right: 15px;
      }

      .summary-content {
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }

        .summary-label {
          font-size: 14px;
          color: #909399;
          margin-top: 5px;
        }
      }
    }
  }
}

.tips-section {
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-left: 4px solid #409EFF;
  border-radius: 4px;

  h3 {
    font-size: 16px;
    color: #303133;
    margin-top: 0;
    margin-bottom: 15px;

    i {
      color: #409EFF;
      margin-right: 5px;
    }
  }

  ul {
    margin: 0;
    padding-left: 20px;
    font-size: 15px;

    li {
      margin-bottom: 8px;
      color: #606266;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
