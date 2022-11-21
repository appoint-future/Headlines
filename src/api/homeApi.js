import axios from '@/utils/axios'

export const getUserChannelAPI = () => {
  return axios.get('/v1_0/user/channels')
}
export const getArtListAPI = (id, time) => {
  return axios.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time,
    },
  })
}

export const getAllChannelAPI = () => {
  return axios.get('/v1_0/channels')
}

export const updateUserChannelAPI = (channels) => {
  return axios.put('/v1_0/user/channels', {
    channels,
  })
}
