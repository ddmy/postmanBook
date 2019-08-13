<template>
  <div>
    <a-button
      v-if="visible"
      class="to-home"
      type="primary"
      shape="circle"
      icon="home"
      :size="size"
      @click="to('/')"
    />
    <nuxt />
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
      visible: true,
      visibleFalse: ["index", "login"]
    }
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    $route: function(newVal) {
      this.visible = !this.visibleFalse.includes(newVal.name)
    }
  },
  created() {
    this.visible = !this.visibleFalse.includes(this.$route.name)
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
