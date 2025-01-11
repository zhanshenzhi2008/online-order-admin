// Layout
export interface MenuItem {
  path: string
  name: string
  meta: {
    title: string
    icon?: string
    hidden?: boolean
    roles?: string[]
    permissions?: string[]
    keepAlive?: boolean
    activeMenu?: string
  }
  children?: MenuItem[]
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

// Form
export interface FormItem {
  prop: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date' | 'time' | 'datetime' | 'upload' | 'editor' | 'custom'
  rules?: any[]
  options?: Array<{
    label: string
    value: any
    disabled?: boolean
  }>
  props?: {
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
    multiple?: boolean
    filterable?: boolean
    [key: string]: any
  }
  span?: number
  render?: (form: any) => any
  slot?: string
}

// Search
export interface SearchItem extends Omit<FormItem, 'rules'> {
  defaultValue?: any
}

// Dialog
export interface DialogProps {
  title: string
  width?: number | string
  fullscreen?: boolean
  top?: string
  modal?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  center?: boolean
  destroyOnClose?: boolean
}

// Upload
export interface UploadProps {
  action: string
  headers?: Record<string, string>
  data?: Record<string, any>
  name?: string
  withCredentials?: boolean
  multiple?: boolean
  accept?: string
  listType?: 'text' | 'picture' | 'picture-card'
  autoUpload?: boolean
  disabled?: boolean
  limit?: number
}

// Chart
export interface ChartProps {
  width?: number | string
  height?: number | string
  options?: Record<string, any>
  loading?: boolean
  theme?: 'light' | 'dark'
}

// Pagination
export interface PaginationProps {
  total: number
  page: number
  size: number
  sizes?: number[]
  layout?: string
  background?: boolean
  autoScroll?: boolean
  hidden?: boolean
}

// Tree
export interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
  isLeaf?: boolean
  [key: string]: any
}

export interface TreeProps {
  data: TreeNode[]
  props?: {
    children?: string
    label?: string
    disabled?: string
    isLeaf?: string
  }
  nodeKey?: string
  checkStrictly?: boolean
  defaultExpandAll?: boolean
  expandOnClickNode?: boolean
  checkOnClickNode?: boolean
  defaultCheckedKeys?: (string | number)[]
  defaultExpandedKeys?: (string | number)[]
  currentNodeKey?: string | number
  showCheckbox?: boolean
  draggable?: boolean
  allowDrag?: (node: TreeNode) => boolean
  allowDrop?: (draggingNode: TreeNode, dropNode: TreeNode, type: 'prev' | 'inner' | 'next') => boolean
}

// Descriptions
export interface DescriptionItem {
  prop: string
  label: string
  span?: number
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  labelAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  formatter?: (row: any, item: DescriptionItem) => any
  render?: (row: any) => any
  slot?: string
}

// Steps
export interface StepItem {
  title: string
  description?: string
  icon?: string
  status?: 'wait' | 'process' | 'finish' | 'error' | 'success'
}

// Timeline
export interface TimelineItem {
  timestamp: string
  content: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  color?: string
  size?: 'normal' | 'large'
  hollow?: boolean
}

// Statistic
export interface StatisticProps {
  title: string
  value: number | string
  precision?: number
  prefix?: string
  suffix?: string
  separator?: string
  decimal?: string
  format?: (value: number) => string | number
  loading?: boolean
  valueStyle?: Record<string, any>
}

// Progress
export interface ProgressProps {
  percentage: number
  type?: 'line' | 'circle' | 'dashboard'
  status?: 'success' | 'exception' | 'warning'
  strokeWidth?: number
  textInside?: boolean
  width?: number
  showText?: boolean
  color?: string | Array<string | { color: string; percentage: number }>
  format?: (percentage: number) => string
} 