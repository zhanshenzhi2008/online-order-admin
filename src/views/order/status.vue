<template>
  <div class="order-status">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单状态管理</span>
        </div>
      </template>

      <!-- 状态流转配置 -->
      <el-table :data="statusFlowConfig" border>
        <el-table-column prop="from" label="当前状态" width="180">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.from)">
              {{ orderStatusMap[row.from] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="to" label="可流转状态">
          <template #default="{ row }">
            <el-tag
              v-for="status in row.to"
              :key="status"
              :type="getStatusType(status)"
              class="status-tag"
            >
              {{ orderStatusMap[status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="300" />
      </el-table>

      <!-- 状态说明 -->
      <div class="status-description">
        <h3>状态说明</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item v-for="(label, value) in orderStatusMap" :key="value" :label="label">
            <el-tag :type="getStatusType(value)">{{ value }}</el-tag>
            <div class="status-detail">{{ getStatusDescription(value) }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { OrderStatus } from '@/types/order'

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

// 状态流转配置
const statusFlowConfig = [
  {
    from: 'pending' as OrderStatus,
    to: ['paid', 'cancelled'] as OrderStatus[],
    description: '待支付订单可以支付或取消'
  },
  {
    from: 'paid' as OrderStatus,
    to: ['preparing', 'refunded'] as OrderStatus[],
    description: '已支付订单可以开始制作或申请退款'
  },
  {
    from: 'preparing' as OrderStatus,
    to: ['delivering'] as OrderStatus[],
    description: '制作中的订单完成后可以开始配送'
  },
  {
    from: 'delivering' as OrderStatus,
    to: ['completed'] as OrderStatus[],
    description: '配送中的订单送达后可以完成'
  },
  {
    from: 'completed' as OrderStatus,
    to: [] as OrderStatus[],
    description: '已完成订单为最终状态'
  },
  {
    from: 'cancelled' as OrderStatus,
    to: [] as OrderStatus[],
    description: '已取消订单为最终状态'
  },
  {
    from: 'refunded' as OrderStatus,
    to: [] as OrderStatus[],
    description: '已退款订单为最终状态'
  }
]

// 获取状态对应的标签类型
const getStatusType = (status: OrderStatus) => {
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

// 获取状态详细说明
const getStatusDescription = (status: OrderStatus) => {
  const descriptionMap: Record<OrderStatus, string> = {
    pending: '订单已创建，等待用户支付',
    paid: '用户已完成支付，等待商家处理',
    preparing: '商家正在制作订单中的商品',
    delivering: '商品已制作完成，正在配送中',
    completed: '订单已完成，交易结束',
    cancelled: '订单已取消，交易关闭',
    refunded: '订单已退款，交易关闭'
  }
  return descriptionMap[status]
}
</script>

<style lang="scss" scoped>
.order-status {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-tag {
    margin-right: 8px;
    
    &:last-child {
      margin-right: 0;
    }
  }

  .status-description {
    margin-top: 20px;

    h3 {
      margin-bottom: 15px;
    }

    .status-detail {
      margin-top: 8px;
      color: #666;
      font-size: 14px;
    }
  }
}
</style> 