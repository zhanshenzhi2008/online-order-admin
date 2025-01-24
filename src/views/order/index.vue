<template>
  <div class="order-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="(label, value) in orderStatusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.userPhone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-buttons">
            <el-button type="primary" :icon="PieChart" @click="goToStatistics">
              订单统计
            </el-button>
            <el-button type="primary" :icon="Download" @click="handleExport">
              导出订单
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="userName" label="用户名" min-width="120" />
        <el-table-column prop="userPhone" label="手机号" width="120" />
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.status)">
              {{ orderStatusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <OrderStatusManager
              :order="row"
              @update="loadData"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { getOrderList, exportOrders } from '@/api/order'
import type { Order, OrderStatus } from '@/types/order'
import OrderStatusManager from '@/components/OrderStatusManager.vue'

const { Search, Refresh, View, Download, PieChart } = ElementPlusIconsVue

const router = useRouter()

// 订单状态映射
const orderStatusMap = {
  pending: '待支付',
  paid: '已支付',
  preparing: '制作中',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

// 获取订单状态对应的标签类型
const getOrderStatusType = (status: OrderStatus) => {
  const typeMap: Record<OrderStatus, 'info' | 'success' | 'warning' | 'danger'> = {
    pending: 'info',
    paid: 'warning',
    preparing: 'warning',
    delivering: 'warning',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info'
  }
  return typeMap[status]
}

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  status: undefined as OrderStatus | undefined,
  userName: '',
  userPhone: '',
})

const dateRange = ref<[string, string] | null>(null)

// 表格数据
const loading = ref(false)
const tableData = ref<Order[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    const [startTime, endTime] = dateRange.value || []
    const res = await getOrderList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
      startTime,
      endTime
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.orderNo = ''
  searchForm.status = undefined
  searchForm.userName = ''
  searchForm.userPhone = ''
  dateRange.value = null
  handleSearch()
}

// 分页变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadData()
}

// 查看详情
const handleDetail = (row: Order) => {
  router.push(`/order/detail/${row.id}`)
}

// 导出订单
const handleExport = async () => {
  try {
    const [startTime, endTime] = dateRange.value || []
    const blob = await exportOrders({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
      startTime,
      endTime
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '订单数据.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    ElMessage.error(error.message || '导出失败')
  }
}

// 跳转到订单统计页面
const goToStatistics = () => {
  router.push('/statistics/orders')
}

// 初始化
loadData()
</script>

<style lang="scss" scoped>
.order-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
  }
  
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-buttons {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 