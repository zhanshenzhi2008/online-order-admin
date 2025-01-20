<template>
  <div class="sales-statistics">
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

    <!-- 销售概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
              <el-tag type="success">同比 +{{ salesData?.totalSalesGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">¥{{ formatNumber(salesData?.totalSales || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
              <el-tag type="success">同比 +{{ salesData?.todaySalesGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">¥{{ formatNumber(salesData?.todaySales || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>本月销售额</span>
              <el-tag type="success">同比 +{{ salesData?.monthSalesGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">¥{{ formatNumber(salesData?.monthSales || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>本年销售额</span>
              <el-tag type="success">同比 +{{ salesData?.yearSalesGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">¥{{ formatNumber(salesData?.yearSales || 0) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>销售趋势</span>
          <el-radio-group v-model="trendType" size="small" @change="handleTrendTypeChange">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="salesTrendChart" class="chart-container"></div>
    </el-card>

    <!-- 品类销售分布 -->
    <el-row :gutter="20" class="distribution-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>品类销售分布</span>
            </div>
          </template>
          <div ref="categoryPieChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>品类销售排行</span>
            </div>
          </template>
          <el-table
            :data="salesData?.categoryDistribution || []"
            border
            style="width: 100%"
          >
            <el-table-column prop="category" label="品类" />
            <el-table-column prop="amount" label="销售额">
              <template #default="{ row }">
                ¥{{ formatNumber(row.amount) }}
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
import { getSalesStatistics, getSalesTrend } from '@/api/statistics'
import type { SalesStatistics } from '@/types/statistics'
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
const salesData = ref<SalesStatistics & { 
  totalSalesGrowth?: number
  todaySalesGrowth?: number
  monthSalesGrowth?: number
  yearSalesGrowth?: number
}>()

// 图表实例
let salesTrendChart: echarts.ECharts | null = null
let categoryPieChart: echarts.ECharts | null = null

// 加载销售统计数据
const loadSalesData = async () => {
  try {
    salesData.value = await getSalesStatistics(timeRange.value)
    updateCharts()
  } catch (error: any) {
    ElMessage.error(error.message || '获取销售统计数据失败')
  }
}

// 加载销售趋势数据
const loadSalesTrend = async () => {
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

    const trend = await getSalesTrend(startDate, endDate, trendType.value)
    updateSalesTrendChart(trend)
  } catch (error: any) {
    ElMessage.error(error.message || '获取销售趋势数据失败')
  }
}

// 更新图表
const updateCharts = () => {
  if (!salesData.value) return

  // 更新品类分布饼图
  if (categoryPieChart) {
    const pieData = salesData.value.categoryDistribution.map(item => ({
      name: item.category,
      value: item.amount
    }))

    categoryPieChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)'
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

// 更新销售趋势图
const updateSalesTrendChart = (trend: SalesStatistics['salesTrend']) => {
  if (!salesTrendChart || !trend) return

  const xData = trend.map(item => item.date)
  const yData = trend.map(item => item.amount)

  salesTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.marker}销售额: ¥${formatNumber(data.value)}`
      }
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
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${formatNumber(value)}`
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: yData,
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
  loadSalesData()
  loadSalesTrend()
}

// 趋势类型变化
const handleTrendTypeChange = () => {
  loadSalesTrend()
}

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 初始化图表
const initCharts = () => {
  const salesTrendEl = document.querySelector('.sales-statistics .chart-container') as HTMLElement
  const categoryPieEl = document.querySelector(
    '.sales-statistics .distribution-row .chart-container'
  ) as HTMLElement

  if (salesTrendEl) {
    salesTrendChart = echarts.init(salesTrendEl)
  }

  if (categoryPieEl) {
    categoryPieChart = echarts.init(categoryPieEl)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  salesTrendChart?.resize()
  categoryPieChart?.resize()
}

// 组件挂载时初始化
onMounted(() => {
  initCharts()
  loadSalesData()
  loadSalesTrend()
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesTrendChart?.dispose()
  categoryPieChart?.dispose()
})
</script>

<style lang="scss" scoped>
.sales-statistics {
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