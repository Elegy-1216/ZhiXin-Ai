# 知因AI · 智能错题诊断平台

基于 **OpenClaw** + **千问大模型** 构建的 AI 错题诊断平台前端。

## 目录结构

```
C:\project\zhixin-ai\
├── index.html      # 主页面
├── server.py       # 开发服务器
└── README.md       # 项目说明
```

## 启动开发服务器

```powershell
cd C:\project\zhixin-ai
python server.py
```

访问 http://localhost:8080

## 技术栈

- 纯前端 HTML/CSS/JS（无需构建工具）
- 通过 OpenClaw API 与千问大模型交互
- 靛蓝主题，响应式布局
