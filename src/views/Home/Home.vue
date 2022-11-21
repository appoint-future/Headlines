<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed title="黑马头条" left-text="返回" right-text="按钮">
      <template #left>
        <van-icon name="arrow-left" color="#fff" />
      </template>
      <template #right>
        <van-icon name="search" size="18" color="#fff" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="46px">
      <van-tab :title="item.name" v-for="item in userChannel" :key="item.id">
        <ArtList :channel-id="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeApi'
import ArtList from '@/components/ArtList/ArtList.vue'
export default {
  name: 'Home',
  components: {
    ArtList,
  },
  data() {
    return {
      active: 0,
      // 用户的频道列表数组
      userChannel: [],
    }
  },
  methods: {
    // 获得用户数据
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    },
  },
  created() {
    this.initUserChannel()
  },
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
}
/deep/.van-nav-bar {
  background-color: rgb(0, 98, 255);
  .van-nav-bar__title,
  .van-nav-bar__text {
    color: #fff;
  }
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>
