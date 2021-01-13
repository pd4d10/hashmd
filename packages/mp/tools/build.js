const path = require('path')

const gulp = require('gulp')
const clean = require('gulp-clean')
const less = require('gulp-less')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const webpack = require('webpack')
const gulpInstall = require('gulp-install')

const config = require('./config')
const checkComponents = require('./checkcomponents')
const checkWxss = require('./checkwxss')
const _ = require('./utils')

const wxssConfig = config.wxss || {}
const srcPath = config.srcPath
const distPath = config.distPath

/**
 * 获取 wxss 流
 */
function wxss(wxssFileList) {
  if (!wxssFileList.length) return false

  // 加上要忽略的列表
  if (config.ignore) {
    wxssFileList = wxssFileList.concat(config.ignore)
  }
  return gulp.src(wxssFileList, {cwd: srcPath, base: srcPath})
    .pipe(checkWxss.start()) // 开始处理 import
    // .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.init()))
    // .pipe(gulpif(wxssConfig.less, less({paths: [srcPath]})))
    .pipe(checkWxss.end()) // 结束处理 import
    .pipe(rename({extname: '.wxss'}))
    .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.write('./')))
    .pipe(_.logger(wxssConfig.less ? 'generate' : undefined))
    .pipe(gulp.dest(distPath))
}
/**
 * 获取 less 流
 */
function buildLess(lessFileList) {
  if (!lessFileList.length) return false
  // 加上要忽略的列表
  // if (config.ignore) {
  //   lessFileList = lessFileList.concat(config.ignore)
  // }
  // console.log('build less', lessFileList, srcPath)
  return gulp.src(lessFileList, {cwd: srcPath, base: srcPath})
    // .pipe(checkWxss.start()) // 开始处理 import
    .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.init()))
    .pipe(gulpif(wxssConfig.less, less({paths: [srcPath], compress: true})))
    // .pipe(checkWxss.end()) // 结束处理 import
    .pipe(rename({extname: '.wxss'}))
    .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.write('./')))
    .pipe(_.logger(wxssConfig.less ? 'generate' : undefined))
    .pipe(gulp.dest(distPath))
}

/**
 * 获取 js 流
 */
