import type { RouteRecordRaw } from 'vue-router'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name: string
  meta: RouteMeta
  children?: AppRouteRecordRaw[]
}

export interface RouteMeta {
  title: string
  icon?: string
  hidden?: boolean
  roles?: string[]
  permissions?: string[]
  keepAlive?: boolean
  activeMenu?: string
  breadcrumb?: boolean
  affix?: boolean
  noCache?: boolean
  noTag?: boolean
}

export interface TagView {
  path: string
  name: string
  title: string
  affix?: boolean
  noCache?: boolean
}

export interface Breadcrumb {
  path: string
  title: string
} 