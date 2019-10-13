<template>
  <div class="AllUsersInfo">
   <div v-show="AllUsersInfo">
    <span>用户信息</span>
    <el-divider></el-divider>
    <el-menu mode="horizontal" :default-active="index" @select="handleSelect">
      <el-menu-item index="1">全部</el-menu-item>
      <el-menu-item index="2">普通用户</el-menu-item>
      <el-menu-item index="3">铜牌用户</el-menu-item>
      <el-menu-item index="4">银牌用户</el-menu-item>
      <el-menu-item index="5">金牌用户</el-menu-item>
      <el-menu-item index="6" v-if="$store.state.loginLevel == 'superRoot'">管理员</el-menu-item>
    </el-menu>
    <el-button @click="deleteSelectInfo">
      <i class="el-icon-finished">批量删除</i>
    </el-button>
    <el-dropdown split-button trigger="click" @command="handleCommand">
      <span>
        <i class="el-icon-finished">变更用户权限</i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">普通用户</el-dropdown-item>
        <el-dropdown-item command="b">铜牌用户</el-dropdown-item>
        <el-dropdown-item command="c">银牌用户</el-dropdown-item>
        <el-dropdown-item command="d">金牌用户</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input v-model="searchKeyWord" placeholder="用户相关信息"></el-input>
    <el-button type="primary" @click="searchInfo">查询</el-button>
    <el-table ref="multipleTable" :data="usersDate"  height="580" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="company" label="公司"></el-table-column>
      <el-table-column prop="telnum" label="公司电话"></el-table-column>
      <el-table-column prop="companyBoss" label="公司负责人"></el-table-column>
      <el-table-column prop="right" label="用户等级"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="ip" label="IP地址"></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            :disabled="scope.row.right === '管理员'||$store.state.loginLevel !== 'superRoot'">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :disabled="scope.row.right === '管理员'||$store.state.loginLevel !== 'superRoot'">删除</el-button>
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
     <EditUserInfo @save_edit="updateInfo" @cancel="switchPage" :date="usersDate[usersDateRowIndex]" :id="usersDateRowIndex"></EditUserInfo>
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
      AllUsersInfo: true,
      EditUserInfo: false,
      usersDateRowIndex: 0,
      totalInfoNum: 1,
      index: '',
      resetPage: 1,
      usersDate: [],
      multipleTable: [],
      searchKeyWord: ''
    }
  },
  created () {
    this.index = '1'
  },
  watch: {
    index: function (val) {
      this.resetPage = 1
      switch (this.index) {
        case '1':
          this.getDate(1)
          break
        case '2':
          this.getDate(1)
          break
      }
    }
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
          loading.close()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    searchInfo () {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_user_info', {searchKeyWord: this.searchKeyWord})
        .then(response => {
          this.usersDate = response.data.user_info
          loading.close()
        })
        .catch(function (error) {
          console.log(error)
          loading.close()
        })
    },
    updateInfo (obj, index) {
      this.AllUsersInfo = !this.AllUsersInfo
      this.EditUserInfo = !this.EditUserInfo
      this.usersDate[index] = obj
    },
    deleteSelectInfo () {
      if (this.multipleTable.length === 0) {
        this.$alert('请勾选用户后再操作！', '注意', '确定')
        return
      }
      this.$confirm('是否删除选中的用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.usersDate = this.usersDate.concat(this.multipleTable).filter(function (value, index, tempArr) {
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
    handleCommand (command) {
      if (this.multipleTable.length === 0) {
        this.$alert('请勾选用户后再操作！', '注意', '确定')
      } else {
        this.$confirm('是否变更选中用户权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (command) {
            case 'a':
              this.multipleTable.map(i => { i.right = '普通用户' })
              break
            case 'b':
              this.multipleTable.map(i => { i.right = '铜牌用户' })
              break
            case 'c':
              this.multipleTable.map(i => { i.right = '银牌用户' })
              break
            case 'd':
              this.multipleTable.map(i => { i.right = '金牌用户' })
              break
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消变更'
          })
        })
      }
    },
    handleSelectionChange (val) {
      this.multipleTable = val
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
            this.usersDate.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(function (error) {
            console.log(error)
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
</style>
<style>
.el-button-group>.el-button:first-child {
  padding-right: 10px;
}
</style>
