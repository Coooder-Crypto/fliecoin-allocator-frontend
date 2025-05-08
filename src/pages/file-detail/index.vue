<template>
  <view class="detail-container">
    <view class="header">
      <text class="title">文件详情</text>
    </view>
    
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    
    <view v-else-if="error" class="error">
      <text>{{ error }}</text>
      <button class="retry-btn" @click="loadFileDetails">重试</button>
    </view>
    
    <view v-else class="file-details">
      <view class="file-header">
        <view class="file-icon" :class="getFileIconClass(fileDetails.type)"></view>
        <view class="file-info">
          <text class="file-name">{{ fileDetails.name }}</text>
          <view class="file-meta">
            <text class="file-size">{{ formatSize(fileDetails.size) }}</text>
            <text class="file-date">{{ formatDate(fileDetails.date) }}</text>
          </view>
        </view>
        <view class="file-status" :class="getStatusClass(fileDetails.status)">
          <text>{{ getStatusText(fileDetails.status) }}</text>
        </view>
      </view>
      
      <view class="detail-section">
        <view class="section-header">
          <text class="section-title">存储信息</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">CID</text>
          <view class="detail-value cid">
            <text>{{ fileDetails.cid }}</text>
            <view class="copy-btn" @click="copyCID">复制</view>
          </view>
        </view>
        <view class="detail-item">
          <text class="detail-label">存储状态</text>
          <text class="detail-value">{{ getStatusText(fileDetails.status) }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">存储时间</text>
          <text class="detail-value">{{ formatFullDate(fileDetails.date) }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">存储期限</text>
          <text class="detail-value">{{ formatFullDate(fileDetails.expiryDate) }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">副本数量</text>
          <text class="detail-value">{{ fileDetails.replicas }}</text>
        </view>
      </view>
      
      <view class="detail-section">
        <view class="section-header">
          <text class="section-title">合规检测</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">检测结果</text>
          <text class="detail-value" :class="getComplianceClass(fileDetails.compliance.status)">
            {{ getComplianceText(fileDetails.compliance.status) }}
          </text>
        </view>
        <view class="detail-item">
          <text class="detail-label">检测时间</text>
          <text class="detail-value">{{ formatFullDate(fileDetails.compliance.date) }}</text>
        </view>
        <view v-if="fileDetails.compliance.details" class="detail-item">
          <text class="detail-label">检测详情</text>
          <text class="detail-value">{{ fileDetails.compliance.details }}</text>
        </view>
      </view>
      
      <view class="detail-section">
        <view class="section-header">
          <text class="section-title">存储交易</text>
        </view>
        <view v-if="fileDetails.deals.length === 0" class="empty-deals">
          <text>暂无存储交易</text>
        </view>
        <view v-else class="deals-list">
          <view class="deal-item" v-for="(deal, index) in fileDetails.deals" :key="index">
            <view class="deal-header">
              <text class="deal-id">交易 #{{ deal.id }}</text>
              <text class="deal-status" :class="getDealStatusClass(deal.status)">
                {{ getDealStatusText(deal.status) }}
              </text>
            </view>
            <view class="deal-details">
              <view class="deal-detail-item">
                <text class="deal-detail-label">存储提供商</text>
                <text class="deal-detail-value">{{ deal.provider }}</text>
              </view>
              <view class="deal-detail-item">
                <text class="deal-detail-label">开始时间</text>
                <text class="deal-detail-value">{{ formatFullDate(deal.startDate) }}</text>
              </view>
              <view class="deal-detail-item">
                <text class="deal-detail-label">结束时间</text>
                <text class="deal-detail-value">{{ formatFullDate(deal.endDate) }}</text>
              </view>
              <view class="deal-detail-item">
                <text class="deal-detail-label">价格</text>
                <text class="deal-detail-value">{{ deal.price }} FIL</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="actions">
        <button class="action-btn download" @click="downloadFile">下载文件</button>
        <button class="action-btn share" @click="shareFile">分享</button>
        <button class="action-btn renew" @click="renewStorage">续期存储</button>
        <button class="action-btn delete" @click="deleteFile">删除文件</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cid: '',
      loading: true,
      error: null,
      fileDetails: null
    }
  },
  onLoad(options) {
    if (options.cid) {
      this.cid = decodeURIComponent(options.cid);
      this.loadFileDetails();
    } else {
      this.loading = false;
      this.error = '未找到文件CID';
    }
  },
  methods: {
    loadFileDetails() {
      this.loading = true;
      this.error = null;
      
      // 模拟API调用
      setTimeout(() => {
        // 模拟文件详情数据
        this.fileDetails = {
          name: '项目计划书.docx',
          size: 1024 * 1024 * 2.5, // 2.5MB
          date: new Date(2025, 4, 5), // 2025-05-05
          expiryDate: new Date(2026, 4, 5), // 2026-05-05
          type: 'docx',
          status: 'active',
          cid: this.cid,
          replicas: 3,
          compliance: {
            status: 'passed',
            date: new Date(2025, 4, 5),
            details: '文件内容符合合规要求'
          },
          deals: [
            {
              id: 'deal-123456',
              provider: 'f01234567',
              status: 'active',
              startDate: new Date(2025, 4, 5),
              endDate: new Date(2026, 4, 5),
              price: 0.0025
            },
            {
              id: 'deal-123457',
              provider: 'f07654321',
              status: 'active',
              startDate: new Date(2025, 4, 5),
              endDate: new Date(2026, 4, 5),
              price: 0.0023
            },
            {
              id: 'deal-123458',
              provider: 'f09876543',
              status: 'active',
              startDate: new Date(2025, 4, 5),
              endDate: new Date(2026, 4, 5),
              price: 0.0027
            }
          ]
        };
        
        this.loading = false;
      }, 1000);
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
    
    formatFullDate(date) {
      return date.getFullYear() + '-' + 
             (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
             date.getDate().toString().padStart(2, '0') + ' ' +
             date.getHours().toString().padStart(2, '0') + ':' +
             date.getMinutes().toString().padStart(2, '0');
    },
    
    getFileIconClass(type) {
      const iconMap = {
        'pdf': 'icon-pdf',
        'doc': 'icon-word',
        'docx': 'icon-word',
        'xls': 'icon-excel',
        'xlsx': 'icon-excel',
        'ppt': 'icon-ppt',
        'pptx': 'icon-ppt',
        'jpg': 'icon-image',
        'jpeg': 'icon-image',
        'png': 'icon-image',
        'gif': 'icon-image',
        'mp4': 'icon-video',
        'mov': 'icon-video',
        'mp3': 'icon-audio',
        'wav': 'icon-audio',
        'zip': 'icon-zip',
        'rar': 'icon-zip',
        'psd': 'icon-psd'
      };
      
      return iconMap[type] || 'icon-file';
    },
    
    getStatusClass(status) {
      const statusMap = {
        'active': 'status-success',
        'pending': 'status-pending',
        'expired': 'status-failed'
      };
      
      return statusMap[status] || '';
    },
    
    getStatusText(status) {
      const statusMap = {
        'active': '活跃',
        'pending': '待确认',
        'expired': '已过期'
      };
      
      return statusMap[status] || '未知';
    },
    
    getComplianceClass(status) {
      const statusMap = {
        'passed': 'compliance-passed',
        'pending': 'compliance-pending',
        'failed': 'compliance-failed'
      };
      
      return statusMap[status] || '';
    },
    
    getComplianceText(status) {
      const statusMap = {
        'passed': '通过',
        'pending': '审核中',
        'failed': '未通过'
      };
      
      return statusMap[status] || '未知';
    },
    
    getDealStatusClass(status) {
      const statusMap = {
        'active': 'deal-active',
        'pending': 'deal-pending',
        'expired': 'deal-expired',
        'failed': 'deal-failed'
      };
      
      return statusMap[status] || '';
    },
    
    getDealStatusText(status) {
      const statusMap = {
        'active': '活跃',
        'pending': '待确认',
        'expired': '已过期',
        'failed': '失败'
      };
      
      return statusMap[status] || '未知';
    },
    
    copyCID() {
      uni.setClipboardData({
        data: this.fileDetails.cid,
        success: () => {
          uni.showToast({
            title: 'CID已复制',
            icon: 'success'
          });
        }
      });
    },
    
    downloadFile() {
      uni.showLoading({
        title: '准备下载...'
      });
      
      // 模拟下载过程
      setTimeout(() => {
        uni.hideLoading();
        
        uni.showToast({
          title: '下载成功',
          icon: 'success'
        });
      }, 2000);
    },
    
    shareFile() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: this.fileDetails.name,
        summary: '我通过Filecoin存储分配器分享了一个文件',
        imageUrl: '/static/logo.png',
        href: 'https://example.com/share?cid=' + this.fileDetails.cid,
        success: function (res) {
          console.log('分享成功：' + JSON.stringify(res));
        },
        fail: function (err) {
          console.log('分享失败：' + JSON.stringify(err));
        }
      });
    },
    
    renewStorage() {
      uni.showModal({
        title: '续期存储',
        content: '确定要为此文件续期存储吗？',
        success: (res) => {
          if (res.confirm) {
            // 模拟续期过程
            uni.showLoading({
              title: '处理中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              
              // 更新到期日期
              const currentExpiryDate = new Date(this.fileDetails.expiryDate);
              this.fileDetails.expiryDate = new Date(
                currentExpiryDate.getFullYear() + 1,
                currentExpiryDate.getMonth(),
                currentExpiryDate.getDate()
              );
              
              // 更新交易到期日期
              this.fileDetails.deals.forEach(deal => {
                const currentEndDate = new Date(deal.endDate);
                deal.endDate = new Date(
                  currentEndDate.getFullYear() + 1,
                  currentEndDate.getMonth(),
                  currentEndDate.getDate()
                );
              });
              
              uni.showToast({
                title: '续期成功',
                icon: 'success'
              });
            }, 2000);
          }
        }
      });
    },
    
    deleteFile() {
      uni.showModal({
        title: '删除文件',
        content: '确定要删除此文件吗？此操作不可撤销。',
        success: (res) => {
          if (res.confirm) {
            // 模拟删除过程
            uni.showLoading({
              title: '处理中...'
            });
            
            setTimeout(() => {
              uni.hideLoading();
              
              uni.showToast({
                title: '删除成功',
                icon: 'success',
                success: () => {
                  // 返回上一页
                  setTimeout(() => {
                    uni.navigateBack();
                  }, 1500);
                }
              });
            }, 2000);
          }
        }
      });
    }
  }
}
</script>

