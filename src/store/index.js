import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo, getUserProfileAPI } from '@/api/userAPi'

Vue.use(Vuex)

// 初始化vuex的时候加载本地的state数据
const state = JSON.parse(localStorage.getItem('state'))
let initState = {
  tokenInfo: {},
  userInfo: {},
  userProfile: {},
}
if (state) {
  initState = state
}

export default new Vuex.Store({
  state: initState,
  getters: {},
  mutations: {
    // 将获取到的token保存到tokeninfo中
    updateTokenInfo(state, token) {
      state.tokenInfo = token
      // 将state信息保存到localStorage中  防止刷新丢失数据
      this.commit('saveStateToStorage')
    },
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新用户基本信息
    updateUserInfo(state, payload) {
      state.userInfo = payload
      // 将state信息保存到localStorage中  防止刷新丢失数据
      this.commit('saveStateToStorage')
    },
    // 更新用户简介信息
    updateUserProfile(state, payload) {
      state.userProfile = payload
      // 将state信息保存到localStorage中  防止刷新丢失数据
      this.commit('saveStateToStorage')
    },
    // 清空vuex中的数据
    removeState(state) {
      state.tokenInfo = {}
      state.userInfo = {}
      // 将清除后的数据保存到本地存储中
      this.commit('saveStateToStorage')
    },
  },
  actions: {
    // 获取到用户的基本信息
    async initUserInfo(config) {
      const { data: res } = await getUserInfo()
      if (res.message === 'OK') {
        // 更新用户基本信息
        config.commit('updateUserInfo', res.data)
      }
    },
    // 获取用户简介信息
    async initUserProfile(config) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        config.commit('updateUserProfile', res.data)
      }
    },
  },
  modules: {},
})
