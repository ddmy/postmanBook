export const state = () => ({
  userInfo: {}
})

export const mutations = {
  setUserInfo(state, data) {
    console.log("设置用户信息", data)
    state.userInfo = data
  }
}
