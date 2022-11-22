<template>
  <div
    class="art-cmt-container"
    :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'"
  >
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="快点加上你的评论吧！"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 评论列表 -->
      <div class="cmt-list">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="item in commitList" :key="item.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="item.is_liking"
                @click="delLikeCmt(item)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="addLikeCmt(item)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body" v-html="item.content"></div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
        </div>
      </div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
        <van-icon name="arrow-left" size="18" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
        <div class="icon-box">
          <van-badge :content="total_count" :max="99">
            <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
          </van-badge>
          <van-icon name="star-o" size="20" />
          <van-icon name="share-o" size="20" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          v-model.trim="cmt"
          placeholder="友善评论、理性发言、阳光心灵"
          @blur="hideBox2"
          ref="ipt"
        ></textarea>
        <van-button
          type="default"
          :disabled="cmt.length === 0"
          @click="pubComment"
          >发布</van-button
        >
      </div></van-list
    >
  </div>
</template>

<script>
import {
  getCmtListAPI,
  addLikeCmtAPI,
  delLikeCmtAPI,
  pubCommentAPI,
} from '@/api/articlesApi'
// 引入平滑滚动包
import { animate } from 'popmotion'

export default {
  name: 'ArtCmt',
  props: {
    // 文章ID
    source: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      commitList: [],
      // 最后一条评论 可以当作offset
      last_id: null,
      // 总评论数
      total_count: 0,
      loading: false,
      finished: false,
      // 按需展示评论区域1和2
      isShowBox1: true,
      // 用户填写的评论内容
      cmt: '',
    }
  },
  methods: {
    // 初始化评论列表的数据
    async initCmtList() {
      // 调用 API 接口
      const { data: res } = await getCmtListAPI(this.source, this.last_id)
      if (res.message === 'OK') {
        // 为偏移量赋值
        this.last_id = res.data.last_id
        // 获得总评论数
        this.total_count = res.data.total_count
        // 1. 数据拼接：“旧数据”在前，“新数据”在后
        this.commitList = [...this.commitList, ...res.data.results]
        // 2. 将 loading 重置为 false
        this.loading = false
        // 3. 判断所有数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
      }
    },
    onLoad() {
      this.initCmtList()
    },
    // 点赞评论
    async addLikeCmt(item) {
      const { data: res } = await addLikeCmtAPI(item.com_id)
      if (res.message === 'OK') {
        this.$toast.success('点赞成功！')
        item.is_liking = true
      }
    },
    // 取消点赞
    async delLikeCmt(item) {
      const res = await delLikeCmtAPI(item.com_id)
      if (res.status === 204) {
        this.$toast.success('取消成功！')
        item.is_liking = false
      }
    },
    // 展示发布评论的框子
    showBox2() {
      this.isShowBox1 = false
      // 这里聚焦必须写在nextTick里面
      this.$nextTick(() => {
        // 聚焦
        this.$refs.ipt.focus()
      })
    },
    // 发布评论
    async pubComment() {
      const { data: res } = await pubCommentAPI(this.source, this.cmt)
      if (res.message === 'OK') {
        this.total_count++
        res.data.new_obj.is_liking = false
        this.commitList.unshift(res.data.new_obj)
        this.$toast.success('发表评论成功')
      }
      this.cmt = ''
    },
    // 隐藏Box2
    hideBox2() {
      setTimeout(() => {
        this.isShowBox1 = true
      }, 100)
    },
    scrollToCmtList() {
      // 1. 当前滚动条的位置
      const now = window.scrollY
      // 2. 目标位置（文章信息区域的高度）
      const dist = document.querySelector('.article-container').offsetHeight

      // 3. 实现滚动动画
      animate({
        from: now, // 当前的位置
        to: dist, // 目标位置
        onUpdate: (latest) => window.scrollTo(0, latest),
      })
    },
  },
  created() {
    this.initCmtList()
  },
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
