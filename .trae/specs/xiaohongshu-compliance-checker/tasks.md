# 小红书「发布前合规预检助手」- The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 项目初始化与基础结构搭建
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 使用 Vite + React + Tailwind CSS 初始化项目
  - 配置项目目录结构
  - 添加预填的示例笔记内容（标题和正文）
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 项目能够正常启动并在浏览器中运行
  - `human-judgment` TR-1.2: 创作页布局正确，包含标题输入区、正文编辑区和底部工具栏
- **Notes**: 示例笔记内容参考产品说明文档中的 Demo 用例

## [ ] Task 2: 创作页 UI 实现
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 实现「写长文」编辑界面的完整 UI
  - 实现顶部导航栏（返回、标题、一键排版）
  - 实现标题和正文输入区
  - 实现底部工具栏（Aa、列表、标记笔、表情、图片、问一问、完成）
  - 集成「问一问」图标（使用 logo_vector.svg）
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-2.1: UI 与小红书原生设计风格一致
  - `human-judgment` TR-2.2: 「问一问」图标位于图片图标与「完成」之间
  - `programmatic` TR-2.3: 输入区可以正常输入和编辑文本
- **Notes**: 参考 Frontend/「写长文」编辑页面.jpg 和 Frontend/logo_vector.svg

## [ ] Task 3: 半屏弹层组件实现
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 实现 Modal Bottom Sheet 组件
  - 实现弹层打开/关闭动画
  - 实现顶部把手和标题区
  - 实现背景遮罩和点击关闭功能
  - 添加模式切换按钮
- **Acceptance Criteria Addressed**: AC-2, AC-9, AC-10
- **Test Requirements**:
  - `human-judgment` TR-3.1: 弹层从底部滑入，高度约占 2/3
  - `human-judgment` TR-3.2: 点击背景或下拉把手可以关闭弹层
  - `human-judgment` TR-3.3: 弹层动画流畅自然
  - `human-judgment` TR-3.4: 可以看到模式切换按钮
- **Notes**: 参考 Frontend/弹层交互形态.jpg

## [ ] Task 4: 对话内容区实现
- **Priority**: P0
- **Depends On**: Task 3
- **Description**: 
  - 实现对话气泡样式
  - 实现意图选项按钮组件
  - 实现底部输入框组件
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 对话气泡样式与小红书原生「问一问」一致
  - `human-judgment` TR-4.2: 意图选项按钮样式美观可点击
  - `programmatic` TR-4.3: 底部输入框可以正常输入和发送
- **Notes**: 参考 Frontend/问一问内容样式.jpg

## [ ] Task 5: 状态管理与核心逻辑实现
- **Priority**: P0
- **Depends On**: Task 4
- **Description**: 
  - 实现草稿内容的状态管理
  - 实现对话历史的状态管理
  - 实现弹层打开时自动读取草稿的逻辑
  - 实现 AI 主动开场的逻辑
  - 实现模式切换的状态管理（Demo / 真实 API）
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-10
- **Test Requirements**:
  - `programmatic` TR-5.1: 弹层打开时能正确获取当前草稿内容
  - `programmatic` TR-5.2: 弹层打开后自动显示 AI 开场气泡
  - `programmatic` TR-5.3: 模式切换状态能正确保存
- **Notes**: 使用 React Context 或 Zustand 进行状态管理

## [ ] Task 6: Demo 模式 - 模拟数据系统
- **Priority**: P0
- **Depends On**: Task 5
- **Description**: 
  - 构建模拟响应数据文件（JSON 格式）
  - 实现模拟的意图选项生成逻辑
  - 实现模拟的规则命中和改进建议生成
  - 实现模拟的追问和回复逻辑
  - 实现 AI 思考动画（模拟打字效果）
- **Acceptance Criteria Addressed**: AC-4, AC-5, AC-6, AC-7, AC-8
- **Test Requirements**:
  - `programmatic` TR-6.1: 点击意图选项后该选项被高亮
  - `programmatic` TR-6.2: 用户可以在输入框输入并发送自定义意图
  - `human-judgment` TR-6.3: 意图选项与示例笔记内容相关
  - `programmatic` TR-6.4: AI 返回结构化结果
  - `programmatic` TR-6.5: 支持多轮追问
- **Notes**: 示例意图选项：「想推荐一个最好用的 AI」、「想做多个 AI 的横向对比」

## [ ] Task 7: API Key 配置系统
- **Priority**: P1
- **Depends On**: Task 5
- **Description**: 
  - 实现 API Key 输入界面
  - 实现 localStorage 存储/读取 API Key
  - 实现 Key 的删除/重置功能
  - 实现 Key 的基本验证（格式检查）
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `programmatic` TR-7.1: 用户可以输入并保存 API Key
  - `programmatic` TR-7.2: Key 能在刷新后保持
  - `programmatic` TR-7.3: 可以删除已保存的 Key
- **Notes**: Key 只存储在浏览器本地，不上传任何服务器

## [ ] Task 8: 真实 API 模式 - LLM 集成
- **Priority**: P1
- **Depends On**: Task 6, Task 7
- **Description**: 
  - 集成 OpenAI（或其他）API 客户端
  - 设计系统提示词（System Prompt）
  - 实现意图识别和选项生成的 API 调用
  - 实现规则命中分析的 API 调用
  - 实现多轮对话的 API 调用
  - 实现流式输出（打字机效果）
  - 错误处理（网络错误、Key 无效、超限等）
- **Acceptance Criteria Addressed**: AC-4, AC-5, AC-6, AC-7, AC-8
- **Test Requirements**:
  - `programmatic` TR-8.1: 有 API Key 时能调用真实 API
  - `programmatic` TR-8.2: 支持流式输出显示
  - `programmatic` TR-8.3: 错误时显示友好提示
- **Notes**: 待定：具体使用哪家 LLM API

## [ ] Task 9: 规则知识库集成（真实 API 模式）
- **Priority**: P1
- **Depends On**: Task 8
- **Description**: 
  - 将规则知识库嵌入系统提示词或做成检索系统
  - 根据规则量决定技术方案（直接嵌入 / 向量检索）
  - 实现规则匹配和引用逻辑
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-9.1: AI 能正确引用规则
  - `programmatic` TR-9.2: 改进建议与规则相符
- **Notes**: 规则格式和内容待提供

## [ ] Task 10: 响应式设计与移动端优化
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 优化移动端适配
  - 确保在不同屏幕尺寸下显示正常
  - 优化触摸交互体验
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-9
- **Test Requirements**:
  - `human-judgment` TR-10.1: 在移动端浏览器中显示正常
  - `human-judgment` TR-10.2: 触摸操作流畅，无卡顿
- **Notes**: 主要针对移动端设计，因为小红书主要在手机上使用

## [ ] Task 11: 整体测试与优化
- **Priority**: P1
- **Depends On**: Task 9, Task 10
- **Description**: 
  - 完整的用户流程测试
  - UI/UX 优化
  - 性能优化
- **Acceptance Criteria Addressed**: AC-1 至 AC-11
- **Test Requirements**:
  - `human-judgment` TR-11.1: 完整用户流程顺畅无卡顿
  - `human-judgment` TR-11.2: 整体体验符合预期
  - `human-judgment` TR-11.3: 两种模式都能正常工作
- **Notes**: 测试从打开创作页到完成预检的完整流程
