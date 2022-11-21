import axios from 'axios'
// 导入轻量级弹框
import { Toast } from 'vant'
// 导入vuex模块
import store from '@/store/index'

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
instance.interceptors.response.use(
  // 响应的时候 隐藏 loading 效果
  (response) => {
    Toast.clear()
    return response
  },
  // 响应失败
  (err) => {
    return Promise.reject(err)
  }
)

export default instance
