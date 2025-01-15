/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus' {
  import type { Component } from 'vue'
  
  export const ElMessage: {
    success(message: string): void
    warning(message: string): void
    error(message: string): void
    info(message: string): void
  }
  
  export const ElMessageBox: {
    confirm(message: string, title: string, options?: any): Promise<void>
    prompt(message: string, title: string, options?: any): Promise<{ value: string }>
  }
  
  export interface FormInstance {
    validate(): Promise<boolean>
    validateField(props: string | string[]): Promise<void>
    resetFields(): void
    scrollToField(prop: string): void
  }

  export interface TreeInstance {
    filter(value: string): void
    getCheckedNodes(leafOnly?: boolean): any[]
    getCheckedKeys(leafOnly?: boolean): any[]
    setCheckedKeys(keys: any[]): void
    setChecked(key: string | number, checked: boolean): void
    getHalfCheckedNodes(): any[]
    getHalfCheckedKeys(): any[]
    getCurrentKey(): string | number
    getCurrentNode(): any
    setCurrentKey(key: string | number): void
    setCurrentNode(node: any): void
    getNode(key: string | number): any
    remove(node: any): void
    append(data: any, parentNode: any): void
    insertBefore(data: any, refNode: any): void
    insertAfter(data: any, refNode: any): void
  }
}

declare module '@element-plus/icons-vue' {
  import type { Component } from 'vue'
  
  export const Search: Component
  export const Refresh: Component
  export const Plus: Component
  export const Edit: Component
  export const Delete: Component
  export const Key: Component
  export const Switch: Component
  export const Setting: Component
  export const User: Component
  export const Lock: Component
  export const SwitchButton: Component
  export const Expand: Component
  export const Fold: Component
  export const House: Component
  export const Tools: Component
}

declare module 'vue-router' {
  import type { Component } from 'vue'
  
  export interface RouteLocationMatched {
    path: string
    name?: string
    meta: Record<string, any>
  }
  
  export interface RouteRecordRaw {
    path: string
    name?: string
    component: Component | (() => Promise<Component>)
    components?: Record<string, Component | (() => Promise<Component>)>
    redirect?: string | { name: string }
    meta?: Record<string, any>
    children?: RouteRecordRaw[]
  }
  
  export function createRouter(options: any): any
  export function createWebHistory(): any
  export function useRouter(): any
  export function useRoute(): any
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_PROXY: string
  readonly VITE_PROXY_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 