<template>
  <div class="app">
    <AppSidebar :active="currentRoute" @navigate="navigate" />
    <main class="main">
      <AppTopbar :title="pageTitle" />
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)
const pageTitle = computed(() => route.meta?.title || '知因AI')

function navigate(path) {
  router.push(path)
}
</script>
