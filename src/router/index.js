import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: '分析看板' },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: 'AI 诊断' },
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/Placeholder.vue'),
    meta: { title: '错题上传' },
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/views/Placeholder.vue'),
    meta: { title: '错题列表' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/Placeholder.vue'),
    meta: { title: '学习统计' },
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('@/views/Placeholder.vue'),
    meta: { title: '教师端' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Placeholder.vue'),
    meta: { title: '系统设置' },
  },
]

const router = createRouter({
  history: createWebHistory('/zhixin/'),
  routes
})

export default router
