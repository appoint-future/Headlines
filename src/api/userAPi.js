import axios from '@/utils/axios'
import request from 'axios'

export const getUserInfo = () => {
  return axios.get('/v1_0/user')
}

export const getUserProfileAPI = () => {
  return axios.get('/v1_0/user/profile')
}

export const updateUserAPI = (obj) => {
  return axios.patch('/v1_0/user/profile', obj)
}

export const updateUserPhoto = (photo) => {
  return axios.patch('/v1_0/user/photo', { photo })
}

export const updateUserAvatarAPI = (fd) => {
  return axios.patch('/v1_0/user/photo', fd)
}

// 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
export const exchangeTokenAPI = (refreshToken) => {
  return request({
    method: 'PUT',
    // 这里必须填写完整的请求 URL 地址
    url: 'http://toutiao.itheima.net/v1_0/authorizations',
    headers: {
      // 在请求头中携带 Authorization 身份认证字段
      Authorization: 'Bearer ' + refreshToken,
    },
  })
}
