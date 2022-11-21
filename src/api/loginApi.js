import axios from '@/utils/axios'

export const loginApi = (data) => {
  return axios.post('/v1_0/authorizations', data)
}
