<template>
  <div class="app-container">
    <div class="header-section">
      <div class="title-area">
        <h2 class="main-title">数据采集中心</h2>
        <p class="sub-title">从多平台快速获取商品数据</p>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="collection-methods">
        <h3 class="method-title">选择采集方式</h3>
        <el-tabs v-model="activeCollectionMethod" type="card">
          <!-- <el-tab-pane label="手动采集" name="manual">
            <div class="input-wrapper">
              <div class="label">商品名：</div>
              <el-input
                ref="keywords"
                v-model="keywords"
                placeholder="输入关键字（如：手机、电脑）"
                type="text"
                tabindex="1"
                auto-complete="on"
                prefix-icon="el-icon-search"
                class="search-input"
              />

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

              <el-button type="primary" class="fetch-btn" :loading="listLoading" @click="handleFetch">
                <i class="el-icon-download" /> 开始采集
              </el-button>
            </div>
          </el-tab-pane> -->

          <el-tab-pane label="文件上传采集" name="file">
            <div class="file-operations">
              <div class="upload-section">
                <span class="label">上传数据文件：</span>
                <el-upload
                  class="upload-demo"
                  action="#"
                  :http-request="handleFileUpload"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                >
                  <el-button size="small" type="primary" :loading="uploadLoading">
                    <i class="el-icon-upload" /> 点击上传
                  </el-button>
                  <div slot="tip" class="el-upload__tip">支持 .csv, .xlsx 格式文件</div>
                </el-upload>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div v-if="collectStatus" class="collect-result">
      <!-- 采集成功提示 -->
      <el-alert :title="`采集成功`" type="success" show-icon :closable="false" class="success-alert" />

      <div class="data-summary">
        <div class="summary-card">
          <div class="summary-icon"><i class="el-icon-s-data" /></div>
          <div class="summary-content">
            <div class="summary-value">{{ startTime }}</div>
            <div class="summary-label">开始采集时间</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon"><i class="el-icon-time" /></div>
          <div class="summary-content">
            <div class="summary-value">{{ endTime }}</div>
            <div class="summary-label">采集完成时间</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <h3><i class="el-icon-info" /> 采集提示</h3>
      <ul>
        <li>关键词越精确，采集结果越准确</li>
        <li>采集过程可能需要几分钟，请耐心等待</li>
        <li>采集结果将自动保存到数据库</li>
        <li>可以通过上传文件批量导入数据</li>
      </ul>
    </div>
  </div>
</template>

<script>

import { spiderShop, asyncImportGoodsData } from '@/api/common'

export default {
  data() {
    return {
      keywords: '', // 关键字
      listLoading: false,
      selectedPlatform: 'taobao', // 默认选择淘宝
      activeCollectionMethod: 'manual', // 默认选择手动采集

      queryPage: 5, // 截止
      startPage: 1, // 开始

      collectStatus: false, // 采集成功

      uploadLoading: false,
      fileList: [],

      startTime: '', // 开始采集时间
      endTime: '' // 采集完成时间
    }
  },
  methods: {
    // 采集数据
    handleFetch() {
      if (!this.selectedPlatform) {
        this.$message.warning('请选择采集平台')
        return
      }

      if (!this.keywords.trim()) {
        this.$message.warning('请输入关键词')
        return
      }

      this.listLoading = true
      // 记录开始采集时间
      this.startTime = new Date().toLocaleTimeString()

      // spiderShop(this.keywords, this.queryPage, this.startPage, this.selectedPlatform).then((res) => {
      //   setTimeout(async() => {
      //     // 采集成功
      //     this.collectStatus = true

      //     this.listLoading = false
      //   }, 3000)
      // })

      // TODO:
      setTimeout(async() => {
        // 采集成功
        this.collectStatus = true
        // 记录采集完成时间
        this.endTime = new Date().toLocaleTimeString()
        this.listLoading = false
      }, 3000)
    },

    // 文件上传前的验证
    beforeUpload(file) {
      const isValidFormat = file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'text/csv'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isValidFormat) {
        this.$message.error('上传文件只能是 Excel/CSV 格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
        return false
      }
      return true
    },

    // 处理文件上传
    handleFileUpload(options) {
      this.uploadLoading = true
      // 记录开始采集时间
      this.startTime = new Date().toLocaleTimeString()

      const formData = new FormData()
      formData.append('file', options.file)
      formData.append('platform', this.selectedPlatform)

      // 异步导入数据
      asyncImportGoodsData(formData).then(response => {
        this.uploadLoading = false
        if (response.code === '000') {
          this.$message.success('数据导入成功')
          // 记录采集完成时间
          this.endTime = new Date().toLocaleTimeString()
          this.collectStatus = true
        } else {
          this.$message.error(response.msg || '数据导入失败')
        }
      }).catch(() => {
        this.uploadLoading = false
        this.$message.error('数据导入失败，请重试')
      })
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

  .collection-methods {
    margin-bottom: 20px;

    .method-title {
      font-size: 16px;
      margin-bottom: 15px;
      color: #303133;
    }
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    margin-top: 15px;

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

  .file-operations {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 15px;

    .upload-section {
      display: flex;
      align-items: center;
    }

    .el-upload__tip {
      margin-left: 10px;
      color: #909399;
    }
  }

  .download-section {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #dcdfe6;
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
    margin-bottom: 10px;
  }

  .data-summary {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;

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
  margin-top: 20px;
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
