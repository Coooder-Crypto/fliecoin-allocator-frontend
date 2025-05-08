import { createSSRApp } from "vue";
import App from "./App.vue";

// 全局样式
import './uni.scss';

export function createApp() {
	const app = createSSRApp(App);
	
	// 全局错误处理
	app.config.errorHandler = (err, vm, info) => {
		console.error('全局错误:', err, info);
	};
	
	// 全局属性
	app.config.globalProperties.$filters = {
		// 格式化文件大小
		formatSize(bytes) {
			if (bytes === 0) return '0 B';
			
			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},
		
		// 格式化日期
		formatDate(date) {
			if (!date) return '';
			
			if (typeof date === 'string') {
				date = new Date(date);
			}
			
			return date.getFullYear() + '-' + 
				(date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
				date.getDate().toString().padStart(2, '0');
		}
	};
	
	return {
		app
	};
}
