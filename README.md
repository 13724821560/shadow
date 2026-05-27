# Minimal Video Shadowing

一个极简英语视频影子跟读网站，基于 Next.js 15、TypeScript、Tailwind CSS 和 shadcn/ui 风格组件构建。

当前版本只使用前端 mock 数据，不包含数据库、登录、后台管理、AI、Whisper、YouTube 下载或会员系统。

## 功能

- 视频播放
- 双语字幕
- 当前句自动高亮
- 点击字幕跳转
- 单句循环
- 上一句 / 下一句
- 慢速播放
- MediaRecorder 跟读录音
- 录音回放
- 首页 mock lesson 搜索和分类筛选

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

常用检查：

```bash
npm run lint
npm run build
```

生产运行：

```bash
npm run build
npm run start
```

## 添加 Lesson

当前 lesson 数据在：

```text
lib/mock-shadowing.ts
```

添加新 lesson 的基本步骤：

1. 把视频放到 `public/videos/`，例如：

```text
public/videos/my-lesson.mp4
```

2. 把封面放到 `public/covers/`，或使用远程图片 URL。

3. 在 `lib/mock-shadowing.ts` 的 `mockShadowingLessons` 中新增一个对象：

```ts
{
  id: "my-lesson",
  title: "My Lesson",
  titleZh: "我的跟读素材",
  author: "Source Name",
  category: "Daily",
  level: "B1",
  durationLabel: "03:20",
  tags: ["daily english", "speaking"],
  coverUrl: "/covers/my-lesson.jpg",
  videoUrl: "/videos/my-lesson.mp4",
  subtitles: [
    {
      id: 1,
      start: 0,
      end: 5,
      en: "This is the first sentence.",
      zh: "这是第一句话。",
    },
  ],
}
```

4. 访问：

```text
http://localhost:3000/shadowing/my-lesson
```

更详细的内容格式说明见：

- `docs/content-format.md`
- `docs/add-new-lesson.md`

## Demo 视频

当前 mock lesson 可以共用本地占位视频：

```text
public/videos/demo.mp4
```

对应路径：

```ts
videoUrl: "/videos/demo.mp4"
```

以后替换真实视频时，只需要改对应 lesson 的 `videoUrl`。

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 打开 Vercel，选择 `Add New Project`。
3. 导入该 GitHub 仓库。
4. Framework Preset 选择 `Next.js`。
5. 使用默认命令：

```text
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

6. 点击 Deploy。

`public/` 目录下的静态资源会被 Vercel 自动发布，因此 `public/videos/demo.mp4` 可以通过 `/videos/demo.mp4` 访问。

## 当前边界

本项目暂时不包含：

- 数据库
- 用户登录
- 后台管理
- AI 评分
- Whisper 转写
- YouTube 下载
- 会员系统
