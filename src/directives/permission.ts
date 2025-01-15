import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const userStore = useUserStore()
  const { value } = binding

  if (value) {
    const hasPermission = Array.isArray(value)
      ? value.some(permission => userStore.hasPermission(permission))
      : userStore.hasPermission(value)

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('need permission! Like v-permission="\'system:user:add\'"')
  }
}

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  }
} 