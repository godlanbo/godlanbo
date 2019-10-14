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

            <el-form-item>
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
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
          .catch(function (error) {
            console.log(error)
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
  margin-left: 470px;
}
/*.el-form>>>button.el-button.el-button--button{
  margin-left: 590px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}*/
.el-form>>>button.el-button.el-button--primary{
  margin-left: 895px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-divider{
  margin: 12px auto 30px auto;
  background-color: #3a4f80;
}
</style>
<style>
</style>
