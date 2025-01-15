<template>
  <div class="goods-container">
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
          <el-tree-select
            v-model="searchForm.categoryId"
            :data="categoryOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择商品分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number
            v-model="searchForm.minPrice"
            :min="0"
            :precision="2"
            placeholder="最低价"
            style="width: 120px"
          />
          <span class="separator">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            :min="0"
            :precision="2"
            placeholder="最高价"
            style="width: 120px"
          />
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
        新增商品
      </el-button>
      <el-button type="success" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入商品
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出商品
      </el-button>
    </div>

    <!-- 商品表格 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="goodsList"
        border
        stripe
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="商品名称" min-width="200">
          <template #default="{ row }">
            <div class="goods-info">
              <el-image
                :src="row.images[0]"
                :preview-src-list="row.images"
                fit="cover"
                class="goods-image"
              />
              <span class="goods-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="商品分类" width="120" />
        <el-table-column prop="price" label="价格" width="120" align="center">
          <template #default="{ row }">
            ￥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
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
                {{ row.status === 1 ? '下架' : '上架' }}
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleStock(row)"
              >
                <el-icon><Box /></el-icon>
                库存
              </el-button>
              <el-button
                type="primary"
                link
                @click="handlePrice(row)"
              >
                <el-icon><Money /></el-icon>
                价格
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品分类" prop="categoryId">
          <el-tree-select
            v-model="form.categoryId"
            :data="categoryOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择商品分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action="/api/upload"
            list-type="picture-card"
            :limit="5"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <!-- TODO: 富文本编辑器 -->
          <el-input
            v-model="form.detail"
            type="textarea"
            :rows="5"
            placeholder="请输入商品详情"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 库存对话框 -->
    <el-dialog
      title="修改库存"
      v-model="stockDialogVisible"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="stockFormRef"
        :model="stockForm"
        :rules="stockRules"
        label-width="100px"
      >
        <el-form-item label="当前库存">
          <span>{{ stockForm.currentStock }}</span>
        </el-form-item>
        <el-form-item label="库存变更" prop="stock">
          <el-input-number
            v-model="stockForm.stock"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleStockSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 价格对话框 -->
    <el-dialog
      title="修改价格"
      v-model="priceDialogVisible"
      width="400px"
      destroy-on-close
    >
      <el-form
        ref="priceFormRef"
        :model="priceForm"
        :rules="priceRules"
        label-width="100px"
      >
        <el-form-item label="当前价格">
          <span>￥{{ priceForm.currentPrice?.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="新价格" prop="price">
          <el-input-number
            v-model="priceForm.price"
            :min="0"
            :precision="2"
            :step="0.1"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="priceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePriceSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入商品"
      v-model="importDialogVisible"
      width="400px"
      destroy-on-close
    >
      <el-upload
        class="upload-demo"
        drag
        action="/api/goods/import"
        :auto-upload="false"
        :limit="1"
        :on-change="handleImportChange"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit">确定</el-button>
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
  Switch,
  Box,
  Money,
  Upload,
  Download,
  UploadFilled
} from '@element-plus/icons-vue'
import type { FormInstance, UploadFile } from 'element-plus'
import { formatDateTime } from '@/utils/format'
import {
  getGoodsList,
  createGoods,
  updateGoods,
  deleteGoods,
  updateGoodsStatus,
  updateGoodsStock,
  updateGoodsPrice,
  importGoods,
  exportGoods
} from '@/api/goods'
import type { GoodsForm, GoodsQuery, GoodsVO } from '@/api/goods'
import { getCategoryList } from '@/api/goods'
import type { CategoryVO } from '@/api/goods'

// 搜索表单
const searchForm = reactive<GoodsQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  categoryId: undefined,
  status: undefined,
  minPrice: undefined,
  maxPrice: undefined
})

// 加载状态
const loading = ref(false)

// 商品列表
const goodsList = ref<GoodsVO[]>([])
const total = ref(0)

// 分类选项
const categoryOptions = ref<CategoryVO[]>([])

