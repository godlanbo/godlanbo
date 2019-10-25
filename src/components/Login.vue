<template>
  <div class="login">
    <el-container>
        <el-main>
            <el-form :model="user" :rules="rules" hide-required-asterisk ref="user">
                <h2>商户管理系统</h2>
                <el-divider></el-divider>
                <el-form-item label="账号:" prop="account">
                    <el-input v-model="user.account" placeholder=" "  @keyup.enter.native="login('user')"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input v-model="user.password" placeholder=" " @keyup.enter.native="login('user')" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login('user')"  class="login_button">登录</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        account: '',
        password: ''
      },
      rules: {
        account: [{required: true, message: '请输入账户', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      tempLoading: null
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tempLoading = this.$loading({target: document.querySelector('.el-form')})
          this.$axios.post('/api/check_account', this.user).then(res => {
            if (!res.data.success) {
              this.$message({
                type: 'error',
                message: res.data.error_message
              })
              this.tempLoading.close()
              return
            }
            localStorage.setItem('Authorization', res.headers.authorization)
            localStorage.setItem('loginLevel', res.data.right)
            localStorage.setItem('Identity', res.data.identity)
            if (localStorage.getItem('loginLevel') === 'superRoot' || localStorage.getItem('loginLevel') === 'Root') {
              this.$router.replace({
                path: '/admin'
              })
              this.tempLoading.close()
            } else {
              this.$router.replace({
                path: '/user'
              })
              this.tempLoading.close()
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '登陆失败'
            })
            console.log(err)
            this.tempLoading.close()
          })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  }
}
</script>
<style scoped>
.el-form{
  border: 10px solid #b9c1d2;
  width: 400px;
  margin: 180px auto;
  padding: 0px 20px 15px 20px;
  -webkit-border-radius: 8px;
  box-shadow: -16px 20px 20px 3px #909399;
}
.el-divider{
  margin: 10px 0 10px 0;
  background-color: #3a4f80;
}
.el-form>>>button.el-button.el-button--primary{
  margin-left: 0px;
  margin-top:20px;
  padding-right: 180px;
  padding-left: 180px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.el-form>>>.el-form-item{
  padding-bottom: 2px;
  margin-bottom: 10px;
}
.el-form>>>.el-form-item__label{
  font-size: 20px;
}

.el-form>>>.el-input__inner{
  font-size: 18px;
}
.el-form>>>span{
  font-size: 20px;
}
</style>
<style>
h2{
  margin-top: 10px;
  margin-bottom: 10px;
}
body{
  margin: 0px;
}
</style>
