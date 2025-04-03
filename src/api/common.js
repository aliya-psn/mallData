import request from '@/utils/request'

// 重新爬取数据
export function spiderShop(keywords, endPage, startPage) {
  return request({
    url: `/spiderShop?keywords=${keywords}&endPage=${endPage}&startPage=${startPage}`,
    method: 'get'
  })
}

// 获取商品列表所有
export function getProductsList() {
  return request({
    url: `/getProductList`,
    method: 'get'
  })
}
// 获取商品列表通过分类
export function getProductsListByType(type) {
  return request({
    url: `/getProductsListByType?type=${type}`,
    method: 'get'
  })
}

// 获取商品 type 值
export function getProductType() {
  return request({
    url: `/getProductType`,
    method: 'get'
  })
}

// 删除该分类下数据
export function deleteProductByType(type) {
  return request({
    url: `/deleteProductByType/${type}`,
    method: 'delete'
  })
}
