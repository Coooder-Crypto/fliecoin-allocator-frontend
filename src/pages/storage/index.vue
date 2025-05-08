<template>
  <view class="storage-container">
    <view class="header">
      <text class="title">文件存储</text>
      <text class="subtitle">查看和管理您存储在Filecoin网络上的文件</text>
    </view>
    
    <view class="search-bar">
      <input class="search-input" type="text" v-model="searchKeyword" placeholder="搜索文件名" @input="handleSearch" />
      <view class="filter-btn" @click="showFilterOptions">
        <text>筛选</text>
      </view>
    </view>
    
    <view class="filter-tags" v-if="activeFilters.length > 0">
      <view class="filter-tag" v-for="(filter, index) in activeFilters" :key="index">
        <text>{{ filter.label }}</text>
        <text class="tag-close" @click="removeFilter(index)">×</text>
      </view>
      <text class="clear-filters" @click="clearFilters">清除全部</text>
    </view>
    
    <view class="storage-stats">
      <view class="stat-item">
        <text class="stat-value">{{ formatSize(storageStats.totalSize) }}</text>
        <text class="stat-label">总存储</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ storageStats.totalFiles }}</text>
        <text class="stat-label">文件数</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ storageStats.deals }}</text>
        <text class="stat-label">存储交易</text>
      </view>
    </view>
    
    <view class="tab-container">
      <view class="tab-header">
        <view 
          class="tab-item" 
          :class="{ active: currentTab === 'all' }" 
          @click="switchTab('all')"
        >
          <text>全部文件</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentTab === 'images' }" 
          @click="switchTab('images')"
        >
          <text>图片</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentTab === 'documents' }" 
          @click="switchTab('documents')"
        >
          <text>文档</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentTab === 'others' }" 
          @click="switchTab('others')"
        >
          <text>其他</text>
        </view>
      </view>
      
      <view class="tab-content">
        <view v-if="filteredFiles.length === 0" class="empty-state">
          <view class="empty-icon"></view>
          <text class="empty-text">暂无文件</text>
          <text class="empty-hint">您可以在上传页面添加文件</text>
          <button class="upload-btn" @click="navigateToUpload">去上传</button>
        </view>
        
        <view v-else class="file-list">
          <view class="file-item" v-for="(file, index) in filteredFiles" :key="index" @click="viewFileDetails(file)">
            <view class="file-icon" :class="getFileIconClass(file.type)"></view>
            <view class="file-info">
              <text class="file-name">{{ file.name }}</text>
              <view class="file-meta">
                <text class="file-size">{{ formatSize(file.size) }}</text>
                <text class="file-date">{{ formatDate(file.date) }}</text>
              </view>
              <view class="file-cid">
                <text>CID: {{ shortenCID(file.cid) }}</text>
              </view>
            </view>
            <view class="file-status" :class="getStatusClass(file.status)">
              <text>{{ getStatusText(file.status) }}</text>
            </view>
            <view class="file-actions">
              <view class="action-icon download" @click.stop="downloadFile(file)"></view>
              <view class="action-icon share" @click.stop="shareFile(file)"></view>
              <view class="action-icon more" @click.stop="showMoreActions(file)"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载更多 -->
    <view v-if="filteredFiles.length > 0 && hasMoreFiles" class="load-more" @click="loadMoreFiles">
      <text>加载更多</text>
    </view>
    
    <!-- 筛选弹窗 -->
    <view v-if="showFilter" class="filter-modal">
      <view class="filter-content">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="filter-close" @click="hideFilterOptions">×</text>
        </view>
        
        <view class="filter-section">
          <text class="section-title">文件类型</text>
          <view class="filter-options">
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.fileTypes.includes('image') }"
              @click="toggleFilterOption('fileTypes', 'image')"
            >
              <text>图片</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.fileTypes.includes('document') }"
              @click="toggleFilterOption('fileTypes', 'document')"
            >
              <text>文档</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.fileTypes.includes('video') }"
              @click="toggleFilterOption('fileTypes', 'video')"
            >
              <text>视频</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.fileTypes.includes('audio') }"
              @click="toggleFilterOption('fileTypes', 'audio')"
            >
              <text>音频</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.fileTypes.includes('other') }"
              @click="toggleFilterOption('fileTypes', 'other')"
            >
              <text>其他</text>
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">存储状态</text>
          <view class="filter-options">
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.status.includes('active') }"
              @click="toggleFilterOption('status', 'active')"
            >
              <text>活跃</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.status.includes('pending') }"
              @click="toggleFilterOption('status', 'pending')"
            >
              <text>待确认</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.status.includes('expired') }"
              @click="toggleFilterOption('status', 'expired')"
            >
              <text>已过期</text>
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">上传时间</text>
          <view class="filter-options">
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.timeRange === 'today' }"
              @click="setFilterOption('timeRange', 'today')"
            >
              <text>今天</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.timeRange === 'week' }"
              @click="setFilterOption('timeRange', 'week')"
            >
              <text>本周</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.timeRange === 'month' }"
              @click="setFilterOption('timeRange', 'month')"
            >
              <text>本月</text>
            </view>
            <view 
              class="filter-option" 
              :class="{ selected: filterOptions.timeRange === 'year' }"
              @click="setFilterOption('timeRange', 'year')"
            >
              <text>今年</text>
            </view>
          </view>
        </view>
        
        <view class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="apply-btn" @click="applyFilters">应用</button>
        </view>
      </view>
    </view>
    
    <!-- 更多操作弹窗 -->
    <view v-if="showMoreActionsModal" class="actions-modal">
      <view class="actions-content">
        <view class="action-item" @click="renameFile">
          <view class="action-icon rename"></view>
          <text class="action-text">重命名</text>
        </view>
        <view class="action-item" @click="copyFileCID">
          <view class="action-icon copy"></view>
          <text class="action-text">复制CID</text>
        </view>
        <view class="action-item" @click="viewFileDetails(selectedFile)">
          <view class="action-icon details"></view>
          <text class="action-text">查看详情</text>
        </view>
        <view class="action-item" @click="renewStorage">
          <view class="action-icon renew"></view>
          <text class="action-text">续期存储</text>
        </view>
        <view class="action-item delete" @click="deleteFile">
          <view class="action-icon delete"></view>
          <text class="action-text">删除文件</text>
        </view>
        <view class="action-cancel" @click="hideMoreActions">
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      currentTab: 'all',
      showFilter: false,
      showMoreActionsModal: false,
      selectedFile: null,
      filterOptions: {
        fileTypes: [],
        status: [],
        timeRange: ''
      },
      activeFilters: [],
      storageStats: {
        totalSize: 0,
        totalFiles: 0,
        deals: 0
      },
      files: [],
      currentPage: 1,
      hasMoreFiles: true
    }
  },
  computed: {
    filteredFiles() {
      let result = [...this.files];
      
      // 根据搜索关键词筛选
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(file => 
          file.name.toLowerCase().includes(keyword)
        );
      }
      
      // 根据当前标签筛选
      if (this.currentTab !== 'all') {
        if (this.currentTab === 'images') {
          result = result.filter(file => 
            ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(file.type)
          );
        } else if (this.currentTab === 'documents') {
          result = result.filter(file => 
            ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(file.type)
          );
        } else if (this.currentTab === 'others') {
          result = result.filter(file => 
            !['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(file.type)
          );
        }
      }
      
      // 应用活跃筛选条件
      if (this.activeFilters.length > 0) {
        // 文件类型筛选
        const fileTypeFilters = this.activeFilters.filter(f => f.type === 'fileType').map(f => f.value);
        if (fileTypeFilters.length > 0) {
          result = result.filter(file => {
            if (fileTypeFilters.includes('image') && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(file.type)) {
              return true;
            }
            if (fileTypeFilters.includes('document') && ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(file.type)) {
              return true;
            }
            if (fileTypeFilters.includes('video') && ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(file.type)) {
              return true;
            }
            if (fileTypeFilters.includes('audio') && ['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(file.type)) {
              return true;
            }
            if (fileTypeFilters.includes('other') && 
              !['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'mp3', 'wav', 'ogg', 'flac', 'aac'].includes(file.type)) {
              return true;
            }
            return false;
          });
        }
        
        // 状态筛选
        const statusFilters = this.activeFilters.filter(f => f.type === 'status').map(f => f.value);
        if (statusFilters.length > 0) {
          result = result.filter(file => statusFilters.includes(file.status));
        }
        
        // 时间范围筛选
        const timeFilter = this.activeFilters.find(f => f.type === 'timeRange');
        if (timeFilter) {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const thisWeekStart = new Date(today);
          thisWeekStart.setDate(today.getDate() - today.getDay());
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const thisYearStart = new Date(now.getFullYear(), 0, 1);
          
          result = result.filter(file => {
            const fileDate = new Date(file.date);
            if (timeFilter.value === 'today') {
              return fileDate >= today;
            } else if (timeFilter.value === 'week') {
              return fileDate >= thisWeekStart;
            } else if (timeFilter.value === 'month') {
              return fileDate >= thisMonthStart;
            } else if (timeFilter.value === 'year') {
              return fileDate >= thisYearStart;
            }
            return true;
          });
        }
      }
      
      return result;
    }
  },
  onLoad() {
    this.loadFiles();
    this.loadStorageStats();
  },
  methods: {
    loadFiles() {
      // 模拟从API获取文件列表
      // 在实际应用中，这里应该调用后端API
      
      // 模拟文件数据
      const newFiles = [
        {
          name: '项目计划书.docx',
          size: 1024 * 1024 * 2.5, // 2.5MB
          date: new Date(2025, 4, 5), // 2025-05-05
          type: 'docx',
          status: 'active',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
        },
        {
          name: '财务报表.xlsx',
          size: 1024 * 1024 * 1.2, // 1.2MB
          date: new Date(2025, 4, 3), // 2025-05-03
          type: 'xlsx',
          status: 'active',
          cid: 'bafybeihwrdpqjxzs4nh5z5fvpsfx3p2hk4d2ixzxpz3qxcnmx6zxzxzxzx'
        },
        {
          name: '产品设计图.psd',
          size: 1024 * 1024 * 15, // 15MB
          date: new Date(2025, 4, 1), // 2025-05-01
          type: 'psd',
          status: 'pending',
          cid: 'bafybeihjwrdpqjxzs4nh5z5fvpsfx3p2hk4d2ixzxpz3qxcnmx6zxzxzxz'
        },
        {
          name: '营销视频.mp4',
          size: 1024 * 1024 * 50, // 50MB
          date: new Date(2025, 3, 28), // 2025-04-28
          type: 'mp4',
          status: 'active',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzda'
        },
        {
          name: '公司Logo.png',
          size: 1024 * 512, // 512KB
          date: new Date(2025, 3, 25), // 2025-04-25
          type: 'png',
          status: 'active',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdb'
        },
        {
          name: '用户调研报告.pdf',
          size: 1024 * 1024 * 3.7, // 3.7MB
          date: new Date(2025, 3, 20), // 2025-04-20
          type: 'pdf',
          status: 'expired',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdc'
        },
        {
          name: '产品宣传音乐.mp3',
          size: 1024 * 1024 * 8.2, // 8.2MB
          date: new Date(2025, 3, 15), // 2025-04-15
          type: 'mp3',
          status: 'active',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdd'
        },
        {
          name: '源代码备份.zip',
          size: 1024 * 1024 * 25, // 25MB
          date: new Date(2025, 3, 10), // 2025-04-10
          type: 'zip',
          status: 'active',
          cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzde'
        }
      ];
      
      this.files = [...this.files, ...newFiles];
      
      // 更新是否有更多文件
      this.hasMoreFiles = this.currentPage < 3; // 模拟只有3页数据
      this.currentPage++;
    },
    
    loadStorageStats() {
      // 模拟从API获取存储统计数据
      this.storageStats = {
        totalSize: 1024 * 1024 * 1024 * 2.5, // 2.5GB
        totalFiles: 15,
        deals: 8
      };
    },
    
    loadMoreFiles() {
      this.loadFiles();
    },
    
    handleSearch() {
      // 搜索处理
      // 实际应用中可能需要调用API进行搜索
    },
    
    switchTab(tab) {
      this.currentTab = tab;
    },
    
    showFilterOptions() {
      this.showFilter = true;
    },
    
    hideFilterOptions() {
      this.showFilter = false;
    },
    
    toggleFilterOption(category, value) {
      const index = this.filterOptions[category].indexOf(value);
      if (index === -1) {
        this.filterOptions[category].push(value);
      } else {
        this.filterOptions[category].splice(index, 1);
      }
    },
    
    setFilterOption(category, value) {
      this.filterOptions[category] = value;
    },
    
    resetFilters() {
      this.filterOptions = {
        fileTypes: [],
        status: [],
        timeRange: ''
      };
    },
    
    applyFilters() {
      // 清除现有筛选条件
      this.activeFilters = [];
      
      // 添加文件类型筛选
      this.filterOptions.fileTypes.forEach(type => {
        let label = '';
        switch (type) {
          case 'image': label = '图片'; break;
          case 'document': label = '文档'; break;
          case 'video': label = '视频'; break;
          case 'audio': label = '音频'; break;
          case 'other': label = '其他'; break;
        }
        
        this.activeFilters.push({
          type: 'fileType',
          value: type,
          label: `类型: ${label}`
        });
      });
      
      // 添加状态筛选
      this.filterOptions.status.forEach(status => {
        let label = '';
        switch (status) {
          case 'active': label = '活跃'; break;
          case 'pending': label = '待确认'; break;
          case 'expired': label = '已过期'; break;
        }
        
        this.activeFilters.push({
          type: 'status',
          value: status,
          label: `状态: ${label}`
        });
      });
      
      // 添加时间范围筛选
      if (this.filterOptions.timeRange) {
        let label = '';
        switch (this.filterOptions.timeRange) {
          case 'today': label = '今天'; break;
          case 'week': label = '本周'; break;
          case 'month': label = '本月'; break;
          case 'year': label = '今年'; break;
        }
        
        this.activeFilters.push({
          type: 'timeRange',
          value: this.filterOptions.timeRange,
          label: `时间: ${label}`
        });
      }
      
      // 隐藏筛选弹窗
      this.hideFilterOptions();
    },
    
    removeFilter(index) {
      this.activeFilters.splice(index, 1);
    },
    
    clearFilters() {
      this.activeFilters = [];
    },
    
    showMoreActions(file) {
      this.selectedFile = file;
      this.showMoreActionsModal = true;
    },
    
    hideMoreActions() {
      this.showMoreActionsModal = false;
      this.selectedFile = null;
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
    
    shortenCID(cid) {
      if (!cid) return '';
      return cid.substring(0, 10) + '...' + cid.substring(cid.length - 4);
    },
    
    viewFileDetails(file) {
      // 查看文件详情
      uni.navigateTo({
        url: '/pages/file-detail/index?cid=' + encodeURIComponent(file.cid)
      });
    },
    
    downloadFile(file) {
      // 下载文件
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
    
    shareFile(file) {
      // 分享文件
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: file.name,
        summary: '我通过Filecoin存储分配器分享了一个文件',
        imageUrl: '/static/logo.png',
        href: 'https://example.com/share?cid=' + file.cid,
        success: function (res) {
          console.log('分享成功：' + JSON.stringify(res));
        },
        fail: function (err) {
          console.log('分享失败：' + JSON.stringify(err));
        }
      });
    },
    
    renameFile() {
      // 重命名文件
      uni.showModal({
        title: '重命名文件',
        editable: true,
        placeholderText: this.selectedFile.name,
        success: (res) => {
          if (res.confirm && res.content) {
            // 更新文件名
            const index = this.files.findIndex(f => f.cid === this.selectedFile.cid);
            if (index !== -1) {
              this.files[index].name = res.content;
              
              uni.showToast({
                title: '重命名成功',
                icon: 'success'
              });
            }
          }
        },
        complete: () => {
          this.hideMoreActions();
        }
      });
    },
    
    copyFileCID() {
      // 复制CID
      uni.setClipboardData({
        data: this.selectedFile.cid,
        success: () => {
          uni.showToast({
            title: 'CID已复制',
            icon: 'success'
          });
        },
        complete: () => {
          this.hideMoreActions();
        }
      });
    },
    
    renewStorage() {
      // 续期存储
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
              
              uni.showToast({
                title: '续期成功',
                icon: 'success'
              });
              
              // 更新文件状态
              const index = this.files.findIndex(f => f.cid === this.selectedFile.cid);
              if (index !== -1) {
                this.files[index].status = 'active';
              }
            }, 2000);
          }
        },
        complete: () => {
          this.hideMoreActions();
        }
      });
    },
    
    deleteFile() {
      // 删除文件
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
              
              // 从列表中移除文件
              const index = this.files.findIndex(f => f.cid === this.selectedFile.cid);
              if (index !== -1) {
                this.files.splice(index, 1);
              }
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }, 2000);
          }
        },
        complete: () => {
          this.hideMoreActions();
        }
      });
    },
    
    navigateToUpload() {
      uni.switchTab({
        url: '/pages/upload/index'
      });
    }
  }
}
</script>

