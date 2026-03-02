# 暗色轮廓 Silhouette - 官方粉丝网站

一个为独立电子乐队「暗色轮廓 Silhouette」打造的粉丝网站。

## 🎵 关于乐队

暗色轮廓 Silhouette 成立于2022年夏天，是一支来自南京的独立电子（Indietronica）乐队。追求干净与简洁的音乐理念，用旋律化的贝斯线条、复古的合成器音色，搭配富有张力的吉他Riff和强烈的节奏，编织出属于暗色轮廓的独特声音。

## ✨ 网站特性

- 🌙 **暗色主题**：深蓝色为主色调，梦幻渐变效果
- 🌐 **双语支持**：中文/英文切换
- 📱 **响应式设计**：适配桌面、平板、手机
- ⚡ **纯静态**：无需后端，可直接部署到 GitHub Pages
- 🎨 **现代设计**：文艺气质、轻盈梦幻的视觉风格

## 📁 项目结构

```
Silhouette/
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件
├── js/
│   ├── main.js             # 主逻辑
│   ├── i18n.js             # 国际化模块
│   └── components.js       # 组件渲染
├── data/
│   ├── events.json         # 演出行程数据
│   ├── discography.json    # 音乐作品数据
│   └── members.json        # 成员信息
├── locales/
│   ├── zh.json             # 中文语言包
│   └── en.json             # 英文语言包
├── assets/
│   └── images/             # 图片资源
└── README.md
```

## 🚀 快速开始

### 本地预览

由于使用了 `fetch` 加载 JSON 数据，需要通过本地服务器运行：

```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080

# 或使用 VS Code 的 live Server 插件
```

然后访问 `http://localhost:8080`

### 部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 将代码推送到仓库
3. 在仓库 Settings > Pages 中选择部署分支
4. 等待部署完成后访问 `https://你的用户名.github.io/仓库名`

## 📝 内容更新指南

### 更新演出行程

编辑 `data/events.json` 文件，添加新的演出信息：

```json
{
    "id": 8,
    "date": "2026-06-15",
    "title": {
        "zh": "演出名称",
        "en": "Event Name"
    },
    "venue": {
        "zh": "场地名称",
        "en": "Venue Name"
    },
    "location": {
        "zh": "城市",
        "en": "City, China"
    },
    "ticketUrl": "https://购票链接"
}
```

### 更新音乐作品

编辑 `data/discography.json` 文件，添加新专辑/单曲。

### 更新成员信息

编辑 `data/members.json` 文件。

### 添加图片

将图片放入 `assets/images/` 目录，然后在对应的 JSON 数据中引用路径。

## 🎨 自定义主题

主题颜色在 `css/style.css` 文件开头的 CSS 变量中定义：

```css
:root {
    /* 主色调 */
    --color-bg-dark: #0a0d14;
    --color-accent-primary: #667eea;
    --color-accent-secondary: #764ba2;
    /* ... */
}
```

## 📄 许可证

本项目为粉丝作品，仅供学习交流使用。

---

Made by Zoey
