<template>
  <div class="app-wrapper" :class="{ 'is-collapse': isCollapse }">
    <!-- 侧边栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <el-image
          class="logo"
          src="https://element-plus.org/images/element-plus-logo.svg"
          fit="contain"
        />
        <h1 class="title">后台管理系统</h1>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <!-- 遍历路由生成菜单 -->
        <template v-for="route in routes" :key="route.path">
          <sidebar-item :item="route" :base-path="route.path" />
        </template>
      </el-menu>
    </div>
    
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left">
          <el-icon
            class="fold-btn"
            @click="toggleSidebar"
          >
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <breadcrumb />
        </div>
        
        <div class="right">
          <el-dropdown trigger="click">
            <div class="avatar-container">
              <el-avatar
                :size="32"
                :src="userInfo.avatar"
              />
              <span class="name">{{ userInfo.nickname }}</span>
              <el-icon class="el-icon--right">
                <i class="el-icon-arrow-down" />
              </el-icon>
            </div>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 主要内容区 -->
      <div class="app-main">
        <router-view />
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
  Lock,
  Tools,
  Expand,
  Fold,
  SwitchButton
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
  Lock,
  Tools
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
  height: 100%;
  
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 210px;
    background-color: #304156;
    transition: width 0.3s;
    z-index: 1001;
    overflow: hidden;
    
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
        margin: 0;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    
    .el-menu {
      border: none;
    }
  }
  
  .main-container {
    position: relative;
    margin-left: 210px;
    min-height: 100%;
    background: #f0f2f5;
    transition: margin-left 0.3s;
    
    .navbar {
      height: 50px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      
      .left {
        display: flex;
        align-items: center;
        
        .fold-btn {
          padding: 0 15px;
          cursor: pointer;
          font-size: 16px;
          
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
      
      .right {
        .avatar-container {
          display: flex;
          align-items: center;
          padding: 0 8px;
          cursor: pointer;
          
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
          
          .name {
            margin: 0 8px;
            font-size: 14px;
          }
        }
      }
    }
    
    .app-main {
      padding: 15px;
    }
  }
  
  &.is-collapse {
    .sidebar-container {
      width: 54px;
      
      .title {
        display: none;
      }
    }
    
    .main-container {
      margin-left: 54px;
    }
  }
}
</style> 