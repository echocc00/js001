# js001 项目开发约定

> 最后更新: 2026-05-22 | 基于 Hydrooj 运维问题复盘

## 核心原则：严格区分开发与部署

| 场景 | 工作流 | hydrooj 访问方式 | 环境 |
|------|--------|-----------------|------|
| 本地开发 | DevContainer (Docker) | npx hydrooj | VS Code + docker-compose |
| 测试机部署 | 手动安装 (用户空间) | 用户 PATH | Linux 裸机 + PM2 |
| 生产部署 | Docker Compose | 容器内 | Docker |

**禁止混用**: git clone + yarn install = 开发工作流, 不等于部署。
部署必须走 install.sh 或 docker-compose, 确保 hydrooj 进入全局 PATH。

## 测试机 (192.168.2.19) 环境事实

- SSH: debian / debian (端口 22)
- Hydro 源码: /home/debian/Hydro (wget tarball 方式)
- 管理方式: PM2 (hydro-backend)
- MongoDB: 用户空间 /home/debian/mongodb, 127.0.0.1:27017
- Node.js: /home/debian/node-v22.14.0-linux-x64/bin/
- 配置: ~/.hydro/config.json
- 端口: 8888

## 部署后必跑检查清单

每次在测试机部署/更新后, 必须验证以下 4 项:

```bash
ps aux | grep mongod | grep -v grep || echo FAIL: mongod not running
[ -f ~/.hydro/config.json ] || echo FAIL: no config
[ -f ~/Hydro/packages/ui-next/public/index.html ] || echo FAIL: ui-next not built
curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/ | grep -q 200 || echo FAIL: server not responding
```

## 常见错误与避免

### 1. hydrooj 命令找不到
- 原因: 源码 clone + yarn install 后 hydrooj 只在 node_modules/.bin
- 修复: ln -sf /root/Hydro/node_modules/.bin/hydrooj /usr/local/bin/hydrooj
- 预防: 部署走 install.sh, 或手动创建 symlink

### 2. 误判为 Python venv 问题
- Hydrooj 是 Node.js 项目, 不涉及 Python
- 排查前先确认技术栈: 读 package.json

### 3. MongoDB 连接失败
- 原因: ~/.hydro/config.json 不存在或 MongoDB 未启动
- 预防: 部署后检查 mongod 进程

### 4. 页面空白 / "Hydro UI is building" 一直显示
- 原因: `packages/ui-next/public/` 不存在, 前端 Vite 构建未执行
- 根因: `.gitignore` 排除了 `public/`, git clone/pull 不带前端产物; `yarn build` 只编译 TS, 不含 `build:ui-next`
- 修复: `npm run build:ui-next && pm2 restart hydro-backend`
- 预防: 部署流程中必须包含 `build:ui-next` 步骤; 构建后必须重启 (koa-static-cache 在启动时缓存)

### 5. 页面无功能模块 (无登录/题库/中文)
- 原因: `ui-next` 渲染器优先级 100 > `ui-default` 优先级 1, 所有页面被 ui-next 劫持
- 根因: `~/.hydro/addon.json` 中包含 `ui-next`, 其 `asFallback + priority:100` 覆盖了 ui-default 的传统模板渲染
- 修复: 从 `~/.hydro/addon.json` 中移除 `ui-next` 条目, 然后 `pm2 restart hydro-backend`
- 预防: 生产/测试环境不要启用 ui-next (半成品), 仅本地开发时使用

## 升级测试机标准流程

```bash
export PATH=$HOME/node-v22.14.0-linux-x64/bin:$PATH
cd ~/Hydro
wget -q -O hydro.tar.gz https://codeload.github.com/echocc00/js001/tar.gz/base-deploy
tar -xzf hydro.tar.gz --strip-components=1 -C ~/Hydro-tmp
# 手动替换需要更新的文件
cd ~/Hydro && yarn install && npm run build && npm run build:ui
pm2 restart hydro-backend
curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/ | grep -q 200 || echo FAIL: server not responding
```

## 关于 ui-next

`ui-next` (新版 React SPA UI) 为半成品, **生产/测试环境必须禁用**:
- `~/.hydro/addon.json` 中不应包含 `ui-next` 条目
- 仅本地开发 (`yarn dev`) 时按需启用

## 参考文档
- Hydro-Ops-Manual.md -- 运维手册
- Hydro/AGENTS.md -- Hydro 源码开发指引
## 评测环境 (judge + sandbox)

评测架构: `sandbox (go-judge :5050) ←→ hydrojudge ←WebSocket→ hydro-backend :8888`

### 安装

在测试机上运行:
```bash
bash ~/Hydro/scripts/setup-judge.sh
```

脚本会完成:
1. 下载 go-judge sandbox (criyle/go-judge) 到 /usr/local/bin/sandbox
2. 创建 ~/.hydro/mount.yaml (进程隔离挂载配置)
3. 创建 ~/.hydro/judge.yaml (评测机连接配置)
4. 从 Hydro 源码安装/编译 hydrojudge
5. 通过 PM2 启动 sandbox + hydrojudge

### 安装后必须编辑

```bash
nano ~/.hydro/judge.yaml
# 修改 uname 和 password 为你在 Hydro 中的账号密码
```

### 评测链路验证 (5 项检查)

```bash
ps aux | grep mongod | grep -v grep || echo FAIL: mongod
[ -f ~/.hydro/config.json ] || echo FAIL: no config
curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/ | grep -q 200 || echo FAIL: server
curl -s http://localhost:5050/version | grep buildVersion || echo FAIL: sandbox
pm2 status | grep hydrojudge | grep online || echo FAIL: hydrojudge
```
