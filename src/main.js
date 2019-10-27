// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import Qs from 'qs'
import store from './vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true'
axios.defaults.withCredentials = true
axios.defaults.timeout = 30000
Vue.prototype.$axios = axios
Vue.prototype.qs = Qs
Vue.prototype.HOME = '/api'
Vue.use(ElementUI)
Vue.config.productionTip = false

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization') !== null || localStorage.getItem('Authorization') !== undefined) {
      config.headers.Authorization = localStorage.getItem('Authorization')
    }
    return config
  },
  err => {
    console.log(-1)
    return Promise.reject(err)
  })
// 响应拦截器
axios.interceptors.response.use(
  response => {
    console.log(response)
    if (response.headers.code === 10010 || response.headers.code === 10011) {
      alert('登录超时')
      localStorage.setItem('Authorization', null)
      localStorage.setItem('loginLevel', null)
      localStorage.setItem('Identity', null)
      router.replace({
        path: '/Login'
      })
    }
    return response
  },
  error => {
    if (error.response.status === 401) {
      router.replace({
        path: '/401'
      })
    } else if (error.response.status === 500) {
      router.replace({
        path: '/500'
      })
    }
    return Promise.reject(error.response.data)
  })

/* eslint-disable no-new */
// Vue.config.devtools = true
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
