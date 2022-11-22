import axios from '@/utils/axios'

export const getArticleDetailAPI = (id) => {
  return axios.get('/v1_0/articles/' + id)
}

export const followingsAuthorAPI = (authorId) => {
  return axios.post('/v1_0/user/followings', { target: authorId })
}

export const deleteFollowingsAPI = (authorId) => {
  return axios.delete('/v1_0/user/followings/' + authorId)
}

export const likingsArticleAPI = (articleId) => {
  return axios.post('/v1_0/article/likings', { target: articleId })
}

export const deletelikingsArticleAPI = (articleId) => {
  return axios.delete('/v1_0/article/likings/' + articleId)
}
