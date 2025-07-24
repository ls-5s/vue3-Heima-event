<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { formatDate } from '@/utils/format.js'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { artGetArticleService, artDelService } from '@/api/article.js'
import articleEdit from '@/views/article/components/articleEdit.vue'
const articleList = ref([])
const total = ref()
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const loading = ref(false)
const articleEditRef = ref(null)
const getArticleList = async () => {
  loading.value = true
  const res = await artGetArticleService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
  console.log(res.data.data)
}
getArticleList()

const handleSizeChange = (val) => {
  // 每页条数改变
  params.value.pagesize = val
  getArticleList()
}
const handleCurrentChange = (val) => {
  // 页码改变
  params.value.pagenum = val
  getArticleList()
}
//查询
const onSerach = () => {
  params.value.pagenum = 1
  getArticleList()
}
//重置
const onReset = () => {
  params.value = {
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  getArticleList()
}
const onAddArticle = () => {
  articleEditRef.value.open({})
}
const onEditChannel = (row) => {
  articleEditRef.value.open(row)
  // console.log(row)
}

const onDelChannel = async (row) => {
  try {
    // await ElMessageBox.confirm(
    //   '你确定删除该分类信息吗？',
    //   '温馨提示',
    //   {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }
    // )

    // 只有用户确认后才会执行删除
    await artDelService(row.id)
    // ElMessage.success('删除成功')
    getArticleList()
  } catch {
    // 用户取消删除
    // ElMessage({
    //   type: 'info',
    //   message: '删除取消',
    // })
  }
}
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastPage
  }

  getArticleList()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <!-- 表单 -->
    <el-form inline>
      <el-form-item label="文字分类:">
        <ChannelSelect v-model="params.cate_id" />
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" placeholder="请选择" style="width: 240px">
          <el-option label="已发布" value="已发布"></el-option> <!-- 改为"已发布" -->
          <el-option label="草稿" value="草稿"></el-option> <!-- 改为"草稿" -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSerach">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link underline="never">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ row.pub_date ? formatDate(row.pub_date) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- row 就是 channelList 的一项， $index 下标 -->
        <template #default="{ row, $index }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row, $index)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row, $index)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <!-- 表格分页 -->
    <el-pagination class="pagination" v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]" background layout=" jumper,total, sizes, prev, pager, next" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <articleEdit ref="articleEditRef" @success="onSuccess"></articleEdit>
  </PageContainer>
</template>
<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
