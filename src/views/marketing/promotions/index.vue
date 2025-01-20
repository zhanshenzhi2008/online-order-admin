<template>
  <div class="promotions-management">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="活动名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入活动名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择活动类型"
            clearable
          >
            <el-option
              v-for="(label, value) in promotionTypeOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择活动状态"
            clearable
          >
            <el-option
              v-for="(label, value) in promotionStatusOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
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
          <span>活动列表</span>
          <el-button type="primary" @click="handleCreate">新建活动</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="promotionList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="活动名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="活动类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getPromotionTypeTag(row.type as PromotionType)">
              {{ promotionTypeOptions[row.type as PromotionType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="240">
          <template #default="{ row }">
            {{ row.startTime }} 至 {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="活动商品" width="120">
          <template #default="{ row }">
            <el-tooltip
              :content="row.products.map((product: PromotionProduct) => product.name).join('、')"
              placement="top"
              :hide-after="0"
            >
              <span>{{ row.products.length }}个商品</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPromotionStatusTag(row.status as PromotionStatus)">
              {{ promotionStatusOptions[row.status as PromotionStatus] }}
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
              v-if="row.status === PromotionStatus.ACTIVE"
              type="warning"
              size="small"
              @click="handlePause(row)"
            >
              暂停
            </el-button>
            <el-button
              v-if="row.status === PromotionStatus.PAUSED"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPromotionList,
  deletePromotion,
  updatePromotion
} from '@/api/marketing'
import type { Promotion, PromotionListParams, PromotionProduct } from '@/types/marketing'
import { PromotionType, PromotionStatus } from '@/types/marketing'

const router = useRouter()

// 活动类型选项
const promotionTypeOptions: Record<PromotionType, string> = {
  [PromotionType.FLASH_SALE]: '限时特价',
  [PromotionType.GROUP_BUY]: '团购',
  [PromotionType.BUNDLE]: '优惠套餐',
  [PromotionType.GIFT]: '赠品'
}

// 活动状态选项
const promotionStatusOptions: Record<PromotionStatus, string> = {
  [PromotionStatus.DRAFT]: '草稿',
  [PromotionStatus.UPCOMING]: '即将开始',
  [PromotionStatus.ACTIVE]: '进行中',
  [PromotionStatus.PAUSED]: '已暂停',
  [PromotionStatus.FINISHED]: '已结束'
}

// 搜索表单
const searchForm = ref({
  name: '',
  type: '' as PromotionType | '',
  status: '' as PromotionStatus | '',
  timeRange: [] as string[]
})

// 列表数据
const loading = ref(false)
const promotionList = ref<Promotion[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载活动列表
const loadPromotionList = async () => {
  loading.value = true
  try {
    const params: PromotionListParams = {
      page: page.value,
      pageSize: pageSize.value,
      ...(searchForm.value.name ? { name: searchForm.value.name } : {}),
      type: searchForm.value.type || undefined,
      status: searchForm.value.status || undefined,
      startTime: searchForm.value.timeRange[0],
      endTime: searchForm.value.timeRange[1]
    }
    const { list, total: totalCount } = await getPromotionList(params)
    promotionList.value = list
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取活动列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  loadPromotionList()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    name: '',
    type: '',
    status: '',
    timeRange: []
  }
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadPromotionList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadPromotionList()
}

// 新建活动
const handleCreate = () => {
  router.push('/marketing/promotions/form')
}

// 编辑活动
const handleEdit = (row: Promotion) => {
  router.push(`/marketing/promotions/form?id=${row.id}`)
}

// 暂停活动
const handlePause = async (row: Promotion) => {
  try {
    await ElMessageBox.confirm('确定要暂停该活动吗？', '提示', {
      type: 'warning'
    })
    await updatePromotion(row.id, { status: PromotionStatus.PAUSED })
    ElMessage.success('暂停成功')
    loadPromotionList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '暂停失败')
    }
  }
}

// 恢复活动
const handleResume = async (row: Promotion) => {
  try {
    await ElMessageBox.confirm('确定要恢复该活动吗？', '提示', {
      type: 'warning'
    })
    await updatePromotion(row.id, { status: PromotionStatus.ACTIVE })
    ElMessage.success('恢复成功')
    loadPromotionList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '恢复失败')
    }
  }
}

// 删除活动
const handleDelete = async (row: Promotion) => {
  try {
    await ElMessageBox.confirm('确定要删除该活动吗？删除后不可恢复！', '警告', {
      type: 'warning'
    })
    await deletePromotion(row.id)
    ElMessage.success('删除成功')
    if (promotionList.value.length === 1 && page.value > 1) {
      page.value--
    }
    loadPromotionList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 格式化活动类型标签样式
const getPromotionTypeTag = (type: PromotionType) => {
  const map: Record<PromotionType, 'success' | 'warning' | 'danger' | 'info'> = {
    [PromotionType.FLASH_SALE]: 'danger',
    [PromotionType.GROUP_BUY]: 'success',
    [PromotionType.BUNDLE]: 'warning',
    [PromotionType.GIFT]: 'info'
  }
  return map[type]
}

// 格式化活动状态标签样式
const getPromotionStatusTag = (status: PromotionStatus) => {
  const map: Record<PromotionStatus, '' | 'info' | 'success' | 'warning' | 'danger'> = {
    [PromotionStatus.DRAFT]: '',
    [PromotionStatus.UPCOMING]: 'info',
    [PromotionStatus.ACTIVE]: 'success',
    [PromotionStatus.PAUSED]: 'warning',
    [PromotionStatus.FINISHED]: 'danger'
  }
  return map[status]
}

// 初始化
onMounted(() => {
  loadPromotionList()
})
</script>

<style lang="scss" scoped>
.promotions-management {
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
}
</style> 