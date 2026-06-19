<template>
  <div class="teacher-login">
    <!-- 左侧：品牌面板 -->
    <div class="brand-panel">
      <div class="brand-content">
        <div class="brand-mark-small">
          <svg viewBox="0 0 40 40" width="40" height="40">
            <rect x="2" y="2" width="36" height="36" rx="6" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
            <text x="20" y="27" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">知</text>
          </svg>
        </div>
        <div class="brand-title">知因AI</div>
        <div class="brand-subtitle">教师端 · 教学管理中心</div>

        <div class="math-divider">
          <span class="divider-line"></span>
          <span class="divider-symbol">∫</span>
          <span class="divider-line"></span>
        </div>

        <div class="motto">
          <div class="motto-line">每一个错误</div>
          <div class="motto-line">都是理解的缺口</div>
        </div>

        <div class="math-art" aria-hidden="true">
          <svg viewBox="0 0 320 280" class="math-svg">
            <circle cx="160" cy="140" r="100" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
            <circle cx="160" cy="140" r="72" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.2"/>
            <circle cx="160" cy="140" r="44" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
            <circle cx="124" cy="116" r="58" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.15"/>
            <circle cx="196" cy="164" r="58" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.15"/>
            <line x1="60" y1="140" x2="260" y2="140" stroke="currentColor" stroke-width="0.5" opacity="0.12"/>
            <line x1="160" y1="40" x2="160" y2="240" stroke="currentColor" stroke-width="0.5" opacity="0.12"/>
            <line x1="78" y1="58" x2="242" y2="222" stroke="currentColor" stroke-width="0.4" opacity="0.1"/>
            <line x1="78" y1="222" x2="242" y2="58" stroke="currentColor" stroke-width="0.4" opacity="0.1"/>
            <text x="260" y="136" font-size="12" fill="currentColor" opacity="0.3" font-family="serif">x</text>
            <text x="156" y="34" font-size="12" fill="currentColor" opacity="0.3" font-family="serif">y</text>
            <circle cx="160" cy="140" r="2.5" fill="currentColor" opacity="0.3"/>
            <text x="148" y="156" font-size="11" fill="currentColor" opacity="0.3" font-family="serif">O</text>
            <path d="M80,200 Q120,100 160,140 Q200,80 240,160" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 右侧：登录表单 -->
    <div class="form-panel">
      <div class="form-container">
        <div class="form-header">
          <div class="form-badge">教师登录</div>
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-desc">登录教师端管理班级、查看学情分析</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field">
            <label class="field-label">学校 / 班级</label>
            <div class="input-wrap">
              <span class="input-icon">🏫</span>
              <input v-model="form.school" type="text" placeholder="请输入学校名称或班级编号" class="field-input" />
            </div>
          </div>

          <div class="field">
            <label class="field-label">账号</label>
            <div class="input-wrap">
              <span class="input-icon">👤</span>
              <input v-model="form.account" type="text" placeholder="手机号 / 邮箱 / 工号" class="field-input" />
            </div>
          </div>

          <div class="field">
            <label class="field-label">密码</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" class="field-input" />
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <div class="field-options">
            <label class="checkbox-wrap">
              <input type="checkbox" v-model="form.remember" />
              <span class="checkbox-text">记住登录</span>
            </label>
            <button type="button" class="link-btn">忘记密码？</button>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="!isLoading">登 录</span>
            <span v-else class="loading-text">登录中…</span>
          </button>
        </form>

        <div class="form-footer">
          <div class="seal-line">
            <span class="seal-dash"></span>
            <span class="seal-text">教师认证入口</span>
            <span class="seal-dash"></span>
          </div>
          <p class="footer-note">首次使用请联系管理员开通教师账号</p>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <Transition name="toast">
      <div v-if="errorMsg" class="error-toast">{{ errorMsg }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  school: '',
  account: '',
  password: '',
  remember: false,
})
const showPwd = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

function handleLogin() {
  if (!form.account.trim()) {
    errorMsg.value = '请输入账号'
    setTimeout(() => { errorMsg.value = '' }, 3000)
    return
  }
  if (!form.password) {
    errorMsg.value = '请输入密码'
    setTimeout(() => { errorMsg.value = '' }, 3000)
    return
  }
  isLoading.value = true
  errorMsg.value = ''

  // TODO: 接入教师认证 API
  setTimeout(() => {
    isLoading.value = false
    errorMsg.value = '教师认证功能开发中，敬请期待'
    setTimeout(() => { errorMsg.value = '' }, 3000)
  }, 800)
}
</script>

