# BinNav - WebStack风格导航网站

<div align="center">
  <img src="logo.png" alt="BinNav Logo" width="120">
  <h3>精选网站导航 · 现代化设计 · 智能搜索</h3>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
</div>

## ✨ 项目简介

BinNav 是一个基于 WebStack.cc 设计理念的现代化导航网站，采用 React + Vite + Tailwind CSS 技术栈构建。致力于为设计师和开发者提供精选的网站资源导航，支持智能搜索、分类浏览、管理后台等功能。

### 🎯 设计理念

- **简洁优雅** - 参考 WebStack.cc 的简约设计风格
- **用户友好** - 直观的操作界面和流畅的交互体验  
- **功能完备** - 搜索、分类、管理一应俱全
- **技术现代** - 使用最新的前端技术栈

## 🚀 核心特性

### 🔍 智能搜索系统
- **AI智能搜索** - 支持同义词映射和相关性排序
- **站内精准搜索** - 基于网站名称、描述、标签的全文搜索
- **实时搜索建议** - 输入即搜索，无需点击搜索按钮
- **快捷搜索标签** - 提供常用搜索词快捷按钮

### 📂 分类体系
- **12个专业分类** - 覆盖设计师和开发者的核心需求
- **作者专栏** - 展示项目作者的相关作品和账号
- **热门网站标识** - 基于人气值的智能推荐
- **层级化显示** - 清晰的信息架构和视觉层次

### 🎨 界面设计
- **玻璃拟态设计** - 现代化的毛玻璃质感界面
- **响应式布局** - 完美适配桌面、平板、移动设备
- **渐变配色** - 柔和舒适的蓝色渐变主题
- **交互动效** - 流畅的悬停效果和过渡动画

### ⚙️ 管理后台
- **网站管理** - 支持网站的增删改查操作
- **分类管理** - 支持二级分类和内联编辑
- **系统设置** - 站点信息和Logo自定义
- **数据导出** - 支持配置文件导出功能

## 📊 网站资源

当前收录 **45个精选网站**，涵盖以下分类：

- **作者专栏** (6个) - Navigator 的个人作品和媒体账号
- **常用推荐** (5个) - Dribbble、Behance、UI中国等知名平台
- **发现产品** (3个) - Product Hunt、NEXT、少数派
- **界面灵感** (3个) - UI设计模式和界面参考
- **网页灵感** (3个) - Awwwards等顶级网页设计
- **图标素材** (4个) - 图标库和矢量资源
- **平面素材** (3个) - PSD、图片、设计素材
- **界面设计** (4个) - Figma、Sketch等设计工具
- **在线配色** (3个) - 颜色和配色工具
- **开发工具** (4个) - GitHub、VS Code等开发资源
- **学习教程** (4个) - 设计和开发学习平台
- **社区资讯** (3个) - 行业资讯和社区平台

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化前端框架
- **Vite 5** - 快速的构建工具
- **React Router DOM** - 单页应用路由

### 样式方案
- **Tailwind CSS 3** - 原子化CSS框架
- **PostCSS** - CSS后处理器
- **Lucide React** - 现代图标库

### 交互增强
- **@dnd-kit** - 拖拽排序功能
- **CSS Transitions** - 流畅的动画效果

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn

### 安装运行

```bash
# 克隆项目
git clone https://github.com/your-username/binnav.git
cd binnav

# 安装依赖（会自动创建 node_modules 目录）
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

> **说明**：`npm install` 会根据 `package.json` 自动下载并安装所有依赖包到 `node_modules/` 目录，该目录通常很大（100-500MB），但不会提交到版本控制系统。

### 访问地址
- 主站地址：http://localhost:5173
- 管理后台：http://localhost:5173/admin

## 📁 项目结构

```
binnav/
├── src/
│   ├── components/
│   │   ├── ui/              # UI基础组件
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   └── input.jsx
│   │   └── WebsiteCard.jsx  # 网站卡片组件
│   ├── pages/
│   │   ├── HomePage.jsx     # 主页面
│   │   └── Admin.jsx        # 管理后台
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   ├── App.css              # 样式文件
│   └── websiteData.js       # 网站数据
├── node_modules/            # NPM依赖包目录(自动生成)
├── index.html              # HTML入口文件
├── logo.png                # 网站Logo
├── *.png                   # 分类图标文件
├── package.json            # 项目配置和依赖声明
├── package-lock.json       # 依赖版本锁定文件
├── vite.config.js         # Vite构建配置
├── tailwind.config.js     # Tailwind CSS配置
└── postcss.config.js      # PostCSS配置
```

## 🔧 自定义配置

### 修改网站数据

编辑 `src/websiteData.js` 文件添加新网站：

```javascript
{
  id: 999,
  name: "您的网站名称",
  description: "网站描述",
  url: "https://your-website.com",
  category: "recommended",
  tags: ["标签1", "标签2"],
  icon: "/your-icon.png",
  popularity: 95
}
```

### 修改分类信息

在 `src/websiteData.js` 中的 `categories` 数组中添加新分类：

```javascript
{
  id: "new_category",
  name: "新分类",
  icon: "/new_icon.png",
  color: "bg-blue-500"
}
```

### 系统设置

通过管理后台的系统设置页面可以修改：
- 站点名称
- Logo路径  
- 站点描述

## 📱 部署指南

### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 Vercel 中导入仓库
3. 自动检测并部署

### Netlify 部署
1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`dist`

### 传统服务器部署
```bash
# 构建生产版本
npm run build

# 将 dist/ 目录部署到服务器
# 配置 Nginx/Apache 支持单页应用
```

## 📈 版本历史

- **v1.0** - 基础导航功能实现
- **v2.0** - UI优化 + 玻璃拟态设计
- **v2.1** - 作者专栏 + AI智能搜索
- **v2.2** - 站内搜索专精 + 侧边栏优化
- **v2.3** - 分类区块布局 + 滚动同步
- **v2.4** - 管理后台功能完善

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- 设计灵感来源于 [WebStack.cc](https://webstack.cc/)
- 图标资源来自各大设计平台
- 感谢所有贡献者的支持

## 📞 联系方式

- **项目维护者**: Navigator
- **技术栈**: React + Vite + Tailwind CSS
- **更新时间**: 2025年1月

---

<div align="center">
  <p>Made with ❤️ by Navigator</p>
  <p>如果这个项目对你有帮助，请考虑给一个 ⭐</p>
</div> 