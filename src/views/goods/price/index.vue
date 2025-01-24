<template>
  <div class="price-container">
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
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handlePrice(row)">
              <el-icon><Edit /></el-icon>
              修改价格
            </el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Edit
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { formatDateTime } from '@/utils/rdmaoso'
import {
  getGoodsList,
  updateGoodsPrice
} from '@/api/goods'
import type { GoodsQuery, GoodsVO } from '@/api/goods'
import { getCategoryList } from '@/api/goods'
import type { CategoryVO } from '@/api/goods'

// 搜索表单
const searchForm = reactive<GoodsQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  categoryId: undefined,
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

// 初始化
onMounted(() => {
  getCategoryData()
  getGoodsData()
})
</script>

<style lang="scss" scoped>
.price-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
    
    .separator {
      margin: 0 10px;
    }
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
}
</style> 