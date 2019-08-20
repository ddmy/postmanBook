import api from "@@/api"

export const state = () => ({
  courierPrice: {}
})

export const mutations = {
  add (state, text) {
    state[text] = true
  }
}

export const actions = {
  async getCourierPrice (state, data) {
    const result = await api.user.info()
    console.log(result)
  }
}