<template>
  <div class="order-statistics">
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

    <!-- 订单概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
              <el-tag type="success">同比 +{{ orderData?.totalOrdersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(orderData?.totalOrders || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
              <el-tag type="success">同比 +{{ orderData?.todayOrdersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(orderData?.todayOrders || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>本月订单数</span>
              <el-tag type="success">同比 +{{ orderData?.monthOrdersGrowth || 0 }}%</el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(orderData?.monthOrders || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>订单转化率</span>
            </div>
          </template>
          <div class="card-value">{{ ((orderData?.completedOrders || 0) / (orderData?.totalOrders || 1) * 100).toFixed(2) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>订单趋势</span>
          <div class="chart-controls">
            <el-radio-group v-model="trendMetric" size="small" class="trend-metric">
              <el-radio-button label="count">订单量</el-radio-button>
              <el-radio-button label="amount">订单额</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="trendType" size="small" @change="handleTrendTypeChange">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <div ref="orderTrendChart" class="chart-container"></div>
    </el-card>

    <!-- 订单分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单状态分布</span>
            </div>
          </template>
          <div ref="statusDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>支付方式分布</span>
            </div>
          </template>
          <div ref="paymentDistributionChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单金额分析 -->
    <el-card class="amount-card">
      <template #header>
        <div class="card-header">
          <span>订单金额分析</span>
        </div>
      </template>
      <el-table :data="amountAnalysis" border style="width: 100%">
        <el-table-column prop="range" label="金额区间" />
        <el-table-column prop="count" label="订单数量">
          <template #default="{ row }">
            {{ formatNumber(row.count) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额">
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
import { getOrderStatistics, getOrderTrend } from '@/api/statistics'
import type { OrderStatistics } from '@/types/statistics'
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

// 数据和控制变量
const timeRange = ref<StatTimeRange>(StatTimeRange.LAST_30_DAYS)
const trendType = ref<'day' | 'month' | 'year'>('day')
const trendMetric = ref<'count' | 'amount'>('count')
const orderData = ref<OrderStatistics & {
  totalOrdersGrowth?: number
  todayOrdersGrowth?: number
  monthOrdersGrowth?: number
  completedOrders?: number
}>()

// 订单金额分析数据
const amountAnalysis = ref([
  { range: '0-50元', count: 0, amount: 0, percentage: 0 },
  { range: '51-100元', count: 0, amount: 0, percentage: 0 },
  { range: '101-200元', count: 0, amount: 0, percentage: 0 },
  { range: '201-500元', count: 0, amount: 0, percentage: 0 },
  { range: '501-1000元', count: 0, amount: 0, percentage: 0 },
  { range: '1000元以上', count: 0, amount: 0, percentage: 0 }
])

// 图表实例
let orderTrendChart: ECharts | null = null
let statusDistributionChart: ECharts | null = null
let paymentDistributionChart: ECharts | null = null

// 加载订单统计数据
const loadOrderData = async () => {
  try {
    orderData.value = await getOrderStatistics(timeRange.value)
    updateCharts()
  } catch (error: any) {
    ElMessage.error(error.message || '获取订单统计数据失败')
  }
}

// 加载订单趋势数据
const loadOrderTrend = async () => {
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

    const trend = await getOrderTrend(startDate, endDate, trendType.value)
    updateOrderTrendChart(trend)
  } catch (error: any) {
    ElMessage.error(error.message || '获取订单趋势数据失败')
  }
}

// 更新图表
const updateCharts = () => {
  if (!orderData.value) return

  // 更新订单状态分布图
  if (statusDistributionChart) {
    const statusData = orderData.value.statusDistribution.map(item => ({
      name: item.status,
      value: item.count
    }))

    statusDistributionChart.setOption({
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
          data: statusData
        }
      ]
    })
  }

  // 更新支付方式分布图
  if (paymentDistributionChart && orderData.value.paymentDistribution) {
    const paymentData = orderData.value.paymentDistribution.map(item => ({
      name: item.method,
      value: item.amount
    }))

    paymentDistributionChart.setOption({
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
          data: paymentData
        }
      ]
    })
  }
}

// 更新订单趋势图
const updateOrderTrendChart = (trend: OrderStatistics['orderTrend']) => {
  if (!orderTrendChart || !trend) return

  const xData = trend.map(item => item.date)
  const yData = trend.map(item => trendMetric.value === 'count' ? item.count : item.amount)

  orderTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.marker}${
          trendMetric.value === 'count' ? '订单量: ' : '订单额: ¥'
        }${formatNumber(data.value)}`
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
        formatter: (value: number) =>
          trendMetric.value === 'count'
            ? formatNumber(value)
            : `¥${formatNumber(value)}`
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
  loadOrderData()
  loadOrderTrend()
}

// 趋势类型变化
const handleTrendTypeChange = () => {
  loadOrderTrend()
}

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 初始化图表
const initCharts = () => {
  const trendEl = document.querySelector('.order-statistics .chart-container') as HTMLElement
  const statusEl = document.querySelector(
    '.order-statistics .analysis-row .chart-container:first-child'
  ) as HTMLElement
  const paymentEl = document.querySelector(
    '.order-statistics .analysis-row .chart-container:last-child'
  ) as HTMLElement

  if (trendEl) {
    orderTrendChart = echarts.init(trendEl)
  }

  if (statusEl) {
    statusDistributionChart = echarts.init(statusEl)
  }

  if (paymentEl) {
    paymentDistributionChart = echarts.init(paymentEl)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  orderTrendChart?.resize()
  statusDistributionChart?.resize()
  paymentDistributionChart?.resize()
}

// 组件挂载时初始化
onMounted(() => {
  initCharts()
  loadOrderData()
  loadOrderTrend()
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  orderTrendChart?.dispose()
  statusDistributionChart?.dispose()
  paymentDistributionChart?.dispose()
})
</script>

<style lang="scss" scoped>
.order-statistics {
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

      .chart-controls {
        display: flex;
        gap: 16px;

        .trend-metric {
          margin-right: 16px;
        }
      }
    }

    .chart-container {
      height: 400px;
    }
  }

  .analysis-row {
    .chart-container {
      height: 300px;
    }
  }

  .amount-card {
    margin-bottom: 20px;
  }
}
</style> 