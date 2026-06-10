/**
 * 知因AI 应用配置
 * 集中管理所有硬编码常量与导航数据
 */

/** 应用信息 */
export const APP = {
  name: '知因AI',
  shortName: '知因',
  description: '智能错题诊断平台',
  version: '1.0.0',
  platform: 'OpenClaw · DeepSeek',
}

/** AI 模型信息 */
export const AI = {
  model: 'DeepSeek V4 Flash',
  platform: 'OpenClaw Gateway',
  agent: 'math-assistant',
  dataService: 'OpenClaw Data Service',
}

/** 导航菜单 */
export const NAV_ITEMS = [
  { path: '/', label: '分析看板', icon: '📊' },
  { path: '/chat', label: 'AI 诊断', icon: '🧠' },
  { path: '/upload', label: '错题上传', icon: '📝' },
  { path: '/questions', label: '错题列表', icon: '📚' },
  { path: '/stats', label: '学习统计', icon: '📈' },
  { path: '/teacher', label: '教师端', icon: '👨‍🏫' },
  { path: '/settings', label: '系统设置', icon: '⚙️' },
]

/** 快速诊断示例（ChatView） */
export const QUICK_PROMPTS = [
  '2(x+3) = 2x+3，分析错因',
  '√(a²) = a 为什么不对？',
  '(a+b)² 的正确展开公式',
  '一元二次方程常见错误有哪些？',
  '请讲解乘法分配律',
]

/** 路由 meta 标题映射 */
export const ROUTE_TITLES = {
  '/': '分析看板',
  '/chat': 'AI 诊断',
  '/upload': '错题上传',
  '/questions': '错题列表',
  '/stats': '学习统计',
  '/teacher': '教师端',
  '/settings': '系统设置',
}
