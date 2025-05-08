<template>
  <view class="container">
    <view class="landing-container">
      <view class="header">
        <image class="logo" src="/static/logo.png"></image>
        <text class="app-title">Filecoin存储分配器</text>
        <text class="app-subtitle">基于Filecoin的合规存储解决方案</text>
      </view>
      
      <view class="features">
        <view class="feature-item">
          <view class="feature-icon auth-icon"></view>
          <view class="feature-content">
            <text class="feature-title">微信授权</text>
            <text class="feature-desc">通过微信快速授权登录，安全便捷</text>
          </view>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon kyc-icon"></view>
          <view class="feature-content">
            <text class="feature-title">自动化KYC/KYB</text>
            <text class="feature-desc">支持个人和企业身份验证，确保合规性</text>
          </view>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon compliance-icon"></view>
          <view class="feature-content">
            <text class="feature-title">合规检测</text>
            <text class="feature-desc">自动化内容合规检测，保障数据安全</text>
          </view>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon storage-icon"></view>
          <view class="feature-content">
            <text class="feature-title">Filecoin存储</text>
            <text class="feature-desc">去中心化存储，安全可靠，永久保存</text>
          </view>
        </view>
      </view>
      
      <view class="description">
        <text class="desc-title">什么是Filecoin存储分配器？</text>
        <text class="desc-text">Filecoin存储分配器是一个结合了微信授权、自动化KYC/KYB流程和合规检测系统的Filecoin存储解决方案。它能够帮助用户安全、合规地将数据存储在Filecoin网络中，实现数据的永久保存和高效检索。</text>
      </view>
      
      <view class="action-area">
        <button class="login-btn" type="primary" @click="navigateToLogin">开始使用</button>
        <view class="links">
          <text class="link" @click="navigateToTerms">用户协议</text>
          <text class="separator">|</text>
          <text class="link" @click="navigateToPrivacy">隐私政策</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Filecoin存储分配器'
    }
  },
  onLoad() {
    console.log('首页加载');
    // 检查是否已登录
    const userInfo = uni.getStorageSync('userInfo');
    
    if (userInfo) {
      console.log('用户已登录，跳转到控制面板');
      // 已登录，直接跳转到控制面板，不管KYC状态
      uni.reLaunch({
        url: '/pages/dashboard/index'
      });
    } else {
      console.log('用户未登录，显示首页');
    }
  },
  methods: {
    navigateToLogin() {
      console.log('跳转到登录页');
      uni.navigateTo({
        url: '/pages/login/index'
      });
    },
    
    navigateToTerms() {
      console.log('跳转到用户协议');
      uni.navigateTo({
        url: '/pages/terms/index'
      });
    },
    
    navigateToPrivacy() {
      console.log('跳转到隐私政策');
      uni.navigateTo({
        url: '/pages/privacy/index'
      });
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  font-size: 14px;
  line-height: 24px;
}

.landing-container {
  padding: 40rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx;
}

.app-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.app-subtitle {
  font-size: 28rpx;
  color: #666;
}

.features {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.feature-item {
  display: flex;
  margin-bottom: 30rpx;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.auth-icon {
  background-color: #07c160;
}

.kyc-icon {
  background-color: #1890ff;
}

.compliance-icon {
  background-color: #faad14;
}

.storage-icon {
  background-color: #722ed1;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
  display: block;
}

.feature-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.description {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.desc-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.desc-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-btn {
  width: 80%;
  height: 90rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.links {
  display: flex;
  align-items: center;
}

.link {
  font-size: 26rpx;
  color: #007AFF;
}

.separator {
  margin: 0 20rpx;
  color: #ccc;
  font-size: 26rpx;
}
</style>
