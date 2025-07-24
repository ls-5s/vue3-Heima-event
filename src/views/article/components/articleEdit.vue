<script setup>
import { ref } from 'vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { artGetDetailService } from '@/api/article.js'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artPublishService, artEditService } from '@/api/article.js'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const drawer = ref(false)

const forModel = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})
const formRef = ref(null)
// const rules = {
//   title: [
//     { required: true, message: '请输入标题', trigger: 'blur' },
//     {
//       pattern: /^\S.{1,8}\S$/,  // 修改为更精确的匹配
//       message: '标题必须是 3-10 位的非空字符(前后不能有空格)',
//       trigger: 'blur'
//     }
//   ],
//   cate_id: [
//     { required: true, message: '请选择分类', trigger: 'change' }
//   ],
//   content: [
//     { required: true, message: '请输入内容', trigger: 'change' }  // 改为change触发
//   ],
//   cover_img: [
//     { required: true, message: '请上传封面', trigger: 'blur' }  // 改为blur触发
//   ]
// }
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  forModel.value.cover_img = uploadFile.raw
  // console.log(uploadFile.raw)
  // console.log(forModel.value.cover_img)
}
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}
const open = async (row) => {
  drawer.value = true
  // console.log(row)
  forModel.value = { ...row }
  if (row.id) {
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    forModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + forModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      forModel.value.cover_img
    )
    forModel.value.cover_img = file
    console.log(res.data.data)
  }
  else {
    forModel.value = {
      title: '',
      cate_id: '',
      content: '',
      cover_img: '',
      state: ''
    }
    imgUrl.value = ''
    // editorRef.value.setHTML('')
    console.log(row)
  }
}

const emit = defineEmits(['success'])
const onSubmit = async (state) => {
  forModel.value.state = state
  // forModel.value.cover_img = imgUrl.value
  const fd = new FormData()
  for (let key in forModel.value) {
    fd.append(key, forModel.value[key])
  }
  // 发请求
  // await formRef.value.validate()
  if (forModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    // ElMessage.success('修改成功')
    drawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    // ElMessage.success('添加成功')
    drawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
  // const res = await artPublishService(fd)
  // console.log(res)
}
defineExpose({
  open,
})
</script>

<template>
  <el-drawer v-model="drawer" :title="forModel.id ? '编辑文章' : '发布文章'" size="50%" direction="rtl">
    <div>

      <el-form ref="formRef" :model="forModel" class="article-form" style="width: 700px">
        <el-form-item label="文章标题" prop="title" style="width: 700px">
          <el-input v-model="forModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文字分类:" prop="cate_id">
          <ChannelSelect v-model="forModel.cate_id" style="width: 800px" />
        </el-form-item>

        <el-form-item label="文章封面:" prop="cover_img">
          <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="onSelectFile">
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容:" prop="content">
          <!-- <div class="editor">
            <QuillEditor content-type="html" v-model="forModel.content" theme="snow" />
          </div> -->
          <!-- <el-input v-model="forModel.content"></el-input> -->
          <el-mention v-model="forModel.content" type="textarea" style="width: 640px" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('已发布')">发布</el-button>
          <el-button type="info" @click="onSubmit('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>


<!--
} -->

<style scoped>
.article-form {
  margin-left: 50px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.editor {
  width: 100%;


}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
