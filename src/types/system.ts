// 管理员接口
export interface Admin {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status: number; // 0: 禁用, 1: 正常
  roleIds: string[];
  createTime: string;
  updateTime: string;
}

// 角色接口
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: number; // 0: 禁用, 1: 正常
  createTime: string;
  updateTime: string;
}

// 权限接口
export interface Permission {
  id: string;
  name: string;
  code: string;
  type: number; // 1: 菜单, 2: 按钮
  parentId?: string;
  path?: string;
  icon?: string;
  component?: string;
  sort: number;
  status: number; // 0: 禁用, 1: 正常
  createTime: string;
  updateTime: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResult {
  token: string;
  admin: Admin;
}

// 修改密码参数
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 系统配置
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  createTime: string;
  updateTime: string;
} 