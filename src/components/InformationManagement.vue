<template>
  <div class="InformationManagement">
    <div v-if="$store.state.MainJudge">
      <el-form  :model="formInline" :rules="rules" ref="search" :inline="true" hide-required-asterisk>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formInline.keyword" placeholder="相关信息"></el-input>
        </el-form-item>
        <el-form-item label="信息来源" label-width="100px" prop="infofrom">
          <el-select v-model="formInline.infofrom" placeholder="请选择">
            <el-option label="自动抓取" value="自动抓取"></el-option>
            <el-option label="手动生成" value="手动生成"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道" label-width="100px" prop="path">
          <el-select v-model="formInline.path" placeholder="请选择">
            <el-option label="美团" value="美团"></el-option>
            <el-option label="大众点评" value="大众点评"></el-option>
            <el-option label="全部" value="all"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" label-width="100px">
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
        <el-button type="primary" @click="sendMessage" v-if="$store.state.loginLevel == 'superRoot'">群发短信</el-button>
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
            title="短信内容:"
            :visible.sync="dialogVisible"
            width="30%">
            <el-divider></el-divider>
            <el-input
              type="textarea"
              :rows="7"
              placeholder="请输入内容"
              resize="none"
              v-model="textarea">
            </el-input>

            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="sendMessageAlert">发送</el-button>
            </span>
        </el-dialog>
    </div>
    <div v-else-if="$store.state.EditJudge">
      <EditInformation @save_edit="updateform" :date="tableData[tableDateRowIndex]" :id="tableDateRowIndex"></EditInformation>
    </div>
    <div v-else-if="$store.state.AddJudge">
      <AddInformation @save_add="addInformationToform"></AddInformation>
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
      dialogVisible: false,
      totalInfoNum: 10,
      textarea: '',
      formInline: {
        keyword: '',
        infofrom: '',
        path: '',
        date1: '',
        date2: ''
      },
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
    handleCurrentPage (val) {
      console.log(this.resetPage)
      this.getDate(val)
    },
    updateform (obj, index) {
      obj.time = this.getDateTime()
      // this.tableData[index] = obj
    },
    addInformationToform (obj) {
      obj.time = this.getDateTime()
      // this.tableData[this.tableData.length] = obj
    },
    handleEdit (index, row) {
      console.log(row)
      this.tableDateRowIndex = index
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixEditJudge')
    },
    addInformation () {
      this.$store.commit('FixMainJudge')
      this.$store.commit('FixAddJudge')
    },
    handleDelete (index, row) {
      this.$confirm('是否删除该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
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
    sendMessage () {
      if (this.multipleSelection.length === 0) {
        this.$alert('请勾选商户后再点击群发短信！', '注意', '确定')
      } else {
        this.dialogVisible = true
      }
    },
    sendMessageAlert () {
      this.$axios.post('/api/get_store_info', this.multipleSelection)
        .then(response => {
          console.log(response)
          // this.tableData = response.data.info
        })
        .catch(function (error) {
          console.log(error)
        })
      this.$alert('已选中' + this.multipleSelection.length + '个商户进行短信群发', '发送成功', '成功')
      this.dialogVisible = false
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
.el-textarea>>>.el-textarea__inner{
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
.el-textarea{
  margin-bottom: 10px;
}

</style>
<style>
body{
  margin: 0px;
}
.el-form{
  padding: 0px 20px 0px 20px;
}
.el-table {
  margin: 0px auto;
  padding: 0px auto 20px auto;
}
.el-main{
  margin-top: 10px;
  padding-top: 0px;
}

</style>
