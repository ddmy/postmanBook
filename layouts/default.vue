<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item key="index">
        <router-link to="/">
          <a-icon type="home" />
          主页
        </router-link>
      </a-menu-item>
      <a-menu-item key="record-recordId">
        <router-link to="/record">
          <a-icon type="edit" />
          记录
        </router-link>
      </a-menu-item>
      <a-menu-item key="history">
        <router-link to="/history">
          <a-icon type="clock-circle" />
          历史
        </router-link>
      </a-menu-item>
      <a-menu-item key="login" @click="logout">
        <router-link to="/login">
          <a-icon type="clock-circle" />
          {{ isLogin ? "退出登录" : "登录" }}
        </router-link>
      </a-menu-item>
    </a-menu>
    <nuxt />
    <div />
  </div>
</template>

<script>
import _ from "lodash"
import { mapState, mapMutations } from "vuex"

export default {
  name: "DefaultLayout",
  data() {
    return {
      size: "large",
      current: []
    }
  },
  computed: {
    ...mapState(["userInfo"]),
    isLogin() {
      // 返回 true 表示 已登陆
      return !_.isEmpty(this.userInfo)
    }
  },
  created() {
    this.current.push(this.$route.name)
    if (_.isEmpty(this.userInfo)) {
      this.getUserInfo()
    }
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    to(url) {
      this.$router.push(url)
    },
    async getUserInfo() {
      const result = await this.$api.user.info()
      if (result.status === 200) {
        this.setUserInfo(result.data)
      } else {
        this.$message.error("账户状态异常,请重新登录!")
        this.$router.push("login")
      }
    },
    async logout() {
      if (!this.isLogin) return
      const result = await this.$api.user.logout()
      if (result.status === 200) {
        this.$message.success("您已退出登录!")
        this.$router.push("login")
      } else {
        this.$message.error("网络繁忙,请稍后再试!")
      }
    }
  }
}
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.to-home {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 20px;
  margin: auto 0;
  opacity: 0.7;
  z-index: 9999;
}
</style>
