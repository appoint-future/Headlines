import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/components/Login/Login.vue')
const Home = () => import('@/views/Home/Home.vue')
const Main = () => import('@/views/Main/Main.vue')
const User = () => import('@/views/User/User.vue')
const Search = () => import('@/components/Search/Search.vue')
const SearchResult = () => import('@/components/Search/SearchResult.vue')
const ArticleDetail = () => import('@/views/ArticleDetail/ArticleDetail.vue')
const UserEdit = () => import('@/views/UserEdit/UserEdit.vue')
const Chat = () => import('@/views/Chat/Chat.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/main/home',
    children: [
      { path: 'home', component: Home },
      { path: 'user', component: User },
    ],
  },
  { path: '/search', component: Search },
  { path: '/search/:keyword', component: SearchResult },
  { path: '/article/:id', component: ArticleDetail },
  { path: '/useredit', component: UserEdit },
  { path: '/chat', component: Chat },
]

const router = new VueRouter({
  routes,
})

// 前置导航守卫
import store from '@/store/index.js'
router.beforeEach((to, from, next) => {
  // 声明需要验证的hash地址
  const listPath = [
    '/main',
    '/main/home',
    '/main/user',
    '/search',
    '/search/:keyword',
    '/useredit',
    '/chat',
    '/article/:id',
  ]
  // 判断需要前往的页面是否在listPath里面
  if (listPath.indexOf(to.path) !== -1) {
    // 判断是否有token值
    const token = store.state.tokenInfo.token
    if (token) {
      next()
    } else {
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    next()
  }
})
// 解决 vue-router 内部的报错的问题：
// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch((err) => err)
}

export default router
