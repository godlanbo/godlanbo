<template>
  <div class="AllUsersInfo">
   <div v-show="AllUsersInfo">
    <span>用户信息</span>
    <el-divider></el-divider>
    <el-menu mode="horizontal" :default-active="index" @select="handleSelect">
      <el-menu-item index="0">全部</el-menu-item>
      <el-menu-item index="1">普通用户</el-menu-item>
      <el-menu-item index="2">铜牌用户</el-menu-item>
      <el-menu-item index="3">银牌用户</el-menu-item>
      <el-menu-item index="4">金牌用户</el-menu-item>
      <el-menu-item index="5">管理员</el-menu-item>
    </el-menu>
    <el-button @click="deleteSelectInfo">
      <i class="el-icon-finished">批量删除</i>
    </el-button>
    <el-dropdown split-button trigger="click" @command="handleCommand">
      <span>
        <i class="el-icon-finished">变更用户权限</i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="1">普通用户</el-dropdown-item>
        <el-dropdown-item command="2">铜牌用户</el-dropdown-item>
        <el-dropdown-item command="3">银牌用户</el-dropdown-item>
        <el-dropdown-item command="4">金牌用户</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input v-model="searchKeyWord" @keyup.enter.native="searchInfo" placeholder="用户相关信息"></el-input>
    <el-button type="primary" @click="searchInfo">查询</el-button>
    <el-table
      ref="multipleTable"
      :data="usersDate"
      :height="tableHeight"
      @select-all="handleAllSelection"
      @select="handleSingleSelect"
      stripe
      v-loading="theFirstGet">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="company" label="公司"></el-table-column>
      <el-table-column prop="telnum" label="公司电话"></el-table-column>
      <el-table-column prop="companyBoss" label="公司负责人"></el-table-column>
      <el-table-column prop="right" label="用户等级"></el-table-column>
      <el-table-column prop="ip_addr" label="IP地址"></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            :disabled="scope.row.right === '管理员'&&$store.state.loginLevel !== 'superRoot'">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.right === '管理员'&&$store.state.loginLevel !== 'superRoot'">删除</el-button>
        </template>
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
   <div v-if="EditUserInfo">
     <EditUserInfo @save_edit="updateInfo" @cancel="switchPage" :date="usersDate[usersDateRowIndex]"></EditUserInfo>
   </div>
  </div>
