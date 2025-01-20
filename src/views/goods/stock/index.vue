<template>
  <div class="stock-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="商品分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择商品分类"
            clearable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="库存状态">
          <el-select
            v-model="searchForm.stockStatus"
            placeholder="请选择库存状态"
            clearable
          >
            <el-option label="库存充足" value="normal" />
            <el-option label="库存不足" value="low" />
            <el-option label="无库存" value="empty" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>商品库存列表</span>
          <div class="right">
            <el-button type="success" @click="handleBatchImport">
              <el-icon><UploadFilled /></el-icon>
              批量导入
            </el-button>
            <el-button type="primary" @click="handleBatchExport">
              <el-icon><DownloadFilled /></el-icon>
              批量导出
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="categoryName" label="商品分类" width="120" />
        <el-table-column prop="stock" label="当前库存" width="100" align="center" />
        <el-table-column prop="minStock" label="最低库存" width="100" align="center" />
        <el-table-column prop="maxStock" label="最高库存" width="100" align="center" />
        <el-table-column label="库存状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStockStatusType(row)">
              {{ getStockStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="handleEdit(row)"
            >
              修改库存
            </el-button>
            <el-button
              link
              type="warning"
              @click="handleLog(row)"
            >
              库存记录
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
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #total>
            共 {{ total }} 条记录
          </template>
          <template #sizes="{ item }">
            {{ item.value }}条/页
          </template>
          <template #prev>
            上一页
          </template>
          <template #next>
            下一页
          </template>
        </el-pagination>
      </div>
    </el-card>
    
    <!-- 修改库存弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改库存"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="商品名称">
          <span>{{ editForm.name }}</span>
        </el-form-item>
        <el-form-item label="当前库存">
          <span>{{ editForm.stock }}</span>
        </el-form-item>
        <el-form-item label="变更类型">
          <el-radio-group v-model="editForm.type">
            <el-radio label="in">入库</el-radio>
            <el-radio label="out">出库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更数量" prop="quantity">
          <el-input-number
            v-model="editForm.quantity"
            :min="1"
            :max="99999"
          />
        </el-form-item>
        <el-form-item label="变更原因" prop="reason">
          <el-input
            v-model="editForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入变更原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 库存记录弹窗 -->
    <el-dialog
      v-model="logDialogVisible"
      title="库存记录"
      width="800px"
    >
      <el-table
        :data="logData"
        border
        style="width: 100%"
      >
        <el-table-column prop="type" label="变更类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'in' ? 'success' : 'danger'">
              {{ row.type === 'in' ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="变更数量" width="100" />
        <el-table-column prop="beforeStock" label="变更前库存" width="100" />
        <el-table-column prop="afterStock" label="变更后库存" width="100" />
        <el-table-column prop="reason" label="变更原因" min-width="200" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="createTime" label="操作时间" width="180" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  UploadFilled,
  DownloadFilled
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  categoryId: '',
  stockStatus: ''
})

// 商品分类选项
const categoryOptions = ref([
  { label: '主食', value: 1 },
  { label: '小吃', value: 2 },
  { label: '饮品', value: 3 }
])

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    id: 1,
    name: '香辣鸡腿堡',
    categoryName: '主食',
    stock: 100,
    minStock: 20,
    maxStock: 200,
    updateTime: '2024-01-14 15:30:00'
  },
  {
    id: 2,
    name: '薯条',
    categoryName: '小吃',
    stock: 50,
    minStock: 30,
    maxStock: 150,
    updateTime: '2024-01-14 15:30:00'
  }
])

// 分页
const page = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 修改库存表单
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: 0,
  name: '',
  stock: 0,
  type: 'in',
  quantity: 1,
  reason: ''
})

// 修改库存表单验证规则
const editRules = {
  quantity: [
    { required: true, message: '请输入变更数量', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入变更原因', trigger: 'blur' }
  ]
}

// 库存记录
const logDialogVisible = ref(false)
const logData = ref([
  {
    type: 'in',
    quantity: 50,
    beforeStock: 50,
    afterStock: 100,
    reason: '补充库存',
    operator: '管理员',
    createTime: '2024-01-14 15:30:00'
  },
  {
    type: 'out',
    quantity: 20,
    beforeStock: 120,
    afterStock: 100,
    reason: '日常销售',
    operator: '管理员',
    createTime: '2024-01-14 15:00:00'
  }
])

// 获取库存状态类型
const getStockStatusType = (row: any) => {
  if (row.stock <= 0) return 'danger'
  if (row.stock < row.minStock) return 'warning'
  return 'success'
}

// 获取库存状态文本
const getStockStatusText = (row: any) => {
  if (row.stock <= 0) return '无库存'
  if (row.stock < row.minStock) return '库存不足'
  return '库存充足'
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件：', searchForm)
  // TODO: 调用搜索接口
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.categoryId = ''
  searchForm.stockStatus = ''
  handleSearch()
}

// 批量导入
const handleBatchImport = () => {
  // TODO: 实现批量导入
  ElMessage.success('批量导入功能开发中')
}

// 批量导出
const handleBatchExport = () => {
  // TODO: 实现批量导出
  ElMessage.success('批量导出功能开发中')
}

// 修改库存
const handleEdit = (row: any) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.stock = row.stock
  editForm.type = 'in'
  editForm.quantity = 1
  editForm.reason = ''
  editDialogVisible.value = true
}

// 提交修改
const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    // TODO: 调用修改库存接口
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    handleSearch()
  } catch (error) {
    // 表单验证失败
  }
}

// 查看库存记录
const handleLog = (row: any) => {
  // TODO: 调用获取库存记录接口
  logDialogVisible.value = true
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  page.value = val
  handleSearch()
}
</script>

<style lang="scss" scoped>
.stock-container {
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
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style> 