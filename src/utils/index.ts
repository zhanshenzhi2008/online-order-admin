import type { App } from 'vue'
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import type { AppRouteRecordRaw, RouteMeta } from '@/types'

// App
export function getAppEnvConfig() {
  const env = import.meta.env
  const {
    VITE_APP_TITLE,
    VITE_API_BASE_URL,
    VITE_UPLOAD_URL,
    VITE_IMAGE_BASE_URL,
    VITE_USE_MOCK,
    VITE_USE_PROXY,
    VITE_PROXY_PATH,
  } = env

  return {
    title: VITE_APP_TITLE,
    apiUrl: VITE_API_BASE_URL,
    uploadUrl: VITE_UPLOAD_URL,
    imageUrl: VITE_IMAGE_BASE_URL,
    useMock: VITE_USE_MOCK,
    useProxy: VITE_USE_PROXY,
    proxyPath: VITE_PROXY_PATH,
  }
}

// Storage
export const setStorage = (key: string, value: any) => {
  if (value === undefined || value === null) {
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export const getStorage = (key: string) => {
  const value = localStorage.getItem(key)
  if (value) {
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }
  return null
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(key)
}

export const clearStorage = () => {
  localStorage.clear()
}

// Cookie
export const setCookie = (key: string, value: any, expires = 7) => {
  const date = new Date()
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
  document.cookie = `${key}=${encodeURIComponent(
    JSON.stringify(value)
  )};expires=${date.toUTCString()}`
}

export const getCookie = (key: string) => {
  const name = `${key}=`
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.indexOf(name) === 0) {
      try {
        return JSON.parse(decodeURIComponent(cookie.substring(name.length)))
      } catch (error) {
        return cookie.substring(name.length)
      }
    }
  }
  return null
}

export const removeCookie = (key: string) => {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

// Date
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  return format
    .replace('YYYY', String(year))
    .replace('MM', String(month).padStart(2, '0'))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('HH', String(hour).padStart(2, '0'))
    .replace('mm', String(minute).padStart(2, '0'))
    .replace('ss', String(second).padStart(2, '0'))
}

export const formatTime = (time: number) => {
  if (time < 0) {
    return '00:00:00'
  }
  const hour = Math.floor(time / 3600)
  const minute = Math.floor((time % 3600) / 60)
  const second = Math.floor(time % 60)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

// String
export const formatMoney = (money: number | string, decimals = 2) => {
  return Number(money).toFixed(decimals)
}

export const formatPhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const formatBank = (bank: string) => {
  return bank.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
}

export const formatIdCard = (idCard: string) => {
  return idCard.replace(/(\d{6})\d+(\d{4})/, '$1********$2')
}

// Array
export const uniqueArray = <T>(arr: T[]) => {
  return Array.from(new Set(arr))
}

export const uniqueArrayByKey = <T>(arr: T[], key: keyof T) => {
  const map = new Map()
  return arr.filter((item) => {
    const value = item[key]
    if (!map.has(value)) {
      map.set(value, true)
      return true
    }
    return false
  })
}

export const arrayToTree = <T extends { id: string | number; pid: string | number }>(
  arr: T[],
  pid: string | number = 0
) => {
  const tree: T[] = []
  arr.forEach((item) => {
    if (item.pid === pid) {
      const children = arrayToTree(arr, item.id)
      if (children.length) {
        ;(item as any).children = children
      }
      tree.push(item)
    }
  })
  return tree
}

export const treeToArray = <T extends { children?: T[] }>(tree: T[]) => {
  const array: T[] = []
  tree.forEach((item) => {
    const { children, ...i } = item
    array.push(i as T)
    if (children && children.length) {
      array.push(...treeToArray(children))
    }
  })
  return array
}

// Object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj) as any
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any
  }
  const cloneObj = {} as any
  Object.keys(obj).forEach((key) => {
    cloneObj[key] = deepClone((obj as any)[key])
  })
  return cloneObj
}

export const deepMerge = <T extends object>(target: T, source: T): T => {
  Object.keys(source).forEach((key) => {
    const targetValue = target[key as keyof T]
    const sourceValue = source[key as keyof T]
    if (targetValue && sourceValue && typeof targetValue === 'object' && typeof sourceValue === 'object') {
      Object.assign(targetValue, deepMerge(targetValue as any, sourceValue as any))
    } else {
      target[key as keyof T] = sourceValue
    }
  })
  return target
}

// Route
export const getRoutePath = (path: string) => {
  return path.startsWith('/') ? path : `/${path}`
}

export const getRouteFullPath = (route: RouteLocationNormalized) => {
  let fullPath = ''
  route.matched.forEach((r) => {
    fullPath += getRoutePath(r.path)
  })
  return fullPath
}

export const getRouteMeta = (route: RouteLocationNormalized): RouteMeta => {
  return route.meta as RouteMeta
}

export const getRouteTitle = (route: RouteLocationNormalized) => {
  const meta = getRouteMeta(route)
  return meta.title || route.name || route.path
}

export const getActiveMenu = (route: RouteLocationNormalized) => {
  const meta = getRouteMeta(route)
  return meta.activeMenu || route.path
}

export const hasPermission = (route: AppRouteRecordRaw, roles: string[], permissions: string[]) => {
  const meta = route.meta
  if (!meta) {
    return true
  }
  if (meta.roles && meta.roles.length > 0) {
    return roles.some((role) => meta.roles?.includes(role))
  }
  if (meta.permissions && meta.permissions.length > 0) {
    return permissions.some((permission) => meta.permissions?.includes(permission))
  }
  return true
}

// Validation
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isPhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

export const isEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

export const isIdCard = (idCard: string) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

export const isUrl = (url: string) => {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(url)
}

// DOM
export const scrollTo = (element: HTMLElement, to: number, duration = 300) => {
  const start = element.scrollTop
  const change = to - start
  const increment = 20
  let currentTime = 0

  const animateScroll = () => {
    currentTime += increment
    const val = Math.easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }

  Math.easeInOutQuad = function (t: number, b: number, c: number, d: number) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  animateScroll()
}

export const scrollToTop = (element: HTMLElement, duration = 300) => {
  scrollTo(element, 0, duration)
}

export const scrollToBottom = (element: HTMLElement, duration = 300) => {
  scrollTo(element, element.scrollHeight - element.clientHeight, duration)
}

// File
export const downloadFile = (url: string, filename?: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || url.substring(url.lastIndexOf('/') + 1)
  link.click()
}

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  URL.revokeObjectURL(url)
}

export const getFileSize = (size: number) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

export const getFileType = (filename: string) => {
  return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
}

// Color
export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const getRgbaColor = (color: string, alpha: number) => {
  const div = document.createElement('div')
  div.style.backgroundColor = color
  document.body.appendChild(div)
  const rgbaColor = window.getComputedStyle(div).backgroundColor
  document.body.removeChild(div)
  return rgbaColor.replace(/[^,]+(?=\))/, String(alpha))
}

// Other
export const copyText = (text: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const input = document.createElement('textarea')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null
  let last = 0
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - last < delay) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        last = now
        fn.apply(this, args)
        timer = null
      }, delay)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
} 