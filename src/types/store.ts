import type { UserInfo } from './api'
import type { AppRouteRecordRaw, TagView } from './router'

// App
export interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'tablet' | 'mobile'
  size: 'large' | 'default' | 'small'
  theme: 'light' | 'dark'
  language: string
}

// User
export interface UserState {
  token: string
  userInfo: Nullable<UserInfo>
  roles: string[]
  permissions: string[]
}

// Permission
export interface PermissionState {
  routes: AppRouteRecordRaw[]
  addRoutes: AppRouteRecordRaw[]
  menus: AppRouteRecordRaw[]
}

// TagsView
export interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}

// Settings
export interface SettingsState {
  title: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
  breadcrumb: boolean
  layout: 'left' | 'top' | 'mix'
  uniqueOpened: boolean
  showFooter: boolean
  footerContent: string
  colorWeak: boolean
  size: 'large' | 'default' | 'small'
  theme: 'light' | 'dark'
  language: string
}

// Global
export type Nullable<T> = T | null
export type TimeoutHandle = ReturnType<typeof setTimeout>
export type IntervalHandle = ReturnType<typeof setInterval>

export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

export interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

export type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

export type Recordable<T = any> = Record<string, T>

export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}

export interface ThemeVars {
  [key: string]: string | number | null | undefined
} 