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
    // document.body.removeChild(document.getElementById('loader-wrapper'))
    document.getElementById('loader-wrapper').style.display = 'none'
    let temp = localStorage.getItem('loginLevel')
    if (temp === 'null' || temp === undefined) {
      if (this.$route.path !== '/Login') {
        this.$router.push('/Login')
      }
    }
    if (localStorage.getItem('Identity') === 'admin' && this.$route.path !== '/admin') {
      this.$router.push('/admin')
    } else if (localStorage.getItem('Identity') === 'user' && this.$route.path !== '/user') {
      this.$router.push('/user')
    }
  }
}

</script>
<style type="text/css">
body{
  margin: 0px;
  min-width: 1150px;
}
.app .el-main{
  margin-top: 10px;
  padding-top: 0px ;
  padding-bottom: 0px ;
}
</style>
