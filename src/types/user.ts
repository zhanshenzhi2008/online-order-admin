// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',    // 正常
  DISABLED = 'disabled' // 禁用
}

// 用户反馈状态枚举
export enum FeedbackStatus {
  PENDING = 'pending',   // 待处理
  PROCESSING = 'processing', // 处理中
  RESOLVED = 'resolved',  // 已解决
  CLOSED = 'closed'      // 已关闭
}

// 用户反馈类型枚举
export enum FeedbackType {
  COMPLAINT = 'complaint',  // 投诉
  SUGGESTION = 'suggestion', // 建议
  QUESTION = 'question',    // 问题咨询
  OTHER = 'other'          // 其他
}

// 用户信息接口
export interface User {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  avatar: string;
  status: UserStatus;
  registerTime: string;
  lastLoginTime: string;
  orderCount: number;
  totalSpent: number;
}

// 用户反馈接口
export interface Feedback {
  id: string;
  userId: string;
  username: string;
  type: FeedbackType;
  title: string;
  content: string;
  status: FeedbackStatus;
  createTime: string;
  updateTime: string;
  reply?: string;
  replyTime?: string;
  images?: string[];
}

// 用户列表查询参数
export interface UserListParams {
  page: number;
  pageSize: number;
  username?: string;
  phone?: string;
  status?: UserStatus;
  startTime?: string;
  endTime?: string;
}

// 用户反馈查询参数
export interface FeedbackListParams {
  page: number;
  pageSize: number;
  userId?: string;
  type?: FeedbackType;
  status?: FeedbackStatus;
  startTime?: string;
  endTime?: string;
}

// 登录表单接口
export interface LoginForm {
  username: string
  password: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  user: UserInfo
} 