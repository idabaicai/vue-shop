<template>
    <div>
        <!-- 面包导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索区域 -->
        <el-row :gutter="10">
            <el-col :span="12">
                <el-input placeholder="请输入内容" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button 
                @click="get"
                type="primary">添加</el-button>
            </el-col>
        </el-row>
        <!-- 用户表格 -->
        <el-table
            :data="userList"
            style="width: 100%;">
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="角色"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop=""
                label="操作">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data () {
        return {
            total: 0,
            userList: [],
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            }
        }
    },
    created () {
        this.getUserList()
    },
    mounted () {
        console.log(this.userList)
    },
    methods: {
        async getUserList () {
            const { data: res } = await this.$http.get('users', { 
                params: this.queryInfo
            })
            if (res.meta.status === 200) {
                this.total = res.data.total
                this.userList = res.data.users
            } else {
                return this.$message.error(res.meta.msg)
            }
        },
        get () {
            console.log(this.userList)
        }
    }
}
</script>
<style lang="less" scoped>
.el-col {
    height: 60px;
    line-height: 60px;
}
.el-table-column {
    height: 40px;
    line-height: 40px !important;
    text-align: center;
}
.el-table {
    text-align: center;
}
table.el-table__header thead tr th {
    line-height: 30px;
}
</style>
