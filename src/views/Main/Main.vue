<template>
  <div class="main-container">
    <router-view></router-view>
    <!-- 底部的 TabBar -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/main/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/main/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main',
}
</script>

<style></style>
