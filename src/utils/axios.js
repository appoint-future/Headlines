import axios from 'axios'
// 导入轻量级弹框
import { Toast } from 'vant'
// 导入vuex模块
import store from '@/store/index'
// 按需导入换取 token 的 API
import { exchangeTokenAPI } from '@/api/userAPi'

const instance = axios.create({
  baseURL: 'http://toutiao.itheima.net',
})

// 请求拦截器
// 注意：在我们的项目中，是基于 instance 实例来发起 ajax 请求的，因此一定要为 instance 实例绑定请求拦截器
instance.interceptors.request.use(
  // config 代表这次请求
  (config) => {
    // 请求的时候 展示 loading 效果
    Toast.loading({
      message: '玩命加载中...', // 文本内容
      duration: 0, // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    // 1. 获取 token 值
    const tookenStr = store.state.tokenInfo.token
    // 2. 判断 token 的值是否为空
    if (tookenStr) {
      // 如果不为空则为这次请求添加请求头
      config.headers.Authorization = `Bearer ${tookenStr}`
    }
    // 如果为空 则表示这次请求不需要token 故不需要添加请求头
    return config
  },
  // 请求失败
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器（注意：响应拦截器也应该绑定给 instance 实例）
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 隐藏 loading 提示效果
    Toast.clear()
    return response
  },
  async (error) => {
    Toast.clear()

    // 1. 从 vuex 中获取 tokenInfo 对象，格式为： { token, refresh_token }
    const tokenInfo = store.state.tokenInfo
    // 2. 判断是否为 token 过期
    if (
      error.response &&
      error.response.status === 401 &&
      tokenInfo.refresh_token
    ) {
      // token 过期
      console.log('token过期啦')

      try {
        // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
        // 3.2 TODO: 更新 Store 中的 Token
        store.commit('updateTokenInfo', {
          token: res.data.token,
          refresh_token: tokenInfo.refresh_token,
        })
        // 3.3 重新调用刚才“请求未遂”的接口
        // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return instance(error.config)
      } catch {
        //  token 和 refresh_token 都失效了
        // 4.1 清空 vuex 和 localStorage
        store.commit('cleanState')
        // 4.2 强制跳转到登录页
        router.replace('/login?pre=' + router.currentRoute.fullPath)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
