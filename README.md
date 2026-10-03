# MovieIsFine Display

MovieIsFine 的只读展示版本。它从现有 MongoDB 读取电影资料，提供电影列表、搜索、排序、详情、IMDb/豆瓣评分、剧情时间轴和家长指南展示。

本仓库不包含电影采集、翻译、数据库写入、用户认证、管理 API 或迁移脚本。

## 环境要求

- Node.js 20+
- 可访问的 MongoDB 数据库，其中包含 `movies` 集合

## 配置

在项目根目录创建 `.env.local`：

```dotenv
MONGODB_URI=mongodb://...
MONGODB_DB_NAME=movieisfine

# 可选；未配置时从 public/posters 读取海报
NEXT_PUBLIC_IMAGE_CDN_URL=https://your-cdn.example.com
```

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm start
```

构建电影详情静态参数时需要连接 MongoDB。

## 页面

- `/`：电影列表、搜索、排序和无限加载
- `/movie/[doubanId]`：电影资料、评分、剧情时间轴和家长指南

## 数据边界

应用只读取 MongoDB，不提供写入入口。电影数据和海报应由独立的数据维护流程或外部系统提供。
