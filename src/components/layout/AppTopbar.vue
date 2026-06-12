<template>
  <header class="topbar">
    <h2 class="topbar-title">{{ title }}</h2>
    <div class="topbar-right">
      <span class="badge">v1.0</span>
      <div class="user-avatar">张</div>
    </div>
  </header>
</template>

<script setup>
defineProps({ title: String })
</script>

<style scoped>
.topbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--card);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}
.topbar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-alt);
  padding: 2px 8px;
  border-radius: 10px;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
}
</style>
