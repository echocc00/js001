# Hydro 项目 Codex 开发指引

- 技术栈: TypeScript, Yarn 4 (Berry) workspaces, MongoDB 7
- 核心包: packages/hydrooj (主站), packages/hydrojudge (评测机)
- 插件系统入口: packages/hydrooj/src/plugin-api.ts
- 插件加载器: packages/hydrooj/src/loader.ts
- 新功能优先用插件实现，不要直接改核心代码
- 数据模型: packages/hydrooj/src/model/
- 路由处理器: packages/hydrooj/src/handler/
- 业务逻辑: packages/hydrooj/src/service/
- 前端 UI: packages/ui-default/
- 数据库 migration: packages/hydrooj/src/script/
- 测试命令: yarn test
- 构建命令: yarn build
- 启动命令: yarn start
- 调试模式: yarn debug
- 编码风格: 遵循项目 eslint.config.mjs 规则
- 运行 Yarn: node .yarn/releases/yarn-4.14.1.cjs <command>或设置 $env:YARN_GLOBAL_FOLDER / $env:YARN_CACHE_FOLDER 到 .yarn/
