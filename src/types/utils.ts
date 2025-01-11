// Common
export type Nullable<T> = T | null
export type NonNullable<T> = T extends null | undefined ? never : T
export type Recordable<T = any> = Record<string, T>
export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
export type Indexable<T = any> = {
  [key: string]: T
}
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type TimeoutHandle = ReturnType<typeof setTimeout>
export type IntervalHandle = ReturnType<typeof setInterval>

// Function
export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

// Component
export interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

export type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

// Event
export type EventType = MouseEvent | TouchEvent | KeyboardEvent | FocusEvent

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
}

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

// Style
export interface CSSStyleDeclaration {
  [key: string]: string | number | null | undefined
}

// Theme
export interface ThemeVars {
  [key: string]: string | number | null | undefined
}

// Date
export type DateLike = Date | string | number

// Tree
export interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

export interface TreeItem {
  id: string | number
  [key: string]: any
}

// Menu
export interface MenuOption {
  path: string
  name: string
  component?: any
  components?: Record<string, any>
  redirect?: string
  meta: {
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
  children?: MenuOption[]
}

// Form
export interface FormItemRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  validator?: (rule: any, value: any, callback: any) => void
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
  enum?: any[]
  whitespace?: boolean
  fields?: Record<string, FormItemRule | FormItemRule[]>
  defaultField?: FormItemRule | FormItemRule[]
  transform?: (value: any) => any
  type?: string
  asyncValidator?: (rule: any, value: any, callback: any) => Promise<void>
}

// Table
export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => any
  render?: (row: any) => any
  slot?: string
}

// Upload
export interface UploadFile {
  name: string
  url: string
  status?: 'ready' | 'uploading' | 'success' | 'fail'
  size?: number
  type?: string
  raw?: File
  uid: string
  response?: any
  percent?: number
  [key: string]: any
}

// Chart
export interface ChartOptions {
  [key: string]: any
}

export interface ChartEvent {
  type: string
  event: Event
  target: any
  [key: string]: any
} 