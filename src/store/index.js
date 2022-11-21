import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 初始化vuex的时候加载本地的state数据
const state = JSON.parse(localStorage.getItem('state'))
let initState = {
  tokenInfo: {},
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
  },
  actions: {},
  modules: {},
})
