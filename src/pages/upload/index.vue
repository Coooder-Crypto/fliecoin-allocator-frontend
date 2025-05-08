<template>
  <view class="upload-container">
    <view class="header">
      <text class="title">文件上传</text>
      <text class="subtitle">上传文件将自动进行合规检测后存储到Filecoin网络</text>
    </view>
    
    <view class="upload-area" @click="chooseFile" :class="{ 'dragging': isDragging }">
      <view class="upload-icon"></view>
      <text class="upload-text">点击或拖拽文件到此处上传</text>
      <text class="upload-hint">支持各种文件格式，单个文件最大500MB</text>
    </view>
    
    <view v-if="uploadedFiles.length > 0" class="file-list">
      <view class="section-header">
        <text class="section-title">上传列表</text>
        <text v-if="hasCompletedUploads" class="clear-btn" @click="clearCompletedUploads">清除已完成</text>
      </view>
      
      <view class="file-item" v-for="(file, index) in uploadedFiles" :key="index">
        <view class="file-icon" :class="getFileIconClass(file.type)"></view>
        <view class="file-info">
          <text class="file-name">{{ file.name }}</text>
          <view class="file-meta">
            <text class="file-size">{{ formatSize(file.size) }}</text>
          </view>
          
          <!-- 上传进度 -->
          <view v-if="file.status === 'uploading'" class="progress-container">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: file.progress + '%' }"></view>
            </view>
            <text class="progress-text">{{ file.progress }}%</text>
          </view>
          
          <!-- 合规检测状态 -->
          <view v-if="file.status === 'checking'" class="status-container">
            <text class="status-text checking">正在进行合规检测...</text>
          </view>
          
          <!-- 存储状态 -->
          <view v-if="file.status === 'storing'" class="status-container">
            <text class="status-text storing">正在存储到Filecoin网络...</text>
          </view>
          
          <!-- 完成状态 -->
          <view v-if="file.status === 'success'" class="status-container">
            <text class="status-text success">存储成功</text>
            <text class="cid-text">CID: {{ file.cid }}</text>
          </view>
          
          <!-- 失败状态 -->
          <view v-if="file.status === 'failed'" class="status-container">
            <text class="status-text failed">{{ file.errorMessage || '处理失败' }}</text>
          </view>
        </view>
        
        <view class="file-actions">
          <!-- 取消上传 -->
          <view v-if="file.status === 'uploading'" class="action-btn cancel" @click="cancelUpload(index)">
            <text>取消</text>
          </view>
          
          <!-- 重试 -->
          <view v-if="file.status === 'failed'" class="action-btn retry" @click="retryUpload(index)">
            <text>重试</text>
          </view>
          
          <!-- 查看详情 -->
          <view v-if="file.status === 'success'" class="action-btn view" @click="viewFileDetails(file)">
            <text>详情</text>
          </view>
          
          <!-- 删除 -->
          <view v-if="file.status !== 'uploading'" class="action-btn delete" @click="removeFile(index)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="compliance-info">
      <view class="info-header">
        <text class="info-title">合规检测说明</text>
      </view>
      
      <view class="info-content">
        <view class="info-item">
          <text class="info-label">检测内容：</text>
          <text class="info-value">文件内容合规性、敏感信息、版权保护等</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">处理流程：</text>
          <text class="info-value">上传 → 合规检测 → Filecoin存储 → 生成CID</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">注意事项：</text>
          <text class="info-value">请勿上传违法违规内容，否则将无法通过合规检测</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isDragging: false,
      uploadedFiles: []
    }
  },
  computed: {
    hasCompletedUploads() {
      return this.uploadedFiles.some(file => file.status === 'success' || file.status === 'failed');
    }
  },
  methods: {
    chooseFile() {
      uni.chooseFile({
        count: 9, // 最多可以选择的文件数量
        type: 'all',
        success: (res) => {
          const files = res.tempFiles;
          
          // 处理选择的文件
          files.forEach(file => {
            // 检查文件大小
            if (file.size > 500 * 1024 * 1024) { // 500MB
              uni.showToast({
                title: '文件大小不能超过500MB',
                icon: 'none'
              });
              return;
            }
            
            // 获取文件类型
            const fileType = this.getFileType(file.name);
            
            // 添加到上传列表
            this.uploadedFiles.push({
              name: file.name,
              size: file.size,
              path: file.path,
              type: fileType,
              status: 'uploading',
              progress: 0,
              cid: '',
              errorMessage: ''
            });
            
            // 开始上传
            this.startUpload(this.uploadedFiles.length - 1);
          });
        }
      });
    },
    
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      return extension;
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
    
    formatSize(bytes) {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    startUpload(index) {
      const file = this.uploadedFiles[index];
      
      // 模拟上传进度
      let progress = 0;
      const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          
          // 上传完成，开始合规检测
          this.startComplianceCheck(index);
        }
        
        // 更新进度
        this.uploadedFiles[index].progress = progress;
      }, 300);
    },
    
    startComplianceCheck(index) {
      // 更新状态为检测中
      this.uploadedFiles[index].status = 'checking';
      
      // 模拟合规检测过程
      setTimeout(() => {
        const file = this.uploadedFiles[index];
        const fileName = file.name.toLowerCase();
        
        // 模拟检测结果（实际应用中应该调用后端API）
        let passed = true;
        let errorMessage = '';
        
        // 简单模拟一些违规内容检测
        if (fileName.includes('违规') || fileName.includes('illegal')) {
          passed = false;
          errorMessage = '文件内容不合规';
        }
        
        if (passed) {
          // 合规检测通过，开始存储
          this.startFilecoinStorage(index);
        } else {
          // 合规检测不通过
          this.uploadedFiles[index].status = 'failed';
          this.uploadedFiles[index].errorMessage = errorMessage;
        }
      }, 2000);
    },
    
    startFilecoinStorage(index) {
      // 更新状态为存储中
      this.uploadedFiles[index].status = 'storing';
      
      // 模拟Filecoin存储过程
      setTimeout(() => {
        // 生成随机CID
        const cid = 'bafy' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // 更新状态为成功
        this.uploadedFiles[index].status = 'success';
        this.uploadedFiles[index].cid = cid;
        
        // 存储成功通知
        uni.showToast({
          title: '文件存储成功',
          icon: 'success'
        });
      }, 3000);
    },
    
    cancelUpload(index) {
      // 取消上传
      this.uploadedFiles.splice(index, 1);
    },
    
    retryUpload(index) {
      // 重试上传
      this.uploadedFiles[index].status = 'uploading';
      this.uploadedFiles[index].progress = 0;
      this.uploadedFiles[index].errorMessage = '';
      
      // 开始上传
      this.startUpload(index);
    },
    
    removeFile(index) {
      // 删除文件
      this.uploadedFiles.splice(index, 1);
    },
    
    clearCompletedUploads() {
      // 清除已完成的上传
      this.uploadedFiles = this.uploadedFiles.filter(file => 
        file.status !== 'success' && file.status !== 'failed'
      );
    },
    
    viewFileDetails(file) {
      // 查看文件详情
      uni.navigateTo({
        url: '/pages/file-detail/index?cid=' + encodeURIComponent(file.cid)
      });
    }
  }
}
</script>

