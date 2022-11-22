import axios from '@/utils/axios'

export const getSuggestionAPI = (keyword) => {
  return axios.get('/v1_0/suggestion', { params: { q: keyword } })
}

export const getSearchResultAPI = (keyword, page) => {
  return axios.get('/v1_0/search', { params: { q: keyword, page } })
}
