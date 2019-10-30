<template>
  <div class="MyInfo">
    <span>个人资料</span>
        <el-divider></el-divider>
        <el-form :model="formInline" label-width="80px" class="formInfo" v-loading="theFirstGet">
            <el-form-item label="账号:" >
                <el-input v-model="formInline.account" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label="公司:" >
                <el-input v-model="formInline.company" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label=" 联系方式: " >
                <el-input v-model="formInline.telnum" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="用户等级:" >
                <el-input v-model="formInline.right" placeholder=" " disabled></el-input>
            </el-form-item>

            <el-form-item label="IP地址:" >
                <el-input v-model="formInline.ip" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label=":">
                <el-button type="primary" @click="saveModify">保存修改</el-button>
                <el-button type="default" @click="modifyPass('ruleForm')">修改密码</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            title="修改密码:"
            :visible.sync="dialogVisible"
            width="30%"
            class="dialog">
            <el-divider></el-divider>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
              <el-form-item label="旧密码" prop="oldPass" >
                <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                <div class="error" v-show="oldPassCheck">旧密码错误</div>
              </el-form-item>
              <el-form-item label="密码" prop="pass" >
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
  name: 'AddUser',
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
    return {
      formInline: {
        account: '',
        company: '',
        telnum: '',
        right: '',
        ip: ''
      },
      checkModify: '',
      theFirstGet: true,
      oldPassCheck: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        // oldPass: [{validator: checkoldpass, trigger: 'blur'}],
        pass: [{ validator: checkpassword, trigger: 'blur' }],
        checkPass: [{ validator: checkpassword2, trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  methods: {
    saveModify () {
      console.log(this.checkModify)
      if (JSON.stringify(this.formInline) === JSON.stringify(this.checkModify)) {
        this.$alert('没有要保存的修改', '注意', '确定')
        return
      }
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$loading({target: document.querySelector('.el-table')})
        this.$axios.post('/api/modify_personal_info', this.formInline)
          .then(response => {
            console.log(response)
            this.formInline = response.data
            loading.close()
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '保存失败'
            })
            loading.close()
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
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
          this.checkModify = JSON.parse(JSON.stringify(this.formInline))
          this.theFirstGet = false
        })
        .catch(error => {
          this.theFirstGet = false
          console.log(error)
        })
    }
  },
  created () {
    this.getDate()
  }
}
</script>
<style scoped>
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
  margin-left: 0px;
}
.ruleForm>>>.el-input__inner{
  width: 100%;
  font-weight: bold;
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
.MyInfo>>>.el-dialog__body {
  padding: 0px 0px 0px 0px;
}
.MyInfo>>>.el-dialog__header {
  padding-top: 15px;
  text-align: left;
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
.formInfo>>>button.el-button.el-button--primary{
  /*margin-left: 550px;*/
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.formInfo>>>button.el-button.el-button--default{
  margin-left: 145px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-divider{
  margin: 12px auto 30px auto;
  background-color: #3a4f80;
}
/*@media (max-width: 1000px){
  .formInfo>>>.el-form-item__label{
    margin-left: 7%;
  }
}*/
@media (max-width: 1300px){
  .formInfo>>>.el-form-item__label{
    margin-left: 12%;
  }
}
</style>
<style>

div:nth-child(6) > label{
  color: white;
}
</style>
