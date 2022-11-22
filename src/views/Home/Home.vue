<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed title="黑马头条" left-text="返回" right-text="按钮">
      <template #left>
        <van-icon name="arrow-left" color="#fff" />
      </template>
      <template #right>
        <van-icon name="search" size="18" color="#fff" @click="search" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="46px">
      <van-tab :title="item.name" v-for="item in userChannel" :key="item.id">
        <ArtList :channel-id="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup v-model="show" @close="isDel = false">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray" v-if="!isDel">点击进入频道</span>
                <span class="title-gray" v-else>点击移除频道</span>
              </div>
              <span class="btn-edit" v-if="!isDel" @click="isDel = !isDel"
                >编辑</span
              >
              <span class="btn-edit" v-else @click="isDel = !isDel">完成</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col
                span="6"
                v-for="(item, index) in userChannel"
                :key="item.id"
              >
                <!-- 用户的频道 Item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="removeChannel(item, index)"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="
                      isDel && item.name != '推荐' && userChannel.length > 2
                    "
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col
                span="6"
                v-for="item in moreChannel"
                :key="item.id"
                @click="addChannel(item)"
              >
                <div class="channel-item van-hairline--surround">
                  {{ item.name }}
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updateUserChannelAPI,
} from '@/api/homeApi'
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
      // 所有的频道列表数组
      allChannel: [],
      // 管理弹出层的显示和隐藏
      show: false,
      // 判断是否处于移除频道的状态
      isDel: false,
    }
  },
  computed: {
    moreChannel() {
      return this.allChannel.filter((Allitem) => {
        return !this.userChannel.some((item) => {
          if (item.id === Allitem.id) return true
        })
      })
    },
  },
  methods: {
    // 获得用户数据
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    },
    // 获得全部频道
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
      }
    },
    // 添加频道
    async addChannel(channel) {
      this.userChannel.push(channel)
      // 将用户最新的列表发送回服务器
      this.updateChannel()
    },
    // 把用户的频道列表数据提交到后端保存
    async updateChannel() {
      // 1. 准备要提交到服务器的数据
      const channels = this.userChannel
        .filter((item) => item.name !== '推荐') // 将“推荐”从频道列表中过滤出去
        .map((item, index) => {
          // 调用数组的 map 循环，最终返回一个处理好的新数组
          return {
            id: item.id,
            seq: index + 1,
          }
        })
      // 2. 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === 'OK') {
        // TODO：提示用户更新成功
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    },
    // 删除用户频道
    removeChannel(channel, index) {
      // 判断是否为删除状态
      if (
        this.isDel &&
        channel.name !== '推荐' &&
        this.userChannel.length > 2
      ) {
        this.userChannel = this.userChannel.filter(
          (item) => item.id !== channel.id
        )
        // 将更新后的数据返回到后台中
        this.updateChannel()
      } else {
        // 点击之后进入频道
        this.active = index
        // 关闭弹窗
        this.show = false
      }
    },
    search() {
      this.$router.push('/search')
    },
  },
  created() {
    // 获得用户频道
    this.initUserChannel()
    // 获得全部频道
    this.initAllChannel()
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
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
