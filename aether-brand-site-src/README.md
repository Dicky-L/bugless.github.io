# AETHER® — Beyond Ordinary

独立原创的跨行业创意品牌官网演示。面向企业官网、Landing Page、创意展示项目的实际接单作品集，非真实商业客户案例。

## Technology

- Vue 3 + TypeScript + Vite
- GSAP 动画（默认兼容 prefers-reduced-motion）
- CSS 高性能渐变 / 2D/3D transforms（不依赖 WebGL 持续渲染）
- 自适应桌面、平板、手机
- GitHub Actions → GitHub Pages 静态部署

## Modules

- 全屏 Hero、CSS 3D 风格视觉艺术与微动效
- 响应式菜单与章节平滑导航
- 品牌叙事、能力展示、滚动揭示、滚动阅读进度
- 4 组原创演示案例，支持分类筛选、弹窗预览
- 联系表单的浏览器验证和 mailto 唤起（演示模式，无服务端收件功能）
- 可访问性基础（键盘焦点、Escape 关闭弹窗、动效降级）

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Publishing

Push to main triggers `.github/workflows/build-aether.yml`, which compiles Vue and commits built static assets to `aether-brand-site/`. The GitHub Pages site must be set to serve the main branch root.

Preview: https://dicky-l.github.io/bugless.github.io/aether-brand-site/

## Important

**AETHER 为原创技术演示**，公司及项目名称、业务能力描述和指标均是概念展示。产品不包含真实客户数据、订单、后台 API 或真实合同经历。联系表单默认收件人 `hello@example.com` 为占位地址，真实商业部署必须替换或接入可用表单后端，不得宣传已上线实际提交功能。
