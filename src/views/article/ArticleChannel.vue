<script setup>
import { artGetChannelsService, artDelChannelsService } from '@/api/article.js'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref(null)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data

  loading.value = false
}
// 获取文章分类
getChannelList()
const onEditChannel = (row) => {
  // console.log(row)
  dialog.value.open(row)

}
const onDelChannel = async (row) => {

  try {
    // await ElMessageBox.confirm(
    //   '你确定删除该文章信息吗？',
    //   '温馨提示',
    //   {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }
    // )

    await artDelChannelsService(row.id)
    // ElMessage.success('删除成功')
    getChannelList()
  } catch {
    //   ElMessage({
    //     type: 'info',
    //     message: '删除取消',
    //   })
  }


}
const onAddChannel = () => {
  dialog.value.open()

}
</script>


<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
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
    <ChannelEdit ref="dialog" @success="getChannelList"> </ChannelEdit>
  </PageContainer>
</template>
<style lang="scss" scoped></style>
