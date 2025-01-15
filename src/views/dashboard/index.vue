<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag type="success">实时</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">1,234</div>
            <div class="text">较昨日 +12.5%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
              <el-tag type="warning">日</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">89</div>
            <div class="text">较昨日 -2.3%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月销售额</span>
              <el-tag type="danger">月</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">￥45,678</div>
            <div class="text">较上月 +8.9%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
              <el-tag type="info">月</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">567</div>
            <div class="text">较上月 +5.6%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="saleChartType" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="saleChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div ref="userChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-row :gutter="20" class="table-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新订单</span>
              <el-button link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestOrders" style="width: 100%" size="large">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="customer" label="客户" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ￥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'warning'">
                  {{ row.status === 1 ? '已完成' : '处理中' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统日志</span>
              <el-button link>查看更多</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in systemLogs"
              :key="index"
              :type="log.type"
              :timestamp="log.time"
            >
              {{ log.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartOption } from 'echarts'
import { ElMessage } from 'element-plus'

// 销售图表类型
const saleChartType = ref('month')

// 图表实例
let saleChart: echarts.ECharts | null = null
let userChart: echarts.ECharts | null = null

// 图表容器
const saleChartRef = ref<HTMLDivElement>()
const userChartRef = ref<HTMLDivElement>()

// 最新订单
const latestOrders = ref([
  { orderNo: 'SO20240101001', customer: '张三', amount: 1299, status: 1 },
  { orderNo: 'SO20240101002', customer: '李四', amount: 2499, status: 0 },
  { orderNo: 'SO20240101003', customer: '王五', amount: 899, status: 1 },
  { orderNo: 'SO20240101004', customer: '赵六', amount: 3299, status: 0 }
])

// 系统日志
const systemLogs = ref([
  { content: '系统更新完成', time: '2024-01-01 10:00:00', type: 'success' },
  { content: '新用户注册: 张三', time: '2024-01-01 09:30:00', type: 'info' },
  { content: '检测到异常登录', time: '2024-01-01 09:00:00', type: 'warning' },
  { content: '数据库备份完成', time: '2024-01-01 08:30:00', type: 'success' }
])

// 初始化销售图表
const initSaleChart = () => {
  if (!saleChartRef.value) return

  saleChart = echarts.init(saleChartRef.value)
  const option: EChartOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销售额', '订单量']
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        stack: 'Total',
        data: [12000, 13200, 10100, 13400, 9000, 23000, 21000],
        smooth: true,
        areaStyle: {}
      },
      {
        name: '订单量',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310],
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  saleChart.setOption(option)
}

// 初始化用户图表
const initUserChart = () => {
  if (!userChartRef.value) return

  userChart = echarts.init(userChartRef.value)
  const option: EChartOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '华东' },
          { value: 735, name: '华北' },
          { value: 580, name: '华南' },
          { value: 484, name: '西北' },
          { value: 300, name: '西南' }
        ],
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
  userChart.setOption(option)
}

// 监听销售图表类型变化
watch(saleChartType, () => {
  // 根据类型更新图表数据
  if (saleChart) {
    const option = saleChart.getOption()
    // 这里应该根据类型请求新数据
    saleChart.setOption(option)
  }
})

// 监听窗口大小变化
const handleResize = () => {
  saleChart?.resize()
  userChart?.resize()
}

onMounted(() => {
  initSaleChart()
  initUserChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  saleChart?.dispose()
  userChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  
  .el-row {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-body {
    text-align: center;
    
    .number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .text {
      color: #909399;
      font-size: 14px;
    }
  }
  
  .chart {
    height: 350px;
  }
  
  .chart-row {
    margin: 20px 0;
  }
  
  .table-row {
    .el-card {
      height: 450px;
      
      .el-table {
        margin-top: -10px;
      }
      
      .el-timeline {
        margin-top: -10px;
        padding-left: 10px;
      }
    }
  }
}
</style> 