<style>
.detail-container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.error {
  color: #f5222d;
}

.retry-btn {
  margin-top: 30rpx;
  padding: 10rpx 30rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 30rpx;
  font-size: 28rpx;
}

.file-details {
  
}

.file-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.file-icon {
  width: 100rpx;
  height: 100rpx;
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
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
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
  padding: 6rpx 16rpx;
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

.detail-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.detail-item {
  display: flex;
  margin-bottom: 20rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  width: 180rpx;
  font-size: 28rpx;
  color: #666;
}

.detail-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.detail-value.cid {
  display: flex;
  align-items: center;
  word-break: break-all;
}

.copy-btn {
  margin-left: 20rpx;
  padding: 4rpx 16rpx;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 20rpx;
  font-size: 24rpx;
  white-space: nowrap;
}

.compliance-passed {
  color: #52c41a;
}

.compliance-pending {
  color: #faad14;
}

.compliance-failed {
  color: #f5222d;
}

.empty-deals {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 28rpx;
}

.deals-list {
  
}

.deal-item {
  border: 1px solid #f0f0f0;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.deal-item:last-child {
  margin-bottom: 0;
}

.deal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.deal-id {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.deal-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.deal-active {
  background-color: #f6ffed;
  color: #52c41a;
}

.deal-pending {
  background-color: #fffbe6;
  color: #faad14;
}

.deal-expired {
  background-color: #fff2f0;
  color: #f5222d;
}

.deal-failed {
  background-color: #fff2f0;
  color: #f5222d;
}

.deal-details {
  padding: 20rpx;
}

.deal-detail-item {
  display: flex;
  margin-bottom: 10rpx;
}

.deal-detail-item:last-child {
  margin-bottom: 0;
}

.deal-detail-label {
  width: 150rpx;
  font-size: 26rpx;
  color: #666;
}

.deal-detail-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.action-btn {
  width: 48%;
  height: 90rpx;
  border-radius: 45rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.download {
  background-color: #007AFF;
  color: #fff;
}

.action-btn.share {
  background-color: #52c41a;
  color: #fff;
}

.action-btn.renew {
  background-color: #faad14;
  color: #fff;
}

.action-btn.delete {
  background-color: #f5222d;
  color: #fff;
}
</style>
