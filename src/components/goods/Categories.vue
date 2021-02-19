<template>
  <div>
    <!-- 面包导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" class="addItem" @click="addItem">添加分类</el-button>
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
        show-index
        index-text="#"
        :selection-type="false"
        border
        :data="list"
        :expand-type="false"
        :columns="columns"
      >
      <!-- 是否有效 -->
      <template slot="deleted" slot-scope="scope">
        <!-- 没有删除则是有效的 -->
        <i v-if="scope.row.cat_deleted" class="el-icon-error"></i>
        <i v-else class="el-icon-success"></i>
      </template>
      <!-- 排序 -->
      <template slot="level" slot-scope="scope">
        <el-tag type="" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="info" v-else>三级</el-tag>
      </template>
      <!-- 排序 -->
      <template slot="handle" slot-scope="scope">
        <el-button type="primary" @click="edit(scope)" size="small"><i class="el-icon-edit"></i> 编辑</el-button>
        <el-button type="danger" @click="delCat(scope)" size="small"><i class="el-icon-delete"></i> 删除</el-button>
      </template>
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
    <!-- 添加分类对话框 -->
  <el-dialog
   title="添加分类"
   width="50%"
   @close="closeDialog"
   :visible.sync="addItemDialogVisiable">
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="分类名称" prop="cat_name" label-width="100px">
        <el-input v-model="form.cat_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" label-width="100px">
        <el-cascader
          clearable
          expand-trigger="hover"
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="parentCateChanged"
        >
        </el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addItemDialogVisiable = false">取 消</el-button>
      <el-button type="primary" @click="addCat">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 添加分类对话框
      addItemDialogVisiable: false,
      // 添加分类数据
      form: {
        // 分类名称
        cat_name: '',
        // 分类父id 0:1级分类
        cat_pid: 0,
        // 分类层级 0 一级分类 1 二级分类 2 三级分类
        cat_level: 0
      },
      // 父级分类数据
      parentCateList: [],
      // 添加分类验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 级联选择器配置项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择的数组
      selectedKeys: [],
      // 总数
      total: 0,
      // 商品分类数据
      list: [],
      queryInfo: {
        // 每页显示多少条数据
        pagesize: 6,
        // 当前页码值
        pagenum: 1
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'deleted'
        }, {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level'
        }, {
          label: '操作',
          prop: 'cat_id',
          type: 'template',
          template: 'handle'
        }
      ]
    }
  },
  methods: {
    // 添加分类
    addItem () {
      // 获取父级分类列表
      this.getParentCateList()
      this.addItemDialogVisiable = true
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status === 200) {
        console.log(res.data)
        this.parentCateList = res.data
      } else {
        this.$message.error('获取父级分类失败')
      }
    },
    // 父级分类选择器发生改变
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 选中父级分类
      const len = this.selectedKeys.length
      if (len > 0) {
        this.form.cat_pid = this.selectedKeys[len - 1]
        this.form.cat_level = len
      } else {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      }
    },
    // 添加分类
    addCat () {
      this.$refs.formRef.validate(async valid => {
        // 验证通过
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.form)
          // console.log(this.form)
          // console.log(res)
          if (res.meta.status === 201) {
            this.$message.success('添加成功')
            // 重新获取数据
            this.getCateList()
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('请正确填写表单')
        }
      })
    },
    // 添加分类对话框关闭
    closeDialog () {
      // 重置表单
      this.$refs.formRef.resetFields()
      this.selectedKeys = []
      this.form.cat_id = 0
      this.form.cat_level = 0
    },
    // 每页显示条数
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 关闭添加分类对话框
    close () {
      // this.$refs[formRef].resetFields();
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
  margin-left: -900px;
  margin-bottom: 8px;
}
.el-cascader {
  width: 100%;
}
</style>
