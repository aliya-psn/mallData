import request from '@/utils/request'

// 文件上传
export function uploadFile(param) {
  return request({
    url: `/client/file/upload`,
    method: 'post',
    data: param
  })
}

// 文件下载
export function downloadFile(param) {
  return request({
    url: `/client/file/download`,
    method: 'get',
    params: param
  })
}
