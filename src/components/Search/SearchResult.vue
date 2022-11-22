<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="我是有底线的~"
      :immediate-check="false"
      @load="onLoad"
    >
      <!-- 渲染搜索结果 -->
      <ArtItem
        v-for="item in artList"
        :key="item.art_id"
        :article="item"
        @remove-article="removeArticle"
      ></ArtItem>
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchApi'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
import { Toast } from 'vant'
export default {
  name: 'SearchResult',
  components: {
    ArtItem,
  },
  data() {
    return {
      keyword: this.$route.params.keyword,
      page: 1,
      artList: [],
      loading: false,
      finished: false,
    }
  },
  methods: {
    async initSearchResult() {
      const { data: res } = await getSearchResultAPI(this.keyword, this.page)
      if (res.message === 'OK' && res.data.results.length !== 0) {
        this.artList = [...this.artList, ...res.data.results]
        this.loading = false
      } else {
        this.finished = true
      }
    },
    removeArticle(val) {
      // 删除文章
      this.artList.some((item, index) => {
        if (item.art_id === val) {
          this.artList.splice(index, 1)
          return true
        }
      })
      Toast('感谢您的反馈')
      // 如果删除文章后artlist的长度小于10则主动发起请求
      if (this.artList.length < 9) {
        this.initSearchResult()
      }
    },
    onLoad() {
      this.loading = true
      this.page++
      this.initSearchResult()
    },
  },
  created() {
    this.initSearchResult()
  },
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
/deep/.van-nav-bar {
  background-color: rgb(0, 98, 255);
  .van-nav-bar__title,
  .van-nav-bar__left i {
    color: #fff;
  }
}
</style>
