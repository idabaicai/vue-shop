<template>
  <div>
    <!-- 面包导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
              :key="item1.id"
              v-for="(item1, index) in scope.row.children"
            >
              <!-- 一级权限 -->
              <el-col :span="4">
                <el-tag
                  closable
                  @close="rmRightById(scope.row, item1.id)"
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="20">
                <el-row
                  :class="[index === 0 ? '': 'bdtop', 'vcenter']"
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                  :span="24"
                >
                  <!-- 二级权限 -->
                  <el-col :span="4">
                    <el-tag
                      closable
                      @close="rmRightById(scope.row, item2.id)"
                      type="success">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="20">
                    <el-tag
                      closable
                      @close="rmRightById(scope.row,item3.id)"
                      type="info"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
              size="small"
              @click="setRightDialog(scope.$index, scope.row.id)"
            ><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button size="small" type="danger"><i class="el-icon-delete"></i> 删除</el-button>
            <el-button
              size="small"
              type="warning"
              ><i class="el-icon-setting"></i>
              分配角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="40%">
      <el-tree
        :data="allRights"
        :props="rightProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
        show-checkbox
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button
         type="primary"
         @click="setRight"
         >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rolesList: [],
      // 分配权限对话框
      rightDialogVisible: false,
      // 所有权限
      allRights: [],
      // 设置权限渲染时的props
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的key
      defKeys: [105],
      // 正在分配权限角色的id
      roleId: 0
    }
  },
  methods: {
    // 删除权限
    rmRightById (role, rightId) {
      this.$confirm('确认删除此权限吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(rightId)
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        console.log(res)
        role.children = res.data
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 获取权限列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
    },
    // 分配权限对话框
    async setRightDialog (idx, roleId) {
      // 设置当前角色id
      this.roleId = roleId
      // 重新获取权限
      this.getRolesList()
      // console.log(idx)
      this.getRightId(idx)
      // 获取所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status === 200) {
        this.allRights = res.data
        // console.log(res.data)
      } else {
        this.$message.error(res.meta.msg)
      }
      this.rightDialogVisible = true
    },
    // 分配权限
    async setRight () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids
      })
      if (res.meta.status === 200) {
        this.$message.success('分配成功')
        // 刷新权限
        this.getRolesList()
      } else {
        this.$message.error('分配失败，请重试')
      }
    },
    // 获取三级节点id 方法一
    getRightId (idx) {
      // 先清空
      this.defKeys = []
      // 获取三级节点id
      this.rolesList[idx].children.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            this.defKeys.push(item2.id)
          })
        })
      })
    },
    // 获取三级节点id 方法一
    getRightId2 (node, arr) {
      //  如果当前node不含children 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getRightId2(item, arr)
      })
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  .el-button {
    float: left;
    margin-bottom: 5px;
  }
  .el-tag {
    margin-top: 10px;
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
