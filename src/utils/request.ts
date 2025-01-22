import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
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
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    // 如果没有 code，说明是直接返回的数据
    if (code === undefined) {
      return response.data
    }

    // 根据自定义错误码处理错误
    switch (code) {
      case 0:
        return data
      case 401:
        // token 过期或未登录
        localStorage.removeItem('token')
        router.push('/login')
        ElMessage.error(message || '请重新登录')
        return Promise.reject(new Error(message || '请重新登录'))
      default:
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    let message = error.message
    if (error.response?.data?.message) {
      message = error.response.data.message
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 默认请求方法
function request<T = any>(config: InternalAxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}

// HTTP 方法
request.get = <T = any>(url: string, params?: any): Promise<T> => {
  return service({ method: 'GET', url, params }) as Promise<T>
}

request.post = <T = any>(url: string, data?: any): Promise<T> => {
  return service({ method: 'POST', url, data }) as Promise<T>
}

request.put = <T = any>(url: string, data?: any): Promise<T> => {
  return service({ method: 'PUT', url, data }) as Promise<T>
}

request.delete = <T = any>(url: string, params?: any): Promise<T> => {
  return service({ method: 'DELETE', url, params }) as Promise<T>
}

export default request 