<style>
.storage-container {
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

.search-bar {
  display: flex;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  background-color: #fff;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.filter-btn {
  width: 120rpx;
  height: 80rpx;
  background-color: #007AFF;
  border-radius: 40rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.filter-tag {
  background-color: #e6f7ff;
  border-radius: 30rpx;
  padding: 6rpx 20rpx;
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  color: #007AFF;
  display: flex;
  align-items: center;
}

.tag-close {
  margin-left: 10rpx;
  font-size: 28rpx;
}

.clear-filters {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
  display: flex;
  align-items: center;
}

.storage-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.stat-item {
  flex: 1;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin: 0 10rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.stat-item:first-child {
  margin-left: 0;
}

.stat-item:last-child {
  margin-right: 0;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.tab-container {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #007AFF;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #007AFF;
  border-radius: 2rpx;
}

.tab-content {
  padding: 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.empty-hint {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.upload-btn {
  width: 200rpx;
  height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-list {
  
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
  margin-right: 20rpx;
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
  margin-bottom: 6rpx;
}

.file-size {
  margin-right: 20rpx;
}

.file-cid {
  font-size: 22rpx;
  color: #999;
}

.file-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-right: 20rpx;
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

.file-actions {
  display: flex;
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
  margin-left: 10rpx;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  color: #007AFF;
  font-size: 28rpx;
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.filter-content {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.filter-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.filter-close {
  font-size: 40rpx;
  color: #999;
}

.filter-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
}

.filter-option {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-option.selected {
  background-color: #e6f7ff;
  color: #007AFF;
}

.filter-actions {
  display: flex;
  margin-top: 40rpx;
}

.reset-btn {
  flex: 1;
  height: 80rpx;
  background-color: #f5f5f5;
  color: #666;
  border-radius: 40rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apply-btn {
  flex: 1;
  height: 80rpx;
  background-color: #007AFF;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.actions-content {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.action-item:last-child {
  border-bottom: none;
}

.action-item.delete {
  color: #f5222d;
}

.action-icon {
  width: 50rpx;
  height: 50rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
}

.action-text {
  font-size: 30rpx;
}

.action-cancel {
  margin-top: 20rpx;
  padding: 30rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #999;
  border-top: 1px solid #f0f0f0;
}
</style>
