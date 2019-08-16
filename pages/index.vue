<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        mom
      </h1>
      <h2 class="subtitle">
        {{ userInfo.nickname }}
      </h2>
      <div v-if="isLogin" class="links">
        <a-button @click="logout">
          退出登录
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import { mapState, mapMutations } from "vuex"
import Logo from "~/components/Logo.vue"

export default {
  components: {
    Logo
  },
  data() {
    return {
      msg: ""
    }
  },
  computed: {
    ...mapState(["userInfo"]),
    isLogin() {
      // 返回 true 表示 已登陆
      return !_.isEmpty(this.userInfo)
    }
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    async logout() {
      const result = await this.$api.user.logout()
      if (result.status === 200) {
        this.$message.success("您已退出登录!")
        this.setUserInfo({})
        this.$router.push("login")
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  height: calc(100vh - 47px);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
