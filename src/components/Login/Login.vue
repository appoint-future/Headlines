<template>
  <div class="login-container">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="黑马头条 - 登录" fixed />

    <!-- 登录的表单 -->
    <van-form @submit="login">
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
      ></van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入登录的Api模块
import { loginApi } from '@/api/loginApi'
export default {
  data() {
    return {
      // 表单数据
      form: {
        mobile: '',
        code: '',
      },
      // 表单校验规则
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入正确的手机号',
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
            trigger: 'onBlur',
          },
        ],
        code: [
          { required: true, message: '请输入正确的密码', trigger: 'onBlur' },
        ],
      },
    }
  },
  methods: {
    async login() {
      // 发起登录请求 返回token字符串
      const { data: res } = await loginApi(this.form)
      if (res.message === 'OK') {
        // 将信息保存到vuex中
        this.$store.commit('updateTokenInfo', res.data)
        // 跳转至首页
        this.$router.push('/home')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  padding-top: 46px;
  // 覆盖 NavBar 组件的默认样式
  .van-nav-bar {
    background-color: #007bff;
    /deep/.van-nav-bar__title {
      color: white;
      font-size: 14px;
    }
  }
}
</style>
