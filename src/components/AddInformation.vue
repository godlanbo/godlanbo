<template>
  <div class="AddInformation">
    <span>新增商户信息</span>
    <el-divider></el-divider>

    <el-form :model="formInline" label-width="80px" :rules="rules" ref="addInfoForm" hide-required-asterisk>
      <el-form-item label="商户名称:" prop="store_name">
        <el-input v-model="formInline.store_name" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <el-form-item label="质量评级:" prop="score">
        <el-input v-model="formInline.score" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <el-form-item label=" 地址: " prop="store_address">
        <el-input v-model="formInline.store_address" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <el-form-item label=" 链接: " prop="web_link">
        <el-input v-model="formInline.web_link" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系人:" prop="adminName">
        <el-input v-model="formInline.adminName" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item> -->
      <el-form-item label="电话:" prop="phone_number">
        <el-input v-model="formInline.phone_number" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <el-form-item label="信息来源:" >
        <el-select v-model="formInline.infofrom" placeholder="请选择" style="width: 93%;">
          <el-option label="自动抓取" value="自动抓取" v-if="$store.state.loginLevel == 'superRoot'"></el-option>
          <el-option label="手动生成" value="手动生成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道:" prop="web">
        <el-select v-model="formInline.web" placeholder="请选择" :disabled="$store.state.automaticGrabState&&formInline.infofrom != '手动生成'" style="width: 93%;">
          <el-option label="美团" value="美团"></el-option>
          <el-option label="大众点评" value="大众点评"></el-option>
          <el-option label="全部" value="全部"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" >
        <el-input v-model="formInline.remark" placeholder=" " :disabled="judgeShowInput"></el-input>
      </el-form-item>
      <el-form-item label=":" class="the_end_formline">
        <el-button type="primary" @click="save_add('addInfoForm')" :disabled="$store.state.automaticGrabState&&formInline.infofrom != '手动生成'">添加</el-button>
        <el-button  @click="cancel" >取消</el-button>
      </el-form-item>
    </el-form>
    <div v-if="$store.state.automaticGrabState">
      <span class="autoText">数据抓取中<i class="el-icon-loading"></i></span>
      <el-button type="danger" class="button_stop" size="mini " @click="cancelAutoGetInfo">终止抓取</el-button>
      <el-progress :percentage="percentageNum" :format="format" :stroke-width="14"></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditInformation',
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
    return {
      formInline: {
        store_name: '',
        score: '',
        store_address: '',
        web_link: '',
        comment_num: '0',
        phone_number: '',
        infofrom: '手动生成',
        web: '',
        remark: '',
        time: ''
      },
      rules: {
        store_name: [{required: true, message: '此项不能为空'}],
        score: [{validator: checkStoreScore}],
        store_address: [{required: true, message: '此项不能为空'}],
        web_link: [{required: true, message: '此项不能为空'}],
        phone_number: [{required: true, message: '此项不能为空'}],
        web: [{required: true, message: '此项不能为空'}]
      },
      percentageNum: 0
    }
  },
  methods: {
    cancelAutoGetInfo () {
      // xxx
      this.$store.commit('InitializationAutomaticGrabState', false)
    },
    save_add (formdate) {
      if (this.formInline.infofrom === '手动生成') {
        this.$refs[formdate].validate((valid) => {
          if (valid) {
            this.$confirm('是否添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.formInline.time = this.getDateTime()
              this.$axios.post('/api/add_store_info', this.formInline).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$emit('save_add')
                this.$store.commit('FixAddJudge')
                this.$store.commit('FixMainJudge')
              }).catch(err => {
                console.log(err)
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
          } else {
            return false
          }
        })
      } else if (this.formInline.infofrom === '自动抓取') {
        this.$store.commit('InitializationAutomaticGrabState', true)
      }
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
    format (percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`
    },
    cancel () {
      this.$store.commit('FixAddJudge')
      this.$store.commit('FixMainJudge')
    },
    getDate () {
      // get percentageNum
    }
  },
  created () {
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
    this.getDate()
  },
  computed: {
    judgeShowInput: function () {
      return (this.formInline.infofrom === '自动抓取' || this.$store.state.automaticGrabState) && this.formInline.infofrom !== '手动生成'
    }
  },
  watch: {
    percentageNum: function () {
      if (this.percentageNum === 100) {
        this.$alert('自动抓取信息已完成', '注意', {
          confirmButtonText: '确定',
          callback: action => {
            this.$store.commit('InitializationAutomaticGrabState', false)
          }
        })
      }
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
.AddInformation>>>.el-progress-bar{
  width: 32%;
  margin-left: 33%;
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
.autoText{
  margin-left: 33%;
  margin-top:-15px;
}
</style>
