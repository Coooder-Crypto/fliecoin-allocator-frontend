<template>
  <view class="kyc-container">
    <view class="header">
      <text class="title">身份验证</text>
      <text class="subtitle">完成身份验证可享受更多存储权益和功能（可选）</text>
      <view class="skip-container">
        <text class="skip-btn" @click="skipVerification">跳过 ></text>
      </view>
    </view>
    
    <view class="verification-type">
      <view class="type-selector">
        <view 
          class="type-item" 
          :class="{ active: verificationType === 'personal' }" 
          @click="setVerificationType('personal')"
        >
          <text>个人认证</text>
        </view>
        <view 
          class="type-item" 
          :class="{ active: verificationType === 'business' }" 
          @click="setVerificationType('business')"
        >
          <text>企业认证</text>
        </view>
      </view>
    </view>
    
    <!-- 个人认证表单 -->
    <view v-if="verificationType === 'personal'" class="form-container">
      <view class="form-group">
        <text class="label">姓名</text>
        <input class="input" v-model="personal.name" placeholder="请输入您的真实姓名" />
      </view>
      
      <view class="form-group">
        <text class="label">身份证号码</text>
        <input class="input" v-model="personal.idNumber" placeholder="请输入您的身份证号码" />
      </view>
      
      <view class="form-group">
        <text class="label">手机号码</text>
        <input class="input" v-model="personal.phone" placeholder="请输入您的手机号码" />
      </view>
      
      <view class="upload-section">
        <text class="section-title">身份证照片上传</text>
        
        <view class="upload-item">
          <text class="upload-label">身份证正面</text>
          <view class="upload-box" @click="chooseImage('idCardFront')">
            <image v-if="personal.idCardFront" class="preview" :src="personal.idCardFront" mode="aspectFit"></image>
            <text v-else class="upload-text">点击上传</text>
          </view>
        </view>
        
        <view class="upload-item">
          <text class="upload-label">身份证反面</text>
          <view class="upload-box" @click="chooseImage('idCardBack')">
            <image v-if="personal.idCardBack" class="preview" :src="personal.idCardBack" mode="aspectFit"></image>
            <text v-else class="upload-text">点击上传</text>
          </view>
        </view>
      </view>
      
      <view class="face-verification">
        <text class="section-title">人脸验证</text>
        <button class="verify-btn" @click="startFaceVerification">开始人脸验证</button>
      </view>
    </view>
    
    <!-- 企业认证表单 -->
    <view v-if="verificationType === 'business'" class="form-container">
      <view class="form-group">
        <text class="label">企业名称</text>
        <input class="input" v-model="business.companyName" placeholder="请输入企业名称" />
      </view>
      
      <view class="form-group">
        <text class="label">统一社会信用代码</text>
        <input class="input" v-model="business.creditCode" placeholder="请输入统一社会信用代码" />
      </view>
      
      <view class="form-group">
        <text class="label">法定代表人</text>
        <input class="input" v-model="business.legalPerson" placeholder="请输入法定代表人姓名" />
      </view>
      
      <view class="form-group">
        <text class="label">联系电话</text>
        <input class="input" v-model="business.contactPhone" placeholder="请输入联系电话" />
      </view>
      
      <view class="upload-section">
        <text class="section-title">证件照片上传</text>
        
        <view class="upload-item">
          <text class="upload-label">营业执照</text>
          <view class="upload-box" @click="chooseImage('businessLicense')">
            <image v-if="business.businessLicense" class="preview" :src="business.businessLicense" mode="aspectFit"></image>
            <text v-else class="upload-text">点击上传</text>
          </view>
        </view>
        
        <view class="upload-item">
          <text class="upload-label">法定代表人身份证正面</text>
          <view class="upload-box" @click="chooseImage('legalPersonIdFront')">
            <image v-if="business.legalPersonIdFront" class="preview" :src="business.legalPersonIdFront" mode="aspectFit"></image>
            <text v-else class="upload-text">点击上传</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="submit-section">
      <button class="submit-btn" type="primary" @click="submitVerification">提交验证</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      verificationType: 'personal', // 默认为个人认证
      personal: {
        name: '',
        idNumber: '',
        phone: '',
        idCardFront: '',
        idCardBack: '',
        faceVerified: false
      },
      business: {
        companyName: '',
        creditCode: '',
        legalPerson: '',
        contactPhone: '',
        businessLicense: '',
        legalPersonIdFront: ''
      }
    }
  },
  methods: {
    skipVerification() {
      // 显示提示
      uni.showModal({
        title: '跳过验证',
        content: '您可以随时在控制面板中完成身份验证，以享受更多存储权益和功能',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到控制面板
            uni.reLaunch({
              url: '/pages/dashboard/index'
            });
          }
        }
      });
    },
    
    setVerificationType(type) {
      this.verificationType = type;
    },
    
    chooseImage(field) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 根据不同字段更新不同对象
          if (field === 'idCardFront' || field === 'idCardBack') {
            this.personal[field] = tempFilePath;
            
            // 模拟OCR识别
            if (field === 'idCardFront') {
              setTimeout(() => {
                // 模拟从身份证OCR中获取信息
                this.personal.name = '张三';
                this.personal.idNumber = '110101199001011234';
              }, 1000);
            }
          } else {
            this.business[field] = tempFilePath;
            
            // 模拟OCR识别
            if (field === 'businessLicense') {
              setTimeout(() => {
                // 模拟从营业执照OCR中获取信息
                this.business.companyName = '北京科技有限公司';
                this.business.creditCode = '91110105MA01ABCDEF';
                this.business.legalPerson = '李四';
              }, 1000);
            }
          }
        }
      });
    },
    
    startFaceVerification() {
      // 模拟人脸验证过程
      uni.showLoading({
        title: '正在进行人脸验证'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        this.personal.faceVerified = true;
        
        uni.showToast({
          title: '人脸验证成功',
          icon: 'success'
        });
      }, 2000);
    },
    
    validatePersonal() {
      if (!this.personal.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.personal.idNumber) {
        uni.showToast({
          title: '请输入身份证号码',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.personal.phone) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.personal.idCardFront) {
        uni.showToast({
          title: '请上传身份证正面照片',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.personal.idCardBack) {
        uni.showToast({
          title: '请上传身份证反面照片',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.personal.faceVerified) {
        uni.showToast({
          title: '请完成人脸验证',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    validateBusiness() {
      if (!this.business.companyName) {
        uni.showToast({
          title: '请输入企业名称',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.business.creditCode) {
        uni.showToast({
          title: '请输入统一社会信用代码',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.business.legalPerson) {
        uni.showToast({
          title: '请输入法定代表人姓名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.business.contactPhone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.business.businessLicense) {
        uni.showToast({
          title: '请上传营业执照',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.business.legalPersonIdFront) {
        uni.showToast({
          title: '请上传法定代表人身份证正面',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    submitVerification() {
      let isValid = false;
      
      if (this.verificationType === 'personal') {
        isValid = this.validatePersonal();
      } else {
        isValid = this.validateBusiness();
      }
      
      if (!isValid) {
        return;
      }
      
      // 显示加载中
      uni.showLoading({
        title: '提交验证中'
      });
      
      // 模拟API调用
      setTimeout(() => {
        uni.hideLoading();
        
        // 存储验证状态
        uni.setStorageSync('kycVerified', true);
        uni.setStorageSync('verificationType', this.verificationType);
        
        // 验证成功，跳转到主页
        uni.showToast({
          title: '验证成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/dashboard/index'
              });
            }, 2000);
          }
        });
      }, 2000);
    }
  }
}
</script>

<style>
.kyc-container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.skip-container {
  margin-top: 20rpx;
  text-align: right;
}

.skip-btn {
  font-size: 28rpx;
  color: #007AFF;
  padding: 10rpx;
}

.verification-type {
  margin-bottom: 40rpx;
}

.type-selector {
  display: flex;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  border: 1px solid #eee;
}

.type-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.type-item.active {
  background-color: #007AFF;
  color: #fff;
}

.form-container {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.form-group {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.upload-section {
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.upload-item {
  margin-bottom: 30rpx;
}

.upload-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.upload-box {
  width: 100%;
  height: 300rpx;
  border: 1px dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.upload-text {
  font-size: 28rpx;
  color: #999;
}

.preview {
  width: 100%;
  height: 100%;
}

.face-verification {
  margin-top: 40rpx;
}

.verify-btn {
  width: 100%;
  height: 80rpx;
  background-color: #07c160;
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-section {
  margin-top: 60rpx;
  padding-bottom: 40rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
