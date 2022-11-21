import axios from '@/utils/axios'

export const getUserChannelAPI = () => {
  return axios.get('/v1_0/user/channels')
}
