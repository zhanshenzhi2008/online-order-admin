<template>
  <div class="order-status-manager">
    <!-- 状态更新下拉菜单 -->
    <el-dropdown v-if="showStatusActions" @command="handleStatusChange">
      <el-button type="primary" link>
        <el-icon><Setting /></el-icon>
        状态管理
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-if="order.status === 'pending'"
            command="paid"
          >
            标记为已支付
          </el-dropdown-item>
          <el-dropdown-item
            v-if="order.status === 'paid'"
            command="preparing"
          >
            开始制作
          </el-dropdown-item>
          <el-dropdown-item
            v-if="order.status === 'preparing'"
            command="delivering"
          >
            开始配送
          </el-dropdown-item>
          <el-dropdown-item
            v-if="order.status === 'delivering'"
            command="completed"
          >
            完成订单
          </el-dropdown-item>
          <el-dropdown-item
            v-if="order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'refunded'"
            divided
            @click="handleCancel"
          >
            取消订单
          </el-dropdown-item>
          <el-dropdown-item
            v-if="order.status === 'paid'"
            @click="handleRefund"
          >
            退款
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 取消订单对话框 -->
    <el-dialog
      v-model="cancelDialogVisible"
      title="取消订单"
      width="500px"
    >
      <el-form :model="cancelForm" label-width="100px">
        <el-form-item label="取消原因" required>
          <el-input
            v-model="cancelForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCancel" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog
      v-model="refundDialogVisible"
      title="订单退款"
      width="500px"
    >
      <el-form :model="refundForm" label-width="100px">
        <el-form-item label="退款原因" required>
          <el-input
            v-model="refundForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入退款原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRefund" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { updateOrderStatus, cancelOrder, refundOrder } from '@/api/order'
import type { Order, OrderStatus } from '@/types/order'

const { Setting, ArrowDown } = ElementPlusIconsVue

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  (e: 'update', orderId: string): void
}>()

// 是否显示状态操作按钮
const showStatusActions = computed(() => {
  const status = props.order.status
  return status !== 'completed' && status !== 'cancelled' && status !== 'refunded'
})

// 取消订单相关
const cancelDialogVisible = ref(false)
const cancelForm = ref({
  reason: ''
})

// 退款相关
const refundDialogVisible = ref(false)
const refundForm = ref({
  reason: ''
})

const submitting = ref(false)

// 处理状态变更
const handleStatusChange = async (status: OrderStatus) => {
  try {
    await updateOrderStatus(props.order.id, status)
    ElMessage.success('状态更新成功')
    emit('update', props.order.id)
  } catch (error: any) {
    ElMessage.error(error.message || '状态更新失败')
  }
}

// 处理取消订单
const handleCancel = () => {
  cancelForm.value.reason = ''
  cancelDialogVisible.value = true
}

const confirmCancel = async () => {
  if (!cancelForm.value.reason) {
    ElMessage.warning('请输入取消原因')
    return
  }

  submitting.value = true
  try {
    await cancelOrder(props.order.id, cancelForm.value.reason)
    ElMessage.success('订单已取消')
    cancelDialogVisible.value = false
    emit('update', props.order.id)
  } catch (error: any) {
    ElMessage.error(error.message || '取消订单失败')
  } finally {
    submitting.value = false
  }
}

// 处理退款
const handleRefund = () => {
  refundForm.value.reason = ''
  refundDialogVisible.value = true
}

const confirmRefund = async () => {
  if (!refundForm.value.reason) {
    ElMessage.warning('请输入退款原因')
    return
  }

  submitting.value = true
  try {
    await refundOrder(props.order.id, refundForm.value.reason)
    ElMessage.success('退款成功')
    refundDialogVisible.value = false
    emit('update', props.order.id)
  } catch (error: any) {
    ElMessage.error(error.message || '退款失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.order-status-manager {
  display: inline-block;
}
</style> 