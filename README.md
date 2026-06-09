# 知因AI · 智能错题诊断平台

基于 **OpenClaw** 平台 + **DeepSeek 大模型** 构建的 AI 错题诊断平台，后端用 Node.js、前端用 Vue 3。

---

## 架构

```
浏览器 (Vue 3 SPA)
    │  POST /api/chat
    ▼
Node.js 后端 (server.js · 端口 8080)
    │  spawn(openclaw agent)
    ▼
OpenClaw Gateway (端口 18789)
    │  DeepSeek API
    ▼
DeepSeek V4 Flash 大模型
```

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | Vue 3 + Vue Router |
| 构建工具 | Vite 6 |
| 后端 | Node.js + Express 5 |
| AI 平台 | OpenClaw Gateway |
| 大模型 | DeepSeek V4 Flash |
| 机器人角色 | 数学教师（知因AI） |

## 目录结构

```
zhixin-ai/
├── server.js               # Node.js API 代理（←→ OpenClaw）
├── package.json            # Vue 3 + Vite + Express
├── vite.config.js          # Vite 配置（/api → localhost:8080）
├── index.html              # Vite 入口
└── src/
    ├── main.js             # 应用入口
    ├── App.vue             # 根组件
    ├── style.css           # 全局样式（靛蓝主题）
    ├── router/index.js     # 7 条路由
    ├── api/chat.js         # API 封装
    ├── composables/useChat.js  # 聊天状态管理
    ├── views/
    │   ├── Dashboard.vue   # 分析看板
    │   ├── ChatView.vue    # AI 诊断对话（核心）
    │   └── Placeholder.vue # 占位页
    └── components/
        ├── AppSidebar.vue  # 侧边栏
        ├── AppTopbar.vue   # 顶部栏
        ├── StatCard.vue    # 统计卡片
        ├── ChatMessage.vue # 消息气泡
        └── ErrorTable.vue  # 高频错题表
```

## 启动方式

```powershell
# 终端 1：启动 Node.js 后端
npm run server

# 终端 2：启动 Vite 前端开发服务器
npm run dev
```

访问 **http://localhost:5173**

## API

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/chat | AI 对话（{message, sessionId} → {reply, model, durationMs}） |
| GET | /api/health | 健康检查 |

## Prompt 工程

通过 OpenClaw 的 `math-assistant` agent 加载数学教师指令：

- **角色：** 经验丰富的数学教师，严谨不失耐心
- **错题分析：** 1)错误步骤 2)错误原因 3)关联知识点 4)重新讲解
- **语言风格：** 多用"我们"，少用"错了"，鼓励独立思考

Workspace 配置位于 `~/.openclaw/workspace-math-assistant/`
