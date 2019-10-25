<template>
  <div class="InformationManagement">
    <div v-if="$store.state.MainJudge">
      <el-form  :model="formInline" :rules="rules" ref="search" :inline="true" hide-required-asterisk label-width="70px">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formInline.keyword" placeholder="相关信息"></el-input>
        </el-form-item>
        <el-form-item label="信息来源"  prop="infofrom">
          <el-select v-model="formInline.infofrom" placeholder="请选择">
            <el-option label="自动抓取" value="自动抓取"></el-option>
            <el-option label="手动生成" value="手动生成"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道"  prop="path">
          <el-select v-model="formInline.path" placeholder="请选择">
            <el-option label="美团" value="美团"></el-option>
            <el-option label="大众点评" value="大众点评"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" >
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="2">&nbsp;——</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch('search')">查询</el-button>
        <el-button @click="addInformation">新增</el-button>
        <el-button @click="outPutInfo">导出</el-button>
        <div class="superRoot" v-if="$store.state.loginLevel == 'superRoot'">
          <el-button @click="sendMessageBox">群发短信</el-button>
          <el-input class="dialog_input" v-model="inputTemplateCode" placeholder="填写模板code"></el-input>
          <el-button @click="addTemplateCode" style="margin-left: 10px;" type="primary" class="add_template_button">添加模板</el-button>
          <a href="https://signin.aliyun.com/login.htm" target="_blank"><el-button type="primary" style="margin-left: 10px;">获得code</el-button></a>
        </div>
      </el-form-item>
    </el-form>

      <el-table
        id="out-table"
        ref="multipleTable"
        :data="tableData"
        height="590"
        @selection-change="handleSelectionChange"
        stripe
        v-loading="theFirstGet">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="store_name" label="商户名称" width="120">
        </el-table-column>
        <el-table-column prop="score" label="质量评级" width="80">
        </el-table-column>
        <el-table-column prop="store_address" label="地址" width="120">
        </el-table-column>
        <el-table-column label="链接">
          <template slot-scope="scope">
            <a :href="''+tableData[scope.$index].web_link" target="_blank">{{tableData[scope.$index].web_link}}</a>
          </template>

        </el-table-column>
        <el-table-column prop="adminName" label="联系人">
        </el-table-column>
        <el-table-column prop="phone_number" label="电话">
        </el-table-column>
        <el-table-column prop="infofrom" label="信息来源">
        </el-table-column>
        <el-table-column prop="web" label="渠道">
        </el-table-column>
        <el-table-column prop="comment_num" label="评论数" width="80">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="time" label="更新时间">
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          ref="pagination"
          @current-change="handleCurrentPage"
          layout="prev, pager, next, jumper"
          :current-page.sync="resetPage"
          :page-size="20"
          :total="totalInfoNum">
        </el-pagination>
      </div>
      <el-dialog
            title="选择模板:"
            :visible.sync="dialogVisibleMessage"
            class="dialog_message"
            width="50%">
            <el-divider></el-divider>
            <el-input v-model="signName" placeholder="填写公司签名" class="signName_input"></el-input>
            <el-table class="dialog_table" :data="templateData" stripe height="400">
              <el-table-column
               label="Select"
               width="140">
                 <template slot-scope="scope">
                   <el-radio v-model="checked" :label="scope.row.templateCode">&nbsp;</el-radio>
                 </template>
               </el-table-column>
              <el-table-column prop="templateName" label="模板名称"></el-table-column>
              <el-table-column prop="templateCode" label="模板code"></el-table-column>
              <el-table-column prop="templateStatus" label="模板状态"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                  size="mini"
                  @click="showTheTemplateInfo(scope.$index, scope.row)">查看</el-button>
                  <el-button
                  size="mini"
                  type="danger"
                  @click="deleteTheTemplateInfo(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" class="submit_message" @click="sendMessage">确认发送</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="模板内容:"
            :visible.sync="dialogVisibleShow"
            class="dialog_showInfo"
            width="30%">
            <el-divider></el-divider>
            <p>{{ dialogText }}</p>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisibleShow = false">确认</el-button>
            </span>
        </el-dialog>

    </div>
    <div v-else-if="$store.state.EditJudge">
      <EditInformation @save_edit="updateform" :date="tableData[tableDateRowIndex]"></EditInformation>
    </div>
    <div v-else-if="$store.state.AddJudge">
      <AddInformation @save_add="updateform"></AddInformation>
    </div>
  </div>
