import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import './assets/css/global.css'

// 导入axios
import axios from 'axios'
// tree-table
import TreeTable from 'vue-table-with-tree-grid'
// tree-table 插件
Vue.component('tree-table', TreeTable)
// 配置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(config)
  return config
})
//  配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
//  时间过滤器
Vue.filter('dateFormat', val => {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  return `${year}-${month}-${day}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
