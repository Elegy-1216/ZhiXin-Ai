<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">累计错题</div>
        <div class="stat-value">47</div>
        <div class="stat-trend up">较上周 +12</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">高频错题</div>
        <div class="stat-value">8</div>
        <div class="stat-trend down">同类错误反复出现</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已诊断</div>
        <div class="stat-value">32</div>
        <div class="stat-trend up">诊断率 68%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">薄弱知识点</div>
        <div class="stat-value">5</div>
        <div class="stat-trend">一元二次方程 · 因式分解</div>
      </div>
    </div>

    <div class="two-col">
      <div class="panel">
        <div class="panel-header">
          <h3>最近诊断</h3>
          <button class="btn-sm" @click="$router.push('/chat')">查看全部 →</button>
        </div>
        <div class="panel-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr><th>题目</th><th>错误率</th><th>状态</th></tr>
            </thead>
            <tbody>
              <tr><td>2(x+3)=2x+3</td><td><span class="red-tag">高</span></td><td>待诊断 →</td></tr>
              <tr><td>√(a²)=a</td><td><span class="red-tag">高</span></td><td>✅ 已诊断</td></tr>
              <tr><td>(a+b)²</td><td>中</td><td>待诊断 →</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>知识图谱</h3>
          <span class="badge">建设中</span>
        </div>
        <div class="panel-body">
          <div class="kg-placeholder">
            <div class="kg-icon">⊞</div>
            <p>知识点关联图谱</p>
            <span>完成更多诊断后自动生成</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>API 状态</h3>
      </div>
      <div class="panel-body">
        <div class="api-row">
          <span class="api-label">后端服务</span>
          <span class="api-value ok">● 运行中</span>
          <button class="btn-sm btn-outline" @click="checkApi">测试连接</button>
        </div>
        <div class="api-row">
          <span class="api-label">AI 模型</span>
          <span class="api-value ok">● DeepSeek V4 Flash</span>
          <button class="btn-sm btn-outline" @click="checkAi">诊断测试</button>
        </div>
        <div class="api-result" v-if="apiLog">{{ apiLog }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { healthCheck, sendChatMessage } from '@/api/chat.js'

const apiLog = ref('')

async function checkApi() {
  apiLog.value = '检查中…'
  try {
    const r = await healthCheck()
    apiLog.value = JSON.stringify(r, null, 2)
  } catch (e) {
    apiLog.value = '连接失败: ' + e.message
  }
}
async function checkAi() {
  apiLog.value = '请求中…'
  try {
    const r = await sendChatMessage('测试')
    apiLog.value = "AI 响应成功 (" + r.durationMs + "ms) " + r.reply.slice(0, 200)
  } catch (e) {
    apiLog.value = 'AI 调用失败: ' + e.message
  }
}
</script>

<style scoped>
.dashboard { padding: 0; }
.stat-card {
  background: var(--card);
  border-radius: var(--radius);
  padding: 16px 18px;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--ink);
  opacity: 0.12;
}
.stat-label { font-size: 11px; color: var(--text-secondary); margin-bottom: 2px; }
.stat-value { font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1.2; }
.stat-trend { font-size: 11px; margin-top: 4px; color: var(--text-secondary); }
.stat-trend.up { color: var(--success); }
.stat-trend.down { color: var(--danger); }
.badge {
  font-size: 10px; color: var(--text-muted);
  background: var(--bg-alt); padding: 2px 8px; border-radius: 10px;
}
.kg-placeholder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 160px;
  background: var(--bg-alt); border-radius: var(--radius);
  border: 1.5px dashed var(--border);
  color: var(--text-secondary); font-size: 12px; gap: 4px;
}
.kg-icon { font-size: 28px; opacity: 0.4; margin-bottom: 4px; }
.api-row {
  display: flex; align-items: center; gap: 12px;
  padding: 6px 0; font-size: 12px;
}
.api-label { color: var(--text-secondary); min-width: 80px; }
.api-value { font-weight: 500; }
.api-value.ok { color: var(--success); }
.btn-sm {
  font-size: 11px; padding: 4px 10px;
  background: transparent; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary);
  font-family: inherit; margin-left: auto;
}
.btn-sm:hover { background: var(--bg-alt); }
</style>
