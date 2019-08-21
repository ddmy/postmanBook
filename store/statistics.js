import Vue from 'vue'
import api from "@@/api"

export const state = () => ({
  courierPrice: []
})

export const mutations = {
  setCourierPrice(state, val) {
    state.courierPrice = val
  }
}

export const actions = {
  async getCourierPrice({ state, commit }, data) {
    const result = await api.couriers.price()
    if (result.status === 200) {
      commit("setCourierPrice", result.data.priceList)
    } else {
      Vue.prototype.$message.success('网路超时，获取快递价格失败!请稍后再试!')
    }
  }
}
