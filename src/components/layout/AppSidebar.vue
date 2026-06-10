<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="logo">知</div>
      <div>
        <h1>{{ APP.name }}</h1>
        <small>{{ APP.platform }}</small>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: active === item.path }"
        @click="$emit('navigate', item.path)"
      >
        <span class="icon">{{ item.icon }}</span>
        {{ item.label }}
      </div>
    </nav>

    <div class="sidebar-footer">
      <span class="status-dot"></span>
      OpenClaw 已连接 · AI 在线
    </div>
  </aside>
</template>

<script setup>
import { NAV_ITEMS, APP } from '@/config'

defineProps({
  active: { type: String, default: '/' },
})

defineEmits(['navigate'])

const navItems = NAV_ITEMS
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.sidebar-brand {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-brand .logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.sidebar-brand h1 {
  font-size: 16px;
  font-weight: 600;
}

.sidebar-brand small {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 400;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  transition: 0.15s;
  border-left: 3px solid transparent;
  user-select: none;
}

.nav-item:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
}

.nav-item.active {
  color: #fff;
  background: rgba(79, 70, 229, 0.2);
  border-left-color: var(--primary);
}

.nav-item .icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

.sidebar-footer {
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  display: inline-block;
}
</style>
