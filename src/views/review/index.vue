<template>
  <div class="review-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="评分">
          <el-select v-model="searchForm.rating" placeholder="请选择评分" clearable>
            <el-option
              v-for="rating in [1, 2, 3, 4, 5]"
              :key="rating"
              :label="`${rating}星`"
              :value="rating"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(label, value) in reviewStatusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评价时间">
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
          <span>评价列表</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate
              :model-value="row.rating"
              disabled
              show-score
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getReviewStatusType((row as Review).status)">
              {{ reviewStatusMap[(row as Review).status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="180" />
        <el-table-column prop="replyTime" label="回复时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleReply(row)">
              <el-icon><Edit /></el-icon>
              {{ row.reply ? '查看回复' : '回复' }}
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              link
              @click="handleAudit(row, 'approved')"
            >
              <el-icon><CircleCheck /></el-icon>
              通过
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              link
              @click="handleAudit(row, 'rejected')"
            >
              <el-icon><CircleClose /></el-icon>
              拒绝
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

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      :title="currentReview?.reply ? '查看回复' : '回复评价'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">
          {{ currentReview?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="订单号">
          {{ currentReview?.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate
            :model-value="currentReview?.rating ?? 0"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-descriptions-item>
        <el-descriptions-item label="评价内容">
          {{ currentReview?.content }}
        </el-descriptions-item>
        <el-descriptions-item label="评价时间">
          {{ currentReview?.createTime }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentReview?.reply" label="回复内容">
          {{ currentReview?.reply }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentReview?.replyTime" label="回复时间">
          {{ currentReview?.replyTime }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        v-if="!currentReview?.reply"
        ref="replyFormRef"
        :model="replyForm"
        :rules="replyRules"
        label-width="80px"
        class="reply-form"
      >
        <el-form-item label="回复内容" prop="reply">
          <el-input
            v-model="replyForm.reply"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">关闭</el-button>
          <el-button
            v-if="!currentReview?.reply"
            type="primary"
            @click="submitReply"
          >
            确认回复
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="auditDialogVisible"
      :title="auditForm.status === 'approved' ? '通过评价' : '拒绝评价'"
      width="500px"
    >
      <el-form
        ref="auditFormRef"
        :model="auditForm"
        :rules="auditRules"
        label-width="80px"
      >
        <el-form-item
          v-if="auditForm.status === 'rejected'"
          label="拒绝原因"
          prop="reason"
        >
          <el-input
            v-model="auditForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAudit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Search,
  Refresh,
  Edit,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import {
  getReviewList,
  replyReview,
  auditReview
} from '@/api/review'
import { ReviewStatus } from '@/types/review'
import type {
  Review,
  ReviewListParams,
  RatingLevel
} from '@/types/review'

// 评价状态映射
const reviewStatusMap: Record<ReviewStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
}

// 获取评价状态对应的标签类型
const getReviewStatusType = (status: ReviewStatus): 'info' | 'success' | 'warning' | 'danger' => {
  const typeMap: Record<ReviewStatus, 'info' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status]
}

// 搜索表单
const searchForm = reactive<Partial<ReviewListParams>>({
  username: '',
  orderNo: '',
  rating: undefined,
  status: undefined
})

const dateRange = ref<[string, string] | null>(null)

// 表格数据
const loading = ref(false)
const tableData = ref<Review[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    const [startTime, endTime] = dateRange.value || []
    const res = await getReviewList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
      startTime,
      endTime
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取评价列表失败')
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
  searchForm.orderNo = ''
  searchForm.rating = undefined
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

// 回复相关
const replyDialogVisible = ref(false)
const currentReview = ref<Review>()
const replyFormRef = ref<FormInstance>()
const replyForm = reactive({
  reply: ''
})

const replyRules = {
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 1, max: 500, message: '回复内容长度应在1-500个字符之间', trigger: 'blur' }
  ]
}

// 打开回复对话框
const handleReply = (row: Review) => {
  currentReview.value = row
  replyForm.reply = row.reply || ''
  replyDialogVisible.value = true
}

// 提交回复
const submitReply = async () => {
  if (!replyFormRef.value || !currentReview.value) return

  await replyFormRef.value.validate()

  try {
    await replyReview(currentReview.value.id, replyForm.reply)
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  }
}

// 审核相关
const auditDialogVisible = ref(false)
const auditFormRef = ref<FormInstance>()
const auditForm = reactive({
  status: 'approved' as ReviewStatus,
  reason: ''
})

const auditRules = {
  reason: [
    { required: true, message: '请输入拒绝原因', trigger: 'blur' },
    { min: 1, max: 500, message: '拒绝原因长度应在1-500个字符之间', trigger: 'blur' }
  ]
}

// 打开审核对话框
const handleAudit = (row: Review, status: ReviewStatus) => {
  currentReview.value = row
  auditForm.status = status
  auditForm.reason = ''
  auditDialogVisible.value = true
}

// 提交审核
const submitAudit = async () => {
  if (!auditFormRef.value || !currentReview.value) return

  if (auditForm.status === 'rejected') {
    await auditFormRef.value.validate()
  }

  try {
    await auditReview(
      currentReview.value.id,
      auditForm.status,
      auditForm.status === 'rejected' ? auditForm.reason : undefined
    )
    ElMessage.success('审核成功')
    auditDialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '审核失败')
  }
}

// 初始化
loadData()
</script>

<style lang="scss" scoped>
.review-container {
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

  .reply-form {
    margin-top: 20px;
  }
}
</style> 