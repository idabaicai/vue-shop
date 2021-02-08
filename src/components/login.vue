<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像 -->
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单 -->
            <el-form
            ref="formRef"
            label-width="0"
            class="login-form"
            :model="form"
            :rules="rules"
            ><el-form-item class="login-item" prop="username">
                <!-- 用户名 -->
                    <el-input
                    v-model="form.username"
                    placeholder="请输入用户名"
                    class="login-input"
                    prefix-icon="el-icon-user-solid"
                    ></el-input>
            </el-form-item>
                <!-- 密码 -->
            <el-form-item class="login-item" prop="password">
                    <el-input
                    placeholder="请输入密码"
                    type="password"
                    class="login-input"
                    prefix-icon="el-icon-key"
                    v-model="form.password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="login">
                    <el-button
                    type="primary"
                    @click="submit('formRef')"
                    >登录</el-button>
                    <el-button
                    @click="reset('formRef')"
                    type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '用户名长度为3到5位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6到15位密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit (formRef) {
      this.$refs[formRef].validate(async valid => {
        if (valid) {
        //   alert('submit!')
          const { data: res } = await this.$http.post('login', this.form)
          if (res.meta.status !== 200) {
            this.$message({
              message: res.meta.msg,
              type: 'error'
            })
          } else {
            //   登录成功
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
            // console.log(res)
            const token = res.data.token
            // 1. 保存token到sessionStorage中
            window.sessionStorage.setItem('token', token)
            // 2. 导航到/home
            this.$router.push('/home')
          }
        } else {
          console.log('error submit')
        }
      })
    },
    reset (formRef) {
    //   console.log(this)
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
    height: 100%;
    background-color: #409EFF;
}
.login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 20px;
    transform: translate(-50%,-50%);
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-radius: 20px;
}
.avatar-box {
    position: absolute;
    left: 50%;
    top: -50px;
    transform: translateX(-50%);
    height: 130px;
    width: 130px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
    }
}
.login {
    float: right;
    margin-right: 20px;
}
.login-form {
    margin-top: 110px;
    .login-input {
        margin-top: 20px;
    }

}
</style>