<style scoped>
/* ===== 布局 ===== */
.teacher-login {
  display: flex;
  min-height: calc(100vh - 56px - 44px - 40px);
  margin: -20px -24px;
  background: var(--bg);
  overflow: hidden;
}

/* ===== 左侧品牌面板 ===== */
.brand-panel {
  flex: 0 0 42%;
  background: linear-gradient(145deg, #1e3050 0%, #2a3f6a 40%, #1e3a5f 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px);
  pointer-events: none;
}
.brand-panel::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
  animation: brandGlow 8s ease-in-out infinite alternate;
  pointer-events: none;
}
@keyframes brandGlow {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-20%, 10%); }
}
.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
  max-width: 340px;
}
.brand-mark-small {
  display: inline-flex;
  margin-bottom: 16px;
  opacity: 0.85;
}
.brand-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  margin-bottom: 6px;
}
.brand-subtitle {
  font-size: 13px;
  opacity: 0.6;
  letter-spacing: 2px;
  font-weight: 300;
}
.math-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.15);
}
.divider-symbol {
  font-size: 22px;
  opacity: 0.4;
  font-family: 'Times New Roman', serif;
  font-style: italic;
}
.motto {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
}
.motto-line:last-child {
  opacity: 0.5;
  font-size: 14px;
}
.math-art {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
.math-svg {
  width: 200px;
  height: 175px;
  opacity: 0.7;
}

/* ===== 右侧表单面板 ===== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(232,226,216,0.25) 31px, rgba(232,226,216,0.25) 32px),
    var(--bg);
  padding: 40px;
}
.form-container {
  width: 100%;
  max-width: 380px;
}
.form-header {
  margin-bottom: 32px;
}
.form-badge {
  display: inline-block;
  font-size: 11px;
  color: var(--red-pen);
  background: rgba(205,59,53,0.08);
  padding: 3px 12px;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 6px 0;
}
.form-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ===== 表单 ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.5px;
}
.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input-wrap:focus-within {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px var(--ink-light);
}
.input-icon {
  font-size: 14px;
  flex-shrink: 0;
  opacity: 0.5;
}
.field-input {
  flex: 1;
  padding: 10px 0;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  color: var(--text);
  font-family: inherit;
}
.field-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}
.pwd-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  opacity: 0.4;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.pwd-toggle:hover { opacity: 0.8; }

/* ===== 选项栏 ===== */
.field-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text-secondary);
}
.checkbox-wrap input[type="checkbox"] { accent-color: var(--ink); }
.checkbox-text { user-select: none; }
.link-btn {
  background: none;
  border: none;
  color: var(--ink);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.link-btn:hover { opacity: 1; text-decoration: underline; }

/* ===== 登录按钮（朱砂色）===== */
.login-btn {
  margin-top: 4px;
  padding: 12px;
  border: none;
  border-radius: var(--radius);
  background: var(--red-pen);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  font-family: inherit;
}
.login-btn:hover:not(:disabled) { background: #b02e28; }
.login-btn:active:not(:disabled) { transform: scale(0.98); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.loading-text { letter-spacing: 2px; font-weight: 400; }

/* ===== 底部 ===== */
.form-footer { margin-top: 28px; text-align: center; }
.seal-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.seal-dash { flex: 1; height: 1px; background: var(--border); }
.seal-text {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  letter-spacing: 1px;
}
.footer-note {
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.7;
  margin: 0;
}

/* ===== 错误提示 ===== */
.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--red-pen);
  color: #fff;
  padding: 10px 24px;
  border-radius: var(--radius);
  font-size: 13px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(205,59,53,0.3);
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .teacher-login { flex-direction: column; margin: 0; min-height: auto; }
  .brand-panel { flex: none; padding: 32px 20px; }
  .brand-content { max-width: 100%; padding: 0; }
  .math-art { display: none; }
  .form-panel { padding: 28px 20px; }
  .form-container { max-width: 100%; }
}
</style>
