<template>
  <view class="dashboard-container">
    <!-- KYC提示横幅 -->
    <view v-if="!isVerified" class="kyc-banner">
      <view class="kyc-banner-content">
        <text class="kyc-banner-text">完成身份验证，享受更多存储权益和功能</text>
        <button class="kyc-banner-btn" @click="navigateToKYC">立即验证</button>
      </view>
    </view>
    
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl || '/static/default-avatar.png'"></image>
        <view class="user-details">
          <text class="username">{{ userInfo.nickname || '用户' }}</text>
          <view class="verification-badge" :class="{ verified: isVerified }">
            <text>{{ isVerified ? '已认证' : '未认证' }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="stats-container">
      <view class="stat-card">
        <view class="stat-value">{{ stats.totalFiles }}</view>
        <view class="stat-label">文件总数</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ formatSize(stats.totalStorage) }}</view>
        <view class="stat-label">存储总量</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ stats.complianceRate }}%</view>
        <view class="stat-label">合规率</view>
      </view>
    </view>
    
    <view class="section">
      <view class="section-header">
        <text class="section-title">存储概览</text>
      </view>
      <view class="storage-chart">
        <!-- 这里可以集成图表库，如ECharts，这里用简单的进度条代替 -->
        <view class="storage-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: storagePercentage + '%' }"></view>
          </view>
          <view class="progress-text">
            <text>{{ formatSize(stats.usedStorage) }} / {{ formatSize(stats.totalStorage) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="section">
      <view class="section-header">
        <text class="section-title">最近文件</text>
        <text class="section-more" @click="navigateToStorage">查看全部</text>
      </view>
      <view class="file-list">
        <view v-if="recentFiles.length === 0" class="empty-state">
          <text>暂无文件</text>
        </view>
        <view v-else class="file-item" v-for="(file, index) in recentFiles" :key="index" @click="viewFileDetails(file)">
          <view class="file-icon" :class="getFileIconClass(file.type)"></view>
          <view class="file-info">
            <text class="file-name">{{ file.name }}</text>
            <view class="file-meta">
              <text class="file-size">{{ formatSize(file.size) }}</text>
              <text class="file-date">{{ formatDate(file.date) }}</text>
            </view>
          </view>
          <view class="file-status" :class="{ 'status-success': file.status === 'success', 'status-pending': file.status === 'pending', 'status-failed': file.status === 'failed' }">
            <text>{{ getStatusText(file.status) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="section">
      <view class="section-header">
        <text class="section-title">合规检测</text>
      </view>
      <view class="compliance-summary">
        <view class="compliance-item">
          <view class="compliance-icon success"></view>
          <view class="compliance-info">
            <text class="compliance-label">通过</text>
            <text class="compliance-value">{{ stats.passedFiles }}</text>
          </view>
        </view>
        <view class="compliance-item">
          <view class="compliance-icon warning"></view>
          <view class="compliance-info">
            <text class="compliance-label">待审核</text>
            <text class="compliance-value">{{ stats.pendingFiles }}</text>
          </view>
        </view>
        <view class="compliance-item">
          <view class="compliance-icon error"></view>
          <view class="compliance-info">
            <text class="compliance-label">未通过</text>
            <text class="compliance-value">{{ stats.failedFiles }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="quick-actions">
      <view class="action-button" @click="navigateToUpload">
        <view class="action-icon upload"></view>
        <text class="action-text">上传文件</text>
      </view>
      <view class="action-button" @click="navigateToStorage">
        <view class="action-icon storage"></view>
        <text class="action-text">我的存储</text>
      </view>
      <view class="action-button" @click="showSettings">
        <view class="action-icon settings"></view>
        <text class="action-text">设置</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        avatarUrl: ''
      },
      isVerified: false,
      stats: {
        totalFiles: 0,
        totalStorage: 0,
        usedStorage: 0,
        complianceRate: 0,
        passedFiles: 0,
        pendingFiles: 0,
        failedFiles: 0
      },
      recentFiles: []
    }
  },
  computed: {
    storagePercentage() {
      if (this.stats.totalStorage === 0) return 0;
      return (this.stats.usedStorage / this.stats.totalStorage) * 100;
    }
  },
  onLoad() {
    this.loadUserInfo();
    this.loadDashboardData();
  },
  methods: {
    loadUserInfo() {
      // 从本地存储获取用户信息
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        this.userInfo = userInfo;
      }
      
      // 检查是否已完成KYC/KYB验证
      const kycVerified = uni.getStorageSync('kycVerified');
      this.isVerified = !!kycVerified;
    },
    
    loadDashboardData() {
      // 模拟从API获取数据
      // 在实际应用中，这里应该调用后端API
      
      // 模拟统计数据
      this.stats = {
        totalFiles: 15,
        totalStorage: 1024 * 1024 * 1024 * 5, // 5GB
        usedStorage: 1024 * 1024 * 1024 * 2, // 2GB
        complianceRate: 93,
        passedFiles: 12,
        pendingFiles: 2,
        failedFiles: 1
      };
      
      // 模拟最近文件数据
      this.recentFiles = [
        {
          name: '项目计划书.docx',
          size: 1024 * 1024 * 2.5, // 2.5MB
          date: new Date(2025, 4, 5), // 2025-05-05
          type: 'docx',
          status: 'success'
        },
        {
          name: '财务报表.xlsx',
          size: 1024 * 1024 * 1.2, // 1.2MB
          date: new Date(2025, 4, 3), // 2025-05-03
          type: 'xlsx',
          status: 'success'
        },
        {
          name: '产品设计图.psd',
          size: 1024 * 1024 * 15, // 15MB
          date: new Date(2025, 4, 1), // 2025-05-01
          type: 'psd',
          status: 'pending'
        },
        {
          name: '营销视频.mp4',
          size: 1024 * 1024 * 50, // 50MB
          date: new Date(2025, 3, 28), // 2025-04-28
          type: 'mp4',
          status: 'failed'
        }
      ];
    },
    
    formatSize(bytes) {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    formatDate(date) {
      const now = new Date();
      const diffDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));
      
      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return diffDays + '天前';
      } else {
        return date.getFullYear() + '-' + 
               (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
               date.getDate().toString().padStart(2, '0');
      }
    },
    
    getFileIconClass(type) {
      const iconMap = {
        'pdf': 'icon-pdf',
        'docx': 'icon-word',
        'xlsx': 'icon-excel',
        'pptx': 'icon-ppt',
        'jpg': 'icon-image',
        'png': 'icon-image',
        'mp4': 'icon-video',
        'mp3': 'icon-audio',
        'zip': 'icon-zip',
        'psd': 'icon-psd'
      };
      
      return iconMap[type] || 'icon-file';
    },
    
    getStatusText(status) {
      const statusMap = {
        'success': '已存储',
        'pending': '处理中',
        'failed': '未通过'
      };
      
      return statusMap[status] || '未知';
    },
    
    viewFileDetails(file) {
      // 查看文件详情
      uni.navigateTo({
        url: '/pages/file-detail/index?id=' + encodeURIComponent(file.name)
      });
    },
    
    navigateToUpload() {
      uni.switchTab({
        url: '/pages/upload/index'
      });
    },
    
    navigateToStorage() {
      uni.switchTab({
        url: '/pages/storage/index'
      });
    },
    
    showSettings() {
      uni.navigateTo({
        url: '/pages/settings/index'
      });
    },
    
    navigateToKYC() {
      uni.navigateTo({
        url: '/pages/kyc/index'
      });
    }
  }
}
</script>