function js(jsFileMap, scope) {
  const webpackConfig = config.webpack
  const webpackCallback = (err, stats) => {
    if (!err) {
      // eslint-disable-next-line no-console
      console.log(stats.toString({
        assets: true,
        cached: false,
        colors: true,
        children: false,
        errors: true,
        warnings: true,
        version: true,
        modules: false,
        publicPath: true,
      }))
    } else {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }
  if (!jsFileMap.index) {
    jsFileMap.index = path.resolve(path.join(path.dirname(__dirname), '../src/index.ts'))
  }
  webpackConfig.entry = jsFileMap
  webpackConfig.output.path = distPath
  // console.log('======jsfilemap', jsFileMap)
  if (scope.webpackWatcher) {
    scope.webpackWatcher.close()
    scope.webpackWatcher = null
  }

  if (config.isWatch) {
    scope.webpackWatcher = webpack(webpackConfig).watch({
      ignored: /node_modules/,
    }, webpackCallback)
  } else {
    webpack(webpackConfig).run(webpackCallback)
  }
}

/**
 * 获取 ts 流
 */
function ts(tsFileMap, scope) {
  const webpackConfig = config.webpack
  const webpackCallback = (err, stats) => {
    if (!err) {
      // eslint-disable-next-line no-console
      console.log(stats.toString({
        assets: true,
        cached: false,
        colors: true,
        children: false,
        errors: true,
        warnings: true,
        version: true,
        modules: false,
        publicPath: true,
      }))
    } else {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  webpackConfig.entry = tsFileMap
  webpackConfig.output.path = distPath
  // console.log('=======log tsFileMap', tsFileMap, distPath)
  if (scope.webpackWatcherTS) {
    scope.webpackWatcherTS.close()
    scope.webpackWatcherTS = null
  }

  if (config.isWatch) {
    scope.webpackWatcherTS = webpack(webpackConfig).watch({
      ignored: /node_modules/,
    }, webpackCallback)
  } else {
    webpack(webpackConfig).run(webpackCallback)
  }
}

/**
 * 拷贝文件
 */
function copy(copyFileList) {
  if (!copyFileList.length) return false
  if (config.copy && config.copy.src) {
    if (!Array.isArray(config.copy.src)) {
      copyFileList.push(config.copy.src)
    } else {
      copyFileList = copyFileList.concat(config.copy.src)
    }
  }
  // 加上要忽略的列表
  if (config.copyIgnore) {
    copyFileList = copyFileList.concat(config.copyIgnore)
    // console.log('copy copyFileList', copyFileList)
  }
  return gulp.src(copyFileList, {cwd: srcPath, base: srcPath})
    .pipe(_.logger())
    .pipe(gulp.dest(distPath))
}

/**
 * 安装依赖包
 */
function install() {
  return gulp.series(async () => {
    const demoDist = config.demoDist
    const demoPackageJsonPath = path.join(demoDist, 'package.json')
    const packageJson = _.readJson(path.resolve(__dirname, '../package.json'))
    const dependencies = packageJson.dependencies || {}

    await _.writeFile(demoPackageJsonPath, JSON.stringify({dependencies}, null, '\t')) // write dev demo's package.json
  }, () => {
    const demoDist = config.demoDist
    const demoPackageJsonPath = path.join(demoDist, 'package.json')

    return gulp.src(demoPackageJsonPath)
      .pipe(gulpInstall({production: true}))
  })
}

class BuildTask {
  constructor(id, entry) {
    if (!entry) return

    this.id = id
    this.entries = Array.isArray(config.entry) ? config.entry : [config.entry]
    this.copyList = Array.isArray(config.copy) ? config.copy : []
    this.componentListMap = {}
    this.cachedComponentListMap = {}

    this.init()
  }

  init() {
    const id = this.id

    /**
     * 清空目标目录
     */
    gulp.task(`${id}-clean-dist`, () => gulp.src(distPath, {read: false, allowEmpty: true}).pipe(clean()))

    /**
     * 拷贝 demo 到目标目录
     */
    let isDemoExists = false
    gulp.task(`${id}-demo`, gulp.series(async () => {
      const demoDist = config.demoDist

      // 不检查demo是否存在
      // isDemoExists = await _.checkFileExists(path.join(demoDist, 'project.config.json'))
    }, done => {
      if (!isDemoExists) {
        const demoSrc = config.demoSrc
        const demoDist = config.demoDist

        return gulp.src('**/*', {cwd: demoSrc, base: demoSrc})
          .pipe(gulp.dest(demoDist))
      }

      return done()
    }))

    /**
     * 安装依赖包
     */
    gulp.task(`${id}-install`, install())
    /**
     * 生成package.json
     */
    gulp.task(`${id}-package-json`, (done) => {
      const pkgJson = _.readJson(path.resolve(__dirname, '../package.json'));
      const json = {};
      ['name', 'version', 'description', 'author', 'license'].forEach((item) => {
        json[item] = pkgJson[item]
      })
      _.writeFile(path.join(distPath, 'package.json'), JSON.stringify(json, null, 4))
      return done()
    })
    /**
     * 检查自定义组件
     */
    gulp.task(`${id}-component-check`, async () => {
      const entries = this.entries
      const mergeComponentListMap = {}
      for (let i = 0, len = entries.length; i < len; i++) {
        let entry = entries[i]
        entry = path.join(srcPath, `${entry}.json`)
        // eslint-disable-next-line no-await-in-loop
        const newComponentListMap = await checkComponents(entry)

        _.merge(mergeComponentListMap, newComponentListMap)
      }

      this.cachedComponentListMap = this.componentListMap
      this.componentListMap = mergeComponentListMap
    })

    /**
     * 写 json 文件到目标目录
     */
    gulp.task(`${id}-component-json`, done => {
      const jsonFileList = this.componentListMap.jsonFileList

      if (jsonFileList && jsonFileList.length) {
        return copy(this.componentListMap.jsonFileList)
      }

      return done()
    })

    /**
     * 拷贝 wxml 文件到目标目录
     */
    gulp.task(`${id}-component-wxml`, done => {
      const wxmlFileList = this.componentListMap.wxmlFileList

      if (wxmlFileList &&
        wxmlFileList.length &&
        !_.compareArray(this.cachedComponentListMap.wxmlFileList, wxmlFileList)) {
        return copy(wxmlFileList)
      }

      return done()
    })

    /**
     * 生成 wxss 文件到目标目录
     */
    gulp.task(`${id}-component-wxss`, done => {
      const wxssFileList = this.componentListMap.wxssFileList
      // console.log('wxssFileList file list', wxssFileList)
      if (wxssFileList &&
        wxssFileList.length &&
        !_.compareArray(this.cachedComponentListMap.wxssFileList, wxssFileList)) {
        return wxss(wxssFileList, srcPath, distPath)
      }

      return done()
    })

    /**
     * 生成 less 文件到目标目录
     */
    gulp.task(`${id}-component-less`, done => {
      const lessFileList = this.componentListMap.lessFileList

      if (lessFileList &&
        lessFileList.length &&
        !_.compareArray(this.cachedComponentListMap.lessFileList, lessFileList)) {
        return buildLess(lessFileList, srcPath, distPath)
      }

      return done()
    })

    /**
     * 生成 js 文件到目标目录
     */
    gulp.task(`${id}-component-js`, done => {
      const jsFileList = this.componentListMap.jsFileList

      if (jsFileList &&
        jsFileList.length &&
        !_.compareArray(this.cachedComponentListMap.jsFileList, jsFileList)) {
        // js(this.componentListMap.jsFileMap, this)
      }
      js(this.componentListMap.jsFileMap, this)
      return done()
    })
    /**
     * 生成 ts 文件到目标目录
     */
    gulp.task(`${id}-component-ts`, done => {
      const tsFileList = this.componentListMap.tsFileList

      if (tsFileList &&
        tsFileList.length &&
        !_.compareArray(this.cachedComponentListMap.tsFileList, tsFileList)) {
        ts(this.componentListMap.tsFileList, this)
      }

      return done()
    })

    /**
     * 拷贝相关资源到目标目录
     */
    gulp.task(`${id}-copy`, gulp.parallel(done => {
      const copyList = this.copyList
      const copyFileList = copyList.map(dir => path.join(dir, '**/*.!(wxss)'))

      if (copyFileList.length) return copy(copyFileList)

      return done()
    }, done => {
      const copyList = this.copyList
      const copyFileList = copyList.map(dir => path.join(dir, '**/*.wxss'))

      if (copyFileList.length) return wxss(copyFileList, srcPath, distPath)

      return done()
    }))

    /**
     * 监听 json 变化
     */
    gulp.task(`${id}-watch-json`, () => gulp.watch(this.componentListMap.jsonFileList, {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-check`, gulp.parallel(`${id}-component-wxml`, `${id}-component-wxss`, `${id}-component-js`, `${id}-component-json`))))

    /**
     * 监听 wxml 变化
     */
    gulp.task(`${id}-watch-wxml`, () => {
      this.cachedComponentListMap.wxmlFileList = null
      return gulp.watch(this.componentListMap.wxmlFileList, {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-wxml`))
    })

    /**
     * 监听 wxss 变化
     */
    gulp.task(`${id}-watch-wxss`, () => {
      this.cachedComponentListMap.wxssFileList = null
      return gulp.watch('**/*.wxss', {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-wxss`))
    })
    /**
     * 监听 less 变化
     */
    gulp.task(`${id}-watch-less`, () => {
      this.cachedComponentListMap.lessFileList = null
      return gulp.watch('**/*.less', {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-less`))
    })
    /**
     * 监听 ts 变化
     */
    gulp.task(`${id}-watch-ts`, () => {
      this.cachedComponentListMap.tsFileList = null
      return gulp.watch('**/*.ts', {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-ts`))
    })

    /**
     * 监听相关资源变化
     */
    gulp.task(`${id}-watch-copy`, () => {
      const copyList = this.copyList
      let copyFileList = copyList.map(dir => path.join(dir, '**/*'))
      const watchCallback = filePath => copy([filePath])

      // 加上要忽略的列表
      if (config.copyIgnore) {
        copyFileList = copyFileList.concat(config.copyIgnore)
      }
      return gulp.watch(copyFileList, {cwd: srcPath, base: srcPath})
        .on('change', watchCallback)
        .on('add', watchCallback)
        .on('unlink', watchCallback)
    })

    /**
     * 监听 demo 变化
     */
    gulp.task(`${id}-watch-demo`, () => {
      const demoSrc = config.demoSrc
      const demoDist = config.demoDist
      const watchCallback = filePath => gulp.src(filePath, {cwd: demoSrc, base: demoSrc})
        .pipe(gulp.dest(demoDist))

      return gulp.watch('**/*', {cwd: demoSrc, base: demoSrc})
        .on('change', watchCallback)
        .on('add', watchCallback)
        .on('unlink', watchCallback)
    })

    /**
     * 监听安装包列表变化
     */
    gulp.task(`${id}-watch-install`, () => gulp.watch(path.resolve(__dirname, '../package.json'), install()))

    /**
     * 构建相关任务
     */
    // gulp.task(`${id}-build`, gulp.series(`${id}-clean-dist`, `${id}-component-check`, gulp.parallel(`${id}-component-less`)))
    gulp.task(`${id}-build`, gulp.series(`${id}-clean-dist`, `${id}-component-check`, gulp.parallel(`${id}-component-wxml`, `${id}-component-js`, `${id}-component-less`, `${id}-component-wxss`, `${id}-component-json`, `${id}-copy`, `${id}-package-json`)))

    gulp.task(`${id}-watch`, gulp.series(`${id}-build`, `${id}-demo`, `${id}-install`, gulp.parallel(`${id}-watch-wxml`, `${id}-watch-wxss`, `${id}-watch-json`, `${id}-watch-copy`, `${id}-watch-install`, `${id}-watch-demo`, `${id}-watch-less`, `${id}-watch-ts`)))

    gulp.task(`${id}-dev`, gulp.series(`${id}-build`, `${id}-demo`, `${id}-install`))

    gulp.task(`${id}-default`, gulp.series(`${id}-build`))
  }
}

module.exports = BuildTask
