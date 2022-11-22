<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="18"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="keyword"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="keyword.length > 0">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        @click="gotoSearchResult"
      >
        {{ item }}
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearHistory" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(tag, i) in history"
          :key="i"
          @click="gotoSearchResult"
          >{{ tag }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestionAPI } from '@/api/searchApi'
export default {
  name: 'Search',
  data() {
    return {
      keyword: '',
      // 延时器ID
      timerId: null,
      suggestList: [],
      history: JSON.parse(localStorage.getItem('history') || '[]'),
    }
  },
  methods: {
    async initSearchList() {
      const { data: res } = await getSuggestionAPI(this.keyword)
      if (res.message === 'OK') {
        // 为 suggestList 数据赋值
        this.suggestList = res.data.options
        // 将搜索关键字放入history数组中
        // 把搜索关键词加入到搜索历史中
        const newHistory = this.history.filter((item) => item !== this.keyword)
        newHistory.unshift(this.keyword)
        this.history = newHistory
      }
    },
    onInput() {
      clearTimeout(this.timerId)
      if (this.keyword.length === 0) return (this.suggestList = [])
      this.timerId = setTimeout(async () => {
        this.initSearchList()
      }, 300)
    },
    // 生成DOM元素后让搜索框聚焦
    mounted() {
      const ipt = document.querySelector('input[type=search]')
      ipt && ipt.focus()
    },
    // 跳转至搜索结果页
    gotoSearchResult(e) {
      // 获取用户点击的搜索项
      this.keyword = e.target.innerText
      this.$router.push('/search/' + this.keyword)
    },
    // 清空历史记录
    clearHistory() {
      this.history = []
    },
  },
  // 侦听器监听history数据变换
  watch: {
    history(newVal) {
      localStorage.setItem('history', JSON.stringify(newVal))
    },
  },
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  .goback {
    padding-left: 14px;
  }
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.van-cell i {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
