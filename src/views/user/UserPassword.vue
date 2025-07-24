<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'
import { userUpdatePasswordService } from '@/api/user'

const formRef = ref()
const form = ref({
  old_pwd: '',  // 统一使用下划线命名
  new_pwd: '',  // 与模板保持一致
  re_pwd: ''
  // 通常确认密码字段名为re_pwd
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  old_pwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,12}$/,
      message: '新密码长度在6-12个非空字符',
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const resetForm = () => {
  formRef.value.resetFields()
}

const userStore = useUserStore()
const router = useRouter()
const submitForm = async () => {
  try {
    await formRef.value.validate()
    await userUpdatePasswordService(form.value)
    // ElMessage.success('密码修改成功')
    resetForm()
    // 密码修改成功后，退出重新登录
    // 清空本地存储的 token 和 个人信息
    userStore.setToken('')
    userStore.setUser({})

    // 拦截登录
    router.push('/login')

  } catch (error) {
    console.error('密码修改失败:', error)
  }
}
</script>
<template>
  <page-container title="重置密码">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="旧密码" prop="old_pwd">
        <el-input v-model="form.old_pwd" type="text"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="form.new_pwd" type="text"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="form.re_pwd" type="text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button type="default" @click="resetForm">重置</el-button> <!-- 改为default类型 -->
      </el-form-item>
    </el-form>
  </page-container>
</template>
