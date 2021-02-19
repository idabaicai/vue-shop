<template>
  <div>
    <!-- 面包导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div class="chose">
        <label>请选择商品分类： </label>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in paramsList"
            :key="item.cat_id"
            :label="item.cat_name"
            :value="item.cat_id">
          </el-option>
        </el-select>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 参数列表
      paramsList: [],
      value: []
    }
  },
  created () {
    this.getParamsList()
  },
  methods: {
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status === 200) {
        this.paramsList = res.data
        console.log(res.data)
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>
<style lang="less">
.chose {
  margin-left: -700px;
}
</style>
