/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_UPLOAD_URL: string
  readonly VITE_IMAGE_BASE_URL: string
  readonly VITE_USE_MOCK: boolean
  readonly VITE_USE_PROXY: boolean
  readonly VITE_PROXY_PATH: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json'
declare module '*.md'

declare module 'virtual:*' {
  const result: any
  export default result
}

declare module 'nprogress' {
  const nprogress: any
  export default nprogress
}

declare module 'mockjs' {
  const mockjs: any
  export default mockjs
}

declare module 'echarts' {
  const echarts: any
  export default echarts
}

declare module '@element-plus/icons-vue' {
  const icons: any
  export default icons
}

declare module '@vueuse/core' {
  const vueuse: any
  export default vueuse
}

declare module 'path-to-regexp' {
  const pathToRegexp: any
  export default pathToRegexp
}

declare module 'crypto-js' {
  const cryptoJs: any
  export default cryptoJs
}

declare module 'js-cookie' {
  const jsCookie: any
  export default jsCookie
}

declare module 'dayjs' {
  const dayjs: any
  export default dayjs
}

declare module 'lodash-es' {
  const lodashEs: any
  export default lodashEs
}

declare module 'axios' {
  const axios: any
  export default axios
}

declare module 'qs' {
  const qs: any
  export default qs
}

declare module 'vue-router' {
  const vueRouter: any
  export default vueRouter
}

declare module 'pinia' {
  const pinia: any
  export default pinia
}

declare module 'vue-i18n' {
  const vueI18n: any
  export default vueI18n
}

declare module 'element-plus' {
  const elementPlus: any
  export default elementPlus
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const zhCn: any
  export default zhCn
}

declare module 'element-plus/dist/locale/en.mjs' {
  const en: any
  export default en
} 