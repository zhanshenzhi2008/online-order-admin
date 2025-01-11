// Storage keys
export const TOKEN_KEY = 'token'
export const USER_INFO_KEY = 'userInfo'
export const ROLES_KEY = 'roles'
export const PERMISSIONS_KEY = 'permissions'
export const THEME_KEY = 'theme'
export const LANG_KEY = 'lang'

// Theme
export const LIGHT_THEME = 'light'
export const DARK_THEME = 'dark'

// Language
export const ZH_CN = 'zh-CN'
export const EN_US = 'en-US'

// Layout
export const SIDEBAR_OPENED = 'opened'
export const SIDEBAR_CLOSED = 'closed'

// Response code
export const SUCCESS_CODE = 200
export const UNAUTHORIZED_CODE = 401
export const FORBIDDEN_CODE = 403
export const NOT_FOUND_CODE = 404
export const SERVER_ERROR_CODE = 500

// Request method
export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

// Content type
export const CONTENT_TYPE = {
  JSON: 'application/json;charset=UTF-8',
  FORM: 'application/x-www-form-urlencoded;charset=UTF-8',
  UPLOAD: 'multipart/form-data',
}

// User status
export const USER_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
}

// Order status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

// Payment method
export const PAYMENT_METHOD = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
}

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CLOSED: 'closed',
  REFUNDED: 'refunded',
}

// Food status
export const FOOD_STATUS = {
  ON_SALE: 1,
  OFF_SALE: 0,
}

// Shop status
export const SHOP_STATUS = {
  OPEN: 1,
  CLOSED: 0,
}

// Category status
export const CATEGORY_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
}

// Upload type
export const UPLOAD_TYPE = {
  IMAGE: 'image',
  FILE: 'file',
}

// Image type
export const IMAGE_TYPE = {
  AVATAR: 'avatar',
  FOOD: 'food',
  SHOP: 'shop',
  BANNER: 'banner',
}

// File size
export const FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  FILE: 10 * 1024 * 1024, // 10MB
}

// File type
export const FILE_TYPE = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif'],
  FILE: ['.doc', '.docx', '.xls', '.xlsx', '.pdf'],
}

// Date format
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZES = [10, 20, 50, 100]

// Chart colors
export const CHART_COLORS = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#36CE9E',
  '#FF9F7F',
  '#9F7FFF',
  '#FF7F7F',
  '#7F7FFF',
]

// Chart theme
export const CHART_THEME = {
  LIGHT: {
    backgroundColor: '#ffffff',
    textColor: '#303133',
    axisLineColor: '#E4E7ED',
    splitLineColor: '#E4E7ED',
    tooltipBackgroundColor: 'rgba(255, 255, 255, 0.9)',
    tooltipBorderColor: '#E4E7ED',
  },
  DARK: {
    backgroundColor: '#141414',
    textColor: '#E5EAF3',
    axisLineColor: '#4C4D4F',
    splitLineColor: '#4C4D4F',
    tooltipBackgroundColor: 'rgba(20, 20, 20, 0.9)',
    tooltipBorderColor: '#4C4D4F',
  },
} 