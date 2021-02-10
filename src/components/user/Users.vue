<template>
    <div>
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
                    @click="addDialogVisible=true"
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
                <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
                <el-table-column  prop="role_name" label="角色" width="150"></el-table-column>
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
                            @click="showEditDialog(scope.row.id)" 
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
                                @click="deleteUser(scope.row.id)"
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
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            @close="addDialogClosed"
            :visible.sync="addDialogVisible"
            width="50%">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetFields('addFormRef')">重 置</el-button>
                <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%">
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetFields('editFormRef')">重 置</el-button>
                <el-button type="primary" @click="editUser('editFormRef')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        // 自定义验证规则
        // 验证手机号
        const checkMobile = (rule, value, callback) => {
            const regMobile = /^1[3|4|5|6|8][0-9]{9}$/
            if (regMobile.test(value)) {
                return callback()
            } else {
                callback(new Error('请输入合法手机号'))
            }
        }
        return {
            total: 0,
            userList: [],
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示数量
                pagesize: 4
            },
            // 控制对话框显示和隐藏
            addDialogVisible: false,
            // 添加用户表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            editDialogVisible: false,
            // 修改用户数据
            editForm: {
            },
           
            // 添加用户验证规则
            addRules: {
                username: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
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
        },
        // 关闭添加用户对话框时触发
        addDialogClosed () {
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser (addFormRef) {
            this.$refs[addFormRef].validate(async valid => {
                if (valid) {
                    // 验证通过 添加用户
                    const { data: res } = await this.$http.post('users', this.addForm)
                    // 添加成功
                    if (res.meta.status === 201) {
                        this.$message.success('添加成功！')
                        // 重新获取用户列表
                        this.getUserList()
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                } else {
                    this.$message.error('请正确填写表单')
                }
            })
        },
        // 显示编辑用户对话框
        async showEditDialog (id) {
            this.editDialogVisible = true
            // 查询用户信息
           const { data: res } = await this.$http.get('users/' + id)
            // 成功
            if (res.meta.status !== 200) {
                this.$message.error('获取用户信息失败')
            } else {
                this.editForm = res.data
            }
        },
        // 修改用户信息
        editUser (editFormRef) {
            this.$refs[editFormRef].validate( async valid => {
                if (valid) {
                    const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    })
                    if (res.meta.status === 200) {
                        this.$message.success('更新成功')
                        this.editDialogVisible = false
                        this.getUserList()
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                }
            } )
        },
        // 删除用户
        deleteUser (id) {
             this.$confirm('确认删除用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                        // 删除操作
                        const { data: res } = await this.$http.delete('users/' + id)
                        if (res.meta.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.editDialogVisible = false
                            this.getUserList()
                        } else {
                            this.$message({
                            type: 'error',
                            message: res.meta.message
                        }) 
                    }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })       
            })
        },
        // 重置用户表单
        resetFields (formRef) {
            this.$refs[formRef].resetFields()
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
table.el-table {
    text-align: center;
}
.el-pagination {
    margin-top: 10px;
}
</style>
