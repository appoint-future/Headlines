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

// 获取文章下评论数据的 API
export const getCmtListAPI = (artId, offset) => {
  return axios.get('/v1_0/comments', {
    params: {
      // a 表示获取文章下的评论
      type: 'a',
      // 文章的 Id
      source: artId,
      // 获取评论数据的偏移量，值为评论的 id。表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset,
    },
  })
}

// 点赞评论
export const addLikeCmtAPI = (cmtId) => {
  return axios.post('/v1_0/comment/likings', { target: cmtId })
}

// 评论取消点赞
export const delLikeCmtAPI = (cmtId) => {
  return axios.delete(`/v1_0/comment/likings/${cmtId}`)
}

// 发布评论
export const pubCommentAPI = (artId, cmt) => {
  return axios.post('/v1_0/comments', { target: artId, content: cmt })
}
