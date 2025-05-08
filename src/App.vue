<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 初始化应用
    this.checkLoginStatus()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    checkLoginStatus() {
      // 检查登录状态
      const userInfo = uni.getStorageSync('userInfo')
      console.log('检查登录状态:', userInfo ? '已登录' : '未登录')
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  background-color: #f8f8f8;
  box-sizing: border-box;
}

/* 通用样式 */
.container {
  padding: 30rpx;
}

/* 文本样式 */
.text-primary {
  color: #007AFF;
}

.text-success {
  color: #52c41a;
}

.text-warning {
  color: #faad14;
}

.text-danger {
  color: #f5222d;
}

.text-muted {
  color: #999;
}

/* 按钮样式 */
button {
  font-size: 28rpx;
  line-height: 1.5;
}

button.primary {
  background-color: #007AFF;
  color: #fff;
}

button.success {
  background-color: #52c41a;
  color: #fff;
}

button.warning {
  background-color: #faad14;
  color: #fff;
}

button.danger {
  background-color: #f5222d;
  color: #fff;
}

/* 卡片样式 */
.card {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 表单样式 */
.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

/* 列表样式 */
.list-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.list-item:last-child {
  border-bottom: none;
}
</style>
