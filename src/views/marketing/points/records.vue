<template>
  <div class="point-records-management">
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="记录类型">
          <el-select v-model="searchForm.type" placeholder="请选择记录类型" clearable>
            <el-option
              v-for="(label, value) in pointRecordTypeOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
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
          <el-button type="primary" :loading="loading" @click="handleSearch">
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>积分记录</span>
        </div>
      </template>

      <el-table v-loading="loading" :data="recordList" border style="width: 100%">
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="type" label="记录类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getRecordTypeTag(row.type as PointRecordType)">
              {{ pointRecordTypeOptions[row.type as PointRecordType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分变动" width="120">
          <template #default="{ row }">
            <span :class="row.type === PointRecordType.EARN ? 'text-success' : 'text-danger'">
              {{ row.type === PointRecordType.EARN ? '+' : '-' }}{{ row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getPointRecordList } from '@/api/marketing'
import type { PointRecord } from '@/types/marketing'
import { PointRecordType } from '@/types/marketing'

// 积分记录类型选项
const pointRecordTypeOptions: Record<PointRecordType, string> = {
  [PointRecordType.EARN]: '获得',
  [PointRecordType.SPEND]: '消费'
}

// 搜索表单
const searchForm = ref({
  username: '',
  type: '' as PointRecordType | '',
  timeRange: [] as string[]
})

// 列表数据
const loading = ref(false)
const recordList = ref<PointRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载记录列表
const loadRecordList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      username: searchForm.value.username,
      type: searchForm.value.type || undefined,
      startTime: searchForm.value.timeRange[0],
      endTime: searchForm.value.timeRange[1]
    }
    const { list, total: totalCount } = await getPointRecordList(params)
    recordList.value = list
    total.value = totalCount
  } catch (error: any) {
    ElMessage.error(error.message || '获取记录列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadRecordList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    username: '',
    type: '',
    timeRange: []
  }
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadRecordList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadRecordList()
}

// 格式化记录类型标签样式
const getRecordTypeTag = (type: PointRecordType): 'success' | 'danger' => {
  return type === PointRecordType.EARN ? 'success' : 'danger'
}

// 初始化
loadRecordList()
</script>

<style lang="scss" scoped>
.point-records-management {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .text-success {
    color: var(--el-color-success);
  }

  .text-danger {
    color: var(--el-color-danger);
  }
}
</style> 