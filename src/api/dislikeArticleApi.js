import axios from '@/utils/axios'

export const dislikeArticleAPI = (id) => {
  return axios.post('/v1_0/article/dislikes', { target: id })
}
