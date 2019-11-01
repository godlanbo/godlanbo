<template>
  <div class="UserInfo">
    <span>个人资料</span>
        <el-divider></el-divider>
        <el-form :model="formInline" label-width="80px" class="formInfo" v-loading="theFirstGet">
            <el-form-item label="账号:" >
                <el-input v-model="formInline.account" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label="公司:" >
                <el-input v-model="formInline.company" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label=" 联系方式: " >
                <el-input v-model="formInline.telnum" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label="用户等级:" >
                <el-input v-model="formInline.right" placeholder=" " disabled></el-input>
            </el-form-item>
            <!-- <el-form-item label="IP地址:" >
                <el-input v-model="formInline.ip" placeholder=" " disabled></el-input>
            </el-form-item> -->
            <el-form-item label=":" class="the_end_formline">
                <el-button type="default" @click="modifyPass('ruleForm')">修改密码</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            title="修改密码:"
            :visible.sync="dialogVisible"
            width="30%">
            <el-divider></el-divider>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
              <el-form-item label="旧密码" prop="oldPass" >
                <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                <div class="error" v-show="oldPassCheck">旧密码错误</div>
              </el-form-item>
              <el-form-item label="新密码" prop="pass" >
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserInfo',
  data () {
    const checkpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const checkpassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    // const checkoldpass = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('旧密码错误'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      formInline: {
        account: '',
        company: '',
        telnum: '',
        right: ''
      },
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      oldPassCheck: false,
      theFirstGet: true,
      rules: {
        // oldPass: [{validator: checkoldpass, trigger: 'blur'}],
        pass: [{ validator: checkpassword, trigger: 'blur' }],
        checkPass: [{ validator: checkpassword2, trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    save_add () {
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.formInline)
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消保存'
        })
      })
    },
    modifyPass (formdate) {
      this.dialogVisible = true
      this.oldPassCheck = false
      if (this.$refs[formdate] !== undefined) {
        this.$refs[formdate].resetFields()
      }
    },
    submitForm (formdate) {
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          // getDate
          this.$axios.post('/api/modify_password', this.ruleForm)
            .then(response => {
              console.log(response)
              if (!response.data.success) {
                this.oldPassCheck = true
                return
              }
              this.dialogVisible = false
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    getDate () {
      this.$axios.get('/api/personal_info')
        .then(response => {
          this.formInline = response.data
          this.theFirstGet = false
        })
        .catch(error => {
          this.theFirstGet = false
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
.ruleForm>>>.el-form-item__label{
  margin-left: 0px;
}
.ruleForm>>>.el-input__inner{
  width: 100%;
  font-weight: bold;
}
.formInfo>>>.el-form-item__content{
  margin-left: 20px !important;
  float: left;
}
.formInfo>>>.el-input__inner{
  width: 210%;
  font-weight: bold;
}
.formInfo>>>.el-form-item__label{
  margin-left: 30%;
}
.ruleForm>>>.el-form-item__label{
  margin-left: 25px;
}
.ruleForm>>>.el-form-item__error{
  margin-left: 35px;
}
.ruleForm>>>.el-input{
  width: 75%;
}
.formInfo>>>.el-input{
  width: 100%;
}
.UserInfo>>>.el-dialog__body {
  padding: 0px;
}
.UserInfo>>>.el-dialog__header {
  padding-top: 15px;
  text-align: left;
}
.el-form>>>button.el-button.el-button--default{
  margin-left: 310px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-divider{
  margin: 12px auto 30px auto;
  background-color: #3a4f80;
}
.error{
  color: #F56C6C;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 35px;
}
@media (max-width: 1300px){
  .formInfo>>>.el-form-item__label{
    margin-left: 10%;
  }
}
.el-form-item.the_end_formline >>> .el-form-item__label{
  color: white;
}
</style>
<style>
</style>
