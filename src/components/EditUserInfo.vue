<template>
  <div class="EditUserInfo">
    <span>编辑用户</span>
        <el-divider></el-divider>
        <el-form :model="formInline" label-width="90px" >
            <el-form-item label="账号:" >
                <el-input v-model="formInline.account" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item label="公司:" >
                <el-input v-model="formInline.company" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label=" 公司电话: " >
                <el-input v-model="formInline.telnum" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="公司负责人:" >
                <el-input v-model="formInline.companyBoss" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="用户等级:" >
                <el-select v-model="formInline.right" placeholder="请选择" style="width: 93%;">
                    <el-option label="普通用户" value="普通用户"></el-option>
                    <el-option label="铜牌用户" value="铜牌用户"></el-option>
                    <el-option label="银牌用户" value="银牌用户"></el-option>
                    <el-option label="金牌用户" value="金牌用户"></el-option>
                    <el-option label="管理员" value="管理员" v-if="$store.state.loginLevel == 'superRoot'"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="密码:" v-if="$store.state.loginLevel == 'superRoot'">
                <el-input v-model="formInline.password" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="IP地址:" >
                <el-input v-model="formInline.ip" placeholder=" " disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="button" @click="save_add">保存</el-button>
                <el-button  @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>
<script>
export default {
  name: 'EditUserInfo',
  props: ['date', 'id'],
  data () {
    return {
      formInline: {
        account: this.date.account,
        company: this.date.company,
        telnum: this.date.telnum,
        companyBoss: this.date.companyBoss,
        right: this.date.right,
        password: this.date.password,
        ip: this.date.ip
      }
    }
  },
  methods: {
    save_add () {
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('save_edit', this.formInline, this.id)
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    },
    cancel () {
      this.$emit('cancel')
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
.el-form>>>button.el-button.el-button--button{
  margin-left: 590px;
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-form>>>button.el-button.el-button--default{
  margin-left: 100px;
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
