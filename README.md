# 🚀 BinNav - 精选网站导航

一个现代化的网站导航页面，发现优质网站，提升工作效率。支持可视化管理后台、智能图标获取、拖拽排序和自动部署更新。

## 🌐 在线预览

**[🔗 查看演示站点](https://bincore.cn/)**

## 📸 项目预览

### 首页展示
![首页](/public/img/index.png)

### 管理后台
![管理后台](/public/img/admin.png)

## ⚙️ 环境变量配置

### 基础配置
项目可以零配置运行，但为了完整功能体验，建议配置以下环境变量：

| 变量名 | 描述 | 必需 | 默认值 | 功能影响 |
|--------|------|------|--------|----------|
| `ADMIN_PASSWORD` | 管理后台登录密码 | 否 | `admin` | 未设置时使用默认密码 |
| `GITHUB_TOKEN` | GitHub Personal Access Token | 否 | - | 未设置时无法自动保存配置到GitHub |
| `GITHUB_REPO` | GitHub仓库名（格式：用户名/仓库名） | 否 | - | 未设置时无法自动保存配置到GitHub |
| `RESEND_API_KEY` | Resend API Key，用于邮件服务 | 否 | - | 未设置时无法发送邮件通知 |
| `ADMIN_EMAIL` | 管理员邮箱，接收新站点提交通知 | 否 | - | 未设置时无法接收邮件通知 |
| `RESEND_DOMAIN` | Resend发送域名（仅域名部分） | 否 | - | 未设置时无法发送邮件通知 |

### 功能说明
- **基础功能**：无需任何配置即可正常使用导航和管理后台
- **自动保存**：需要配置 `GITHUB_TOKEN` 和 `GITHUB_REPO`
- **邮件通知**：需要配置 `RESEND_API_KEY`、`ADMIN_EMAIL` 和 `RESEND_DOMAIN`

### 管理后台登录
- **用户名**：无需用户名，仅需密码
- **默认密码**：`admin`（建议生产环境修改）
- **访问地址**：`/admin`

### GitHub Token 创建步骤
1. 访问 [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 权限
4. 复制生成的 token

##  快速部署

### 一键部署

👉 先 [Fork 本项目](https://github.com/sindricn/BinNav_Public/fork) 到你自己的账号下

🧩 若你 Fork 本项目后希望使用一键部署功能，请将部署链接中的 `repository-url` 改为你自己的仓库地址。

#### EdgeOne Pages（国内推荐）

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2F2jzt1%2FBinNav_Public3&project-name=BinNav_Public&build-command=npm%20run%20build&install-command=npm%20install&output-directory=dist&env=ADMIN_PASSWORD,GITHUB_TOKEN,GITHUB_REPO,RESEND_API_KEY,ADMIN_EMAIL,RESEND_DOMAIN&env-description=管理后台密码、GitHub令牌、仓库名称、邮件服务配置&env-link=https%3A%2F%2Fgithub.com%2Fsindricn%2FBinNav_Public%23%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE)


原始链接（请勿直接使用）：
https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2F**sindricn**%2FBinNav_Public&...

修改方法：
将其中的
  repository-url=https%3A%2F%2Fgithub.com%2F**sindricn**%2FBinNav_Public

替换为你自己的仓库地址，例如：
  repository-url=https%3A%2F%2Fgithub.com%2F**your-username**%2FBinNav_Public


### 手动部署：
1. 前往部署平台
2. 选择你 Fork 后的仓库
3. 添加环境变量并部署


#### Vercel（暂未开发完成）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsindricn%2FBinNav_Public&project-name=BinNav_Public)

#### Cloudflare Pages（暂未开发完成）
[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sindricn/BinNav_Public)

### 本地部署
```bash
# 1. 克隆项目
git clone https://github.com/sindricn/BinNav_Public.git
cd BinNav_Public

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 部署 dist 目录到任何静态托管服务
```

## ✨ 核心特性

###  **现代化设计**
- 响应式布局，完美适配桌面端和移动端
- 毛玻璃效果和流畅动画
- 支持分类图标和网站图标自动获取
- 优雅的卡片式布局

###  **强大的管理后台**
-  **网站管理** - 添加、编辑、删除网站，支持拖拽排序
-  **分类管理** - 创建多级分类，自定义图标和排序
-  **智能图标** - 自动获取网站图标，支持多种回退方案
-  **待审核管理** - 用户提交的网站统一审核
-  **系统设置** - 站点信息、Logo、备案信息配置

###  **自动化部署**
- 一键保存到GitHub，触发自动部署
- EdgeOne Functions API，响应速度快80%
- 支持配置文件本地备份下载
- 无需手动操作，保存即生效

###  **智能搜索**
- 站内搜索，快速定位网站
- 支持按分类筛选浏览
- 响应式侧边栏导航

##  本地开发

```bash
# 1. 克隆项目
git clone https://github.com/sindricn/BinNav.git
cd BinNav

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

访问地址：
- 🏠 **首页**: http://localhost:5173
- ⚙️ **管理后台**: http://localhost:5173/admin（默认密码：admin）

## 🚨 常见问题

<details>
<summary><strong>Q: 如何登录管理后台？</strong></summary>

**A:** 管理后台登录信息：
- **访问地址**：`/admin`
- **用户名**：无需用户名
- **默认密码**：`admin`
- **修改密码**：设置环境变量 `ADMIN_PASSWORD`
</details>

<details>
<summary><strong>Q: 为什么无法自动保存配置？</strong></summary>

**A:** 自动保存功能需要配置：
- `GITHUB_TOKEN` - GitHub访问令牌
- `GITHUB_REPO` - 仓库名称（格式：用户名/仓库名）
- 未配置时可手动下载配置文件
</details>

<details>
<summary><strong>Q: 邮件通知功能如何配置？</strong></summary>

**A:** 邮件通知需要配置：
- `RESEND_API_KEY` - Resend API密钥
- `ADMIN_EMAIL` - 管理员邮箱
- `RESEND_DOMAIN` - 发送域名
- 未配置时用户提交不会发送邮件通知
</details>

## 🤝 贡献指南

欢迎参与 BinNav 的开发！

- 公开仓库开发主分支为 `dev`，请基于 `dev` 分支进行开发。
- 新功能或修复请创建自己的功能分支，例如 `feature/xxx`。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**🌟 如果这个项目对你有帮助，请给个 Star ⭐**
