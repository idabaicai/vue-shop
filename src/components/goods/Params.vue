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
      <!-- 提示信息 -->
      <el-alert
        title="注意：只允许修改第三级参数!"
        type="warning"
        show-icon
      ></el-alert>
      <el-row class="header">
        <span>请选择商品分类： </span>
        <!-- 选择商品级联选择框 -->
        <el-cascader
          v-model="options"
          :options="paramsList"
          :props="paramProps"
          @change="getVal"
          clearable
        ></el-cascader>
      </el-row>
      <!-- tab 选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="addDisabled">添加参数</el-button>
        </el-tab-pane>
        <!-- 动态参数表格 -->
        <el-table
          :data="paramsData"
          border
          strip
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
            label="参数列表"
            prop="attr_name"
          ></el-table-column>
          <el-table-column
            label="操作"
            prop="attr_id"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="primary"><i class="el-icon-edit"></i>  编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-tab-pane  label="静态属性" name="only">
          <el-button type="primary" :disabled="addDisabled">添加属性</el-button>
          <pre>{{ paramsData }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 参数列表
      paramsList: [],
      value: [],
      // 级联选择器 prop
      paramProps: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' },
      // 用户选择结果
      options: [1, 3, 6],
      // tab 选项卡 name 默认选中dynamic
      activeName: 'many',
      // 参数数据
      paramsData: []
    }
  },
  created () {
    // 获取参数列表
    this.getParamsList()
    // 获取参数数据
    this.getParamsData()
  },
  methods: {
    // 获取参数列表
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status === 200) {
        this.paramsList = res.data
        // console.log(res.data)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 获取参数数据
    async getParamsData () {
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status === 200) {
        console.log(res)
        this.paramsData = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 选中参数后
    getVal (val) {
      this.options = val
      console.log(val)
      this.getParamsData(this.catId, this.activeName)
    },
    // 切换选项卡
    async handleClick () {
      this.getParamsData(this.catId, this.activeName)
    }
  },
  computed: {
    // 添加分类的按钮是否禁用
    addDisabled () {
      // 当options的长度不等于3时禁用
      return this.options.length !== 3
    },
    // 当前选中的三级分类
    catId () {
      return this.options[2]
    }
  }
}
</script>
<style lang="less">
.el-cascader {
  width: 350px;
}
.el-card .el-alert {
  margin-bottom: 16px;
}
.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-tab-pane {
  text-align: left;
  margin-bottom: 10px;
}
</style>
