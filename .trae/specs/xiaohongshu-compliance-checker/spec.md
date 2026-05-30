# 小红书「发布前合规预检助手」- Product Requirement Document

## 参考文件
本项目涉及的所有设计参考文件存放在 `Frontend/` 目录下：

| 文件名 | 路径 | 说明 |
|--------|------|------|
| logo_vector.svg | [Frontend/logo_vector.svg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/logo_vector.svg) | 「问一问」入口图标（蓝色矢量图，需用于工具栏） |
| 「写长文」编辑页面.jpg | [Frontend/「写长文」编辑页面.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/「写长文」编辑页面.jpg) | 创作页 UI 布局参考 |
| 弹层交互形态.jpg | [Frontend/弹层交互形态.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/弹层交互形态.jpg) | 底部弹层样式参考 |
| 问一问内容样式.jpg | [Frontend/问一问内容样式.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/问一问内容样式.jpg) | AI 对话气泡样式参考 |

## Overview
- **Summary**: 这是一个集成在小红书发布者端（创作页）的合规预检助手，帮助创作者在发布之前检测笔记可能违反的社区规则，并提供具体的改进方向。
- **Purpose**: 解决小红书事后审核带来的体验断层问题，减少创作者因不熟悉规则而导致的无意违规，降低平台的申诉压力和投诉率。
- **Target Users**: 小红书创作者（尤其是希望遵守规则但不熟悉规则边界的普通创作者）

## Goals
- 在发布前帮助创作者检测笔记是否违规
- 提供具体的规则引用和改进方向
- 通过意图对齐确保改进建议符合用户的真实创作意图
- 降低创作者的挫败感，保护创作积极性
- 降低平台的人工客服与申诉压力
- 支持两种模式：Demo 模拟模式和真实 API 模式

## Non-Goals (Out of Scope)
- 不强制拦截发布（仅提供提示和建议）
- 不提供一键替换的成稿（仅提供改进方向）
- 不支持图片/视频内容分析（本期仅支持纯文本）
- 不与真实审核模型打通（Demo 阶段以 LLM + 规则知识库模拟）

## Background & Context
小红书当前采用事后审核机制，创作者发布后才知道是否通过，且通常只收到简单结论。这导致：
1. 规则繁杂，创作者难以完全掌握
2. 大量无意违规导致创作者愤怒和申诉
3. 平台人工客服压力大，投诉率上升

本产品复用小红书原生「问一问 AI」的对话交互形式，将其从内容消费端搬到发布者端，并注入社区规则知识库。

## 架构设计：双模式系统

### 模式一：Demo 模拟模式（默认）
- **目的**：无需配置即可演示完整流程，适合快速分享和展示
- **实现**：使用硬编码的模拟响应数据
- **流程**：
  1. 读取预设的示例草稿
  2. 根据草稿内容生成模拟的意图选项
  3. 用户选择意图后返回预设的规则命中结果和改进建议
  4. 支持有限的预设追问和回复

### 模式二：真实 API 模式
- **目的**：使用真实 LLM 进行智能分析
- **实现**：调用 OpenAI（或其他）API
- **安全设计**：
  - 用户在前端输入自己的 API Key
  - API Key 存储在浏览器 localStorage 中，不存入代码
  - API 调用从前端直接发起，避免后端 Key 泄露
- **需要提供的内容**：
  1. 结构化的规则知识库（格式待确定）
  2. 选择 LLM 提供商（OpenAI / 其他）
  3. 系统提示词（System Prompt）的设计

### 模式切换
- 在弹层右上角或设置中添加模式切换按钮
- 首次使用时默认 Demo 模式
- 用户可随时切换模式并配置 API Key

## Functional Requirements
- **FR-1**: 创作页提供「问一问」合规预检入口
- **FR-2**: 点击入口后唤起半屏弹层（Modal Bottom Sheet）
- **FR-3**: 弹层打开时自动读取当前草稿的标题和正文
- **FR-4**: AI 主动开场，说明已读完笔记，并请用户确认核心意图
- **FR-5**: 提供基于当前内容动态生成的意图选项（可点选）
- **FR-6**: 保留输入框供用户自述意图
- **FR-7**: 用户确认意图后，AI 返回命中规则和改进方向
- **FR-8**: 支持用户在弹层内多轮追问
- **FR-9**: 弹层可通过下拉或点击遮罩关闭
- **FR-10**: 支持 Demo 模式和真实 API 模式切换
- **FR-11**: 支持用户输入并保存 API Key（仅真实 API 模式）

