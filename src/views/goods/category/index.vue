<template>
  <div class="category-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="分类名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入分类名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <!-- 分类表格 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="categoryList"
        row-key="id"
        border
        default-expand-all
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleToggleStatus(row)"
              >
                <el-icon><Switch /></el-icon>
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleDelete(row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            :max="999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Switch
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { formatDateTime } from '@/utils/rdmaoso'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus
} from '@/api/goods'
import type { CategoryForm, CategoryQuery, CategoryVO } from '@/api/goods'

// 搜索表单
const searchForm = reactive<CategoryQuery>({
  name: '',
  status: undefined
})

// 加载状态
const loading = ref(false)

// 分类列表
const categoryList = ref<CategoryVO[]>([])

// 分类选项
const categoryOptions = computed(() => {
  return [{ id: 0, name: '顶级分类' }, ...categoryList.value]
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.id ? '编辑分类' : '新增分类')
const formRef = ref<FormInstance>()
const form = reactive<CategoryForm>({
  parentId: 0,
  name: '',
  sort: 0,
  status: 1
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ]
}

// 获取分类列表
const getCategoryData = async () => {
  try {
    loading.value = true
    const data = await getCategoryList(searchForm)
    categoryList.value = data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  getCategoryData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = undefined
  getCategoryData()
}

// 新增分类
const handleAdd = () => {
  form.id = undefined
  form.parentId = 0
  form.name = ''
  form.sort = 0
  form.status = 1
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: CategoryVO) => {
  Object.assign(form, row)
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: CategoryVO) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}该分类吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await updateCategoryStatus(row.id, row.status === 1 ? 0 : 1)
    ElMessage.success('操作成功')
    getCategoryData()
  } catch (error) {
    // 取消操作
  }
}

// 删除分类
const handleDelete = async (row: CategoryVO) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    getCategoryData()
  } catch (error) {
    // 取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.id) {
          await updateCategory(form)
        } else {
          await createCategory(form)
        }
        ElMessage.success('保存成功')
        dialogVisible.value = false
        getCategoryData()
      } catch (error) {
        console.error('保存分类失败:', error)
      }
    }
  })
}

// 初始化
onMounted(() => {
  getCategoryData()
})
</script>

<style lang="scss" scoped>
.category-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
  }
  
  .action-bar {
    margin-bottom: 20px;
  }
}
</style> 