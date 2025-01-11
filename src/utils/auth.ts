import { TOKEN_KEY, USER_INFO_KEY, ROLES_KEY, PERMISSIONS_KEY } from '@/constants'

// Get token from localStorage
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// Set token to localStorage
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// Remove token from localStorage
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// Get user info from localStorage
export function getUserInfo(): any {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

// Set user info to localStorage
export function setUserInfo(userInfo: any): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

// Remove user info from localStorage
export function removeUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY)
}

// Get roles from localStorage
export function getRoles(): string[] {
  const roles = localStorage.getItem(ROLES_KEY)
  return roles ? JSON.parse(roles) : []
}

// Set roles to localStorage
export function setRoles(roles: string[]): void {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles))
}

// Remove roles from localStorage
export function removeRoles(): void {
  localStorage.removeItem(ROLES_KEY)
}

// Get permissions from localStorage
export function getPermissions(): string[] {
  const permissions = localStorage.getItem(PERMISSIONS_KEY)
  return permissions ? JSON.parse(permissions) : []
}

// Set permissions to localStorage
export function setPermissions(permissions: string[]): void {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions))
}

// Remove permissions from localStorage
export function removePermissions(): void {
  localStorage.removeItem(PERMISSIONS_KEY)
}

// Clear all auth related data from localStorage
export function clearAuth(): void {
  removeToken()
  removeUserInfo()
  removeRoles()
  removePermissions()
} 