<style>
.upload-container {
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
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.upload-area {
  background-color: #fff;
  border: 2px dashed #ddd;
  border-radius: 10rpx;
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.upload-area.dragging {
  border-color: #007AFF;
  background-color: rgba(0, 122, 255, 0.05);
}

.upload-icon {
  width: 120rpx;
  height: 120rpx;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.upload-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.upload-hint {
  font-size: 24rpx;
  color: #999;
}

.file-list {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
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

.clear-btn {
  font-size: 24rpx;
  color: #007AFF;
}

.file-item {
  display: flex;
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
  margin-bottom: 10rpx;
}

.progress-container {
  margin-top: 10rpx;
}

.progress-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 6rpx;
}

.progress-fill {
  height: 100%;
  background-color: #007AFF;
  border-radius: 8rpx;
}

.progress-text {
  font-size: 22rpx;
  color: #999;
  text-align: right;
}

.status-container {
  margin-top: 10rpx;
}

.status-text {
  font-size: 24rpx;
}

.status-text.checking {
  color: #faad14;
}

.status-text.storing {
  color: #1890ff;
}

.status-text.success {
  color: #52c41a;
}

.status-text.failed {
  color: #f5222d;
}

.cid-text {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
  word-break: break-all;
}

.file-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20rpx;
}

.action-btn {
  padding: 6rpx 16rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  margin-bottom: 10rpx;
  text-align: center;
}

.action-btn:last-child {
  margin-bottom: 0;
}

.action-btn.cancel {
  background-color: #f0f0f0;
  color: #666;
}

.action-btn.retry {
  background-color: #e6f7ff;
  color: #1890ff;
}

.action-btn.view {
  background-color: #f6ffed;
  color: #52c41a;
}

.action-btn.delete {
  background-color: #fff2f0;
  color: #f5222d;
}

.compliance-info {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
}

.info-header {
  margin-bottom: 20rpx;
}

.info-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.info-content {
  
}

.info-item {
  margin-bottom: 16rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.info-value {
  font-size: 26rpx;
  color: #666;
}
</style>
