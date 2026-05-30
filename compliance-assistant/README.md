# 小红书「发布前合规预检助手」

一个移动端优先的小红书合规预检 Demo，使用 React + Vite + Tailwind CSS 构建。

## 功能特性

- ✅ 创作页「写长文」编辑器界面
- ✅ 底部工具栏（含「问一问」入口）
- ✅ 半屏弹层交互（Modal Bottom Sheet）
- ✅ AI 主动开场 + 意图选项选择
- ✅ 两段式结果展示（命中规则 + 改进方向）
- ✅ Demo 模式硬编码模拟数据
- ✅ 移动端适配（iOS 风格）

## 技术栈

- **框架**: React 18 + Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **弹层**: 自定义实现（符合设计规范）

## 设计规范

本项目严格遵循 [设计规范](../设计规范.html)，包括：
- 所有组件、字体字号、配色与截图 1:1 对齐
- 使用苹方（PingFang SC）+ SF Pro 字体
- 品牌色 #FF2442、问一问蓝 #017AFC
- iOS 原生风格，移动端优先

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Navbar.jsx           # 顶部导航栏
│   ├── EditorContent.jsx    # 创作页内容
│   ├── Toolbar.jsx          # 底部工具栏
│   ├── BottomSheet.jsx      # 半屏弹层
│   ├── IntentOptions.jsx    # 意图选项
│   ├── ResultCard.jsx       # 结果卡片
│   └── InputBar.jsx         # 底部输入框
├── data/
│   └── demoData.js         # Demo 模拟数据
├── App.jsx
├── App.css
└── index.css
```

## 使用说明

1. 打开页面后，预填的示例笔记将显示在创作页
2. 点击底部工具栏的「问一问」图标打开弹层
3. AI 会主动开场并展示意图选项
4. 选择意图后，AI 会返回两段式结果
5. 可在底部输入框继续追问

## 后续计划

- [ ] 支持真实 LLM API 接入
- [ ] 用户可配置 API Key
- [ ] 规则知识库集成
- [ ] 多轮对话支持

## License

MIT
