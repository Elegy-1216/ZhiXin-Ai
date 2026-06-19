<template>
  <div class="user-menu" ref="menuRef">
    <!-- 头像按钮 -->
    <button class="avatar-btn" @click="toggleMenu" :title="isLoggedIn ? userInfo.name : '未登录'">
      <span class="avatar-circle">{{ isLoggedIn ? userInfo.name[0] : '?' }}</span>
    </button>

    <!-- 下拉菜单 -->
    <Transition name="drop">
      <div v-if="showMenu" class="dropdown">
        <!-- 已登录状态 -->
        <template v-if="isLoggedIn">
          <div class="drop-header">
            <div class="drop-avatar">{{ userInfo.name[0] }}</div>
            <div class="drop-meta">
              <div class="drop-name">{{ userInfo.name }}</div>
              <div class="drop-role">{{ userInfo.role === 'teacher' ? '教师' : '学生' }}</div>
            </div>
          </div>
          <div class="drop-divider"></div>
          <button class="drop-item" @click="goProfile">
            <span class="drop-icon">📋</span>
            <span>个人资料</span>
          </button>
          <button class="drop-item" @click="goSettings">
            <span class="drop-icon">⚙️</span>
            <span>系统设置</span>
          </button>
          <div class="drop-divider"></div>
          <button class="drop-item drop-item--danger" @click="handleLogout">
            <span class="drop-icon">🚪</span>
            <span>退出登录</span>
          </button>
        </template>

        <!-- 未登录状态 -->
        <template v-else>
          <div class="drop-header">
            <div class="drop-avatar drop-avatar--guest">?</div>
            <div class="drop-meta">
              <div class="drop-name">未登录</div>
              <div class="drop-role">游客模式</div>
            </div>
          </div>
          <div class="drop-divider"></div>
          <button class="drop-item drop-item--primary" @click="showLoginModal = true">
            <span class="drop-icon">🔑</span>
            <span>登录 / 注册</span>
          </button>
          <button class="drop-item" @click="goSettings">
            <span class="drop-icon">⚙️</span>
            <span>系统设置</span>
          </button>
        </template>
      </div>
    </Transition>

    <!-- 登录弹窗 -->
    <Transition name="modal">
      <div v-if="showLoginModal" class="modal-mask" @click.self="showLoginModal = false">
        <div class="login-modal">
          <button class="modal-close" @click="showLoginModal = false">✕</button>

          <div class="modal-brand">
            <div class="modal-brand-icon">知</div>
            <div class="modal-brand-text">知因AI</div>
          </div>

          <div class="modal-tabs">
            <button :class="['tab', { active: loginTab === 'login' }]" @click="loginTab = 'login'">登录</button>
            <button :class="['tab', { active: loginTab === 'register' }]" @click="loginTab = 'register'">注册</button>
          </div>

          <!-- 登录表单 -->
          <form v-if="loginTab === 'login'" class="modal-form" @submit.prevent="doLogin">
            <div class="mf-field">
              <label class="mf-label">账号</label>
              <input v-model="loginForm.account" type="text" placeholder="手机号 / 邮箱" class="mf-input" />
            </div>
            <div class="mf-field">
              <label class="mf-label">密码</label>
              <input v-model="loginForm.password" type="password" placeholder="请输入密码" class="mf-input" />
            </div>
            <div class="mf-options">
              <label class="mf-checkbox">
                <input type="checkbox" v-model="loginForm.remember" />
                <span>记住我</span>
              </label>
            </div>
            <button type="submit" class="mf-btn" :disabled="loginLoading">
              {{ loginLoading ? '登录中…' : '登 录' }}
            </button>
          </form>

          <!-- 注册表单 -->
          <form v-else class="modal-form" @submit.prevent="doRegister">
            <div class="mf-field">
              <label class="mf-label">姓名</label>
              <input v-model="regForm.name" type="text" placeholder="请输入真实姓名" class="mf-input" />
            </div>
            <div class="mf-field">
              <label class="mf-label">账号</label>
              <input v-model="regForm.account" type="text" placeholder="手机号 / 邮箱" class="mf-input" />
            </div>
            <div class="mf-field">
              <label class="mf-label">密码</label>
              <input v-model="regForm.password" type="password" placeholder="请设置密码" class="mf-input" />
            </div>
            <div class="mf-field">
              <label class="mf-label">确认密码</label>
              <input v-model="regForm.confirmPwd" type="password" placeholder="再次输入密码" class="mf-input" />
            </div>
            <button type="submit" class="mf-btn mf-btn--secondary" :disabled="regLoading">
              {{ regLoading ? '注册中…' : '注 册' }}
            </button>
          </form>

          <div v-if="loginError" class="mf-error">{{ loginError }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuRef = ref(null)
const showMenu = ref(false)
const showLoginModal = ref(false)
const loginTab = ref('login')
const loginLoading = ref(false)
const regLoading = ref(false)
const loginError = ref('')

// 用户状态
const isLoggedIn = ref(false)
const userInfo = reactive({
  name: '',
  role: '',
})

// 登录表单
const loginForm = reactive({
  account: '',
  password: '',
  remember: false,
})

// 注册表单
const regForm = reactive({
  name: '',
  account: '',
  password: '',
  confirmPwd: '',
})

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function goProfile() {
  closeMenu()
  router.push('/settings')
}

function goSettings() {
  closeMenu()
  router.push('/settings')
}

function handleLogout() {
  isLoggedIn.value = false
  userInfo.name = ''
  userInfo.role = ''
  closeMenu()
}

// 登录
async function doLogin() {
  if (!loginForm.account.trim()) {
    loginError.value = '请输入账号'
    setTimeout(() => { loginError.value = '' }, 3000)
    return
  }
  if (!loginForm.password) {
    loginError.value = '请输入密码'
    setTimeout(() => { loginError.value = '' }, 3000)
    return
  }
  loginLoading.value = true
  loginError.value = ''

  // TODO: 接入用户认证 API
  setTimeout(() => {
    loginLoading.value = false
    isLoggedIn.value = true
    userInfo.name = loginForm.account.value || '用户'
    userInfo.role = 'student'
    showLoginModal.value = false
    showMenu.value = false
  }, 800)
}

// 注册
async function doRegister() {
  if (!regForm.name.trim() || !regForm.account.trim() || !regForm.password) {
    loginError.value = '请填写完整信息'
    setTimeout(() => { loginError.value = '' }, 3000)
    return
  }
  if (regForm.password !== regForm.confirmPwd) {
    loginError.value = '两次密码不一致'
    setTimeout(() => { loginError.value = '' }, 3000)
    return
  }
  regLoading.value = true
  loginError.value = ''

  // TODO: 接入用户注册 API
  setTimeout(() => {
    regLoading.value = false
    loginTab.value = 'login'
    loginError.value = '注册成功，请登录'
    setTimeout(() => { loginError.value = '' }, 3000)
  }, 800)
}
</script>

<style scoped>
/* ===== 头像按钮 ===== */
.user-menu {
  position: relative;
}
.avatar-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  background: var(--ink);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: border-color 0.15s, transform 0.1s;
  font-family: inherit;
}
.avatar-btn:hover {
  border-color: var(--red-pen);
  transform: scale(1.05);
}
.avatar-circle {
  font-size: 11px;
  font-weight: 500;
}

