<template>
  <div class="app-wrapper" :class="{ 'is-collapse': isCollapse }">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <img src="@/assets/logo.png" class="logo" alt="logo">
        <h1 class="title" v-show="!isCollapse">后台管理系统</h1>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="route in routes" :key="route.path">
          <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
            <template #title>
              <el-icon v-if="route.meta?.icon">
                <component :is="getIcon(route.meta.icon)" />
              </el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            
            <el-menu-item 
              v-for="child in route.children"
              :key="child.path"
              :index="`${route.path}/${child.path}`"
            >
              <el-icon v-if="child.meta?.icon">
                <component :is="getIcon(child.meta.icon)" />
              </el-icon>
              <template #title>{{ child.meta?.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          
          <el-menu-item v-else :index="route.path">
            <el-icon v-if="route.meta?.icon">
              <component :is="getIcon(route.meta.icon)" />
            </el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    
    <!-- 主容器 -->
    <div class="main-container" :class="{ 'is-collapse': isCollapse }">
      <div class="navbar">
        <div class="left">
          <el-icon class="hamburger" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <breadcrumb />
        </div>
        
        <el-dropdown trigger="click">
          <div class="right-menu">
            <img :src="userInfo.avatar || '@/assets/avatar.png'" class="avatar">
            <span class="name">{{ userInfo.nickname }}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                <el-icon><switch-button /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  House,
  Setting,
  User,
  UserFilled,
  Lock,
  Tools,
  ShoppingBag,
  Menu,
  List,
  Box,
  Money,
  Expand,
  Fold,
  SwitchButton,
  ArrowDown
} from '@element-plus/icons-vue'
import { logout, getUser } from '@/utils/auth'
import type { UserInfo } from '@/types/user'
import SidebarItem from './components/SidebarItem.vue'
import Breadcrumb from './components/Breadcrumb.vue'

const router = useRouter()
const route = useRoute()

// 图标映射
const iconMap = {
  House,
  Setting,
  User,
  UserFilled,
  Lock,
  Tools,
  ShoppingBag,
  Menu,
  List,
  Box,
  Money
}

// 侧边栏折叠状态
const isCollapse = ref(false)

// 用户信息
const userInfo = computed<UserInfo>(() => getUser() || {
  id: 0,
  username: '',
  nickname: '',
  avatar: '',
  roles: [],
  permissions: []
})

// 路由菜单
const routes = computed(() => {
  return router.options.routes.filter((route: RouteRecordRaw) => !route.meta?.hidden)
})

// 获取图标组件
const getIcon = (name?: string) => {
  return name ? iconMap[name as keyof typeof iconMap] : null
}

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await logout()
    router.push('/login')
  })
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 220px;
    height: 100vh;
    background-color: #304156;
    transition: width 0.3s;
    z-index: 1001;
    overflow-y: auto;
    
    &.is-collapse {
      width: 64px;
    }
    
    .logo-container {
      height: 50px;
      padding: 10px;
      display: flex;
      align-items: center;
      background: #2b2f3a;
      
      .logo {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
      
      .title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .el-menu {
      border: none;
      background-color: transparent;
    }
  }
  
  .main-container {
    position: relative;
    min-height: 100%;
    transition: margin-left 0.3s;
    
    &.is-collapse {
    }
    
    .navbar {
      height: 50px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      position: fixed;
      top: 0;
      right: 0;
      left: 220px;
      z-index: 1000;
      transition: left 0.3s;
      
      &.is-collapse {
        left: 64px;
      }
      
      .hamburger {
        cursor: pointer;
        font-size: 20px;
      }
      
      .right-menu {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-right: 10px;
        }
        
        .name {
          margin-right: 10px;
          font-size: 14px;
        }
      }
    }
    
    .app-main {
      margin-left: 220px;
      padding: 70px 20px 20px 20px;
      min-height: calc(100vh - 50px);
      box-sizing: border-box;
      background-color: #f0f2f5;
      transition: margin-left 0.3s;

      .is-collapse & {
        margin-left: 64px;
      }
    }
  }
}
</style> 