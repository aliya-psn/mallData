const tf = require('@tensorflow/tfjs')
import { Message } from 'element-ui'

// 模型
let model = null
let uniqueAreas = null
let uniqueShops = null
// 定义模型保存的目录
const modelDirectory = 'localstorage://my_model'

/**
 * 预测销量
 * @param {*} productInfo 产品数据
 * @param {*} modelType 模型 1 神经网络 2 线性回归
 * @param {*} trainCount 训练次数
 * @param {*} dbData 数据
 * @returns
 */
export async function predictionSales(productInfo, modelType, trainCount, dbData) {
  console.log('预测商品参数：', productInfo)

  // 删除包含 NaN 和空数据的样本
  const filteredData = dbData.filter((item) => {
    return (
      !isNaN(parseFloat(item.price)) &&
      item.area &&
      item.realSales &&
      item.shopName
    )
  })

  /**
   * 将地区信息转换为独热编码
   */
  // 获取所有唯一的地区信息
  const areas = filteredData.map((item) => item.area)
  uniqueAreas = [...new Set(areas)]
  const encodedAreas = areas.map((area) =>
    uniqueAreas.map((uniqueArea) => (area === uniqueArea ? 1 : 0))
  )
  // 获取所有唯一店铺
  const shopNames = filteredData.map((item) => item.shopName)
  uniqueShops = [...new Set(shopNames)]
  const encodedShops = shopNames.map((name) =>
    uniqueShops.map((uniqueShop) => (name === uniqueShop ? 1 : 0))
  )

  // 测试  只保留价格特征
  // uniqueAreas = []
  // uniqueShops = []

  // 构建特征向量：价格、地区、店铺
  const prices = filteredData.map((item) => item.price)
  const features = prices.map((price, index) => [
    parseFloat(price),
    ...encodedAreas[index],
    ...encodedShops[index]
  ])

  // 构建标签向量：销量
  const labels = filteredData.map((item) => parseFloat(item.realSales))
  // console.log('特征向量：', features);
  // console.log('标签向量：', labels);

  const modelsList = await tf.io.listModels()
  if (modelDirectory in modelsList) {
    // 从本地存储中加载模型配置对象，并加载模型
    Message.success('加载模型成功')
    model = await tf.loadLayersModel(modelDirectory)
  } else {
    Message.warning('训练模型')
    // 创建模型
    model = tf.sequential()
    if (modelType === 1) {
      console.log('神经网络')
      // // 深度神经网络模型
      model.add(
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          inputShape: [1 + uniqueAreas.length + uniqueShops.length]
        })
      )
      model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
      model.add(tf.layers.dense({ units: 1 }))
      // 编译模型
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })
    } else {
      console.log('线性回归')
      // 线性回归模型
      const inputShape = [1 + uniqueAreas.length + uniqueShops.length]

      // 设置第一个维度（价格）的权重为更高的值
      const weights = [
        tf.randomNormal([inputShape[0], 1], 0.1, 0.1), // 权重矩阵
        tf.zeros([1]) // 偏置向量
      ]
      // // 输入形状匹配特征数量
      model.add(
        tf.layers.dense({
          units: 1,
          inputShape: inputShape,
          weights: weights // 设置权重
        })
      )
      // 编译模型
      model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' })
    }

    // 转换数据为 TensorFlow 张量
    const x = tf.tensor2d(features)
    const y = tf.tensor1d(labels)

    // 训练模型
    console.log('训练模型')
    model.fit(x, y, { epochs: trainCount || 100 }) // 训练周期;
    console.log('训练完毕')

    // 保存模型
    saveModel(model)
  }

  /** 输入商品的特征向量  地区、价格、店铺 */
  const newEncodedArea = uniqueAreas.map((uniqueArea) =>
    productInfo.area === uniqueArea ? 1 : 0
  )
  const newEncodedShop = uniqueShops.map((uniqueShop) =>
    productInfo.shopName === uniqueShop ? 1 : 0
  )
  const newFeatures = [
    parseFloat(productInfo.price),
    ...newEncodedArea,
    ...newEncodedShop
  ]
  // 只保留价格特征
  // const newFeatures = [parseFloat(productInfo.price)];

  console.log('预测商品特征向量：', newFeatures)

  // 进行预测
  const prediction = model.predict(tf.tensor2d([newFeatures]))
  const value = prediction.dataSync()[0]
  const predictionValue = Math.abs(parseInt(value))
  console.log('预测销量:', predictionValue)

  Message.success('预测商品销量为：' + predictionValue)
}

// 保存模型
function saveModel(model) {
  try {
    model.save(modelDirectory)
  } catch (error) {
    console.error('Error saving model:', error)
  }
}

// 删除模型
export async function deleteModel() {
  try {
    const modelsList = await tf.io.listModels()
    if (modelDirectory in modelsList) {
      await tf.io.removeModel('localstorage://my_model')
    }
  } catch (error) {
    console.error('Error saving model:', error)
  }
}
