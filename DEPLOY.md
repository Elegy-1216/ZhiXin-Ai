# 知因AI · 云服务器部署指南

> 将 Node.js 后端 + OpenClaw Gateway + Vue 前端部署到 Linux 云服务器，
> 客户端只需浏览器即可使用，无需任何本地安装。

---

## 架构总览

```
客户端浏览器
    │  HTTPS
    ▼
Nginx（反向代理，端口 443）
    │  /api/* → localhost:8080
    │  /*     → dist/ 静态文件
    ▼
Node.js 后端 (server.js · 端口 8080)
    │  openclaw agent
    ▼
OpenClaw Gateway (端口 18789)
    │  DeepSeek API
    ▼
DeepSeek V4 Flash 大模型
```

---

## 一、服务器准备

### 最低配置

| 配置 | 规格 |
|------|------|
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 40 GB |
| 系统 | Ubuntu 22.04 / CentOS 7+ |
| 网络 | 公网 IP，开放 80/443 端口 |

### 推荐云服务商

- 阿里云 / 腾讯云 / 华为云（国内用户，延迟低）
- 新加坡或香港节点（如需境外部署）

---

## 二、服务器环境安装

### 1. 安装 Node.js (v22 LTS)

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v   # ≥ v22
npm -v
```

### 2. 安装 Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. 安装 OpenClaw

```bash
npm install -g @openclaw/cli    # 或对应的 npm 包名
openclaw --version              # 验证安装
```

> 如果 OpenClaw 不在 `/usr/local/bin`，请记下路径，在 `.env` 中配置 `OPENCLAW_BIN`

### 4. 安装 Git (拉取代码)

```bash
sudo apt-get install -y git
```

---

## 三、部署项目

### 1. 拉取代码

```bash
mkdir -p /var/www/zhixin-ai
cd /var/www/zhixin-ai
git clone <你的仓库地址> .
```

### 2. 安装依赖

```bash
npm install --production
```

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

根据服务器环境修改：

```ini
# 服务端口（内网，不对外暴露）
SERVER_PORT=8080

# OpenClaw 配置
OPENCLAW_AGENT=math-assistant
OPENCLAW_TIMEOUT=120000

# Linux 下通常直接用 openclaw 命令（已在 PATH）
OPENCLAW_BIN=openclaw
```

### 4. 构建前端

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 5. 测试后端

```bash
# 前台启动测试
node server.js

# 另开终端测试健康检查
curl http://localhost:8080/api/health
# 应返回: {"status":"ok","service":"知因AI API Server (Node.js)",...}
```

按 `Ctrl+C` 停止测试。

---

## 四、配置 systemd 服务（开机自启）

### 创建服务文件

```bash
sudo nano /etc/systemd/system/zhixin-ai.service
```

```ini
[Unit]
Description=知因AI API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/zhixin-ai
ExecStart=/usr/bin/node /var/www/zhixin-ai/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable zhixin-ai
sudo systemctl start zhixin-ai

# 查看状态
sudo systemctl status zhixin-ai

# 查看日志
sudo journalctl -u zhixin-ai -f
```

---

## 五、配置 Nginx 反向代理

### 1. 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/zhixin-ai
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改为你的域名或服务器 IP

    # 前端静态文件
    root /var/www/zhixin-ai/dist;
    index index.html;

    # API 反向代理 → Node.js 后端
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### 2. 启用站点

```bash
sudo ln -s /etc/nginx/sites-available/zhixin-ai /etc/nginx/sites-enabled/
sudo nginx -t              # 测试配置
sudo systemctl reload nginx
```

### 3. （推荐）配置 HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 六、防火墙设置

```bash
# Ubuntu UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp     # SSH
sudo ufw enable
```

> 注意：**不需要**开放 8080 端口，Nginx 通过本地 127.0.0.1:8080 转发。

---

## 七、验证部署

| 检查项 | 命令 / 方法 |
|--------|------------|
| 后端健康 | `curl http://127.0.0.1:8080/api/health` |
| Nginx 代理 | 浏览器访问 `http://your-domain.com/api/health` |
| 前端页面 | 浏览器访问 `http://your-domain.com/` |
| OpenClaw 通信 | 在聊天页面发送一条消息，查看有无错误返回 |

---

## 八、维护命令

```bash
# 重启后端
sudo systemctl restart zhixin-ai

# 查看实时日志
sudo journalctl -u zhixin-ai -f

# 更新代码
cd /var/www/zhixin-ai
git pull
npm install --production
npm run build
sudo systemctl restart zhixin-ai

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 九、常见问题

### OpenClaw 找不到

```bash
# 确认安装位置
which openclaw
# 如果返回空，手动设置路径
which openclaw || find / -name "openclaw" -type f 2>/dev/null
# 更新 .env 中的 OPENCLAW_BIN
```

### 502 Bad Gateway

```bash
# 检查后端是否运行
sudo systemctl status zhixin-ai
# 检查端口监听
ss -tlnp | grep 8080
# 检查 Nginx 配置
sudo nginx -t
```

### 前端白屏 / 路由无法访问

确认 `dist/` 目录存在且有内容：
```bash
ls -la /var/www/zhixin-ai/dist/
```
若无内容，执行 `npm run build`。
