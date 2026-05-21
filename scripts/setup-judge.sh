#!/bin/bash
# Hydro Judge 评测环境安装脚本 (测试机 192.168.2.19)
# 用法: bash setup-judge.sh

set -e

echo "========================================"
echo " Hydro Judge 评测环境安装"
echo "========================================"

# ── 环境变量 ──────────────────────────────
export PATH=$HOME/node-v22.14.0-linux-x64/bin:$PATH
HYDRO_CONFIG_DIR="$HOME/.hydro"
SANDBOX_BIN="/usr/local/bin/sandbox"
SANDBOX_VERSION="1.9.4"
SANDBOX_URL="https://github.com/criyle/go-judge/releases/download/v${SANDBOX_VERSION}/go-judge_${SANDBOX_VERSION}_linux_amd64v3"

echo ""
echo "[1/5] 检测系统环境..."
echo "  Kernel: $(uname -r)"
echo "  Arch:   $(uname -m)"

# 检查 cgroup 支持
if [ -d /sys/fs/cgroup ]; then
    echo "  cgroup: $(stat -fc %T /sys/fs/cgroup 2>/dev/null || echo 'v1')"
else
    echo "  ⚠ cgroup 未挂载，评测功能可能受限"
fi

# ── 2. 安装 go-judge sandbox ─────────────
echo ""
echo "[2/5] 安装 go-judge sandbox v${SANDBOX_VERSION}..."

if [ -f "$SANDBOX_BIN" ]; then
    echo "  sandbox 已存在，跳过下载"
else
    wget -q --show-progress "$SANDBOX_URL" -O /tmp/sandbox
    chmod +x /tmp/sandbox
    sudo mv /tmp/sandbox "$SANDBOX_BIN"
    echo "  ✓ sandbox 安装完成"
fi

# ── 3. 创建 mount.yaml ──────────────────
echo ""
echo "[3/5] 创建 sandbox mount 配置..."

mkdir -p "$HYDRO_CONFIG_DIR"

cat > "$HYDRO_CONFIG_DIR/mount.yaml" << 'MOUNTEOF'
mount:
  - type: bind
    source: /bin
    target: /bin
    readonly: true
  - type: bind
    source: /lib
    target: /lib
    readonly: true
  - type: bind
    source: /lib64
    target: /lib64
    readonly: true
  - type: bind
    source: /usr
    target: /usr
    readonly: true
  - type: bind
    source: /etc
    target: /etc
    readonly: true
  - type: bind
    source: /var
    target: /var
    readonly: true
  - type: bind
    source: /dev/null
    target: /dev/null
  - type: bind
    source: /dev/urandom
    target: /dev/urandom
  - type: bind
    source: /dev/zero
    target: /dev/zero
  - type: tmpfs
    target: /w
    data: size=512m,nr_inodes=8k
  - type: tmpfs
    target: /tmp
    data: size=512m,nr_inodes=8k
proc: true
workDir: /w
hostName: executor_server
domainName: executor_server
uid: 1536
gid: 1536
MOUNTEOF

echo "  ✓ mount.yaml 已创建"

# ── 4. 创建 judge.yaml ──────────────────
echo ""
echo "[4/5] 创建 hydrojudge 配置..."

# 尝试读取已有 Hydro 配置获取 server_url
SERVER_URL="http://localhost:8888/"
if [ -f "$HYDRO_CONFIG_DIR/config.json" ]; then
    PORT=$(grep -o '"port":[0-9]*' "$HYDRO_CONFIG_DIR/config.json" | head -1 | cut -d: -f2)
    [ -n "$PORT" ] && SERVER_URL="http://localhost:$PORT/"
fi

cat > "$HYDRO_CONFIG_DIR/judge.yaml" << JUDGEEOF
hosts:
  localhost:
    type: hydro
    server_url: $SERVER_URL
    uname: JUDGE_USERNAME
    password: JUDGE_PASSWORD
    detail: full
JUDGEEOF

echo "  ✓ judge.yaml 已创建 (请修改 uname/password)"
echo "  ⚠ 请编辑 ~/.hydro/judge.yaml 填入 Hydro 账号密码"

# ── 5. 安装/验证 hydrojudge ─────────────
echo ""
echo "[5/5] 安装 hydrojudge..."

if command -v hydrojudge &>/dev/null; then
    echo "  hydrojudge 已安装: $(hydrojudge --version 2>/dev/null || echo 'ok')"
else
    # 尝试从 Hydro 源码安装
    if [ -d "$HOME/Hydro" ]; then
        echo "  从 Hydro 源码安装..."
        cd "$HOME/Hydro"
        yarn install --immutable 2>/dev/null || yarn install
        yarn build
        # 创建 symlink
        sudo ln -sf "$HOME/Hydro/packages/hydrojudge/node_modules/.bin/hydrojudge" /usr/local/bin/hydrojudge 2>/dev/null || \
            ln -sf "$HOME/Hydro/packages/hydrojudge/node_modules/.bin/hydrojudge" "$HOME/bin/hydrojudge" 2>/dev/null || true
        echo "  ✓ hydrojudge 安装完成"
    else
        echo "  ⚠ Hydro 源码目录未找到，跳过 hydrojudge 安装"
        echo "  请手动运行: yarn global add @hydrooj/hydrojudge"
    fi
fi

# ── 启动 PM2 服务 ────────────────────────
echo ""
echo "========================================"
echo " 启动评测服务"
echo "========================================"

# 停止旧的 judge 进程（如果存在）
pm2 delete sandbox 2>/dev/null || true
pm2 delete hydrojudge 2>/dev/null || true

# 启动 sandbox（需要 root 权限管理 cgroup）
pm2 start sandbox --name sandbox -- -mount-conf "$HYDRO_CONFIG_DIR/mount.yaml" --port 5050

# 等待 sandbox 就绪
sleep 2

# 启动 hydrojudge
pm2 start hydrojudge --name hydrojudge

pm2 save

echo ""
echo "========================================"
echo " 安装完成！验证步骤："
echo "========================================"
echo ""
echo "1. 检查 sandbox 状态:"
echo "   curl -s http://localhost:5050/version"
echo ""
echo "2. 检查 hydrojudge 状态:"
echo "   pm2 status"
echo ""
echo "3. 检查 Hydro 后台评测机连接:"
echo "   pm2 logs hydrojudge --lines 20"
echo ""
echo "4. 4 项基础检查:"
echo "   ps aux | grep mongod | grep -v grep || echo FAIL: mongod"
echo "   [ -f ~/.hydro/config.json ] || echo FAIL: no config"
echo "   curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/ | grep -q 200 || echo FAIL: server"
echo "   curl -s http://localhost:5050/version | grep buildVersion || echo FAIL: sandbox"
echo ""
