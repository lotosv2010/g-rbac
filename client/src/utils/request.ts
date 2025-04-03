import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5500',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 移除params中值为undefined的属性
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] === undefined || config.params[key] === null || config.params[key] === '') {
          Reflect.deleteProperty(config.params, key);
        }
      });
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          if(window.location.pathname.includes('/login')) {
            message.error('未授权，请重新登录');
          } else {
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求错误，未找到该资源');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(`连接错误${error.response.status}`);
      }
    } else {
      message.error('连接到服务器失败');
    }
    return Promise.reject(error);
  }
);

export default request; 