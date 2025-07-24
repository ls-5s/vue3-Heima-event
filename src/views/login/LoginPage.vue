<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useUserStore } from '@/store'
// import { useRouter } from 'vue-router'
import router from '@/router/index'
const ifRegister = ref(false)
// from 用来提交的对象
const form = ref()
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// rules 用来校验的对象// 1. 非空校验 required: true message消息提示，trigger触发校验的时机 blur change
// 长度校验 min max message消息提示，trigger触发校验的时机 blur change
// 3. 正则校验 pattern: 正则规则  \S 非空字符
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^.{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^.{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和当前 form 中收集的 password 是否
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      }, trigger: 'blur'
    },
  ]
}
// 登录<==> 注册 切换 让数据重置
watch(ifRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
//注册
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  // console.log(formModel.value.username, formModel.value.password, formModel.value.repassword)
  // ElMessage({
  //   message: '注册成功',
  //   type: 'success',
  // })
  ifRegister.value = false
}
//登录
const userStore = useUserStore()
// const router = useRouter()
const login = async () => {
  await form.value.validate()

  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  // console.log(userStore.token)
  // console.log('开始登录', res)
  if (res.data.code === 0) {
    // ElMessage({
    //   message: '登录成功',
    //   type: 'success',
    // })
    // 登录成功后，跳转到首页
    router.push('/')
  } else {
    // ElMessage({
    //   message: res.data.message,
    //   type: 'error',
    // })
  }
}
</script>

<template>
  <!-- el-row表示一行，一行分成24份
  el-col表示列
  (1) :span="12" 代表在一行中，占12份（50%）
  (2) :span="6" 表示在一行中，占6份 （25%）
  (3) :offset="3" 代表在一行中，左侧margin份数

  el-form 整个表单组件
  el-form-item 表单的一行 （一个表单域）
  el-input 表单元素（输入框） -->
  <!-- 校验相关 -->
  <!-- (1) el-form => :model="ruleForm" 绑定的整个form的数据对象 { xxx, xxx, xxx }
  (2) el-form => :rules="rules" 绑定的整个rules规则对象 { xxx, xxx, xxx }
  (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
  (4)  el-form-item => prop配置生效的是哪个校验规则（和rules中的字段要对应） -->
  <!-- 4. 自定义校验 => 自己写逻辑校验（校验函数）
  validator: (rule, value, callback)
  (1) rule 当前校验规则相关的信息
  (2) value 所校验的表单元素目前的表单值
  (3) callback 无论成功还是失败，都需要 callback 回调
  - callback() 校验成功
  - callback(new Error(错误信息)) 校验失败 -->
  <el-row class="quan">
    <!-- 左边 -->
    <el-col :span=12 class="bg"></el-col>
    <!-- 右边 -->
    <el-col :span=6 :offset=3>
      <!-- 注册 -->
      <el-form size="large" v-if=ifRegister class="form" :model="formModel" :rules="rules" autocomplete="off"
        ref="form">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="formModel.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input :prefix-icon="Lock" placeholder="请输入再次密码" v-model="formModel.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="register">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" @click="ifRegister = true"> ← 返回</el-link>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-form size="large" v-else class="form" :model="formModel" :rules="rules" autocomplete="off" ref="form">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="formModel.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false" class="right">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" @click="ifRegister = false">注册 →</el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

</template>

<style lang="scss" scoped>
.quan {
  background: #fff;
  height: 100vh;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 250px;

    .button {
      width: 100%;
    }

    .flex {

      display: flex;

      .right {
        margin-left: 292px;
      }

    }
  }
}
</style>
