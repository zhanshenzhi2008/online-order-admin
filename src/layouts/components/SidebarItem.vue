<template>
  <div v-if="!item.meta?.hidden">
    <!-- 有子菜单的情况 -->
    <template v-if="hasChildren(item)">
      <el-sub-menu :index="resolvePath(item.path)">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(item.path)"
        />
      </el-sub-menu>
    </template>

    <!-- 没有子菜单的情况 -->
    <template v-else>
      <el-menu-item :index="resolvePath(item.path)">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta?.title }}</template>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { resolve } from 'path-browserify'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
  basePath: string
}>()

// 判断是否有子菜单
const hasChildren = (route: RouteRecordRaw) => {
  return route.children && route.children.length > 0
}

// 解析路由路径
const resolvePath = (routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  return resolve(props.basePath, routePath)
}
</script> 