## Non-Functional Requirements
- **NFR-1**: 弹层动画流畅，响应迅速（<500ms）
- **NFR-2**: AI 响应时间合理（Demo 模式 <1s，真实 API 模式 <3s）
- **NFR-3**: 界面美观，与小红书原生设计风格一致
- **NFR-4**: 支持移动端适配
- **NFR-5**: API Key 安全存储，不泄露

## Constraints
- **Technical**: 使用 React + Vite + Tailwind CSS 实现前端
- **Business**: 必须保留原小红书的 UI 设计风格和交互体验
- **Dependencies**: 
  - Demo 模式：无外部依赖
  - 真实 API 模式：需要接入 LLM API（用于内容分析和规则判断）

## Assumptions
- 用户使用的是「写长文」编辑器（非图文笔记编辑器）
- 仅对纯文本内容进行合规检测
- Demo 模式有预设的草稿内容和模拟响应
- 规则知识库已预先构建并可用（用于真实 API 模式）

## Acceptance Criteria

### AC-1: 创作页「问一问」入口
- **Given**: 用户在「写长文」编辑界面
- **When**: 查看底部工具栏
- **Then**: 可以看到「问一问」图标（在图片图标与「完成」之间）
- **Verification**: `human-judgment`
- **参考文件**: [logo_vector.svg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/logo_vector.svg)、[「写长文」编辑页面.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/「写长文」编辑页面.jpg)

### AC-2: 半屏弹层唤起
- **Given**: 用户在「写长文」编辑界面
- **When**: 点击「问一问」图标
- **Then**: 从屏幕底部唤起高度约占 2/3 的半屏弹层，背景变暗
- **Verification**: `human-judgment`
- **参考文件**: [弹层交互形态.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/弹层交互形态.jpg)

### AC-3: AI 主动开场
- **Given**: 弹层已打开，且草稿有内容
- **When**: 弹层完全展开
- **Then**: AI 主动发出开场气泡："我已读完你的笔记，先确认下你最想让读者 get 到的是什么？"
- **Verification**: `programmatic`
- **参考文件**: [问一问内容样式.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/问一问内容样式.jpg)

### AC-4: 动态意图选项
- **Given**: 弹层已打开，AI 已开场
- **When**: 查看开场气泡下方
- **Then**: 显示基于当前草稿内容生成的可点选意图选项按钮
- **Verification**: `programmatic`
- **参考文件**: [问一问内容样式.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/问一问内容样式.jpg)

### AC-5: 用户选择意图
- **Given**: 意图选项已显示
- **When**: 用户点击某个意图选项
- **Then**: 该选项被高亮，AI 开始返回合规检查结果
- **Verification**: `programmatic`

### AC-6: 用户自述意图
- **Given**: 意图选项已显示
- **When**: 用户在底部输入框输入并发送自己的意图
- **Then**: 用户输入的意图被记录，AI 开始返回合规检查结果
- **Verification**: `programmatic`

### AC-7: AI 返回两段式结果
- **Given**: 用户已确认意图
- **When**: AI 完成分析
- **Then**: 返回结构化结果，包含「命中哪条规则」和「改进方向」两部分
- **Verification**: `programmatic`
- **参考文件**: [问一问内容样式.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/问一问内容样式.jpg)

### AC-8: 多轮追问
- **Given**: AI 已返回第一次结果
- **When**: 用户在底部输入框输入问题并发送
- **Then**: AI 基于当前草稿和对话历史继续回答
- **Verification**: `programmatic`

### AC-9: 关闭弹层
- **Given**: 弹层已打开
- **When**: 用户下拉弹层把手或点击变暗的背景
- **Then**: 弹层收起，回到创作页
- **Verification**: `human-judgment`
- **参考文件**: [弹层交互形态.jpg](file:///Users/heyuxuan/Desktop/小红书创作者合规助手/Frontend/弹层交互形态.jpg)

### AC-10: 模式切换
- **Given**: 弹层已打开
- **When**: 用户点击模式切换按钮
- **Then**: 显示模式选择界面，支持 Demo 模式和真实 API 模式切换
- **Verification**: `programmatic`

### AC-11: API Key 配置
- **Given**: 处于真实 API 模式
- **When**: 用户第一次使用或点击配置
- **Then**: 显示 API Key 输入界面，支持输入、保存和删除 Key
- **Verification**: `programmatic`

## Open Questions
- [ ] LLM API 使用哪家？（OpenAI / 其他）
- [ ] 是否需要用户登录？
- [ ] 规则知识库的具体内容和格式？
