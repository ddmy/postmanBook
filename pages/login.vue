<template>
  <div class="login">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '请输入账号!' }] }
          ]"
          placeholder="Username"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码!' }] }
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true
            }
          ]"
        >
          记住账号
        </a-checkbox>
        <a class="login-form-forgot" href="">
          忘记密码？
        </a>
        <a-button
          type="primary"
          html-type="submit"
          class="login-form-button"
          :loading="loading"
        >
          登录
        </a-button>
        Or
        <a href="">
          注册账号!
        </a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  name: "Login",
  data() {
    return {
      loading: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          const result = await this.$api.user
            .login(values)
            .catch(err => console.error(err))
          if (result && result.status === 200) {
            this.$message.success(result.message)
            this.setUserInfo(result.data)
            this.$router.push("/")
          } else {
            this.$message.error(result.message)
          }
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 30px 20px;
  height: calc(100vh - 47px);
  overflow: auto;
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
