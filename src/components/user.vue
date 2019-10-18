<template>
  <div class="user">
    <el-container>
      <el-header height="100px">
        <div class="title_head">
          <h1 style="margin-left: 20px;margin-top: 20px">后台管理系统</h1>
          <el-button class="loginOut" @click="loginOut">登出</el-button>
        </div>
      </el-header>

      <el-container>

        <el-aside width="200px"  ref="asideHeight">
          <el-menu  :default-active="defaultActive" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="/user/SearchInfo" @click="toSomeRouter('SearchInfo')">商户信息查询</el-menu-item>
            <el-menu-item index="/user/UserInfo" @click="toSomeRouter('UserInfo')">个人资料</el-menu-item>
            <!-- <el-menu-item index="/admin/Message" @click="toSomeRouter('Message')">短信群发管理</el-menu-item>
            <el-menu-item index="/admin/MessageHistory" @click="toSomeRouter('MessageHistory')">短信群发历史</el-menu-item> -->
            <!-- <el-submenu index="users">
              <template slot="title">
                  <span>用户</span>
              </template>
              <el-menu-item index="/admin/AllUsersInfo" @click="toSomeRouter('AllUsersInfo')">所有用户</el-menu-item>
              <el-menu-item index="/admin/AddUser" @click="toSomeRouter('AddUser')">添加用户</el-menu-item>
              <el-menu-item index="/admin/MyInfo" @click="toSomeRouter('MyInfo')">个人资料</el-menu-item>
            </el-submenu>
            <el-divider></el-divider> -->
            <!-- <el-menu-item index="/admin/UsersInfoAndOperation" @click="toUsersInfoAndOperation">用户</el-menu-item> -->
            <!-- <el-menu-item index="/admin/RecycleBin" @click="toSomeRouter('RecycleBin')">回收站</el-menu-item> -->
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'user',
  data () {
    return {
      bodyHeight: ''
    }
  },
  watch: {
    bodyHeight: function () {
      this.$refs.asideHeight.$el.style.height = this.bodyHeight - 100 + 'px'
    }
  },
  methods: {
    toSomeRouter (RouterPath) {
      if (this.$route.path !== '/user/' + RouterPath) {
        this.$router.push('/user/' + RouterPath)
      }
    },
    loginOut () {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.setItem('Authorization', null)
        localStorage.setItem('loginLevel', null)
        localStorage.setItem('Identity', null)
        this.$message({
          type: 'success',
          message: '退出登录!'
        })
        this.$router.push('/Login')
      }).catch(() => {})
    }
  },
  computed: {
    defaultActive () {
      return '/user/' + this.$route.path.split('/')[2]
    }
  },
  mounted () {
    this.bodyHeight = document.documentElement.clientHeight
    window.onresize = () => {
      this.bodyHeight = `${document.documentElement.clientHeight}`
    }
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  }
}
</script>
<style scoped>
.el-menu>>>.el-submenu__title i{
  color: #ffd04c;
}
.el-header {
  position: relative;
  background: repeating-linear-gradient(45deg, #333, rgb(84, 92, 100) 50px);
  color: #f5f7fa;
  line-height: 60px;
}
.el-menu-item.is-active {
  background-color: rgb(67, 74, 80)!important;
}
.el-menu {
  border-right: 0;
}
.el-menu-item {
  font-size: 16px;
}
span{
  font-size: 16px;
}
.el-divider--horizontal {
  margin-top: 0px;
  margin-bottom: 0px;
  background-color: #333;
}
h1{
  display: inline;
}
.el-button:focus, .el-button:hover{
  color:#DCDFE6;
  background-color: #767c88;
  border-color: rgb(80, 88, 95);
}
.el-header {
  width: 100%;
}
</style>
<style>
body{
  margin: 0px;
}
.title_head{
  margin-top:20px;
}
.loginOut{
  margin-top: 1%;
  float: right;
  background-color: rgb(80, 88, 95);
  color: #f5f7fa;
  border: 1px solid #363737;
}
.el-pagination{
  text-align: center;
}
.el-pager li{
  font-size: 16px;
}
.el-pagination .btn-next .el-icon, .el-pagination .btn-prev .el-icon{
  font-size: 16px;
}
.el-aside {
  background-color: #bebfc1;
  text-align: center;
  line-height: 60px;
}
.cell {
  text-align: center;
}
</style>
