# Tabepal 项目设计文档

## 项目概述

Tabepal 是一个现代化的待办事项管理应用，采用 React + TypeScript + Tailwind CSS 技术栈构建。项目具有简洁美观的用户界面和流畅的用户体验。

## 设计理念

基于 [Dribbble To-Do List Mobile App Design](https://dribbble.com/shots/21236436-To-Do-List-Mobile-App-Design) 的设计灵感，采用现代化的卡片式布局、柔和的阴影效果和渐变背景，打造简洁而优雅的用户界面。

## 设计系统

### 色彩方案

- **主色调**: 蓝色系 (`blue-500`, `blue-600`)
- **背景色**: 渐变紫色 (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- **卡片背景**: 纯白色 (`white`) 和半透明白色 (`white/90`)
- **文字颜色**: 深灰色 (`gray-800`) 和中灰色 (`gray-600`)
- **边框颜色**: 浅灰色 (`gray-200`, `gray-300`)

### 字体系统

- **主字体**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **标题**: 大号粗体 (`text-3xl font-semibold`)
- **正文**: 中等大小 (`text-lg`)
- **标签**: 小号中等粗细 (`text-sm font-medium`)

### 间距系统

- **组件间距**: `gap-2`, `gap-3`, `gap-6`
- **内边距**: `p-4`, `p-6`, `p-8`
- **外边距**: `mt-4`, `mt-6`, `mb-4`, `mb-6`

## 组件设计

### 1. 全局样式 (`index.css`)

#### 主要特性
- 渐变背景设计
- 自定义滚动条样式
- 滑入动画效果 (`slideIn`)
- 现代化字体栈
- 响应式基础样式

#### 关键样式
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### 2. 主应用布局 (`App.tsx`)

#### 布局结构
- 居中对齐的内容区域
- 半透明头部导航
- 响应式容器 (`max-w-2xl`)
- 毛玻璃效果的按钮

#### 关键特性
- 毛玻璃效果 (`backdrop-blur-sm`)
- 响应式设计
- 居中对齐布局

### 3. 库存管理组件 (`Inventory.tsx`)

#### 设计特点
- 卡片式容器设计
- 渐变背景 (`from-gray-50 to-gray-100`)
- 圆角阴影效果 (`rounded-2xl shadow-xl`)
- 空状态友好提示

#### 功能特性
- 空状态显示（带图标和提示文字）
- 响应式间距 (`space-y-2 sm:space-y-3`)
- 现代化添加按钮
- 动画效果

### 4. 可滑动项目组件 (`SwipeableItem.tsx`)

#### 设计特点
- 白色卡片背景
- 悬停阴影效果 (`hover:shadow-md`)
- 状态指示点
- 现代化输入框

#### 交互特性
- 点击外部自动保存
- 键盘快捷键支持 (Enter/Escape)
- 失焦自动保存
- 平滑过渡动画

### 5. 登录/注册组件 (`Login.tsx`, `Signup.tsx`)

#### 设计特点
- 半透明卡片设计 (`bg-white/90 backdrop-blur-sm`)
- 大圆角阴影 (`rounded-2xl shadow-xl`)
- 标签式表单布局
- 现代化按钮设计

#### 表单特性
- 标签 + 输入框布局
- 焦点环效果 (`focus:ring-2 focus:ring-blue-500`)
- 错误信息显示优化
- 悬停按钮效果

### 6. Footer组件 (`ThemeToggle.tsx`, `HomeToggle.tsx`, `UserInfo.tsx`)

#### 设计特点
- 统一的半透明背景设计
- 毛玻璃效果与渐变背景融合
- 一致的按钮尺寸和图标大小
- 现代化的SVG图标设计

#### 样式统一规范

##### 统一尺寸
- **按钮尺寸**: 所有按钮都是 `w-12 h-12` (48x48px)
- **图标尺寸**: 图标都是 `w-6 h-6` (24x24px)
- **内边距**: 统一为 `p-2`

##### 统一背景样式
- **半透明白色背景**: `bg-white/20`
- **毛玻璃效果**: `backdrop-blur-sm`
- **悬停效果**: `hover:bg-white/30`

##### 统一视觉效果
- **圆角**: `rounded-xl`
- **白色文字**: `text-white`
- **过渡动画**: `transition-all duration-200`
- **居中对齐**: `flex items-center justify-center`

#### 组件特性
- **ThemeToggle**: 太阳/月亮图标，支持主题切换
- **HomeToggle**: 房屋图标，导航到主页
- **UserInfoToggle**: 用户图标，显示用户信息

#### 设计优势
- **视觉一致性**: 三个按钮完全一致的视觉效果
- **背景融合**: 半透明效果完美融入渐变背景
- **现代化外观**: 毛玻璃效果和圆角设计
- **更好的可访问性**: SVG图标比emoji更清晰
- **统一交互**: 相同的悬停效果和过渡动画

## 响应式设计

### 断点系统
- **移动端**: 默认样式
- **平板**: `sm:` 前缀 (640px+)
- **桌面**: `md:` 前缀 (768px+)

### 响应式特性
- 容器最大宽度限制 (`max-w-md`, `max-w-2xl`)
- 响应式间距 (`p-2 sm:p-4 md:p-6`)
- 响应式字体大小
- 移动端优化的触摸交互

## 动画效果

### 过渡动画
- **持续时间**: 200ms (`duration-200`)
- **缓动函数**: `ease-out`
- **变换效果**: `transform hover:scale-105`

### 关键帧动画
- **滑入动画**: `slideIn` (0.3s ease-out)
- **悬停效果**: 阴影加深、轻微缩放
- **焦点效果**: 边框颜色变化

## 用户体验优化

### 交互反馈
- 悬停状态视觉反馈
- 焦点状态清晰指示
- 加载状态动画
- 错误状态友好提示

### 可访问性
- 键盘导航支持
- 焦点管理
- 语义化HTML结构
- 颜色对比度优化

### 性能优化
- CSS动画使用 `transform` 和 `opacity`
- 避免重排重绘
- 合理的动画时长
- 硬件加速支持

## 技术实现

### 核心技术栈
- **前端框架**: React 18
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **路由**: React Router
- **状态管理**: React Context
- **国际化**: react-i18next

### 样式架构
- **原子化CSS**: Tailwind CSS 工具类
- **组件化设计**: 可复用的样式组件
- **主题系统**: 统一的色彩和间距规范
- **响应式优先**: 移动端优先的设计方法

## 设计原则

1. **简洁性**: 去除不必要的视觉元素，专注于核心功能
2. **一致性**: 统一的设计语言和交互模式
3. **可访问性**: 确保所有用户都能轻松使用
4. **响应式**: 在各种设备上都有良好的体验
5. **性能**: 流畅的动画和快速的响应时间

## 未来改进方向

1. **深色模式**: 支持系统主题切换
2. **自定义主题**: 允许用户自定义色彩方案
3. **更多动画**: 添加页面切换和微交互动画
4. **手势支持**: 增强移动端手势交互
5. **无障碍优化**: 进一步提升可访问性

---

*最后更新: 2024年12月*
*设计参考: [Dribbble To-Do List Mobile App Design](https://dribbble.com/shots/21236436-To-Do-List-Mobile-App-Design)* 