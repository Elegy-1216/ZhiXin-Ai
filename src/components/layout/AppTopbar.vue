<template>
  <header class="topbar">
    <h2 class="topbar-title">{{ title }}</h2>
    <div class="topbar-right">
      <span class="badge">v1.0</span>
      <UserMenu />
    </div>
  </header>
</template>

<script setup>
import UserMenu from "@/components/layout/UserMenu.vue"
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

</style>
