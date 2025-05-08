<template>
  <view class="login-container">
    <view class="logo-container">
      <image class="logo" src="/static/logo.png"></image>
      <text class="app-title">Filecoin存储分配器</text>
    </view>
    
    <view class="description">
      <text>基于Filecoin的合规存储解决方案</text>
    </view>
    
    <view class="login-form">
      <button class="wechat-login-btn" type="primary" @click="handleWechatLogin">
        <text class="btn-text">微信授权登录</text>
      </button>
      
      <view class="agreement">
        <checkbox :checked="agreeTerms" @click="toggleAgreement" />
        <text class="agreement-text">我已阅读并同意</text>
        <text class="agreement-link" @click="showTerms">《用户协议》</text>
        <text class="agreement-text">和</text>
        <text class="agreement-link" @click="showPrivacy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreeTerms: false
    }
  },
  methods: {
    handleWechatLogin() {
      if (!this.agreeTerms) {
        uni.showToast({
          title: '请先同意用户协议和隐私政策',
          icon: 'none'
        });
        return;
      }
      
      // 微信登录
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log('微信登录成功', loginRes);
          // 获取用户信息
          uni.getUserInfo({
            provider: 'weixin',
            success: (infoRes) => {
              console.log('获取用户信息成功', infoRes);
              // 将登录信息发送到后端进行验证
              this.verifyLogin(loginRes.code, infoRes);
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
              uni.showToast({
                title: '获取用户信息失败',
                icon: 'none'
              });
            }
          });
        },
        fail: (err) => {
          console.error('微信登录失败', err);
          uni.showToast({
            title: '微信登录失败',
            icon: 'none'
          });
        }
      });
    },
    
    verifyLogin(code, userInfo) {
      // 这里应该调用后端API进行验证
      // 模拟验证成功
      console.log('验证登录信息', code, userInfo);
      
      // 存储用户信息
      uni.setStorageSync('userInfo', userInfo);
      
      // 登录成功后直接跳转到控制面板，不强制KYC
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/dashboard/index'
            });
          }, 1500);
        }
      });
    },
    
    toggleAgreement() {
      this.agreeTerms = !this.agreeTerms;
    },
    
    showTerms() {
      // 显示用户协议
      uni.navigateTo({
        url: '/pages/terms/index'
      });
    },
    
    showPrivacy() {
      // 显示隐私政策
      uni.navigateTo({
        url: '/pages/privacy/index'
      });
    }
  }
}
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  height: 100vh;
  background-color: #f8f8f8;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 60rpx;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 20rpx;
}

.app-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 80rpx;
  text-align: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wechat-login-btn {
  width: 80%;
  height: 90rpx;
  background-color: #07c160;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  color: #fff;
  font-size: 32rpx;
}

.agreement {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40rpx;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
}

.agreement-link {
  font-size: 24rpx;
  color: #007AFF;
}
</style>
