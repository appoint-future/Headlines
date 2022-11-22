<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center @click="UpdatePhoto">
        <template #default>
          <!-- 用户的头像 -->
          <van-image round class="avatar" :src="userProfile.photo" />
          <!-- 文件选择框 -->
          <van-dialog
            v-model="showUpdatePhoto"
            title="请选择图片"
            :showCancelButton="true"
            :before-close="beforeUpdatePhoto"
          >
            <van-uploader v-model="photoFile" :max-count="1" />
          </van-dialog>
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="onNameCellClick"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthdayCellClick"
      />
    </van-cell-group>
    <!-- 修改用户名称 -->
    <van-dialog
      v-model="show"
      title="修改名称"
      :showCancelButton="true"
      :before-close="beforeClose"
    >
      <van-field
        v-model="username"
        placeholder="请输入用户名"
        :maxlength="11"
        ref="iptusername"
      ></van-field>
    </van-dialog>
    <!-- 修改用户生日 -->
    <van-dialog
      v-model="showBirthSheet"
      :showCancelButton="true"
      :before-close="updateBrithday"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { updateUserAPI, updateUserAvatarAPI } from '@/api/userAPi'
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      show: false,
      username: '',
      showBirthSheet: false,
      showUpdatePhoto: false,
      // 选则的生日
      currentDate: new Date(),
      // 最大和最小日期
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2025, 10, 1),
      // 图片文件
      photoFile: [],
    }
  },
  methods: {
    ...mapActions(['initUserProfile']),
    onNameCellClick() {
      this.show = true
      // 输入框聚焦
      this.$nextTick(() => {
        this.$refs.iptusername.focus()
      })
      this.username = this.userProfile.name
    },
    // 输入框的关闭操作
    beforeClose(action, done) {
      if (action === 'cancel') return done()
      if (action === 'confirm') {
        if (this.username.length > 11 || this.username === '') {
          // notify消息通知
          this.$notify({
            type: 'warning',
            message: '名称的长度为1-7个字符',
            duration: 2000,
          })
          // 2. 让文本框持续获得焦点
          this.$refs.iptusername.focus()
          // 3. 阻止对话框关闭
          return done(false)
        } else {
          // 获取到更新后的数据
          this.updateUserName()
          this.$notify({ type: 'success', message: '修改成功', duration: 2000 })
          // 关闭窗口
          done()
        }
      }
    },
    // 获取到更新后的简介信息
    async updateUserName() {
      const { data: res } = await updateUserNameAPI({ name: this.username })
      if (res.message === 'OK') {
        this.initUserProfile()
      }
    },
    // 修改生日
    onBirthdayCellClick() {
      // 展示弹出框
      this.showBirthSheet = true
    },
    updateBrithday(action, done) {
      if (action === 'cancel') return done()
      if (action === 'confirm') {
        // 格式化时间
        this.currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        // 更新简介信息
        this.updateUserBirthday()
        // 提示用户修改成功
        this.$notify({ type: 'success', message: '修改成功', duration: 2000 })
        // 关闭弹出框
        done()
      }
    },
    // 获取到更新后的简介信息
    async updateUserBirthday() {
      const { data: res } = await updateUserAPI({
        birthday: this.currentDate,
      })
      if (res.message === 'OK') {
        this.initUserProfile()
      }
    },
    // 更换用户头像
    UpdatePhoto() {
      // 展示弹出框
      this.showUpdatePhoto = true
    },
    beforeUpdatePhoto(action, done) {
      if (action === 'cancel') return setTimeout(done, 100)
      if (action === 'confirm') {
        this.updateUserAvatar()
        setTimeout(done, 100)
      }
    },
    // 获取用户更新后的简介信息
    async updateUserAvatar() {
      if (this.photoFile.length === 0) return
      // 创建 FormData 的对象
      const fd = new FormData()
      // 向 fd 中追加数据项
      fd.append('photo', this.photoFile[0])
      const { data: res } = await updateUserAvatarAPI(fd)
      if (res.message === 'OK') {
        // 更新用户的简介信息
        this.initUserProfile()
        // 提示用户更新成功
        this.$notify({
          type: 'success',
          message: '更新头像成功！',
          duration: 2000,
        })
      }
    },
  },
  computed: {
    ...mapState(['userProfile']),
  },
  created() {
    this.initUserProfile()
  },
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-picker__toolbar {
  display: block;
  .van-picker__title {
    margin: 23px auto;
  }
  .van-picker__confirm,
  .van-picker__cancel {
    display: none;
  }
}
.van-uploader {
  display: block;
  left: 50%;
  transform: translateX(-12%);
}
</style>
