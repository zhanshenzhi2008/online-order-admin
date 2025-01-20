<template>
  <div class="coupon-management">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="优惠券名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入优惠券名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option
              v-for="(label, value) in couponTypeOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(label, value) in couponStatusOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="action-card">
      <template #header>
        <div class="card-header">
          <span>优惠券列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><plus /></el-icon>
            新建优惠券
          </el-button>
        </div>
      </template>

      <!-- 优惠券列表 -->
      <el-table
        v-loading="loading"
        :data="couponList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="优惠券名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getCouponTypeTag(row.type as CouponType)">
              {{ couponTypeOptions[row.type as CouponType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠金额/折扣" width="120">
          <template #default="{ row }">
            {{ formatCouponValue(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低使用金额" width="120">
          <template #default="{ row }">
            ¥{{ row.minAmount }}
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="240">
          <template #default="{ row }">
            {{ row.startTime }} 至 {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="发放总量" width="100" />
        <el-table-column prop="usedCount" label="已使用" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getCouponStatusTag(row.status as CouponStatus)">
              {{ couponStatusOptions[row.status as CouponStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === CouponStatus.DRAFT"
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.status === CouponStatus.ACTIVE"
              type="warning"
              size="small"
              @click="handlePause(row)"
            >
              暂停
            </el-button>
            <el-button
              v-if="row.status === CouponStatus.PAUSED"
              type="success"
              size="small"
              @click="handleResume(row)"
            >
              恢复
            </el-button>
            <el-button
              v-if="row.status === CouponStatus.DRAFT"
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getCouponList, deleteCoupon } from '@/api/marketing'
import type { Coupon } from '@/types/marketing'
import { CouponType, CouponStatus } from '@/types/marketing'

const router = useRouter()

// 优惠券类型选项
const couponTypeOptions: Record<CouponType, string> = {
  [CouponType.FIXED]: '固定金额',
  [CouponType.PERCENTAGE]: '折扣比例',
  [CouponType.SHIPPING]: '包邮券'
}

// 优惠券状态选项
const couponStatusOptions: Record<CouponStatus, string> = {
  [CouponStatus.DRAFT]: '草稿',
  [CouponStatus.ACTIVE]: '进行中',
  [CouponStatus.PAUSED]: '已暂停',
  [CouponStatus.EXPIRED]: '已过期',
  [CouponStatus.FINISHED]: '已结束'
}

// 搜索表单
const searchForm = ref({
  name: '',
  type: '' as CouponType | '',
  status: '' as CouponStatus | '',
  dateRange: [] as string[]
})

// 列表数据
const loading = ref(false)
const couponList = ref<Coupon[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载优惠券列表
const loadCouponList = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getCouponList({
      page: page.value,
      pageSize: pageSize.value,
      type: searchForm.value.type || undefined,
      status: searchForm.value.status || undefined,
      startTime: searchForm.value.dateRange?.[0],
      endTime: searchForm.value.dateRange?.[1],
      ...(searchForm.value.name ? { name: searchForm.value.name } : {})
    })
    couponList.value = list
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadCouponList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    name: '',
    type: '',
    status: '',
    dateRange: []
  }
  handleSearch()
}

// 新建优惠券
const handleCreate = () => {
  router.push('/marketing/coupons/create')
}

// 编辑优惠券
const handleEdit = (row: Coupon) => {
  router.push(`/marketing/coupons/edit/${row.id}`)
}

// 暂停优惠券
const handlePause = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm('确定要暂停该优惠券吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用暂停接口
    ElMessage.success('暂停成功')
    loadCouponList()
  } catch (error) {
    // 用户取消操作
  }
}

// 恢复优惠券
const handleResume = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm('确定要恢复该优惠券吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用恢复接口
    ElMessage.success('恢复成功')
    loadCouponList()
  } catch (error) {
    // 用户取消操作
  }
}

// 删除优惠券
const handleDelete = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm('确定要删除该优惠券吗？', '提示', {
      type: 'warning'
    })
    await deleteCoupon(row.id)
    ElMessage.success('删除成功')
    if (couponList.value.length === 1 && page.value > 1) {
      page.value--
    }
    loadCouponList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadCouponList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadCouponList()
}

// 格式化优惠券类型标签样式
const getCouponTypeTag = (type: CouponType) => {
  const map: Record<CouponType, 'success' | 'warning' | 'info'> = {
    [CouponType.FIXED]: 'success',
    [CouponType.PERCENTAGE]: 'warning',
    [CouponType.SHIPPING]: 'info'
  }
  return map[type]
}

// 格式化优惠券状态标签样式
const getCouponStatusTag = (status: CouponStatus) => {
  const map: Record<CouponStatus, 'success' | 'warning' | 'info' | 'danger'> = {
    [CouponStatus.DRAFT]: 'info',
    [CouponStatus.ACTIVE]: 'success',
    [CouponStatus.PAUSED]: 'warning',
    [CouponStatus.EXPIRED]: 'danger',
    [CouponStatus.FINISHED]: 'info'
  }
  return map[status]
}

// 格式化优惠券面值
const formatCouponValue = (coupon: Coupon) => {
  switch (coupon.type) {
    case CouponType.FIXED:
      return `¥${coupon.value}`
    case CouponType.PERCENTAGE:
      return `${coupon.value}折`
    case CouponType.SHIPPING:
      return '包邮'
    default:
      return '-'
  }
}

// 初始化
onMounted(() => {
  loadCouponList()
})
</script>

<style lang="scss" scoped>
.coupon-management {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .action-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 