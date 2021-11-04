<template>
  <div class="login-container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="@/assets/head.gif" alt="" />
      </div>
      <el-form
        :model="loginFrom"
        :rules="loginFromRules"
        ref="loginFromRef"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginFrom.username"
            placeholder="Username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            type="password"
            placeholder="Password"
            prefix-icon="iconfont icon-3702mima"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
            :loading="loadingbut"
            :disabled="isDisabled"
            >登录</el-button
          >
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/network/login'
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据绑定对象
      loginFrom: {
        username: '',
        password: '',
      },
      loadingbut: false,
      loadingbuttext: '登录',
      isDisabled: false,
      // 表单的验证规则
      loginFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //点击重置
    resetLoginFrom() {
      this.$refs.loginFromRef.resetFields()
      this.btninitialization()
    },
    btninitialization() {
      this.loadingbut = false
      this.loadingbuttext = '登录'
      this.isDisabled = false
    },
    login() {
      this.loadingbut = true
      this.isDisabled = true
      this.loadingbuttext = '登录中...'
      this.$refs.loginFromRef.validate(async (valid) => {
        if (!valid) {
          this.btninitialization()
          return
        }
        const result = await getLogin(
          this.loginFrom.username,
          this.loginFrom.password
        )
        if (result.meta.status != 200) {
          this.btninitialization()
          return this.$message.error(result.meta.msg)
        }

        this.$message.success('登录成功！')
        this.btninitialization()
        // 登录成功后将获得的token保存到客户端的sessionStorage中
        window.sessionStorage.setItem('token', result.data.token)
        // 登录成功后跳转到后台首页
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  background-color: #283443;
  height: 100%;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
