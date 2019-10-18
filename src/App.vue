<template>
  <div class="app">
  <router-view/>
  </div>
</template>

<script>
// 导入组件
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
.el-main{
  margin-top: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
