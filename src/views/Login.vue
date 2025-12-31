<template>
  <div class="login-container">
    <!-- 左侧插画区域 -->
    <div class="login-illustration">
      <div class="illustration-content">
        <svg viewBox="0 0 400 300" class="login-svg">
          <!-- 电脑显示器 -->
          <g class="computer">
            <rect x="120" y="80" width="160" height="120" rx="8" fill="#4A90E2" opacity="0.9"/>
            <rect x="130" y="90" width="140" height="100" rx="4" fill="#E8F4FF"/>
            <!-- 屏幕上的锁图标 -->
            <circle cx="200" cy="130" r="20" fill="#4A90E2"/>
            <path d="M 195 135 L 205 135 L 205 140 L 195 140 Z" fill="white"/>
            <path d="M 197 135 L 197 130 Q 197 125 200 125 Q 203 125 203 130 L 203 135" stroke="white" stroke-width="2" fill="none"/>
          </g>
          
          <!-- 机器人 -->
          <g class="robot">
            <ellipse cx="280" cy="200" rx="25" ry="30" fill="#E8F4FF"/>
            <circle cx="275" cy="195" r="3" fill="#4A90E2"/>
            <circle cx="285" cy="195" r="3" fill="#4A90E2"/>
            <path d="M 273 205 Q 280 208 287 205" stroke="#4A90E2" stroke-width="2" fill="none"/>
            <circle cx="280" cy="175" r="8" fill="#4A90E2"/>
          </g>
          
          <!-- 装饰元素 -->
          <circle cx="140" cy="160" r="15" fill="#FFB84D" opacity="0.6"/>
          <rect x="250" y="100" width="20" height="20" rx="4" fill="#4A90E2" opacity="0.5"/>
          <circle cx="160" cy="220" r="12" fill="#4A90E2" opacity="0.4"/>
          <rect x="260" y="240" width="25" height="15" rx="3" fill="#E8F4FF"/>
          <circle cx="300" cy="120" r="10" fill="#FFB84D" opacity="0.5"/>
        </svg>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-wrapper">
      <div class="login-card">
        <div class="login-header">
          <el-icon class="header-icon" :size="24" color="#409EFF">
            <Lock />
          </el-icon>
          <h2 class="login-title">实验室管理平台</h2>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-wrapper">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                size="large"
                :prefix-icon="EditPen"
                @keyup.enter="handleLogin"
              />
              <div class="captcha-code" @click="refreshCaptcha">
                {{ captchaText }}
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { User, Lock, EditPen } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaText = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

// 验证码校验
const validateCaptcha = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入验证码'))
  } else if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
    callback(new Error('验证码错误'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, validator: validateCaptcha, trigger: 'blur' }
  ]
}

// 生成随机验证码
const generateCaptcha = () => {
  const chars = '0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha()
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true

      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))

        userStore.setToken('mock-token-' + Date.now())
        userStore.setUserInfo({
          id: 1,
          username: loginForm.username,
          nickname: loginForm.username === 'admin' ? '管理员' : '用户',
          email: `${loginForm.username}@example.com`,
          role: loginForm.username === 'admin' ? 'admin' : 'user'
        })

        ElMessage.success('登录成功')
        router.push('/home')
      } catch (error) {
        ElMessage.error('登录失败')
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #a8d8ff 0%, #c4e0ff 100%);
  position: relative;
  overflow: hidden;
}

.login-illustration {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.illustration-content {
  width: 100%;
  max-width: 500px;
}

.login-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

.computer {
  animation: float 3s ease-in-out infinite;
}

.robot {
  animation: float 3s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.login-form-wrapper {
  flex: 0 0 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.header-icon {
  margin-bottom: 10px;
}

.login-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #409EFF;
}

.el-form-item {
  margin-bottom: 24px;
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-wrapper .el-input {
  flex: 1;
}

.captcha-code {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #67C23A;
  letter-spacing: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  border: 1px solid #DCDFE6;
}

.captcha-code:hover {
  background: linear-gradient(135deg, #e4e7ed 0%, #d3d6db 100%);
  transform: scale(1.05);
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  margin-top: 10px;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #DCDFE6 inset;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #C0C4CC inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF inset;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .login-container {
    flex-direction: column;
  }

  .login-illustration {
    flex: 0 0 300px;
    padding: 20px;
  }

  .login-form-wrapper {
    flex: 1;
    padding: 20px;
  }

  .login-card {
    padding: 30px 25px;
  }
}
</style>
