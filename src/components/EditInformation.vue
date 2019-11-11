<template>
    <div class="EditInformation">
        <span>编辑商户信息</span>
        <el-divider></el-divider>
        <el-form :model="formInline" label-width="80px" :rules="rules">
            <el-form-item label="商户名称:" >
                <el-input v-model="formInline.store_name" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="质量评级:" prop="score">
                <el-input v-model="formInline.score" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label=" 地址: " >
                <el-input v-model="formInline.store_address" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label=" 链接: " >
                <el-input v-model="formInline.web_link" placeholder=" " ></el-input>
            </el-form-item>
            <!-- <el-form-item label="联系人:" >
                <el-input v-model="formInline.adminName" placeholder=" " ></el-input>
            </el-form-item> -->
            <el-form-item label="电话:" >
                <el-input v-model="formInline.phone_number" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="信息来源:" >
                <el-select v-model="formInline.infofrom" placeholder="请选择" style="width: 93%;">
                    <el-option label="自动抓取" value="自动抓取"></el-option>
                    <el-option label="手动生成" value="手动生成"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道:" >
                <el-select v-model="formInline.web" placeholder="请选择" style="width: 93%;">
                    <el-option label="美团" value="美团"></el-option>
                    <el-option label="大众点评" value="大众点评"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="评论数:" prop="comment_num">
                <el-input v-model="formInline.comment_num" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label="备注:" >
                <el-input v-model="formInline.remark" placeholder=" " ></el-input>
            </el-form-item>
            <el-form-item label=":" class="the_end_formline">
                <el-button type="primary" @click="save_edit">保存</el-button>
                <el-button  @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'EditInformation',
  props: ['date'],
  data () {
    var checkStoreScore = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此项不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('请输入数字值'))
      } else if (parseFloat(value) > 5 || parseFloat(value) < 0) {
        callback(new Error('输入范围在1~5之间'))
      } else {
        callback()
      }
    }
    var checkCommentCount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此项不能为空'))
      } else if (isNaN(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      formInline: {
        store_name: this.date.store_name,
        score: this.date.score,
        store_address: this.date.store_address,
        web_link: this.date.web_link,
        phone_number: this.date.phone_number,
        infofrom: this.date.infofrom,
        web: this.date.web,
        remark: this.date.remark,
        comment_num: this.date.comment_num,
        time: this.date.time
      },
      rules: {
        score: [{validator: checkStoreScore}],
        comment_num: [{validator: checkCommentCount}]
      }
    }
  },
  methods: {
    save_edit () {
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formInline.time = this.getDateTime()
        this.$axios.post('/api/save_edit', this.formInline)
          .then(response => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$store.commit('FixMainJudge')
            this.$store.commit('FixEditJudge')
            this.$emit('save_edit')
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '保存失败!'
            })
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消保存'
        })
      })
    },
    getDateTime () {
      var d = new Date()
      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate()
      var hour = d.getHours()
      var minutes = d.getMinutes()
      var sec = d.getSeconds()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + sec
    },
    cancel () {
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixEditJudge')
    }
  }
}
</script>
<style scoped>
.el-form>>>.el-form-item__content{
  margin-left: 20px !important;
  float: left;
}
.el-form>>>.el-input__inner{
  width: 210%;
  font-weight: bold;
}
.el-form>>>.el-form-item__label{
  margin-left: 30%;
}
.el-form>>>button.el-button.el-button--primary{
  /*margin-left: 590px;*/
  margin-top:15px;
  padding-right: 50px;
  padding-left: 50px;
}
.el-form>>>button.el-button.el-button--default{
  margin-left: 200px;
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
.el-form-item.the_end_formline >>> .el-form-item__label{
  color: white;
}
@media (max-width: 1300px){
  .el-form>>>.el-form-item__label{
    margin-left: 12%;
  }
}
</style>
<style>
.el-main{
  padding-top: 12px;
}
</style>