</template>

<script>
import EditInformation from './EditInformation.vue'
import AddInformation from './AddInformation.vue'
export default {
  name: 'InformationManagement',
  components: {
    EditInformation, AddInformation
  },
  data () {
    return {
      tableDateRowIndex: 0,
      dialogVisibleMessage: false,
      dialogVisibleShow: false,
      dialogText: '',
      totalInfoNum: 10,
      inputTemplateCode: '',
      formInline: {
        keyword: '',
        infofrom: '',
        path: '',
        date1: '',
        date2: ''
      },
      signName: null,
      checked: null,
      templateData: [],
      // {
      //   templateName: '',
      //   templateCode: '',
      //   templateStatus: '',
      //   temp;ateInfo: ''
      // }
      resetPage: 1,
      rules: {
        keyword: [{required: true, message: '不能为空', trigger: 'blur'}],
        infofrom: [{required: true, message: '不能为空', trigger: 'blur'}],
        path: [{required: true, message: '不能为空', trigger: 'blur'}]
      },
      tableData: [],
      multipleSelection: [],
      theFirstGet: true
    }
  },
  methods: {
    showTheTemplateInfo (index, row) {
      this.dialogVisibleShow = true
      this.dialogText = row.templateInfo
    },
    deleteTheTemplateInfo (index, row) {
      this.$confirm('是否删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/delete_template', row)
          .then(response => {
            if (response.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
            this.getAllTemplateInfo()
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getAllTemplateInfo () {
      let loading = this.$loading({target: document.querySelector('.dialog_table')})
      this.$axios.get('/api/get_all_template')
        .then(response => {
          console.log(response)
          this.templateData = response.data.all_template
          loading.close()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '拉取数据失败！'
          })
          loading.close()
          console.log(error)
        })
    },
    sendMessage () {
      if (this.checked === null) {
        this.$alert('请先选中模板', '注意', '确定')
        return
      }
      if (this.signName === null) {
        this.$alert('公司签名不能为空', '注意', '确定')
        return
      }
      this.$confirm('是否使用选中模板向用户发送信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$loading({target: document.querySelector('.submit_message')})
        this.$axios.post('/api/send_message', {templateCode: this.checked, acceptUsers: this.multipleSelection, signName: this.signName})
          .then(response => {
            this.dialogVisibleMessage = false
            this.$message({
              type: 'success',
              message: '发送成功!'
            })
            loading.close()
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '发送失败!'
            })
            loading.close()
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发送'
        })
      })
    },
    outPutInfo () {
      if (this.multipleSelection.length === 0) {
        this.$alert('请勾选商户后再导出！', '注意', '确定')
        return
      }
      this.$axios.post('/api/output_info', this.multipleSelection)
        .then(response => {
          if (!response) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([response.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'excel.csv')
          document.body.appendChild(link)
          link.click()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submitSearch (formdate) {
      // 提交数据到后端查询，接受返回数据
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          let loading = this.$loading({target: document.querySelector('.el-table')})
          this.$axios.post('/api/search_store_info', this.formInline)
            .then(response => {
              this.$store.commit('OpenSearchState')
              this.tableData = response.data.info
              loading.close()
            })
            .catch(function (error) {
              console.log(error)
              loading.close()
            })
          this.resetPage = 1
        } else {
          return false
        }
      })
    },
    addTemplateCode () {
      console.log(this.inputTemplateCode)
      let loading = this.$loading({target: document.querySelector('.add_template_button')})
      this.$axios.post('/api/add_template', {templateCode: this.inputTemplateCode})
        .then(response => {
          console.log(response)
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          }
          loading.close()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
          loading.close()
          console.log(error)
        })
    },
    handleCurrentPage (val) {
      this.getDate(val)
    },
    updateform () {
      this.getDate(this.resetPage)
    },
    handleEdit (index, row) {
      this.tableDateRowIndex = index
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixEditJudge')
    },
    addInformation () {
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixAddJudge')
    },
    handleDelete (index, row) {
      this.$confirm('是否删除该商户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_store', row)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDate(this.resetPage)
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    sendMessageBox () {
      if (this.multipleSelection.length === 0) {
        this.$alert('请勾选商户后再点击群发短信！', '注意', '确定').then(() => {}).catch(() => {})
      } else {
        this.getAllTemplateInfo()
        this.signName = null
        this.checked = null
        this.dialogVisibleMessage = true
      }
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableData = response.data.info
          this.totalInfoNum = response.data.totalInfoNum
          loading.close()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    getTheFristInfo (pagenumber) {
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableData = response.data.info
          this.totalInfoNum = response.data.totalInfoNum
          this.theFirstGet = false
        })
        .catch(function (error) {
          console.log(error)
          this.theFirstGet = false
        })
    }
  },
  mounted () {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  },
  created () {
    // getDate 在页面加载前获取数据
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
    this.$store.commit('ResetSearchState')
    this.getTheFristInfo(1)
    this.$store.commit('InitializationMainJudge')
    this.$store.commit('InitializationEditJudge')
    this.$store.commit('InitializationAddJudge')
  }
}
</script>
<style scoped>
.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}
.InformationManagement>>>.el-dialog__body {
  padding: 0px;
}
.InformationManagement>>>.el-dialog__header {
  padding-top: 15px;
  text-align: left;
}
.el-divider--horizontal {
  margin-top: 0px;
  margin-bottom: 30px;
  background-color: #3a4f80;
}
.dialog_input>>>.el-input__inner{
  width: 20%;
  margin-left: 10px;
}
.el-dialog__wrapper.dialog_showInfo>>>.el-dialog{
  margin-top:280px !important;
}
.el-dialog__wrapper.dialog_showInfo>>>.el-dialog__body{
  height: 150px;
}
.el-dialog__wrapper.dialog_message>>>.el-dialog__body{
  height: 460px;
}
.el-dialog__wrapper.dialog_showInfo>>>p{
  text-align: left;
  margin-left: 15px;
  margin-right: 15px;
  font-size: 15px;
}
.dialog_input{
  display: inline;
}
.el-dialog>>>button.el-button.el-button--primary{
  margin-left: 10px;
}
.el-table {
  margin: 0px auto;
  margin-bottom: 10px;
  padding: 0px auto 20px auto;
}
.el-form{
  padding: 10px 10px 10px 10px;
  width: 100%;
  float:left;
}
.el-select>>>.el-input__inner{
  width: 95%;
}
.signName_input.el-input>>>.el-input__inner{
  width: 30%;
  margin-left: 20px;
  margin-top:15px;
}
.superRoot{
  display: inline;
  margin-left: 10px;
}
.el-divider--horizontal{
  margin-bottom: 0px;
}
.el-cascader-node>.el-radio, .el-radio:last-child{
  margin-left: 10px;
}
.el-dialog__wrapper>>>.el-dialog__footer{
  padding-bottom: 10px;
}
.el-button.add_template_button.el-button--primary.el-loading-parent--relative>>>.el-loading-spinner{
  top:60%;
}
</style>
<style>
.el-select__caret.el-input__icon.el-icon-arrow-up{
  margin-right: 20px;
}
.el-loading-spinner .circular{
  height: 30px;
  width: 30px;
}
body{
  margin: 0px;
}
/*.el-main{
  margin-top: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
}*/
</style>
