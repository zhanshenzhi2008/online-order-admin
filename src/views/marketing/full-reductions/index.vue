<template>
  <div class="full-reductions-management">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="规则名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入规则名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="(label, value) in statusOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>满减规则</span>
          <el-button type="primary" @click="handleCreate">新建规则</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="ruleList" border style="width: 100%">
        <el-table-column prop="name" label="规则名称" min-width="150" show-overflow-tooltip />
        <el-table-column label="满减门槛" min-width="200">
          <template #default="{ row }">
            <div v-for="(threshold, index) in row.thresholds" :key="index">
              满{{ threshold.amount }}减{{ threshold.discount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="240">
          <template #default="{ row }">
            {{ row.startTime }} 至 {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ statusOptions[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
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
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="规则名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入规则名称"
          />
        </el-form-item>
        <el-form-item label="满减门槛" prop="thresholds">
          <div
            v-for="(threshold, index) in form.thresholds"
            :key="index"
            class="threshold-item"
          >
            <el-input-number
              v-model="threshold.amount"
              :min="0"
              :precision="2"
              :step="10"
              controls-position="right"
              placeholder="满足金额"
            />
            <span class="threshold-separator">减</span>
            <el-input-number
              v-model="threshold.discount"
              :min="0"
              :precision="2"
              :step="5"
              controls-position="right"
              placeholder="优惠金额"
            />
            <el-button
              type="danger"
              circle
              :icon="Delete"
              @click="removeThreshold(index)"
            />
          </div>
          <el-button
            type="primary"
            plain
            :icon="Plus"
            @click="addThreshold"
          >
            添加门槛
          </el-button>
        </el-form-item>
        <el-form-item label="有效期" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="规则说明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规则说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import {
  getFullReductionList,
  getFullReductionDetail,
  createFullReduction,
  updateFullReduction,
  deleteFullReduction,
  pauseFullReduction,
  resumeFullReduction
} from '@/api/marketing'
import type {
  FullReductionRule,
  FullReductionThreshold,
  FullReductionListParams
} from '@/types/marketing'
import { CouponStatus } from '@/types/marketing'

// 状态选项
const statusOptions: Record<CouponStatus, string> = {
  [CouponStatus.DRAFT]: '草稿',
  [CouponStatus.ACTIVE]: '进行中',
  [CouponStatus.PAUSED]: '已暂停',
  [CouponStatus.EXPIRED]: '已过期',
  [CouponStatus.FINISHED]: '已结束'
}

// 搜索表单
const searchForm = ref({
  name: '',
  status: '' as CouponStatus | ''
})

// 列表数据
const loading = ref(false)
const ruleList = ref<FullReductionRule[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载规则列表
const loadRuleList = async () => {
  loading.value = true
  try {
    const params: FullReductionListParams = {
      page: page.value,
      pageSize: pageSize.value,
      name: searchForm.value.name,
      status: searchForm.value.status || undefined
    }
    const { list, total: totalCount } = await getFullReductionList(params)
    ruleList.value = list
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取规则列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadRuleList()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    name: '',
    status: ''
  }
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadRuleList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadRuleList()
}

// 编辑弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref<{
  id?: string
  name: string
  thresholds: FullReductionThreshold[]
  timeRange: string[]
  description: string
}>({
  name: '',
  thresholds: [],
  timeRange: [],
  description: ''
})
const submitting = ref(false)

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  thresholds: [
    { required: true, message: '请添加满减门槛', trigger: 'change' },
    {
      validator: (rule: any, value: FullReductionThreshold[]) => {
        if (value.length === 0) {
          return Promise.reject('请添加满减门槛')
        }
        for (const threshold of value) {
          if (!threshold.amount || !threshold.discount) {
            return Promise.reject('请完整填写满减门槛')
          }
          if (threshold.discount >= threshold.amount) {
            return Promise.reject('优惠金额不能大于等于满足金额')
          }
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  timeRange: [
    { required: true, message: '请选择有效期', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入规则说明', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ]
}

// 添加门槛
const addThreshold = () => {
  form.value.thresholds.push({
    amount: 0,
    discount: 0
  })
}

// 移除门槛
const removeThreshold = (index: number) => {
  form.value.thresholds.splice(index, 1)
}

// 新建规则
const handleCreate = () => {
  dialogTitle.value = '新建规则'
  form.value = {
    name: '',
    thresholds: [],
    timeRange: [],
    description: ''
  }
  dialogVisible.value = true
}

// 编辑规则
const handleEdit = async (row: FullReductionRule) => {
  dialogTitle.value = '编辑规则'
  const detail = await getFullReductionDetail(row.id)
  form.value = {
    id: detail.id,
    name: detail.name,
    thresholds: detail.thresholds,
    timeRange: [detail.startTime, detail.endTime],
    description: detail.description
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  submitting.value = true
  try {
    const data = {
      name: form.value.name,
      thresholds: form.value.thresholds,
      startTime: form.value.timeRange[0],
      endTime: form.value.timeRange[1],
      description: form.value.description
    }
    
    if (form.value.id) {
      await updateFullReduction(form.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await createFullReduction(data)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    loadRuleList()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

// 暂停规则
const handlePause = async (row: FullReductionRule) => {
  try {
    await ElMessageBox.confirm('确定要暂停该规则吗？', '提示', {
      type: 'warning'
    })
    await pauseFullReduction(row.id)
    ElMessage.success('暂停成功')
    loadRuleList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '暂停失败')
    }
  }
}

// 恢复规则
const handleResume = async (row: FullReductionRule) => {
  try {
    await ElMessageBox.confirm('确定要恢复该规则吗？', '提示', {
      type: 'warning'
    })
    await resumeFullReduction(row.id)
    ElMessage.success('恢复成功')
    loadRuleList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '恢复失败')
    }
  }
}

// 删除规则
const handleDelete = async (row: FullReductionRule) => {
  try {
    await ElMessageBox.confirm('确定要删除该规则吗？删除后不可恢复！', '警告', {
      type: 'warning'
    })
    await deleteFullReduction(row.id)
    ElMessage.success('删除成功')
    if (ruleList.value.length === 1 && page.value > 1) {
      page.value--
    }
    loadRuleList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 格式化状态标签样式
const getStatusTag = (status: CouponStatus) => {
  const map: Record<CouponStatus, '' | 'info' | 'success' | 'warning' | 'danger'> = {
    [CouponStatus.DRAFT]: '',
    [CouponStatus.ACTIVE]: 'success',
    [CouponStatus.PAUSED]: 'warning',
    [CouponStatus.EXPIRED]: 'info',
    [CouponStatus.FINISHED]: 'danger'
  }
  return map[status]
}

// 初始化
onMounted(() => {
  loadRuleList()
})
</script>

<style lang="scss" scoped>
.full-reductions-management {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .list-card {
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

  .threshold-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .threshold-separator {
      margin: 0 10px;
    }

    .el-button {
      margin-left: 10px;
    }
  }
}
</style> 