<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">知</div>
      <div class="brand-text">
        <span class="brand-name">知因AI</span>
        <span class="brand-sub">错题诊断</span>
      </div>
    </div>

    <nav class="nav">
      <router-link
        v-for="item in NAV_ITEMS"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <span class="status-dot online"></span>
      <span class="status-text">AI 在线</span>
    </div>
  </aside>
</template>

<script setup>
import { NAV_ITEMS } from '@/config/index.js'
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: var(--card);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid var(--border-light);
}
.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.2;
}
.brand-sub {
  font-size: 10px;
  color: var(--text-muted);
}
.nav {
  flex: 1;
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 13px;
  transition: all 0.12s;
}
.nav-item:hover {
  background: var(--bg-alt);
  color: var(--ink);
}
.nav-item.active {
  background: var(--ink-light);
  color: var(--ink);
  font-weight: 500;
}
.nav-icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.nav-label {
  font-size: 12px;
}
.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.status-dot.online { background: var(--success); }
.status-text {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
