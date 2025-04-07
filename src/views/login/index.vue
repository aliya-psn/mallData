<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ isRegister ? '用户注册' : '电商数据比价系统' }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="isRegister ? '请输入用户名' : '用户名'"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="isRegister ? '请输入密码' : '请输入密码'"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="isRegister ? handleRegister() : handleLogin()"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        class="login-button"
        @click.native.prevent="isRegister ? handleRegister() : handleLogin()"
      >
        {{ isRegister ? '注册' : '登录' }}
      </el-button>

      <div class="switch-form">
        <span class="switch-text" @click="toggleForm">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        logo: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入用户密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isRegister: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/loginAction', this.loginForm).then(() => {
            localStorage.setItem('loginStatus', true)
            localStorage.setItem('username', this.loginForm.username)
            this.$message.success('登录成功')
            this.loading = false
            setTimeout(() => {
              this.$router.push(this.redirect || '/dashboard')
            }, 500)
          }).catch((e) => {
            this.$message.error(e || '登录失败')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toggleForm() {
      this.isRegister = !this.isRegister
      this.loginForm = {
        username: '',
        password: '',
        logo: ''
      }
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/registerAction', this.loginForm).then(() => {
            this.$message.success('注册成功，请登录')
            this.isRegister = false
            this.loading = false
          }).catch((e) => {
            this.$message.error(e || '注册失败')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #f0f2f5;
$light_gray: #333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .el-input {
    display: inline-block;
    height: 45px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 10px 5px 10px 15px;
      color: $light_gray;
      height: 45px;
      caret-color: $cursor;
      font-size: 14px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    color: #333;
    margin-bottom: 20px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(0, 0, 0, 0.2);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #f0f2f5;
$dark_gray: #666;
$light_gray: #333;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('~@/assets/login-bg.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  position: relative;

  .login-form {
    position: relative;
    width: 420px;
    max-width: 100%;
    padding: 35px;
    margin: 0 auto;
    overflow: hidden;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .tips {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.7);
    text-align: center;
    margin-top: 15px;

    span {
      display: block;
      margin: 4px 0;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 25px;
    display: inline-block;
    transition: color 0.3s;

    &:hover {
      color: $light_gray;
    }
  }

  .title-container {
    position: relative;
    margin-bottom: 35px;

    .title {
      font-size: 28px;
      margin: 0 auto 8px;
      text-align: center;
      font-weight: bold;
      color: $light_gray;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: 1px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 14px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;

    &:hover {
      color: $light_gray;
    }
  }

  .login-button {
    width: 100%;
    height: 45px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    background: linear-gradient(90deg, #4481eb 0%, #04befe 100%);
    border: none;
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(68, 129, 235, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .switch-form {
    margin-top: 20px;
    text-align: center;

    .switch-text {
      color: #4481eb;
      cursor: pointer;
      font-size: 14px;
      transition: color 0.3s;

      &:hover {
        color: #04befe;
      }
    }
  }
}
</style>