/* ===== 下拉菜单 ===== */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(30,58,95,0.1);
  z-index: 100;
  overflow: hidden;
}
.drop-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
}
.drop-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.drop-avatar--guest {
  background: var(--border);
  color: var(--text-secondary);
}
.drop-meta {
  flex: 1;
  min-width: 0;
}
.drop-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}
.drop-role {
  font-size: 11px;
  color: var(--text-secondary);
}
.drop-divider {
  height: 1px;
  background: var(--border-light);
  margin: 0;
}
.drop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.1s;
}
.drop-item:hover {
  background: var(--bg-alt);
}
.drop-icon {
  font-size: 13px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.drop-item--danger {
  color: var(--red-pen);
}
.drop-item--primary {
  color: var(--ink);
  font-weight: 500;
}

/* ===== 登录弹窗 ===== */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(30,58,95,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(2px);
}
.login-modal {
  position: relative;
  width: 380px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--card);
  border-radius: 12px;
  padding: 32px 32px 24px;
  box-shadow: 0 8px 32px rgba(30,58,95,0.15);
}
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--bg-alt);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  font-family: inherit;
}
.modal-close:hover {
  background: var(--border);
}
.modal-brand {
  text-align: center;
  margin-bottom: 24px;
}
.modal-brand-icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--ink);
  color: #fff;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}
.modal-brand-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 2px;
}

/* ===== 标签切换 ===== */
.modal-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-light);
}
.tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
  font-family: inherit;
}
.tab.active {
  color: var(--ink);
  border-bottom-color: var(--ink);
  font-weight: 500;
}
.tab:hover:not(.active) {
  color: var(--text);
}

/* ===== 表单 ===== */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mf-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mf-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.5px;
}
.mf-input {
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 13px;
  outline: none;
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.mf-input:focus {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px var(--ink-light);
}
.mf-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}
.mf-options {
  display: flex;
  justify-content: flex-start;
  font-size: 12px;
}
.mf-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  cursor: pointer;
}
.mf-checkbox input[type="checkbox"] {
  accent-color: var(--ink);
}
.mf-btn {
  margin-top: 4px;
  padding: 11px;
  border: none;
  border-radius: var(--radius);
  background: var(--ink);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  font-family: inherit;
}
.mf-btn:hover:not(:disabled) {
  background: #16304f;
}
.mf-btn:active:not(:disabled) {
  transform: scale(0.98);
}
.mf-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.mf-btn--secondary {
  background: var(--red-pen);
}
.mf-btn--secondary:hover:not(:disabled) {
  background: #b02e28;
}
.mf-error {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: var(--radius);
  background: rgba(205,59,53,0.08);
  color: var(--red-pen);
  font-size: 12px;
  text-align: center;
}

/* ===== 动画 ===== */
.drop-enter-active, .drop-leave-active {
  transition: all 0.2s ease;
}
.drop-enter-from, .drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.modal-enter-active, .modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from .login-modal,
.modal-leave-to .login-modal {
  transform: scale(0.92);
}
.login-modal {
  transition: transform 0.25s ease;
}
</style>
