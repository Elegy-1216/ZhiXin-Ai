#!/bin/bash
# 若叶睦 OpenClaw 配置恢复脚本
# 从项目目录恢复 workspace 文件到 ~/.openclaw/

echo "恢复 workspace 文件..."
cp -r workspace-wakaba-mutsumi ~/.openclaw/
echo "已完成！重启 Gateway: openclaw gateway restart"
