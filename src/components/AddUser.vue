<template>
  <div class="AddUser">
    <span>添加用户</span>
    <el-divider></el-divider>
    <el-form :model="formInline" label-width="90px" >
      <el-form-item label="公司:" >
        <el-input v-model="formInline.company" placeholder=" " ></el-input>
      </el-form-item>
      <el-form-item label="公司电话: " >
        <el-input v-model="formInline.telnum" placeholder=" " ></el-input>
      </el-form-item>
      <el-form-item label="公司负责人:" >
        <el-input v-model="formInline.companyBoss" placeholder=" " ></el-input>
      </el-form-item>
      <el-form-item label="用户等级:" >
        <el-select v-model="formInline.right" placeholder="请选择" style="width: 93%;">
          <el-option label="普通用户" value="1"></el-option>
          <el-option label="铜牌用户" value="2"></el-option>
          <el-option label="银牌用户" value="3"></el-option>
          <el-option label="金牌用户" value="4"></el-option>
          <el-option label="管理员" value="5" v-if="$store.state.loginLevel == 'superRoot'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加数量:" >
        <el-input v-model="formInline.userNum" placeholder="1" ></el-input>
      </el-form-item>

      <el-form-item label=":" class="the_end_formline">
        <el-button type="primary" @click="save_add">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AddUser',
  data () {
    return {
      formInline: {
        company: '',
        telnum: '',
        companyBoss: '',
        right: '',
        userNum: '1'
      }
    }
  },
  methods: {
    save_add () {
      this.$confirm('是否添加?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/add_user', this.formInline)
          .then(response => {
            if (!response.data.success) {
              this.$message({
                type: 'error',
                message: response.data.error_message
              })
              return
            }
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    }
  },
  created () {
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
  }
}
</script>
<style scoped>
.el-form>>>.el-form-item__content{
  margin-left: 20px !important;
  float: left;
}
.el-form>>>.el-input__inner{
  font-weight: bold;
  width: 210%;
}
.el-form>>>.el-form-item__label{
  margin-left: 30%;
}
/*.el-form>>>button.el-button.el-button--button{
  margin-left: 590px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}*/
.el-form>>>button.el-button.el-button--primary{
  margin-left: 335px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-divider{
  margin: 12px auto 30px auto;
  background-color: #3a4f80;
}
.el-select>>>.el-select__caret.el-input__icon.el-icon-arrow-up{
  margin-right: -450px;
  /*margin-left: 100px;*/
}
@media (max-width: 1300px){
  .el-form>>>.el-form-item__label{
    margin-left: 10%;
  }
}
.el-form-item.the_end_formline >>> .el-form-item__label{
  color: white;
}
</style>
<style>
</style>
