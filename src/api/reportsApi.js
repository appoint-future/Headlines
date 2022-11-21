import axios from '@/utils/axios'

export const reportsAPI = (target, type) => {
  return axios.post('/v1_0/article/reports', { target, type })
}
