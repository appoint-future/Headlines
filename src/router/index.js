import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '@/components/Login/Login.vue'
import Home from '@/views/Home/Home.vue'
import Main from '@/views/Main/Main.vue'
import User from '@/views/User/User.vue'
import Search from '@/components/Search/Search.vue'
import SearchResult from '@/components/Search/SearchResult.vue'
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
import UserEdit from '@/views/UserEdit/UserEdit.vue'
import Chat from '@/views/Chat/Chat.vue'

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

export default router
