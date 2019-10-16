<template>
  <div class="app">
  <router-view/>
  </div>
</template>

<script>
// 导入组件
// import admin from './components/admin'
// import Message from './components/Message'
// import MessageHistory from './components/MessageHistory'
// import InformationManagement from './components/InformationManagement'
// import EditInformation from './components/EditInformation'
export default {
  name: 'app',
  created () {
    let temp = localStorage.getItem('loginLevel')
    if (temp === 'null' || temp === undefined) {
      if (this.$route.path !== '/Login') {
        this.$router.push('/Login')
      }
    }
  }
  // components: {
  //   admin, Message, MessageHistory, InformationManagement, EditInformation
  // }
}

</script>
<style type="text/css">
body{
  margin: 0px;
}
/*.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}
.el-aside {
  background-color: rgb(238, 241, 246);
  text-align: center;
  line-height: 60px;
  height: 800px;
}*/
</style>
