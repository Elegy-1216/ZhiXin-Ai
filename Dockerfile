# ===== 知因AI · Docker 部署 =====
# 构建: docker build -t zhixin-ai .
# 运行: docker run -d --name zhixin-ai -p 8080:8080 --env-file .env zhixin-ai

FROM node:22-alpine

WORKDIR /app

# 安装 OpenClaw CLI — 如果包名不同请修改
# 确认方式: npm list -g 或查看 ~/.openclaw 配置
RUN npm install -g openclaw && npm cache clean --force

# 安装项目依赖
COPY package.json package-lock.json ./
RUN npm install --production && npm cache clean --force

# 构建前端
COPY . .
RUN npm run build

EXPOSE 8080

CMD ["node", "server.js"]
