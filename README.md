# ![topcheer](http://www.topcheer.com/images/logo.jpg) 一站式服务平台 - OSS

> Topcheer One-stop service platform

## 项目结构
* build 项目编译配置文件
* config 配置文件
* dist 项目编译后的部署文件
* node_modules 项目依赖包
* src 源代码
    + assets 静态资源
        - css 样式文件
        - images 图片
        - js JS脚本
    + components 公共组件
    + pages 页面视图
    + router 路由
    + App.vue 主视图
    + main.js 主函数
* static 静态文件夹（编译时直接复制，不压缩处理）
* test 测试目录
* index.html 主页面
* favicon.ico 网站头像
* package.json 项目配置文件（依赖包、运行参数等）


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
