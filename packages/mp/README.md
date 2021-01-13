## 开发

1. 安装依赖：

```
npm install
```

2. 执行命令：

```
npm run dev
```

默认会在包根目录下生成 miniprogram\_dev 目录，src 中的源代码会被构建并生成到 miniprogram\_dev/components 目录下。如果需要监听文件变化动态构建，则可以执行命令：

```
npm run watch
```

3. 生成的 miniprogram\_dev 目录是一个小程序项目目录，以此目录作为小程序项目目录在开发者工具中打开即可查看自定义组件被使用的效果。

## 其他命令

* 清空 miniprogram_dist 目录：

```
npm run clean
```

* 清空 miniprogam_dev 目录：

```
npm run clean-dev
```
## 子模块开发

src 下每个组件目录对应一个 npm 模块，需保证文件名均为 index.xxx，同时添加 package.json， 参考 src/video-swiper。

## 发布npm包

`npm run dist` 后生成 miniprogram_npm 目录，进入到每个子项目中执行 `npm publish --access=publish`
