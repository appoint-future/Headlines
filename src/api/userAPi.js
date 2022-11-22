import axios from '@/utils/axios'

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
