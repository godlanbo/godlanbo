<template>
  <div class="InformationManagement">
    <div v-show="$store.state.MainJudge">
      <el-form  :model="formInline" :rules="rules" ref="search" :inline="true" hide-required-asterisk label-width="70px">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formInline.keyword" @keyup.enter.native="submitSearch('search')" placeholder="相关信息"></el-input>
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
      <el-form-item class="button_box">

        <el-button type="primary" @click="submitSearch('search')">查询</el-button>
        <el-button @click="addInformation">新增</el-button>
        <el-button @click="outPutInfo">导出</el-button>
        <!-- <div class="superRoot" v-if="$store.state.loginLevel == 'superRoot'"> -->
        <el-button @click="sendMessageBox" v-if="$store.state.loginLevel == 'superRoot'">群发短信</el-button>
         <input class="dialog_input" v-model="inputTemplateCode" placeholder="填写模板code" v-if="$store.state.loginLevel == 'superRoot'">
          <!-- <el-input class="dialog_input" v-model="inputTemplateCode" placeholder="填写模板code"></el-input> -->
        <el-button @click="addTemplateCode" style="margin-left: 10px;" type="primary" class="add_template_button" v-if="$store.state.loginLevel == 'superRoot'">添加模板</el-button>
        <a href="https://signin.aliyun.com/login.htm" target="_blank" v-if="$store.state.loginLevel == 'superRoot'"><el-button type="primary" style="margin-left: 10px;">获得code</el-button></a>
        <el-button type="default" class="clear_selection" @click="clearSelection">清空选项</el-button>
        <!-- </div> -->

      </el-form-item>
    </el-form>

      <el-table
        id="out-table"
        ref="multipleTable"
        :data="tableData"
        :height="tableHeight"
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
        <el-table-column prop="crawl_time" label="更新时间">
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
            width="50%"
            @opened="beforeOpen">
            <el-divider></el-divider>
            <el-autocomplete
              class="signName_input"
              v-model="inputCompanySign"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              placeholder="填写公司签名"
              @focus="getHistoryCompanySign"
            ></el-autocomplete>

            <el-table class="dialog_table" :data="templateData" stripe height="400">
              <el-table-column
               label="Select">
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
    <div v-if="$store.state.EditJudge">
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
      tableHeight: document.documentElement.clientHeight - 310,
      tableDateRowIndex: 0,
      dialogVisibleMessage: false,
      dialogVisibleShow: false,
      dialogText: '',
      totalInfoNum: 10,
      inputTemplateCode: '',
      inputCompanySign: '',
      historyCompanySign: [
        {'value': '1a1'},
        {'value': '2a2'},
        {'value': '2A2'},
        {'value': '3ba'}
      ],
      formInline: {
        keyword: '',
        infofrom: 'all',
        path: 'all',
        date1: '',
        date2: ''
      },
      checked: null,
      templateData: [],
      templateLoading: null,
      // {
      //   templateName: '',
      //   templateCode: '',
      //   templateStatus: '',
      //   tempateInfo: ''
      // }
      resetPage: 1,
      rules: {
        infofrom: [{required: true, message: '不能为空', trigger: 'blur'}],
        path: [{required: true, message: '不能为空', trigger: 'blur'}]
      },
      tableData: [],
      multipleSelection: [],
      theFirstGet: true,
      allOutPutInfo: []
    }
  },
  methods: {
    // 清空所选项
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
      this.allOutPutInfo = []
      this.multipleSelection = []
    },
    // 获得所有历史输入的公司签名
    getHistoryCompanySign () {
      this.$axios.get('/api/get_sign')
        .then(response => {
          this.historyCompanySign = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 查询并把准备好的输入建议返回到input输入框
    querySearch (queryString, cb) {
      // 创建准备好的数据，输入不为空就匹配所有历史中相似的语句
      var results = queryString ? this.historyCompanySign.filter(this.matchingSuggestion(queryString)) : []
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 匹配输入的字符串函数
    matchingSuggestion (queryString) {
      return (sign) => {
        return sign.value.indexOf(queryString) !== -1
      }
    },
    // 在短信模板框打开前loading模板表格
    beforeOpen () {
      this.templateLoading = this.$loading({target: document.querySelector('.dialog_table')})
      // 获取所有模板信息
      this.getAllTemplateInfo()
    },
    // 显示模板对应的内容
    showTheTemplateInfo (index, row) {
      this.dialogVisibleShow = true
      this.dialogText = row.templateContent
    },
    // 删除模板信息
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
    // 获得所有模板信息
    getAllTemplateInfo () {
      this.$axios.get('/api/get_all_template')
        .then(response => {
          this.templateData = response.data.all_template
          this.templateLoading.close()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '拉取数据失败！'
          })
          this.templateLoading.close()
          console.log(error)
        })
    },
    // 短信群发
    sendMessage () {
      if (this.checked === null) {
        this.$alert('请先选中模板', '注意', '确定')
        return
      }
      if (this.inputCompanySign === '') {
        this.$alert('公司签名不能为空', '注意', '确定')
        return
      }
      this.$confirm('是否使用选中模板向用户发送信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$loading({target: document.querySelector('.submit_message')})
        this.$axios.post('/api/send_message', {templateCode: this.checked, acceptUsers: this.allOutPutInfo, signName: this.inputCompanySign})
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
    // 导出商户信息
    outPutInfo () {
      if (this.allOutPutInfo.length === 0) {
        this.$alert('请勾选商户后再导出！', '注意', '确定')
        return
      }
      if (this.allOutPutInfo.length >= 40) {
        this.$alert('单次导出不超过40个！', '注意', '确定')
        return
      }
      this.$axios.post('/api/output_info', this.allOutPutInfo)
        .then(response => {
          if (!response) {
            return
          }
          // 创建一个下载链接
          let url = window.URL.createObjectURL(new Blob([response.data]))
          // 创建一个 a 标签元素
          let link = document.createElement('a')
          link.style.display = 'none'
          // 将此链接绑定到 a 标签元素上
          link.href = url
          link.setAttribute('download', 'excel.csv')
          // 添加链接标签到body上
          document.body.appendChild(link)
          // 直接触发下载
          link.click()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 搜索信息
    submitSearch (formdate) {
      // 提交数据到后端查询，接受返回数据
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          let loading = this.$loading({target: document.querySelector('.el-table')})
          this.$axios.post('/api/search_store_info', this.formInline)
            .then(response => {
              // 将搜索状态设置为开，此后后端返回数据从搜索状态分出来的数据中给出
              this.$store.commit('OpenSearchState')
              this.tableData = response.data.info
              this.totalInfoNum = response.data.totalInfoNum
              loading.close()
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '搜索信息失败'
              })
              console.log(error)
              loading.close()
            })
          this.resetPage = 1
        } else {
          return false
        }
      })
    },
    // 添加短信模板
    addTemplateCode () {
      let loading = this.$loading({target: document.querySelector('.add_template_button')})
      this.$axios.post('/api/add_template', {templateCode: this.inputTemplateCode})
        .then(response => {
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
    // 翻页，根据传入的页数参数重新获得相关页的数据
    handleCurrentPage (val) {
      this.getDate(val)
    },
    // 更新主页面的信息
    updateform () {
      this.getDate(this.resetPage)
    },
    // 切换编辑商户信息的页面
    handleEdit (index, row) {
      this.tableDateRowIndex = index
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixEditJudge')
    },
    // 切换添加商户信息的页面
    addInformation () {
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixAddJudge')
    },
    // 单个删除商户信息
    handleDelete (index, row) {
      this.$confirm('是否删除该商户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_store', row)
          .then(response => {
            this.allOutPutInfo.splice(this.allOutPutInfo.indexOf(row), 1)
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
    // 将数组指向为所选的对象数组
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.allOutPutInfo = this.multipleSelection.concat(this.allOutPutInfo).filter((value, index, arr) => {
        return arr.map(value_ => JSON.stringify(value_)).indexOf(JSON.stringify(value)) === index
      })
    },
    // 控制弹出的模板选择窗口
    sendMessageBox () {
      if (this.allOutPutInfo.length === 0) {
        this.$alert('请勾选商户后再点击群发短信！', '注意', '确定').then(() => {}).catch(() => {})
      } else {
        // 重置签名
        this.inputCompanySign = ''
        // 重置模板的选择
        this.checked = null
        // 弹窗显示设置为true
        this.dialogVisibleMessage = true
      }
    },
    // 获取数据函数，参数为获取页数
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableData = response.data.info
          setTimeout(() => {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.allOutPutInfo.length; j++) {
                if (this.tableData[i].web_link === this.allOutPutInfo[j].web_link) {
                  this.$refs.multipleTable.toggleRowSelection(this.tableData[i])
                }
              }
            }
          }, 100)
          // 更新总页数
          this.totalInfoNum = response.data.totalInfoNum
          loading.close()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '拉取数据失败'
          })
          console.log(error)
          loading.close()
        })
    },
    // 初始化数据函数，特殊的loading控制，以防止在dom树渲染以前因为组件未加载出现全屏loading现象
    getTheFirstInfo (pagenumber) {
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableData = response.data.info
          // 更新总页数
          this.totalInfoNum = response.data.totalInfoNum
          // 关闭loading
          this.theFirstGet = false
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '初始化数据失败'
          })
          console.log(error)
          this.theFirstGet = false
        })
    }
  },
  mounted () {
    // 动态调整表格的高度
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 310
    }
    // 清空历史页面，使用户不能后退
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  },
  created () {
    // 初始化页面的登录权限判断
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
    // 重置获取数据的状态
    this.$store.commit('ResetSearchState')
    // getDate 在页面加载前获取数据
    this.getTheFirstInfo(1)
    // 重置页面的显示状态，主页面显示，添加和编辑隐藏
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
.el-dialog>>>button.el-button.el-button--primary{
  margin-left: 10px;
}
.el-table {
  margin: 0px auto;
  margin-bottom: 10px;
}
.el-form{
  padding: 10px 10px 10px 10px;
  width: 100%;
  float:left;
}
.el-select>>>.el-input__inner{
  width: 95%;
}
.el-autocomplete.signName_input>>>.el-input__inner{
  /*width: 30%;*/
  margin-left: 20px;
  margin-top:15px;
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
.el-select>>>.el-select__caret.el-input__icon.el-icon-arrow-up{
  margin-right: 10px;
}
@media (max-width: 1050px){
  .el-dialog__wrapper.dialog_message>>>.el-dialog{
    width: 493px !important;
  }
}
</style>
<style>
.dialog_input{
  width: 20%;
  margin-left:10px;
  background-color: #FFF;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
}
.button_box{
  display: flex;
  justify-content: space-between;
}
.el-scrollbar > .el-autocomplete-suggestion__wrap.el-scrollbar__wrap{
  padding: 0px;
}
.el-form-item__content > .clear_selection{
  margin-left: 10px;
}
.el-loading-spinner .circular{
  height: 30px;
  width: 30px;
}
body{
  margin: 0px;
}
</style>
