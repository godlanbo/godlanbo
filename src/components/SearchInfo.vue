<template>
  <div class="SearchInfo">
    <div v-if="$store.state.MainJudge">
      <el-form  :model="formInline" :rules="rules" ref="search" :inline="true" @submit.native.prevent hide-required-asterisk >
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formInline.keyword"  placeholder="相关信息" @keyup.enter.native="submitSearch('search')"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch('search')">查询</el-button>
        <el-button :disabled="$store.state.loginLevel !=='金牌用户'" @click="outputInfo">导出</el-button>
      </el-form-item>
    </el-form>

      <el-table
      ref="multipleTable"
      :data="tableData"
      :height="tableHeight"
      stripe
      @select-all='handleAllSelection'
      @select="handleSingleSelect">
        <el-table-column
          type="selection"
          width="55"
          v-if="$store.state.loginLevel ==='金牌用户'">
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
      tableHeight: document.documentElement.clientHeight - 266,
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
      tableData: [],
      allOutputInfo: []
    }
  },
  methods: {
    handleAllSelection (selection) {
      if (selection.length !== 0) {
        let set = new Set(this.allOutputInfo.concat(selection).map(value => JSON.stringify(value)))
        this.allOutputInfo = [...set].map(value => JSON.parse(value))
      } else {
        this.allOutputInfo = this.allOutputInfo.concat(this.tableData).filter((value, index, arr) => {
          let tempArr = arr.map(value_ => JSON.stringify(value_))
          let tempValue = JSON.stringify(value)
          return tempArr.indexOf(tempValue) === tempArr.lastIndexOf(tempValue)
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
    submitSearch (formdate) {
      // 提交数据到后端查询，接受返回数据
      this.$refs[formdate].validate((valid) => {
        if (valid) {
          let loading = this.$loading({target: document.querySelector('.el-table')})
          this.$axios.post('/api/search_store_info', this.formInline)
            .then(response => {
              if (!response.data.success) {
                this.$alert('查询次数已用完！', '注意', '确定').then(() => {}).catch(() => {})
                loading.close()
                return
              }
              this.tableData = response.data.info
              this.totalInfoNum = response.data.totalInfoNum
              loading.close()
              this.$store.commit('OpenSearchState')
              this.resetPage = 1
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '查询数据失败'
              })
              console.log(error)
              loading.close()
            })
        } else {
          return false
        }
      })
    },
    outputInfo () {
      if (this.allOutputInfo.length === 0) {
        this.$alert('请勾选商户后再导出！', '注意', '确定').then(() => {}).catch(() => {})
        return
      }
      if (this.allOutputInfo.length >= 20) {
        this.$alert('单次导出不超过20个！', '注意', '确定')
        return
      }
      this.$axios.post('/api/output_info', this.allOutputInfo)
        .then(response => {
          if (!response) {
            return
          }
          if (!response.data.success) {
            this.$alert('导出次数已用完！', '注意', '确定').then(() => {}).catch(() => {})
            return
          }
          this.allOutputInfo = []
          this.$refs.multipleTable.clearSelection()
          let url = window.URL.createObjectURL(new Blob([response.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'excel.csv')
          document.body.appendChild(link)
          link.click()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '导出失败!'
          })
          console.log(error)
        })
    },
    handleCurrentPage (val) {
      // 传递页数给后端，重新获取数据
      this.getDate(val)
    },
    getDate (pagenumber) {
      let loading = this.$loading({target: document.querySelector('.el-table')})
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.tableData = response.data.info
          setTimeout(() => {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.allOutputInfo.length; j++) {
                if (this.tableData[i].web_link === this.allOutputInfo[j].web_link) {
                  this.$refs.multipleTable.toggleRowSelection(this.tableData[i])
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
    getFirstInfo (pagenumber) {
      this.$axios.post('/api/get_store_info', {pageNumber: pagenumber, searchState: this.$store.state.searchState})
        .then(response => {
          this.theFirstGet = false
          this.tableData = response.data.info
          this.totalInfoNum = response.data.totalInfoNum
        })
        .catch(error => {
          this.theFirstGet = false
          console.log(error)
        })
    }
  },
  mounted () {
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 266
    }
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
  },
  created () {
    // getDate 在页面加载前获取数据
    this.$store.commit('InitializationLoginLevel', localStorage.getItem('loginLevel'))
    this.$store.commit('ResetSearchState')
    // this.getFirstInfo(1)
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
