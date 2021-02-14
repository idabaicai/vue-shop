<template>
    <el-container class="container">
      <!-- 头部 -->
      <el-header>
        <h3>打工人电商管理系统</h3>
        <el-button type="info" @click="logout" class="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="collapse ? '64px' : '200px'">
          <!-- 折叠按钮 -->
          <div
          class="toggle-button"
          @click="toggle"
          >|||</div>
          <el-menu
            :unique-opened="true"
            :collapse-transition="false"
            :collapse="collapse"
            :default-active="activePath"
            :router="true"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <!-- 一级菜单 -->
            <el-submenu
            :index="index.toString()"
            v-for="(item, index) in menus"
            :key="item.id"
            ><template slot="title">
                <i :class="icons[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 index:开启路由后跳转的链接 -->
                <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="currentPath('/'+subItem.path)"
                ><i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <!-- 主题 -->
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <!-- 底部 -->
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menus: [],
      // 一级菜单图标
      icons: [
        'el-icon-user',
        'el-icon-s-check',
        'el-icon-shopping-cart-1',
        'el-icon-money',
        'el-icon-pie-chart'
      ],
      // 菜单是否折叠
      collapse: false,
      // 当前选中的菜单
      activePath: ''
    }
  },
  mounted () {
  },
  updated () {
  },
  created () {
    // 获取菜单
    this.getMenuList()
  },
  methods: {
    // 退出
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求菜单数据   async简化Promise操作
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menus = res.data
      } else {
        return this.$message.error(res.meta.msg)
      }
    },
    // 折叠菜单
    toggle () {
      this.collapse = !this.collapse
    },
    // 当前激活的路由
    currentPath (path) {
      this.activePath = path
    }
  }
}
</script>
<style lang="less" scoped>
  .el-header, .el-footer {
    background-color: #303133;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-header h3 {
    color: #fff;
  }
  .el-menu {
    border: none;
  }
  main.el-main {
    line-height: 30px;
  }
  .el-footer{
    background-color: #606266;
  }
    .el-aside {
      .toggle-button {
        color: #fff;
        background-color: #495066;
        height: 50px;
        line-height: 50px;
        letter-spacing: 2px;
        cursor: pointer;
      }
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
    .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .container {
    height: 100%;
  }
  .el-submenu i{
    margin-right: 10px;
  }
</style>
