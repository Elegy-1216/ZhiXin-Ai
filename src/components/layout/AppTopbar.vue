<template>
  <header class="topbar">
    <h2>{{ title }}</h2>
    <div class="user-area">
      <span class="badge">v4.0</span>
      <span class="user-name">张老师</span>
      <div class="user-avatar">张</div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: '知因AI' }
})
</script>

<style scoped>
.topbar {
  height: 56px;
  min-height: 56px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--card);
}

.topbar h2 {
  font-size: 15px;
  font-weight: 600;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 500;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
</style>
