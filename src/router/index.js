import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
// import { nextTick } from 'vue/types/umd'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将访问的路径
  // from从哪里来
  // next() 放行  next('/login') 跳转
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (token == null) {
    return next('/login')
  } else {
    next()
  }
})

export default router
