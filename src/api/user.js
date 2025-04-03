import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/client/user/doLogin',
    method: 'get',
    params: data
  })
}

export function register(data) {
  return request({
    url: '/client/user/saveUser',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/client/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/client/user/logout',
    method: 'get'
  })
}

export function updatePassword(data) {
  return request({
    url: '/client/user/updatePwd',
    method: 'put',
    data
  })
}
