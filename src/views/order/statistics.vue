<template>
  <div class="statistics-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
              <el-tag>本月</el-tag>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics?.totalOrders || 0 }}</span>
            <span class="unit">单</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>总金额</span>
              <el-tag>本月</el-tag>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ (statistics?.totalAmount || 0).toFixed(2) }}</span>
            <span class="unit">元</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>待处理订单</span>
              <el-tag type="warning">实时</el-tag>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ statistics?.statusCounts?.pending || 0 }}</span>
            <span class="unit">单</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>今日完成</span>
              <el-tag type="success">今日</el-tag>
            </div>
          </template>
          <div class="statistics-value">
            <span class="number">{{ getTodayCompleted() }}</span>
            <span class="unit">单</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
              <el-radio-group v-model="chartDateRange" size="small">
                <el-radio-button label="7">近7天</el-radio-button>
                <el-radio-button label="30">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单状态分布</span>
            </div>
          </template>
          <div ref="statusChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品 -->
    <el-card class="hot-products">
      <template #header>
        <div class="card-header">
          <span>热销商品排行</span>
          <el-radio-group v-model="productRankRange" size="small">
            <el-radio-button label="amount">按销售额</el-radio-button>
            <el-radio-button label="count">按销量</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="getTopProducts()" border style="width: 100%">
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="salesCount" label="销量" width="120" />
        <el-table-column prop="salesAmount" label="销售额" width="150">
          <template #default="{ row }">
            ¥{{ row.salesAmount.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getOrderStatistics } from '@/api/order'
import type { OrderStatistics, OrderStatus } from '@/types/order'

// 注册必需的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  CanvasRenderer
])

const loading = ref(false)
const statistics = ref<OrderStatistics>()
const chartDateRange = ref('7')
const productRankRange = ref('amount')

// 图表引用
const trendChartRef = ref<HTMLElement>()
const statusChartRef = ref<HTMLElement>()
let trendChart: echarts.EChartsType | null = null
let statusChart: echarts.EChartsType | null = null

// 获取今日完成订单数
const getTodayCompleted = () => {
  if (!statistics.value?.dailyOrders) return 0
  const today = new Date().toISOString().split('T')[0]
  const todayData = statistics.value.dailyOrders.find(item => item.date === today)
  return todayData?.count || 0
}

// 获取热销商品
const getTopProducts = () => {
  if (!statistics.value?.topProducts) return []
  return [...statistics.value.topProducts].sort((a, b) => {
    if (productRankRange.value === 'amount') {
      return b.salesAmount - a.salesAmount
    }
    return b.salesCount - a.salesCount
  })
}

// 初始化订单趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (trendChart) {
    trendChart.dispose()
  }

  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['订单数', '销售额']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: statistics.value?.dailyOrders.map(item => item.date) || []
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        position: 'left'
      },
      {
        type: 'value',
        name: '销售额',
        position: 'right',
        axisLabel: {
          formatter: '{value} 元'
        }
      }
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: statistics.value?.dailyOrders.map(item => item.count) || []
      },
      {
        name: '销售额',
        type: 'line',
        yAxisIndex: 1,
        data: statistics.value?.dailyOrders.map(item => item.amount) || []
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化订单状态分布图
const initStatusChart = () => {
  if (!statusChartRef.value) return
  if (statusChart) {
    statusChart.dispose()
  }

  statusChart = echarts.init(statusChartRef.value)
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    preparing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }

  const data = Object.entries(statistics.value?.statusCounts || {}).map(([key, value]) => ({
    name: statusMap[key as OrderStatus],
    value
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  statusChart.setOption(option)
}

// 加载统计数据
const loadStatistics = async () => {
  loading.value = true
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number(chartDateRange.value))

    statistics.value = await getOrderStatistics({
      startTime: startDate.toISOString().split('T')[0],
      endTime: endDate.toISOString().split('T')[0]
    })

    // 初始化图表
    initTrendChart()
    initStatusChart()
  } catch (error: any) {
    ElMessage.error(error.message || '获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 监听日期范围变化
watch(chartDateRange, () => {
  loadStatistics()
})

// 监听窗口大小变化，重绘图表
const handleResize = () => {
  trendChart?.resize()
  statusChart?.resize()
}

onMounted(() => {
  loadStatistics()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  statusChart?.dispose()
})
</script>

<style lang="scss" scoped>
.statistics-container {
  padding: 20px;

  .statistics-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .statistics-value {
      text-align: center;
      padding: 10px 0;

      .number {
        font-size: 24px;
        font-weight: bold;
        color: #409EFF;
      }

      .unit {
        margin-left: 5px;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .charts-row {
    margin-top: 20px;
  }

  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart {
      height: 400px;
    }
  }

  .hot-products {
    margin-top: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 