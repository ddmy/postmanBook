<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        mom
      </h1>
      <h2 class="subtitle">
        {{ msg }}
      </h2>
      <div class="links">
        <a-button type="primary" @click="to('record')">
          记录
        </a-button>
        <a-button type="primary" @click="to('history')">
          历史
        </a-button>
        <a-button @click="logout">
          退出登录
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import _ from "lodash"
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
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const result = await this.$api.user.info()
      if (result.status === 200) {
        if (_.isEmpty(result.data)) {
          this.$message.warning("请先登录！")
          this.to("login")
        } else {
          this.msg = result.data.nickname
        }
      } else {
        let { message = "获取信息失败!" } = result.data
        this.$message.error(message)
      }
    },
    to(url) {
      this.$router.push(url)
    },
    async logout() {
      const result = await this.$api.user.logout()
      if (result.status === 200) {
        this.$message.success("您已退出登录!")
        this.to("login")
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
  min-height: 100vh;
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
