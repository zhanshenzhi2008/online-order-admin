import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import type { ApiResponse } from '@/types/common'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 如果是blob类型，直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    // 处理业务状态码
    if (code === 0) {
      return data
    }

    // 显示错误消息
    ElMessage.error(message || '系统错误')
    return Promise.reject(new Error(message || '系统错误'))
  },
  (error) => {
    // 处理HTTP错误
    let message = ''
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // TODO: 跳转到登录页
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求错误，未找到该资源'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = '网络错误'
      }
    } else {
      message = error.message
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 封装GET请求
const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.get(url, config)
}

// 封装POST请求
const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.post(url, data, config)
}

// 封装PUT请求
const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.put(url, data, config)
}

// 封装DELETE请求
const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.delete(url, config)
}

// 封装PATCH请求
const patch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.patch(url, data, config)
}

export default {
  get,
  post,
  put,
  delete: del,
  patch
} 