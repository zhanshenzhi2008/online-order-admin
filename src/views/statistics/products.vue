# 商品统计页面
<template>
  <div class="product-statistics">
    <!-- 时间范围选择 -->
    <el-card class="filter-card">
      <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
        <el-radio-button
          v-for="(label, value) in timeRangeOptions"
          :key="value"
          :label="value"
        >
          {{ label }}
        </el-radio-button>
      </el-radio-group>
    </el-card>

    <!-- 商品概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>总商品数</span>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(productData?.totalProducts || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>在售商品数</span>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(productData?.activeProducts || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>缺货商品数</span>
              <el-tag type="danger" v-if="productData?.outOfStockProducts">
                {{ productData.outOfStockProducts }}
              </el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(productData?.outOfStockProducts || 0) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>库存预警商品数</span>
              <el-tag type="warning" v-if="productData?.lowStock?.length">
                {{ productData.lowStock.length }}
              </el-tag>
            </div>
          </template>
          <div class="card-value">{{ formatNumber(productData?.lowStock?.length || 0) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品排行 -->
    <el-card class="ranking-card">
      <template #header>
        <div class="card-header">
          <span>热销商品排行</span>
          <el-select v-model="rankingLimit" size="small" @change="loadProductRanking">
            <el-option label="TOP 10" :value="10" />
            <el-option label="TOP 20" :value="20" />
            <el-option label="TOP 50" :value="50" />
          </el-select>
        </div>
      </template>
      <el-table :data="productData?.topSelling || []" border style="width: 100%">
        <el-table-column type="index" label="排名" width="80" align="center" />
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="sales" label="销量" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.sales) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="销售额" align="right">
          <template #default="{ row }">
            ¥{{ formatNumber(row.amount) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 库存预警商品 -->
    <el-card class="stock-card">
      <template #header>
        <div class="card-header">
          <span>库存预警商品</span>
          <el-button type="primary" size="small" @click="handleStockManagement">
            库存管理
          </el-button>
        </div>
      </template>
      <el-table :data="productData?.lowStock || []" border style="width: 100%">
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="stock" label="当前库存" align="right">
          <template #default="{ row }">
            <el-tag :type="row.stock === 0 ? 'danger' : 'warning'">
              {{ formatNumber(row.stock) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="预警阈值" align="right">
          <template #default="{ row }">
            {{ formatNumber(row.threshold) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleStockUpdate(row)"
            >
              补货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductStatistics, getProductRanking, getLowStockProducts } from '@/api/statistics'
import type { ProductStatistics } from '@/types/statistics'
import { StatTimeRange } from '@/types/statistics'

const router = useRouter()

// 时间范围选项
const timeRangeOptions = {
  [StatTimeRange.TODAY]: '今日',
  [StatTimeRange.YESTERDAY]: '昨日',
  [StatTimeRange.LAST_7_DAYS]: '近7天',
  [StatTimeRange.LAST_30_DAYS]: '近30天',
  [StatTimeRange.THIS_MONTH]: '本月',
  [StatTimeRange.LAST_MONTH]: '上月',
  [StatTimeRange.THIS_YEAR]: '本年'
}

// 数据和控制变量
const timeRange = ref<StatTimeRange>(StatTimeRange.LAST_30_DAYS)
const rankingLimit = ref<number>(10)
const productData = ref<ProductStatistics>()

// 加载商品统计数据
const loadProductData = async () => {
  try {
    productData.value = await getProductStatistics()
  } catch (error: any) {
    ElMessage.error(error.message || '获取商品统计数据失败')
  }
}

// 加载商品排行数据
const loadProductRanking = async () => {
  try {
    const ranking = await getProductRanking(timeRange.value, rankingLimit.value)
    if (productData.value) {
      productData.value.topSelling = ranking
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取商品排行数据失败')
  }
}

// 加载库存预警数据
const loadLowStockData = async () => {
  try {
    const lowStock = await getLowStockProducts()
    if (productData.value) {
      productData.value.lowStock = lowStock
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取库存预警数据失败')
  }
}

// 时间范围变化
const handleTimeRangeChange = () => {
  loadProductRanking()
}

// 跳转到库存管理
const handleStockManagement = () => {
  router.push('/goods/stock')
}

// 处理补货操作
const handleStockUpdate = (row: ProductStatistics['lowStock'][0]) => {
  router.push({
    path: '/goods/stock',
    query: { id: row.id }
  })
}

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  loadProductData()
  loadProductRanking()
  loadLowStockData()
})
</script>

<style lang="scss" scoped>
.product-statistics {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;
  }

  .overview-row {
    margin-bottom: 20px;

    .overview-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
        margin-top: 10px;
      }
    }
  }

  .ranking-card,
  .stock-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 