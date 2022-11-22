<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="article.aut_name"
        :label="article.pubdate | dateFormat"
      >
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button
              type="info"
              size="mini"
              v-if="article.is_followed"
              @click="deleteFollowings"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="followingsAuhtor"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content" v-if="article"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="article.attitude === 1"
          @click="deletelikingsArticle"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="likingsArticle"
          >点赞</van-button
        >
      </div>
    </div>

    <!-- 评论区域 -->
    <ArtCmd :source="id"></ArtCmd>
  </div>
</template>

<script>
import {
  getArticleDetailAPI,
  followingsAuthorAPI,
  deleteFollowingsAPI,
  likingsArticleAPI,
  deletelikingsArticleAPI,
} from '@/api/articlesApi'
import ArtCmd from '@/components/ArtCmt/ArtCmt.vue'

export default {
  name: 'ArticleDetail',
  components: {
    ArtCmd,
  },
  data() {
    return {
      id: this.$route.params.id,
      article: {},
    }
  },
  methods: {
    // 初始化文章主体
    async initArticleDetail() {
      const { data: res } = await getArticleDetailAPI(this.id)
      if (res.message === 'OK') {
        this.article = res.data
      }
    },
    // 关注作者
    async followingsAuhtor() {
      const { data: res } = await followingsAuthorAPI(this.article.aut_id)
      if (res.message === 'OK') {
        this.$toast.success('关注成功！')
        this.article.is_followed = true
      }
    },
    // 取关作者
    async deleteFollowings() {
      // 1. 调用 API 接口
      const res = await deleteFollowingsAPI(this.article.aut_id)
      // 2. 判断响应的状态码
      if (res.status === 204) {
        this.$toast.success('取关成功！')
        this.article.is_followed = false
      }
    },
    // 点赞文章
    async likingsArticle() {
      const { data: res } = await likingsArticleAPI(this.article.art_id)
      if (res.message === 'OK') {
        this.$toast.success('点赞成功！')
        this.article.attitude = 1
      }
    },
    // 取消点赞
    async deletelikingsArticle() {
      const res = await deletelikingsArticleAPI(this.article.art_id)
      if (res.status === 204) {
        this.$toast.success('取消成功！')
        this.article.attitude = -1
      }
    },
  },
  created() {
    this.initArticleDetail()
  },
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
