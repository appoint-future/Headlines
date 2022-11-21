<template>
  <div class="artitem-container">
    <!-- 文章主体 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img
            class="thumb"
            v-lazy="article.cover.images[0]"
            v-if="article.cover.type === 1"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img v-lazy="article.cover.images[0]" class="thumb" />
          <img v-lazy="article.cover.images[1]" class="thumb" />
          <img v-lazy="article.cover.images[2]" class="thumb" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span
            >作者{{ article.aut_name }} &nbsp;&nbsp;
            {{ article.comm_count }}评论 &nbsp;&nbsp; 发布日期
            {{ article.pubdate | dateFormat }}</span
          >
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true" />
        </div>
      </template>
    </van-cell>

    <!-- 反馈的动作面板 -->
    <!-- @close="isSecond = false" 保证每次打开都是一级面板 -->
    <van-action-sheet
      v-model="show"
      cancel-text="取消"
      :closeable="false"
      @close="isSecond = false"
      get-container="body"
    >
      <div class="content">
        <!-- 第一级反馈面板 -->
        <div v-if="!isSecond">
          <!-- 循环渲染可选项 -->
          <van-cell
            :title="item.name"
            clickable
            class="center-title"
            v-for="item in actions"
            :key="item.name"
            @click="onCellClick(item.name)"
          />
        </div>
        <!-- 第二级反馈面板 -->
        <div v-else>
          <!-- 循环渲染可选项 -->
          <van-cell
            title="返回"
            clickable
            title-class="center-title"
            @click="isSecond = false"
          />
          <van-cell
            :title="item.label"
            clickable
            title-class="center-title"
            v-for="item in reports"
            :key="item.type"
            @click="reportArticle(article.art_id, item.type)"
          />
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import reports from '@/api/reports.js'
import { dislikeArticleAPI } from '@/api/dislikeArticleApi'
import { reportsAPI } from '@/api/reportsApi'
export default {
  name: 'ArtItem',
  props: {
    article: {
      type: Object,
      required: true, // 必填项
    },
  },
  data() {
    return {
      show: false,
      isSecond: false,
      // 第一个面板的可选项列表
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' },
      ],
      // 第二个面板的可选列表
      reports,
    }
  },
  methods: {
    async onCellClick(name) {
      if (name === '不感兴趣') {
        const { data: res } = await dislikeArticleAPI(
          this.article.art_id.toString()
        )
        // 删除文章
        if (res.message === 'OK') {
          // 自定义事件  由子向父传值 删除该 id 的文章
          this.$emit('remove-article', this.article.art_id)
        }
        this.show = false
      } else if (name === '反馈垃圾内容') {
        // 自定义事件  由子向父传值 删除该 id 的文章
        this.$emit('remove-article', this.article.art_id)
        this.show = false
      } else {
        // 隐藏一级反馈面板
        this.isSecond = true
      }
    },
    async reportArticle(id, type) {
      const { data: res } = await reportsAPI(id, type)
      if (res.message === 'OK') {
        //删除文章
        this.$emit('remove-article', id)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
.center-title {
  text-align: center;
}
</style>
