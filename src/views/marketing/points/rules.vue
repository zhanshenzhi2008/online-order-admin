<template>
  <div class="point-rules-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>积分规则</span>
        </div>
      </template>

      <el-table v-loading="loading" :data="ruleList" border style="width: 100%">
        <el-table-column prop="type" label="规则类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getPointRuleTypeTag(row.type as PointRuleType)">
              {{ pointRuleTypeOptions[row.type as PointRuleType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分数量" width="120" />
        <el-table-column prop="description" label="规则说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="enabled" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :loading="row.loading"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="规则类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择规则类型" disabled>
            <el-option
              v-for="(label, value) in pointRuleTypeOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="积分数量" prop="points">
          <el-input-number
            v-model="form.points"
            :min="1"
            :max="1000"
            controls-position="right"
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
        <el-form-item label="状态" prop="enabled">
          <el-switch v-model="form.enabled" />
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
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getPointRuleList, updatePointRule } from '@/api/marketing'
import type { PointRule } from '@/types/marketing'
import { PointRuleType } from '@/types/marketing'

// 积分规则类型选项
const pointRuleTypeOptions: Record<PointRuleType, string> = {
  [PointRuleType.SIGN_IN]: '签到',
  [PointRuleType.PURCHASE]: '购物',
  [PointRuleType.REVIEW]: '评价',
  [PointRuleType.SHARE]: '分享'
}

// 列表数据
const loading = ref(false)
const ruleList = ref<(PointRule & { loading?: boolean })[]>([])

// 加载规则列表
const loadRuleList = async () => {
  loading.value = true
  try {
    const list = await getPointRuleList()
    ruleList.value = list
  } catch (error: any) {
    ElMessage.error(error.message || '获取规则列表失败')
  } finally {
    loading.value = false
  }
}

// 修改状态
const handleStatusChange = async (row: PointRule & { loading?: boolean }, enabled: boolean) => {
  row.loading = true
  try {
    await updatePointRule(row.id, { enabled })
    ElMessage.success('更新成功')
    row.enabled = enabled
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
    row.enabled = !enabled
  } finally {
    row.loading = false
  }
}

// 编辑弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = ref<Partial<PointRule>>({})
const submitting = ref(false)

// 表单校验规则
const rules = {
  points: [
    { required: true, message: '请输入积分数量', trigger: 'blur' },
    { type: 'number', message: '积分数量必须为数字', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入规则说明', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ]
}

// 打开编辑弹窗
const handleEdit = (row: PointRule) => {
  dialogTitle.value = '编辑规则'
  form.value = { ...row }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  submitting.value = true
  try {
    await updatePointRule(form.value.id!, {
      points: form.value.points!,
      description: form.value.description!,
      enabled: form.value.enabled!
    })
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadRuleList()
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 格式化规则类型标签样式
const getPointRuleTypeTag = (type: PointRuleType) => {
  const map: Record<PointRuleType, 'success' | 'warning' | 'danger' | 'info'> = {
    [PointRuleType.SIGN_IN]: 'success',
    [PointRuleType.PURCHASE]: 'danger',
    [PointRuleType.REVIEW]: 'warning',
    [PointRuleType.SHARE]: 'info'
  }
  return map[type]
}

// 初始化
onMounted(() => {
  loadRuleList()
})
</script>

<style lang="scss" scoped>
.point-rules-management {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 