// 获取分类列表
const getCategoryData = async () => {
  try {
    const data = await getCategoryList({})
    categoryOptions.value = data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取商品列表
const getGoodsData = async () => {
  try {
    loading.value = true
    const data = await getGoodsList(searchForm)
    goodsList.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  searchForm.page = 1
  getGoodsData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.categoryId = undefined
  searchForm.status = undefined
  searchForm.minPrice = undefined
  searchForm.maxPrice = undefined
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  searchForm.pageSize = val
  getGoodsData()
}

const handleCurrentChange = (val: number) => {
  searchForm.page = val
  getGoodsData()
}

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.id ? '编辑商品' : '新增商品')
const formRef = ref<FormInstance>()
const form = reactive<GoodsForm>({
  categoryId: 0,
  name: '',
  description: '',
  price: 0,
  stock: 0,
  status: 1,
  images: [],
  detail: ''
})

// 文件列表
const fileList = ref<UploadFile[]>([])

// 表单校验规则
const rules = {
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  images: [
    { required: true, message: '请上传商品图片', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 新增商品
const handleAdd = () => {
  form.id = undefined
  form.categoryId = 0
  form.name = ''
  form.description = ''
  form.price = 0
  form.stock = 0
  form.status = 1
  form.images = []
  form.detail = ''
  fileList.value = []
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row: GoodsVO) => {
  Object.assign(form, row)
  fileList.value = row.images.map((url) => ({
    name: url.split('/').pop() || '',
    url
  }))
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: GoodsVO) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '下架' : '上架'}该商品吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await updateGoodsStatus(row.id, row.status === 1 ? 0 : 1)
    ElMessage.success('操作成功')
    getGoodsData()
  } catch (error) {
    // 取消操作
  }
}

// 删除商品
const handleDelete = async (row: GoodsVO) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteGoods(row.id)
    ElMessage.success('删除成功')
    getGoodsData()
  } catch (error) {
    // 取消删除
  }
}

// 上传相关
const handleUploadSuccess = (response: any, file: UploadFile) => {
  form.images.push(response.data)
}

const handleUploadRemove = (file: UploadFile) => {
  const index = form.images.indexOf(file.url || '')
  if (index > -1) {
    form.images.splice(index, 1)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.id) {
          await updateGoods(form)
        } else {
          await createGoods(form)
        }
        ElMessage.success('保存成功')
        dialogVisible.value = false
        getGoodsData()
      } catch (error) {
        console.error('保存商品失败:', error)
      }
    }
  })
}

// 库存相关
const stockDialogVisible = ref(false)
const stockFormRef = ref<FormInstance>()
const stockForm = reactive({
  id: 0,
  currentStock: 0,
  stock: 0
})

const stockRules = {
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ]
}

const handleStock = (row: GoodsVO) => {
  stockForm.id = row.id
  stockForm.currentStock = row.stock
  stockForm.stock = row.stock
  stockDialogVisible.value = true
}

const handleStockSubmit = async () => {
  if (!stockFormRef.value) return
  await stockFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateGoodsStock(stockForm.id, stockForm.stock)
        ElMessage.success('修改成功')
        stockDialogVisible.value = false
        getGoodsData()
      } catch (error) {
        console.error('修改库存失败:', error)
      }
    }
  })
}

// 价格相关
const priceDialogVisible = ref(false)
const priceFormRef = ref<FormInstance>()
const priceForm = reactive({
  id: 0,
  currentPrice: 0,
  price: 0
})

const priceRules = {
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ]
}

const handlePrice = (row: GoodsVO) => {
  priceForm.id = row.id
  priceForm.currentPrice = row.price
  priceForm.price = row.price
  priceDialogVisible.value = true
}

const handlePriceSubmit = async () => {
  if (!priceFormRef.value) return
  await priceFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateGoodsPrice(priceForm.id, priceForm.price)
        ElMessage.success('修改成功')
        priceDialogVisible.value = false
        getGoodsData()
      } catch (error) {
        console.error('修改价格失败:', error)
      }
    }
  })
}

// 导入相关
const importDialogVisible = ref(false)
const importFile = ref<File>()

const handleImport = () => {
  importDialogVisible.value = true
}

const handleImportChange = (file: UploadFile) => {
  importFile.value = file.raw
}

const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  try {
    await importGoods(importFile.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    getGoodsData()
  } catch (error) {
    console.error('导入商品失败:', error)
  }
}

// 导出
const handleExport = async () => {
  try {
    const blob = await exportGoods(searchForm)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '商品列表.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出商品失败:', error)
  }
}

// 初始化
onMounted(() => {
  getCategoryData()
  getGoodsData()
})
</script>

<style lang="scss" scoped>
.goods-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
    
    .separator {
      margin: 0 10px;
    }
  }
  
  .action-bar {
    margin-bottom: 20px;
  }
  
  .goods-info {
    display: flex;
    align-items: center;
    
    .goods-image {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 4px;
    }
    
    .goods-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}
</style> 