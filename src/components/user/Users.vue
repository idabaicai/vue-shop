<template>
    <el-card class="box-card card">
    <!-- 面包导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row :gutter="10">
        <el-col :span="12">
            <el-input
                clearable
                @clear="clear" 
                placeholder="请输入内容" 
                class="input-with-select" 
                v-model="queryInfo.query">
                <el-button 
                slot="append" 
                icon="el-icon-search"
                @click="getUserList"
                ></el-button>
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
        border
        :data="userList"
        style="width: 100%;">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column  prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column
            prop="mg_state"
            width="80"
            label="状态">
                <template slot-scope="scope">
                <el-switch 
                v-model="scope.row.mg_state" 
                @change="userStateChage(scope.row)">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-tooltip class="item"
                    effect="dark" 
                    content="编辑"
                    :enterable="false" 
                    placement="top">
                    <el-button
                    size="mini" 
                    type="primary"
                    @click="editHandle(scope.$index)" 
                    icon="el-icon-edit" circle
                    ></el-button>
                </el-tooltip>
                <!-- 权限 -->
                <el-tooltip class="item"
                    :enterable="false"
                    effect="dark" 
                    content="权限" 
                    placement="top">
                    <el-button
                    size="mini" 
                    type="info" 
                    icon="el-icon-s-tools" 
                    circle></el-button>
                </el-tooltip>
                <el-tooltip class="item"
                effect="dark" 
                content="删除"
                :enterable="false" 
                placement="top">
                    <el-button
                        size="mini" 
                        type="danger" 
                        icon="el-icon-delete" 
                        circle></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
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
                // 当前页数
                pagenum: 1,
                // 当前每页显示数量
                pagesize: 2
            }
        }
    },
    created () {
        this.getUserList()
    },
    mounted () {
        // console.log(this.userList)
    },
    methods: {
        // 获取用户信息
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
            // console.log(this.total)
            console.log(this.userList)
        },
        handleEdit (index, row) {
            console.log(index)
            console.log(row)
        },
        // 清空搜索框
        clear () {
            this.getUserList()
        },
        // 监听pagesize改变的时间
        handleSizeChange (newSize) {
            // 修改查询参数
            this.queryInfo.pagesize = newSize
            // 重新发起请求
            this.getUserList()
        },
        // 当前页
        handleCurrentChange (newPage) {
            // 修改当前页
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 改变用户状态
        async userStateChage (userInfo) {
            // 修改用户状态
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status === 200) {
                this.$message.success('成功')
            } else {
                return this.$message.error(res.meta.meg)
            }
        }

    }
}
</script>
<style lang="less" scoped>
.el-card.box-card.card {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, .18);
}
.el-row {
    margin: 10px 0;
}
.el-pagination {
    margin-top: 10px;
}
</style>
