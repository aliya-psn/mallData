<template>
  <div class="mine-container">
    <el-card class="user-info-card">
      <div class="user-info">
        <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" />
        <div class="user-details">
          <h2>{{ name }}</h2>
        </div>
      </div>
    </el-card>

    <el-card class="password-card">
      <div slot="header" class="card-header">
        <span>修改密码</span>
      </div>
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultAvatar from '@/assets/default-avatar.svg'
import { updatePassword } from '@/api/user'

export default {
  name: 'Mine',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        name: '',
        avatar: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      defaultAvatar
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  methods: {
    handleChangePassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          const data = {
            userName: this.name,
            originPwd: this.passwordForm.oldPassword,
            newPwd: this.passwordForm.newPassword
          }
          updatePassword(data).then(async response => {
            if (response.code === '000') {
              this.$message.success('密码修改成功')
              this.passwordForm = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
              }
              // 退出登录
              await this.$store.dispatch('user/logout')
              // 跳转登录页面
              this.$router.push('/login')
            } else {
              this.$message.error(response.msg || '密码修改失败')
            }
          }).catch(error => {
            this.$message.error(error.message || '密码修改失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.mine-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.user-info-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  margin: 0;
  font-size: 24px;
}

.email {
  color: #666;
  margin: 5px 0 0;
}

.password-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
