#!/bin/bash
# Hydro 测试机部署脚本
# 用法: bash scripts/deploy.sh

set -e

HYDRO_DIR="$HOME/Hydro"
PM2_APP="hydro-backend"

cd "$HYDRO_DIR"

echo ">>> 拉取最新代码..."
git pull origin base-deploy

echo ">>> 运行备份..."
node packages/hydrooj/bin/hydrooj.js backup

echo ">>> 增量编译..."
yarn build

echo ">>> 重启应用..."
pm2 restart "$PM2_APP"

echo ">>> 部署完成！"
pm2 status
