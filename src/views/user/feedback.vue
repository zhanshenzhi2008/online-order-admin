<template>
  <div class="feedback-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="反馈类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option
              v-for="(label, value) in feedbackTypeMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="(label, value) in feedbackStatusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈时间">
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
          <span>反馈列表</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="type" label="反馈类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ feedbackTypeMap[(row as Feedback).type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getFeedbackStatusType((row as Feedback).status)">
              {{ feedbackStatusMap[(row as Feedback).status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="反馈时间" width="180" />
        <el-table-column prop="replyTime" label="回复时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleReply(row)">
              <el-icon><Message /></el-icon>
              {{ row.status === 'pending' ? '回复' : '查看回复' }}
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              link
              @click="handleClose(row)"
            >
              <el-icon><Delete /></el-icon>
              关闭
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
      :title="currentFeedback?.status === 'pending' ? '回复反馈' : '反馈详情'"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">
          {{ currentFeedback?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="反馈类型">
          {{ feedbackTypeMap[currentFeedback?.type || 'other'] }}
        </el-descriptions-item>
        <el-descriptions-item label="标题">
          {{ currentFeedback?.title }}
        </el-descriptions-item>
        <el-descriptions-item label="内容">
          {{ currentFeedback?.content }}
        </el-descriptions-item>
        <el-descriptions-item label="反馈时间">
          {{ currentFeedback?.createTime }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentFeedback?.reply" label="回复内容">
          {{ currentFeedback?.reply }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentFeedback?.replyTime" label="回复时间">
          {{ currentFeedback?.replyTime }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form
        v-if="currentFeedback?.status === 'pending'"
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
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button
            v-if="currentFeedback?.status === 'pending'"
            type="primary"
            @click="submitReply"
          >
            确认回复
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 关闭反馈对话框 -->
    <el-dialog
      v-model="closeDialogVisible"
      title="关闭反馈"
      width="500px"
    >
      <el-form
        ref="closeFormRef"
        :model="closeForm"
        :rules="closeRules"
        label-width="80px"
      >
        <el-form-item label="关闭原因" prop="reason">
          <el-input
            v-model="closeForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入关闭原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitClose">
            确认关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Search,
  Refresh,
  Message,
  Delete
} from '@element-plus/icons-vue'
import {
  getFeedbackList,
  replyFeedback,
  closeFeedback
} from '@/api/user'
import type {
  Feedback,
  FeedbackType,
  FeedbackStatus,
  FeedbackListParams
} from '@/types/user'

// 反馈类型映射
const feedbackTypeMap: Record<FeedbackType, string> = {
  complaint: '投诉',
  suggestion: '建议',
  question: '问题咨询',
  other: '其他'
}

// 反馈状态映射
const feedbackStatusMap: Record<FeedbackStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭'
}

// 获取反馈状态对应的标签类型
const getFeedbackStatusType = (status: FeedbackStatus): 'info' | 'success' | 'warning' | 'danger' => {
  const typeMap: Record<FeedbackStatus, 'info' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    processing: 'info',
    resolved: 'success',
    closed: 'danger'
  }
  return typeMap[status]
}

// 搜索表单
const searchForm = reactive<Partial<FeedbackListParams> & { username?: string }>({
  username: '',
  type: undefined,
  status: undefined
})

const dateRange = ref<[string, string] | null>(null)

// 表格数据
const loading = ref(false)
const tableData = ref<Feedback[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    const [startTime, endTime] = dateRange.value || []
    const res = await getFeedbackList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm,
      startTime,
      endTime
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error: any) {
    ElMessage.error(error.message || '获取反馈列表失败')
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
  searchForm.type = undefined
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
const currentFeedback = ref<Feedback>()
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
const handleReply = (row: Feedback) => {
  currentFeedback.value = row
  replyForm.reply = row.reply || ''
  replyDialogVisible.value = true
}

// 提交回复
const submitReply = async () => {
  if (!replyFormRef.value || !currentFeedback.value) return

  await replyFormRef.value.validate()

  try {
    await replyFeedback(currentFeedback.value.id, replyForm.reply)
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  }
}

// 关闭反馈相关
const closeDialogVisible = ref(false)
const closeFormRef = ref<FormInstance>()
const closeForm = reactive({
  reason: ''
})

const closeRules = {
  reason: [
    { required: true, message: '请输入关闭原因', trigger: 'blur' },
    { min: 1, max: 500, message: '关闭原因长度应在1-500个字符之间', trigger: 'blur' }
  ]
}

// 打开关闭对话框
const handleClose = (row: Feedback) => {
  currentFeedback.value = row
  closeForm.reason = ''
  closeDialogVisible.value = true
}

// 提交关闭
const submitClose = async () => {
  if (!closeFormRef.value || !currentFeedback.value) return

  await closeFormRef.value.validate()

  try {
    await closeFeedback(currentFeedback.value.id, closeForm.reason)
    ElMessage.success('关闭成功')
    closeDialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '关闭失败')
  }
}

// 初始化
loadData()
</script>

<style lang="scss" scoped>
.feedback-container {
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