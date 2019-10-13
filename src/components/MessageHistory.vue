<template>
  <div class="MessageHistory">
      <el-form :inline="true" :model="formInline" ref="search" hide-required-asterisk>
        <el-form-item label="发送对象" prop="MessageTo" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
          <el-input v-model="formInline.MessageTo" placeholder="商户联系电话"></el-input>
        </el-form-item>
        <el-form-item label="发送时间" label-width="100px">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="2">&nbsp;——</el-col>
          <el-col :span="11">
            <el-date-picker placeholder="选择日期" v-model="formInline.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item >
          <el-col :push="12"><el-button type="primary" @click="searchInfo('search')">查看</el-button></el-col>
        </el-form-item>
      </el-form>
      <el-button @click="deleteSelectInfo">
        <i class="el-icon-finished">批量删除</i>
      </el-button>
      <el-table  ref="multipleTable" :data="tableData"  height="610" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="MessageTo" label="发送对象" width="403"></el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="403"></el-table-column>
        <el-table-column prop="MessageInfo" label="详细信息" width="403">
          <div slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-message"
              @click="MessageInfoBox(scope.$index, scope.row)">
            </el-button>
            <el-dialog
              title="消息内容:"
              :visible.sync="dialogVisible"
              width="30%">
              <!-- <el-button @click="test(scope.$index, scope.row)">test</el-button> -->
              <el-divider></el-divider>
              <!-- <p>{{ tableData[scope.$index].MessageInfo }}</p> -->
              <p>{{ dialogText }}</p>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="403">
          <div slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteHistoryInfo(scope.$index, scope.row)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentPage"
          layout="prev, pager, next, jumper"
          :current-page="resetPage"
          :page-size="20"
          :total="totalInfoNum">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: 'MessageHistory',
  data () {
    return {
      formInline: {
        MessageTo: '',
        date1: '',
        date2: ''
      },
      resetPage: 1,
      totalInfoNum: 1,
      dialogText: '',
      tableData: [{
        MessageTo: '1312000000',
        sendTime: '2019-12-20 10:00:20',
        MessageInfo: '尊敬的131200000：近期电信诈骗行为频发，请小心防范；如您有积分兑换需求，请自行登录中国移动积分商城官网https://m.jf.10086.cn/兑换；值此国庆佳节之际，内江移动温馨提示您：请提前预存足额话费，避免影响正常通信。如有出国计划，请提前拨打10086开通国长国漫功能。祝您愉快度过国庆长假。【中国移动】'
      }, {
        MessageTo: '1312000000',
        sendTime: '2019-12-20 10:00:20',
        MessageInfo: '尊敬的客户：近期电信诈骗行为频发，请小心防范；如您有积分兑换需求，请自行登录中国移动积分商城官网https://m.jf.10086.cn/兑换；值此国庆佳节之际，内江移动温馨提示您：请提前预存足额话费，避免影响正常通信。如有出国计划，请提前拨打10086开通国长国漫功能。祝您愉快度过国庆长假。【中国移动】'
      }],
      dialogVisible: false,
      multipleTable: []
    }
  },
  methods: {
    deleteSelectInfo () {
      if (this.multipleTable.length === 0) {
        this.$alert('请勾选信息后再操作！', '注意', '确定')
        return
      }
      this.$confirm('是否删除选中的信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData = this.tableData.concat(this.multipleTable).filter(function (value, index, tempArr) {
          return tempArr.indexOf(value) === tempArr.lastIndexOf(value)
        })
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
    deleteHistoryInfo (index, row) {
      this.$confirm('是否删除该信息?', '提示', {
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
      this.multipleTable = val
    },
    searchInfo (formdate) {
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/get_store_info', this.formInline)
            .then(response => {
              console.log(response)
              // this.tableData = response.data.info
              // this.totalInfoNum = response.data.totalInfoNum
            })
            .catch(function (error) {
              console.log(error)
            })
          this.resetPage = 1
        } else {
          return false
        }
      })
    },
    MessageInfoBox (index, row) {
      this.dialogText = row.MessageInfo
      this.dialogVisible = true
    },
    handleCurrentPage (val) {
      this.getDate(val)
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          console.log(response)
          // this.tableData = response.data.info
          // this.totalInfoNum = response.data.totalInfoNum
          loading.close()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    getFirstInfo (pagenumber) {
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          console.log(response)
          // this.tableData = response.data.info
          // this.totalInfoNum = response.data.totalInfoNum
        })
        .catch(function (error) {
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
.el-table>>>button.el-button.el-button--text {
  padding-top: 0px;
  padding-bottom: 0px;
}
.el-table>>>.el-icon-message {
  font-size: 35px;
}
.el-table>>>.el-dialog__body {
  padding: 0px;
}
.el-table>>>.el-dialog__header {
  padding-top: 15px;
  text-align: left;
}
.el-table>>>p {
  text-align: left;
  margin-left: 15px;
  margin-right: 15px;
  font-size: 15px;
}
.el-table>>>.el-divider--horizontal {
  margin-top: 0px;
  margin-bottom: 0px;
  background-color: #3a4f80;
}
.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}
[class*=" el-icon-"], [class^=el-icon-]{
  font-weight: bold;
}
</style>
<style>
body{
  margin: 0px;
}
.el-form{
  padding: 10px 20px 10px 20px;
}
.el-table {
  margin: 0px auto;
  padding: 0px auto 20px auto;
}
.el-main{
  margin-top: 10px;
  padding-top: 0px;
}
/*.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}*/
/*.el-aside {
  background-color: rgb(238, 241, 246);
  text-align: center;
  line-height: 60px;
  height: 800px;
}*/
</style>
