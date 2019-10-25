<template>
  <div class="SearchInfo">
    <div v-if="$store.state.MainJudge">
      <el-form  :model="formInline" :rules="rules" ref="search" :inline="true" hide-required-asterisk>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formInline.keyword" placeholder="相关信息"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch('search')">查询</el-button>
        <el-button :disabled="$store.state.loginLevel !=='jinpai'" @click="outputInfo">导出</el-button>
      </el-form-item>
    </el-form>

      <el-table  ref="multipleTable" :data="tableData"  height="610" stripe v-loading="theFirstGet">
        <el-table-column
          type="selection"
          width="55"
          v-if="$store.state.loginLevel !=='jinpai'">
        </el-table-column>
        <el-table-column prop="store_name" label="商户名称" >
        </el-table-column>
        <el-table-column prop="store_address" label="地址" >
        </el-table-column>
        <el-table-column prop="phone_number" label="电话">
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
  </div>
</template>

<script>
export default {
  name: 'SearchInfo',
  data () {
    return {
      tableDateRowIndex: 0,
      resetPage: 1,
      totalInfoNum: 1,
      formInline: {
        keyword: '',
        infofrom: '',
        path: '',
        date1: '',
        date2: ''
      },
      theFirstGet: true,
      rules: {
        keyword: [{required: true, message: '不能为空', trigger: 'blur'}]
      },
      tableData: []
    }
  },
  methods: {
    submitSearch (formdate) {
      // 提交数据到后端查询，接受返回数据
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          let loading = this.$loading({target: document.querySelector('.el-table')})
          this.$axios.post('/api/search_store_info', this.formInline)
            .then(response => {
              this.tableData = response.data.info
              loading.close()
              this.$store.commit('OpenSearchState')
              this.resetPage = 1
            })
            .catch(function (error) {
              console.log(error)
              loading.close()
            })
        } else {
          return false
        }
      })
    },
    outputInfo () {
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
    handleCurrentPage (val) {
      // 传递给后端，重新获取数据
      this.getDate(val)
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/search_store_info', this.formInline)
        .then(response => {
          this.tableData = response.data.info
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
          this.theFirstGet = false
          this.tableData = response.data.info
          this.totalInfoNum = response.data.totalInfoNum
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
    this.getFirstInfo(1)
  }
}
</script>
<style scoped>
.el-header {
  background-color:  #808080;
  color: #333;
  line-height: 60px;
}
.SearchInfo>>>.el-table {
  margin-bottom: 30px;
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

</style>
