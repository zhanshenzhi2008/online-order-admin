import request from '@/utils/request'
import type { 
  Admin, 
  Role, 
  Permission, 
  LoginParams, 
  LoginResult,
  ChangePasswordParams,
  SystemConfig
} from '@/types/system'

// 登录相关
export function login(data: LoginParams) {
  return request<LoginResult>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function changePassword(data: ChangePasswordParams) {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data
  })
}

// 管理员相关
export function getAdminList(params: any) {
  return request<{ list: Admin[]; total: number }>({
    url: '/admin/list',
    method: 'get',
    params
  })
}

export function createAdmin(data: Partial<Admin>) {
  return request<Admin>({
    url: '/admin/create',
    method: 'post',
    data
  })
}

export function updateAdmin(id: string, data: Partial<Admin>) {
  return request<Admin>({
    url: `/admin/${id}`,
    method: 'put',
    data
  })
}

export function deleteAdmin(id: string) {
  return request({
    url: `/admin/${id}`,
    method: 'delete'
  })
}

// 角色相关
export function getRoleList(params: any) {
  return request<{ list: Role[]; total: number }>({
    url: '/role/list',
    method: 'get',
    params
  })
}

export function createRole(data: Partial<Role>) {
  return request<Role>({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(id: string, data: Partial<Role>) {
  return request<Role>({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id: string) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

// 权限相关
export function getPermissionList() {
  return request<Permission[]>({
    url: '/permission/list',
    method: 'get'
  })
}

export function createPermission(data: Partial<Permission>) {
  return request<Permission>({
    url: '/permission/create',
    method: 'post',
    data
  })
}

export function updatePermission(id: string, data: Partial<Permission>) {
  return request<Permission>({
    url: `/permission/${id}`,
    method: 'put',
    data
  })
}

export function deletePermission(id: string) {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  })
}

// 系统配置相关
export function getSystemConfigList(params: any) {
  return request<{ list: SystemConfig[]; total: number }>({
    url: '/system-config/list',
    method: 'get',
    params
  })
}

export function createSystemConfig(data: Partial<SystemConfig>) {
  return request<SystemConfig>({
    url: '/system-config/create',
    method: 'post',
    data
  })
}

export function updateSystemConfig(id: string, data: Partial<SystemConfig>) {
  return request<SystemConfig>({
    url: `/system-config/${id}`,
    method: 'put',
    data
  })
}

export function deleteSystemConfig(id: string) {
  return request({
    url: `/system-config/${id}`,
    method: 'delete'
  })
} 