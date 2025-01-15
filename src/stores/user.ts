import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/utils/auth'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<UserInfo | null>(getUser())

  // 设置token
  const setUserToken = (newToken: string) => {
    token.value = newToken
    setToken(newToken)
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    setUser(info)
  }

  // 清除用户信息
  const clearUser = () => {
    token.value = null
    userInfo.value = null
    removeToken()
    removeUser()
  }

  // 判断是否有权限
  const hasPermission = (permission: string) => {
    return userInfo.value?.permissions.includes(permission) ?? false
  }

  // 判断是否有角色
  const hasRole = (role: string) => {
    return userInfo.value?.roles.includes(role) ?? false
  }

  return {
    token,
    userInfo,
    setUserToken,
    setUserInfo,
    clearUser,
    hasPermission,
    hasRole
  }
}) 