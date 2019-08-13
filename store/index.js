export const state = () => ({
  userInfo: {}
})

export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data
  }
}
