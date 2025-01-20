<template>
  <div class="user-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(label, value) in userStatusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
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
          <span>用户列表</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ userStatusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" width="100" />
        <el-table-column prop="totalSpent" label="消费金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalSpent.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button type="primary" link @click="handleOrders(row)">
              <el-icon><List /></el-icon>
              查看订单
            </el-button>
            <el-button
              :type="row.status === 'active' ? 'danger' : 'success'"
              link
              @click="handleStatusChange(row)"
            >
              <el-icon><Lock /></el-icon>
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
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

    <!-- 用户订单对话框 -->
    <el-dialog
      v-model="orderDialogVisible"
      :title="'用户订单 - ' + currentUser?.username"
      width="80%"
    >
      <el-table
        v-loading="orderLoading"
        :data="orderData"
        border
        style="width: 100%"
      >
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
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
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleOrderDetail(row)">
              <el-icon><View /></el-icon>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="orderPage"
          v-model:page-size="orderPageSize"
          :total="orderTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleOrderSizeChange"
          @current-change="handleOrderCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { getUserList, updateUserStatus, getUserOrders } from '@/api/user'
import type { User, UserStatus } from '@/types/user'
import type { Order, OrderStatus } from '@/types/order'

const { Search, Refresh, View, List, Lock } = ElementPlusIconsVue

const router = useRouter()

// 用户状态映射
const userStatusMap = {
  active: '正常',
  disabled: '禁用'
}

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
  username: '',
  phone: '',
  status: undefined as UserStatus | undefined
})

const dateRange = ref<[string, string] | null>(null)

// 表格数据
const loading = ref(false)
const tableData = ref<User[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    const [startTime, endTime] = dateRange.value || []
    const res = await getUserList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
      startTime,
      endTime
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户列表失败')
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
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = undefined
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
const handleDetail = (row: User) => {
  router.push(`/user/detail/${row.id}`)
}

// 更新用户状态
const handleStatusChange = async (row: User) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  const action = newStatus === 'disabled' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 ${row.username} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await updateUserStatus(row.id, newStatus)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || `${action}失败`)
    }
  }
}

// 用户订单相关
const orderDialogVisible = ref(false)
const orderLoading = ref(false)
const orderData = ref<Order[]>([])
const orderPage = ref(1)
const orderPageSize = ref(10)
const orderTotal = ref(0)
const currentUser = ref<User>()

// 查看用户订单
const handleOrders = async (row: User) => {
  currentUser.value = row
  orderDialogVisible.value = true
  orderPage.value = 1
  await loadOrderData()
}

// 加载订单数据
const loadOrderData = async () => {
  if (!currentUser.value) return
  
  orderLoading.value = true
  try {
    const res = await getUserOrders(currentUser.value.id, {
      page: orderPage.value,
      pageSize: orderPageSize.value
    })
    orderData.value = res.list
    orderTotal.value = res.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户订单失败')
  } finally {
    orderLoading.value = false
  }
}

// 订单分页变化
const handleOrderSizeChange = (val: number) => {
  orderPageSize.value = val
  loadOrderData()
}

const handleOrderCurrentChange = (val: number) => {
  orderPage.value = val
  loadOrderData()
}

// 查看订单详情
const handleOrderDetail = (row: Order) => {
  router.push(`/order/detail/${row.id}`)
}

// 初始化
loadData()
</script>

<style lang="scss" scoped>
.user-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
  }
  
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 