<template>
  <div class="RecycleBin">
      <el-form :inline="true" :model="formTable">
        <el-form-item label="关键字">
          <el-input v-model="formTable.keyword" @keyup.enter.native="searchInfo" placeholder="商户地址或电话"></el-input>
        </el-form-item>
        <el-form-item label="时间范围" label-width="100px">
        <el-select v-model="formTable.timeFrame" placeholder="请选择">
          <el-option label="10天以内" value="10"></el-option>
          <el-option label="20天以内" value="20"></el-option>
          <el-option label="30天以内" value="30"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchInfo">查询</el-button>
      </el-form-item>
      </el-form>
      <el-button @click="deleteSelectInfo">
        <i class="el-icon-finished">批量删除</i>
      </el-button>
      <el-button @click="recoverySelectInfo">
        <i class="el-icon-finished">批量恢复</i>
      </el-button>
      <el-table ref="multipleTable" :data="tableInfo"  :height="tableHeight" stripe @selection-change="handleSelectionChange" v-loading="theFirstGet">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="account" label="账户" ></el-table-column>
        <el-table-column prop="company" label="公司" ></el-table-column>
        <el-table-column prop="companyBoss" label="公司负责人" ></el-table-column>
        <el-table-column prop="right" label="用户权限" ></el-table-column>
        <el-table-column prop="password" label="密码" ></el-table-column>
        <el-table-column prop="ip_addr" label="IP地址" ></el-table-column>
        <el-table-column label="操作" >
          <div slot-scope="scope">
            <el-button type="default" size="mini" @click="RecoveryInfo(scope.$index, scope.row)">恢复用户</el-button>
            <el-button type="danger" size="mini" @click="PermanentlyDelete(scope.$index, scope.row)">永久删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentPage"
          layout="prev, pager, next, jumper"
          :current-page.sync="resetPage"
          :page-size="20"
          :total="totalInfoNum">
        </el-pagination>
      </div>
  </div>
</template>
<script>
export default {
  name: 'RecycleBin',
  data () {
    return {
      tableHeight: document.documentElement.clientHeight - 286,
      totalInfoNum: 1,
      formTable: {
        keyword: '',
        timeFrame: ''
      },
      theFirstGet: true,
      resetPage: 1,
      tableInfo: [],
      multipleTable: [],
      allOutPutInfo: []
    }
  },
  created () {
    // 请求数据
    this.$store.commit('ResetSearchState')
    this.getFirstDate(1)
  },
  mounted () {
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 286
    }
  },
  methods: {
    RecoveryInfo (index, row) {
      this.$confirm('是否恢复该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/re_user', row)
          .then(response => {
            this.$message({
              type: 'success',
              message: '恢复成功!'
            })
            this.getDate(this.resetPage)
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '恢复失败'
            })
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    searchInfo () {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/search_re_user', this.formTable)
        .then(response => {
          console.log(response)
          this.tableInfo = response.data.re_user_info
          loading.close()
          this.resetPage = 1
          this.$store.commit('OpenSearchState')
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    getFirstDate (pagenumber) {
      this.$axios.post('/api/get_re_user', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableInfo = response.data.re_user_info
          this.totalInfoNum = response.data.totalInfoNum
          this.theFirstGet = false
        })
        .catch(error => {
          this.theFirstGet = false
          console.log(error)
        })
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_re_user', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableInfo = response.data.re_user_info
          setTimeout(() => {
            for (let i = 0; i < this.tableInfo.length; i++) {
              for (let j = 0; j < this.allOutPutInfo.length; j++) {
                if (this.tableInfo[i].account === this.allOutPutInfo[j].account) {
                  this.$refs.multipleTable.toggleRowSelection(this.tableInfo[i])
                }
              }
            }
          }, 100)
          this.totalInfoNum = response.data.totalInfoNum
          loading.close()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    PermanentlyDelete (index, row) {
      this.$confirm('是否彻底删除该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_re_user', row)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDate(this.resetPage)
            // 从总的标记数组中移除这个用户信息
            this.allOutPutInfo.splice(this.allOutPutInfo.indexOf(row), 1)
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
      this.multipleTable = val
      this.allOutPutInfo = this.multipleTable.concat(this.allOutPutInfo).filter((value, index, arr) => {
        return arr.map(value_ => JSON.stringify(value_)).indexOf(JSON.stringify(value)) === index
      })
    },
    deleteSelectInfo () {
      if (this.allOutPutInfo.length === 0) {
        this.$alert('请勾选信息后再操作！', '注意', '确定')
        return
      }
      this.$confirm('是否删除选中的用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_re_user', this.allOutPutInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 清空存放全部标记对象的数组
            this.allOutPutInfo = []
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
    recoverySelectInfo () {
      if (this.allOutPutInfo.length === 0) {
        this.$alert('请勾选信息后再操作！', '注意', '确定')
        return
      }
      this.$confirm('是否恢复选中的用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/re_user', this.allOutPutInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: '恢复成功!'
            })
            this.allOutPutInfo = []
            this.getDate(this.resetPage)
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '恢复失败'
            })
            console.log(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    handleCurrentPage (val) {
      this.getDate(val)
    }
  }
}
</script>
<style scoped>
.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}
[class*=" el-icon-"], [class^=el-icon-]{
  font-weight: bold;
}
.el-table{
  margin-bottom: 10px;
}
.el-form{
  padding: 10px 20px 10px 20px;
  height: 55px;
}
</style>
<style>
</style>
