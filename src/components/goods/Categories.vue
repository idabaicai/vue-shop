<template>
  <div>
    <!-- 面包导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" class="addItem">添加分类</el-button>
      <!-- <el-table
        :data="list"
        border
      >
        <el-table-column
          label="#"
          type="index"
        >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="cat_name"
        ></el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <i class="el-icon-close" v-if="scope.row.cat_deleted"></i>
            <i class="el-icon-check" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
        >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        </template>
        </el-table-column>
        <el-table-column
         label="操作"
        >
          <template>
            <el-button type="primary" size="small">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button type="danger" size="small">
            <i class="el-icon-delete"></i>  删除
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <tree-table
        :data="list"
        :columns="columns"
      >
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 10, 14]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total = "total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 总数
      total: 0,
      // 商品分类数据
      list: [],
      queryInfo: {
        // 每页显示多少条数据
        pagesize: 6,
        // 当前页码值
        pagenum: 1
      }
    }
  },
  methods: {
    // 每页显示条数
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.list = res.data.result
        console.log(res.data.result)
        this.total = res.data.total
      } else {
        this.$message.error('获取商品分类失败')
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.addItem {
  margin-left: -800px;
  margin-bottom: 8px;
}
</style>
