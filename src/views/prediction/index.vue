<template>
  <div class="app-container">
    <el-card class="shop-info-card">
      <div class="current-shop">
        <div>请填写商品信息：</div>
      </div>
      <el-form ref="productForm" :model="productForm" :rules="productRules" class="product-form" auto-complete="on" label-position="right" label-width="80px">
        <el-form-item prop="modelType" label="分析模型">
          <el-select v-model="productForm.modelType" placeholder="请选择分析模型" style="width: 360px" @change="handleDeleteModel">
            <el-option
              v-for="item in modelTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="trainCount" label="训练次数">
          <el-input
            v-model="productForm.trainCount"
            placeholder="请输入训练次数"
            type="text"
            auto-complete="on"
            style="width: 360px"
            @change="handleDeleteModel"
          />
        </el-form-item>
        <el-form-item prop="type" label="商品分类">
          <el-select v-model="productForm.type" placeholder="请选择" style="width: 360px" @change="fetchData">
            <el-option
              v-for="item in types"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="productName" label="商品名称">
          <el-input
            v-model="productForm.productName"
            placeholder="请输入商品名称"
            type="text"
            auto-complete="on"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item prop="price" label="商品价格">
          <el-input
            v-model="productForm.price"
            placeholder="请输入商品价格"
            type="text"
            auto-complete="on"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item prop="area" label="发货地">
          <el-select v-model="productForm.area" style="width: 360px" placeholder="请选择发货地">
            <el-option
              v-for="item in areaDataList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="shopName" label="店铺名称">
          <el-select v-model="productForm.shopName" style="width: 360px" placeholder="请选择店铺">
            <el-option
              v-for="item in shopNameList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-button v-loading.fullscreen.lock="listLoading" type="primary" style="margin:10px 30px;" @click.native.prevent="reqPredirection">预测销量</el-button>
        <el-button type="primary" @click.native.prevent="handleDeleteModel">删除模型</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getProductsListByType,
  getProductType
} from '@/api/common'
import { predictionSales, deleteModel } from './predict.js'

export default {
  data() {
    return {
      dataList: null,
      listLoading: false,

      // 所有分类
      types: [],
      // 所有区域
      areaDataList: [],
      // 所有店铺
      shopNameList: [],

      // 模型分类
      modelTypeList: [{
        label: '神经网络',
        value: 1
      }, {
        label: '线性回归',
        value: 2
      }],

      // 预测参数
      productForm: {
        modelType: 1, // 1 神经网络 2 线性回归
        trainCount: 100, // 训练次数
        type: '',
        productName: '',
        price: '',
        area: '',
        shopName: ''
      },
      productRules: {
        modelType: [{ required: true, trigger: 'blur', message: '请选择模型' }],
        type: [{ required: true, trigger: 'blur', message: '请选择商品分类' }],
        price: [{ required: true, trigger: 'blur', message: '请输入商品价格' }],
        area: [{ required: true, trigger: 'blur', message: '请选择发货地' }],
        shopName: [{ required: true, trigger: 'blur', message: '请选择店铺名称'
        }]
      }
    }
  },
  async created() {
    // 获取分类
    const res = await getProductType()
    this.types = res.data.map((item) => {
      return item.type
    })
    if (this.types.length === 0) {
      return
    }
    this.productForm.type = this.types[0]
    // 请求当前分类下商品列表
    this.fetchData()
  },
  methods: {
    // 请求分类商品列表数据
    fetchData() {
      this.handleDeleteModel()
      if (!this.productForm.type) return
      getProductsListByType(this.productForm.type).then((res) => {
        this.dataList = res.data

        // 区域
        this.areaDataList = [...new Set(this.dataList.map((item) => item.area))]
        // 店铺
        this.shopNameList = [...new Set(this.dataList.map((item) => item.shopName))]

        this.productForm.shopName = ''
        this.productForm.area = ''
      })
    },
    // 预测销量
    reqPredirection() {
      this.listLoading = true
      this.$refs.productForm.validate(async valid => {
        if (valid) {
          const param = this.productForm
          // 进行预测
          await predictionSales(param, param.modelType, param.trainCount, this.dataList)
          this.listLoading = false
        } else {
          console.log('error submit!!')
          this.listLoading = false
          return false
        }
      })
    },
    // 删除模型
    handleDeleteModel() {
      deleteModel()
    }
  }
}
</script>

<style scoped lang="scss">
.current-shop {
  padding: 20px;
  display: flex;
  gap: 30px;
  align-items: center;
  .tip {
    font-size: 12px;
    color: orange;
  }
}
.shop-info-card {
  width: 50%;
  margin-left: 25%;
}
.product-form {
  overflow: hidden;
  width: 70%;
  margin-left: 15%;
}

</style>
