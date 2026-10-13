# Energy Studio · 能源可视化组态编辑器

企业级能源拓扑编辑器的**独立脱敏交互案例**，基于早期组态系统需求抽象重构；不是任何企业内部系统的原始工程代码，所有数据均为本地模拟。

## Stack

- Vue 3 + TypeScript + Vite + Pinia + Element Plus
- SVG / Pointer Events，**非栅格**自由坐标，设备与管线共享 zIndex
- PageSchema + Draft / Published 分离；localStorage 保存、JSON 导入与导出
- 统一场景渲染器：编辑态与展示态共享 `SceneCanvas`

## Features

- 文本、标签、设备、仪表、数据卡、能源管线的组件资源库
- 鼠标拖拽、画布缩放、组件 Resize、撤销/重做、复制/删除
- 管线平移、折点拖拽、增加/删除折点（至少保留两个节点）、端点样式
- 水、电、气能源 / 逻辑图层筛选，位置、zIndex 和属性面板
- 工艺设备单选、参数绑定；区分采集与虚拟参数；更换设备时清除旧参数
- 草稿保存与运行态发布隔离；Mock 数据定期刷新、详情弹窗、交互动作演示
- 最大 500 个元素 / 管线 2～200 个节点的 Schema 输入校验

## Run

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run build` 生成 `dist/`，Vite 使用 `base: './'`，可直接部署到 GitHub Pages 项目子目录 `energy-visual-editor/`。

## Project layout

```text
src/
  types/scene.ts             # PageSchema 和对象约束
  model/scene.ts             # 数据、Mock Adapter、约束、工厂
  stores/editor.ts           # Pinia 编辑事务、撤销、草稿、发布
  components/SceneCanvas.vue# SVG + HTML 统一画布 renderer
  components/WidgetRenderer.vue
  components/InspectorPanel.vue
  App.vue                    # 工作台、面板与模式切换
```

## Notice

- 不包含真实客户数据、业务接口、系统账户、密钥或生产服务代码。
- 发布只在浏览器的本地存储中模拟，不是真实服务器发布流程。
- React / 低代码引擎不是本演示的实现方案；不能将本项目宣称为真实长安生产交付源码。