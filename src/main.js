import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 导入 Vant 和 组件的样式表
import Vant from 'vant'
import 'vant/lib/index.css'
// 注册全局插件
Vue.use(Vant)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')