<style>
.dashboard-container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.kyc-banner {
  background-color: #e6f7ff;
  border-radius: 10rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  border-left: 8rpx solid #007AFF;
}

.kyc-banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kyc-banner-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.kyc-banner-btn {
  background-color: #007AFF;
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  min-width: 160rpx;
  text-align: center;
}

.header {
  margin-bottom: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.verification-badge {
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  background-color: #f0f0f0;
  color: #999;
}

.verification-badge.verified {
  background-color: #e6f7ff;
  color: #007AFF;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.stat-card {
  flex: 1;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin: 0 10rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.stat-card:first-child {
  margin-left: 0;
}

.stat-card:last-child {
  margin-right: 0;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #007AFF;
}

.storage-chart {
  margin-top: 20rpx;
}

.storage-progress {
  margin-top: 10rpx;
}

.progress-bar {
  height: 20rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  background-color: #007AFF;
  border-radius: 10rpx;
}

.progress-text {
  text-align: right;
  font-size: 24rpx;
  color: #999;
}

.file-list {
  margin-top: 20rpx;
}

.empty-state {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文件图标样式，实际应用中可以使用图片或字体图标 */
.icon-pdf {
  background-color: #f5222d;
}

.icon-word {
  background-color: #1890ff;
}

.icon-excel {
  background-color: #52c41a;
}

.icon-ppt {
  background-color: #fa8c16;
}

.icon-image {
  background-color: #722ed1;
}

.icon-video {
  background-color: #eb2f96;
}

.icon-audio {
  background-color: #13c2c2;
}

.icon-zip {
  background-color: #faad14;
}

.icon-psd {
  background-color: #2f54eb;
}

.icon-file {
  background-color: #bfbfbf;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.file-meta {
  display: flex;
  font-size: 24rpx;
  color: #999;
}

.file-size {
  margin-right: 20rpx;
}

.file-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-success {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-pending {
  background-color: #fffbe6;
  color: #faad14;
}

.status-failed {
  background-color: #fff2f0;
  color: #f5222d;
}

.compliance-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
}

.compliance-item {
  display: flex;
  align-items: center;
}

.compliance-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.compliance-icon.success {
  background-color: #52c41a;
}

.compliance-icon.warning {
  background-color: #faad14;
}

.compliance-icon.error {
  background-color: #f5222d;
}

.compliance-info {
  display: flex;
  flex-direction: column;
}

.compliance-label {
  font-size: 24rpx;
  color: #999;
}

.compliance-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 30rpx;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #007AFF;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: 24rpx;
  color: #333;
}
</style>
