<template>
  <div class="user-statistics">
    <!-- 时间范围选择 -->
    <el-card class="filter-card">
      <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
        <el-radio-button
          v-for="(label, value) in timeRangeOptions"
          :key="value"
          :label="value"
        >
          {{ label }}
        </el-radio-button>
      </el-radio-group>
    </el-card>

    <!-- 用户概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag type="success">同比 +{{ userData?.totalUsersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(userData?.totalUsers || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>活跃用户数</span>
              <el-tag type="success">同比 +{{ userData?.activeUsersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(userData?.activeUsers || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>新增用户数</span>
              <el-tag type="success">同比 +{{ userData?.newUsersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(userData?.newUsers || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>用户活跃率</span>
            </div>
          </template>
          <div class="card-value">{{ ((userData?.activeUsers || 0) / (userData?.totalUsers || 1) * 100).toFixed(2) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>用户趋势</span>
          <el-radio-group v-model="trendType" size="small" @change="handleTrendTypeChange">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="userTrendChart" class="chart-container"></div>
    </el-card>

    <!-- 用户分布 -->
    <el-row :gutter="20" class="distribution-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div ref="userDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户类型分布</span>
            </div>
          </template>
          <el-table
            :data="userData?.userDistribution || []"
            border
            style="width: 100%"
          >
            <el-table-column prop="type" label="用户类型" />
            <el-table-column prop="count" label="用户数量">
              <template #default="{ row }">
                {{ formatNumber(row.count) }}
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="占比">
              <template #default="{ row }">
                {{ row.percentage.toFixed(2) }}%
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts } from 'echarts/core'
import { getUserStatistics, getUserTrend } from '@/api/statistics'
import type { UserStatistics } from '@/types/statistics'
import { StatTimeRange } from '@/types/statistics'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition
])

// 时间范围选项
const timeRangeOptions = {
  [StatTimeRange.TODAY]: '今日',
  [StatTimeRange.YESTERDAY]: '昨日',
  [StatTimeRange.LAST_7_DAYS]: '近7天',
  [StatTimeRange.LAST_30_DAYS]: '近30天',
  [StatTimeRange.THIS_MONTH]: '本月',
  [StatTimeRange.LAST_MONTH]: '上月',
  [StatTimeRange.THIS_YEAR]: '本年'
}

// 数据和图表相关
const timeRange = ref<StatTimeRange>(StatTimeRange.LAST_30_DAYS)
const trendType = ref<'day' | 'month' | 'year'>('day')
const userData = ref<UserStatistics & {
  totalUsersGrowth?: number
  activeUsersGrowth?: number
  newUsersGrowth?: number
}>()

// 图表实例
let userTrendChart: ECharts | null = null
let userDistributionChart: ECharts | null = null

// 加载用户统计数据
const loadUserData = async () => {
  try {
    userData.value = await getUserStatistics(timeRange.value)
    updateCharts()
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户统计数据失败')
  }
}

// 加载用户趋势数据
const loadUserTrend = async () => {
  try {
    const now = new Date()
    let startDate: string
    let endDate = now.toISOString().split('T')[0]

    switch (timeRange.value) {
      case StatTimeRange.LAST_7_DAYS:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        break
      case StatTimeRange.LAST_30_DAYS:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
    }

    const trend = await getUserTrend(startDate, endDate, trendType.value)
    updateUserTrendChart(trend)
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户趋势数据失败')
  }
}

// 更新图表
const updateCharts = () => {
  if (!userData.value) return

  // 更新用户分布饼图
  if (userDistributionChart) {
    const pieData = userData.value.userDistribution.map(item => ({
      name: item.type,
      value: item.count
    }))

    userDistributionChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ]
    })
  }
}

// 更新用户趋势图
const updateUserTrendChart = (trend: UserStatistics['userTrend']) => {
  if (!userTrendChart || !trend) return

  const xData = trend.map(item => item.date)
  const newUsersData = trend.map(item => item.newUsers)
  const activeUsersData = trend.map(item => item.activeUsers)

  userTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].name}<br/>
          ${params[0].marker}新增用户: ${formatNumber(params[0].value)}<br/>
          ${params[1].marker}活跃用户: ${formatNumber(params[1].value)}`
      }
    },
    legend: {
      data: ['新增用户', '活跃用户']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: newUsersData,
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: {
          width: 3
        }
      },
      {
        name: '活跃用户',
        type: 'line',
        smooth: true,
        data: activeUsersData,
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  })
}

// 时间范围变化
const handleTimeRangeChange = () => {
  loadUserData()
  loadUserTrend()
}

// 趋势类型变化
const handleTrendTypeChange = () => {
  loadUserTrend()
}

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 初始化图表
const initCharts = () => {
  const trendEl = document.querySelector('.user-statistics .chart-container') as HTMLElement
  const distributionEl = document.querySelector(
    '.user-statistics .distribution-row .chart-container'
  ) as HTMLElement

  if (trendEl) {
    userTrendChart = echarts.init(trendEl)
  }

  if (distributionEl) {
    userDistributionChart = echarts.init(distributionEl)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  userTrendChart?.resize()
  userDistributionChart?.resize()
}

// 组件挂载时初始化
onMounted(() => {
  initCharts()
  loadUserData()
  loadUserTrend()
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  userTrendChart?.dispose()
  userDistributionChart?.dispose()
})
</script>

<style lang="scss" scoped>
.user-statistics {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;
  }

  .overview-row {
    margin-bottom: 20px;

    .overview-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
        margin-top: 10px;
      }
    }
  }

  .chart-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-container {
      height: 400px;
    }
  }

  .distribution-row {
    .chart-container {
      height: 300px;
    }
  }
}
</style> 