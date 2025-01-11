import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'
import { SUCCESS_CODE, UNAUTHORIZED_CODE, FORBIDDEN_CODE } from '@/constants'

// Create axios instance
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data

    if (code === SUCCESS_CODE) {
      return data
    }

    // Handle business error
    ElMessage.error(message || 'Error')
    return Promise.reject(new Error(message || 'Error'))
  },
  (error) => {
    const { response } = error
    const { status, data } = response || {}

    // Handle HTTP error
    switch (status) {
      case UNAUTHORIZED_CODE:
        ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // TODO: Handle logout
          })
          .catch(() => {})
        break
      case FORBIDDEN_CODE:
        ElMessage.error('没有权限访问该资源')
        break
      default:
        ElMessage.error(data?.message || error.message || '系统错误')
    }

    return Promise.reject(error)
  }
)

// Request methods
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  },

  download(url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> {
    return service
      .get(url, {
        responseType: 'blob',
        ...config,
      })
      .then((response: any) => {
        const blob = new Blob([response])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename || url.substring(url.lastIndexOf('/') + 1)
        link.click()
        URL.revokeObjectURL(link.href)
      })
  },
}

export default request 