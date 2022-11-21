<template>
  <div class="artlist-container">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="loading"
      @refresh="onRefresh"
      :disabled="finished"
    >
      <!-- 上拉加载更多 -->
      <!--:immediate-check="false" 即可防止首次加载时触发 load 事件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的~"
        :immediate-check="false"
        @load="onLoad"
      >
        <ArtItem
          v-for="item in artlist"
          :key="item.art_id"
          :article="item"
        ></ArtItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArtListAPI } from '@/api/homeApi'
import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'ArtList',
  props: {
    channelId: {
      type: Number,
      require: true,
    },
  },
  components: {
    ArtItem,
  },
  data() {
    return {
      // 文章列表的数组
      artlist: [],
      // 时间戳。初始的默认值为当前的时间戳
      timestamp: Date.now(),
      loading: true,
      finished: false,
    }
  },
  methods: {
    async initArtList(isrefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        // 为事件戳重新赋值
        this.timestamp = res.data.pre_timestamp
        // 判断是下拉刷新还是上拉加载更多
        if (!isrefresh) {
          // 上拉加载更多 将文章填充到原数据后面
          this.artlist = [...this.artlist, ...res.data.results]
        } else {
          // 下拉刷新 将文章填充到原数据钱前面
          this.artlist = [...res.data.results, ...this.artlist]
        }
        // 加载完成后重置loading
        this.loading = false
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    onLoad() {
      this.initArtList()
    },
    onRefresh() {
      this.initArtList(true)
    },
  },
  created() {
    this.initArtList()
  },
}
</script>

<style></style>