</template>
<script>
import EditUserInfo from './EditUserInfo.vue'
export default {
  name: 'AllUsersInfo',
  components: {
    EditUserInfo
  },
  data () {
    return {
      tableHeight: document.documentElement.clientHeight - 316,
      AllUsersInfo: true,
      EditUserInfo: false,
      usersDateRowIndex: 0,
      totalInfoNum: 1,
      index: '0',
      resetPage: 1,
      usersDate: [],
      allOutputInfo: [],
      searchKeyWord: '',
      theFirstGet: true
    }
  },
  created () {
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
    this.$store.commit('ResetSearchState')
    this.getFirstInfo(1)
  },
  watch: {
    index: function (val) {
      this.searchInfo()
    }
  },
  mounted () {
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 316
    }
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  },
  methods: {
    switchPage () {
      this.AllUsersInfo = !this.AllUsersInfo
      this.EditUserInfo = !this.EditUserInfo
    },
    handleCurrentPage (val) {
      this.getDate(val)
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_user_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.usersDate = response.data.user_info
          setTimeout(() => {
            for (let i = 0; i < this.usersDate.length; i++) {
              for (let j = 0; j < this.allOutputInfo.length; j++) {
                if (this.usersDate[i].account === this.allOutputInfo[j].account) {
                  this.$refs.multipleTable.toggleRowSelection(this.usersDate[i])
                }
              }
            }
          }, 100)
          this.totalInfoNum = response.data.totalInfoNum
          loading.close()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '拉取用户信息失败'
          })
          console.log(error)
          loading.close()
        })
    },
    getFirstInfo (pagenumber) {
      this.$axios.post('/api/get_user_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.usersDate = response.data.user_info
          this.totalInfoNum = response.data.totalInfoNum
          this.theFirstGet = false
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '拉取用户信息失败'
          })
          this.theFirstGet = false
          console.log(error)
        })
    },
    searchInfo () {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/search_user', {keyword: this.searchKeyWord, group: this.index})
        .then(response => {
          this.usersDate = response.data.user_info
          this.$store.commit('OpenSearchState')
          this.totalInfoNum = response.data.totalInfoNum
          this.allOutputInfo = []
          loading.close()
          this.resetPage = 1
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '搜索数据失败'
          })
          console.log(error)
          loading.close()
        })
    },
    updateInfo () {
      this.AllUsersInfo = !this.AllUsersInfo
      this.EditUserInfo = !this.EditUserInfo
      this.getDate(this.resetPage)
    },
    deleteSelectInfo () {
      if (this.allOutputInfo.length === 0) {
        this.$alert('请勾选用户后再操作！', '注意', '确定')
        return
      }
      this.$confirm('是否删除选中的用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_user', this.allOutputInfo)
          .then(response => {
            // 判断是否除条数大于每页最大显示数 是 获取第一页数据，并定向到第一页
            if (this.allOutputInfo.length >= 20) {
              this.resetPage = 1
            }
            this.allOutputInfo = []
            this.getDate(this.resetPage)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCommand (command) {
      if (this.allOutputInfo.length === 0) {
        this.$alert('请勾选用户后再操作！', '注意', '确定')
      } else {
        this.$confirm('是否变更选中用户权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/modify_right', {toRight: command, allUser: this.allOutputInfo})
            .then(response => {
              this.allOutputInfo = []
              this.getDate(this.resetPage)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
            .catch(error => {
              console.log(error)
              this.$message({
                type: 'info',
                message: '变更失败'
              })
            })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '已取消变更'
          })
        })
      }
    },
    handleSingleSelect (selection, row) {
      let theRowIndexInAllInfo = this.allOutputInfo.map(value => JSON.stringify(value)).indexOf(JSON.stringify(row))
      if (theRowIndexInAllInfo === -1) {
        this.allOutputInfo = this.allOutputInfo.concat(row)
      } else {
        this.allOutputInfo.splice(theRowIndexInAllInfo, 1)
      }
    },
    handleAllSelection (selection) {
      if (selection.length !== 0) {
        let set = new Set(this.allOutputInfo.concat(selection).map(value => JSON.stringify(value)))
        this.allOutputInfo = [...set].map(value => JSON.parse(value))
      } else {
        this.allOutputInfo = this.allOutputInfo.concat(this.usersDate).filter((value, index, arr) => {
          let tempArr = arr.map(value_ => JSON.stringify(value_))
          let tempValue = JSON.stringify(value)
          return tempArr.indexOf(tempValue) === tempArr.lastIndexOf(tempValue)
        })
      }
    },
    handleEdit (index, row) {
      this.AllUsersInfo = !this.AllUsersInfo
      this.EditUserInfo = !this.EditUserInfo
      this.usersDateRowIndex = index
    },
    handleDelete (index, row) {
      this.$confirm('是否删除该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/del_user', row)
          .then(response => {
            let theRowIndexInAllInfo = this.allOutputInfo.map(value => JSON.stringify(value)).indexOf(JSON.stringify(row))
            if (theRowIndexInAllInfo !== -1) {
              this.allOutputInfo.splice(theRowIndexInAllInfo, 1)
            }
            this.getDate(this.resetPage)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(error => {
            console.log(error)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelect (index, indexpath) {
      this.index = index
    }
  }
}
</script>
<style scoped>
el-header {
  color: #333!important;
  line-height: 60px!important;
}
.el-divider{
  margin: 12px auto 0px auto;
  background-color: #3a4f80;
}
[class*=" el-icon-"], [class^=el-icon-]{
  font-weight: bold;
}
.el-menu--horizontal {
  margin-bottom: 15px;
}
.el-input{
  width: 15%;
}
.el-table{
  margin-bottom: 10px;
}
</style>
<style>
.el-button-group>.el-button:first-child {
  padding-right: 10px;
}
</style>
