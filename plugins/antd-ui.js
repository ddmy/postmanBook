import Vue from "vue"
import Antd from "ant-design-vue/lib"
import axios from "axios"
import api from "@@/api"

Vue.prototype.$api = api
Vue.use(Antd)

axios.defaults.baseURL = "/api"
axios.interceptors.response.use(
  res => {
    // 未登录
    if (res.data.status === 402) {
      location.href = "/login"
    }
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)
