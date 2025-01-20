<template>
  <div class="order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions v-loading="loading" :column="2" border>
        <el-descriptions-item label="订单号">{{ order?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getOrderStatusType(order?.status)">
            {{ orderStatusMap[order?.status || ''] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{ order?.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ order?.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="配送地址" :span="2">{{ order?.userAddress }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ order?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ order?.paymentTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="配送时间">{{ order?.deliveryTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ order?.completionTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ order?.paymentMethod }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ order?.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ order?.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <div class="order-items">
        <h3>订单商品</h3>
        <el-table :data="order?.items || []" border style="width: 100%">
          <el-table-column prop="productName" label="商品名称" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.productImage"
                  :preview-src-list="[row.productImage]"
                  fit="cover"
                  class="product-image"
                />
                <span>{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="120">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="120" />
          <el-table-column prop="subtotal" label="小计" width="120">
            <template #default="{ row }">
              ¥{{ row.subtotal.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="order-timeline">
        <h3>订单进度</h3>
        <el-timeline>
          <el-timeline-item
            v-if="order?.completionTime"
            :timestamp="order.completionTime"
            type="success"
          >
            订单已完成
          </el-timeline-item>
          <el-timeline-item
            v-if="order?.deliveryTime"
            :timestamp="order.deliveryTime"
            type="warning"
          >
            开始配送
          </el-timeline-item>
          <el-timeline-item
            v-if="order?.paymentTime"
            :timestamp="order.paymentTime"
            type="warning"
          >
            订单已支付
          </el-timeline-item>
          <el-timeline-item
            :timestamp="order?.createTime"
            type="primary"
          >
            订单创建
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order'
import type { Order, OrderStatus } from '@/types/order'

const route = useRoute()
const loading = ref(false)
const order = ref<Order>()

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
const getOrderStatusType = (status?: OrderStatus) => {
  if (!status) return ''
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

// 加载订单详情
const loadOrderDetail = async () => {
  const orderId = route.params.id as string
  if (!orderId) {
    ElMessage.error('订单ID不能为空')
    return
  }

  loading.value = true
  try {
    order.value = await getOrderDetail(orderId)
  } catch (error: any) {
    ElMessage.error(error.message || '获取订单详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-items {
    margin-top: 20px;

    h3 {
      margin-bottom: 15px;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .product-image {
        width: 50px;
        height: 50px;
        border-radius: 4px;
      }
    }
  }

  .order-timeline {
    margin-top: 20px;

    h3 {
      margin-bottom: 15px;
    }
  }
}
</style> 