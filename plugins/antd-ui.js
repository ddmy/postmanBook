import Vue from 'vue'
import Antd from 'ant-design-vue/lib'
import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.interceptors.response.use(res => {
  return {
    code: res.status,
    data: res.data
  }
}, error => {
  return Promise.reject(error)
})

Vue.use(Antd)
