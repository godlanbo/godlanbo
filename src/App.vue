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
    if (window.innerWidth !== 1919 || window.innerHeight !== 903) {
      this.$alert('窗口大小可能会影响界面的变动，请适当调整浏览器窗口', '注意', '确定')
    }
    if (localStorage.getItem('Identity') === 'admin' && this.$route.path !== '/admin') {
      this.$router.push('/admin')
    } else if (localStorage.getItem('Identity') === 'user' && this.$route.path !== '/user') {
      this.$router.push('/user')
    }
    // window.innerWidth = 1920
    // window.innerHeight = 412
    // localStorage.setItem('Identity', 'admin')
  }
}

</script>
<style type="text/css">
body{
  margin: 0px;
  min-width: 1000px;
}
.app .el-main{
  margin-top: 10px;
  padding-top: 0px ;
  padding-bottom: 0px ;
}
</style>
