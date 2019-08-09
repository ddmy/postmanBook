import Vue from "vue"
import Antd from "ant-design-vue/lib"
import axios from "axios"
import api from "@@/api"

axios.defaults.baseURL = "/api"
axios.interceptors.response.use(
  res => {
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)

Vue.prototype.$api = api
Vue.use(Antd)
