<template>
  <div class="user-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>用户详情</span>
          <el-button type="primary" link @click="goBack">
            <el-icon><Back /></el-icon>
            返回列表
          </el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userInfo?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ userInfo?.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ userInfo?.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ userInfo?.email }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userInfo?.status === 'active' ? 'success' : 'danger'">
            {{ userStatusMap[userInfo?.status || 'active'] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ userInfo?.registerTime }}
        </el-descriptions-item>
        <el-descriptions-item label="订单数">
          {{ userInfo?.orderCount }}
        </el-descriptions-item>
        <el-descriptions-item label="消费金额">
          ¥{{ userInfo?.totalSpent?.toFixed(2) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 用户订单列表 -->
      <div class="order-section">
        <h3>订单记录</h3>
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
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { getUserDetail, getUserOrders } from '@/api/user'
import type { User, UserStatus } from '@/types/user'
import type { Order, OrderStatus } from '@/types/order'

const { Back, View } = ElementPlusIconsVue

const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

// 用户状态映射
const userStatusMap: Record<UserStatus, string> = {
  active: '正常',
  disabled: '禁用'
}

// 订单状态映射
const orderStatusMap: Record<OrderStatus, string> = {
  pending: '待支付',
  paid: '已支付',
  preparing: '制作中',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

// 获取订单状态对应的标签类型
const getOrderStatusType = (status: OrderStatus): 'info' | 'success' | 'warning' | 'danger' => {
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

// 用户信息
const loading = ref(false)
const userInfo = ref<User>()

// 订单数据
const orderLoading = ref(false)
const orderData = ref<Order[]>([])
const orderPage = ref(1)
const orderPageSize = ref(10)
const orderTotal = ref(0)

// 加载用户详情
const loadUserDetail = async () => {
  loading.value = true
  try {
    userInfo.value = await getUserDetail(userId)
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 加载订单数据
const loadOrderData = async () => {
  orderLoading.value = true
  try {
    const res = await getUserOrders(userId, {
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

// 返回列表
const goBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  loadUserDetail()
  loadOrderData()
})
</script>

<style lang="scss" scoped>
.user-detail-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-section {
    margin-top: 20px;

    h3 {
      margin-bottom: 16px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 