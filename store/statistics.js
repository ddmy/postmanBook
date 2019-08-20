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
    }
  }
}
