import request from '@/utils/request'

// 爬取数据
export function spiderShop(keywords, endPage, startPage) {
  return request({
    url: `/spiderShop?keywords=${keywords}&endPage=${endPage}&startPage=${startPage}`,
    method: 'get'
  })
}

// 异步导入文件 模拟数据爬取，参数：file：formData
export function asyncImportGoodsData(param) {
  return request({
    url: `/client/async/import/GOODS`,
    method: 'post',
    data: param
  })
}

// 获取商品列表
export function getProductsList(param) {
  return request({
    url: `/client/goods/`,
    method: 'get',
    params: param
  })
}

// 商品比分排行
export function getGoodsRank(param) {
  return request({
    url: `/client/goodsScore/`,
    method: 'get',
    params: param
  })
}
