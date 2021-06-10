---
title: 利用Hexo搭建一个个人博客网站
categories:
  - 实战教学
tags:
  - hexo
abbrlink: aca
---

![](https://ws1.sinaimg.cn/large/006tNbRwly1fymfgzoorjj30zp0d5t9a.jpg)

## 什么是Hexo
Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。
>Markdown 是一种轻量级的「标记语言」，它的优点很多，目前也被越来越多的写作爱好者，撰稿者广泛使用。看到这里请不要被「标记」、「语言」所迷惑，Markdown 的语法十分简单。常用的标记符号也不超过十个，这种相对于更为复杂的 HTML 标记语言来说，Markdown 可谓是十分轻量的，学习成本也不需要太多，且一旦熟悉这种语法规则，会有一劳永逸的效果。

>推荐阅读[Markdown——入门指南](http://www.jianshu.com/p/1e402922ee32/)


<!-- more -->

## 如何安装Hexo
安装 Hexo 只需几分钟时间，若您在安装过程中遇到问题或无法找到解决方式，请在微信内回复，我们会尽力解决您的问题。

### 安装前提(windows环境下)
安装 Hexo 相当简单。然而在安装前，您必须检查电脑中是否已安装下列应用程序：
* [node.js](http://nodejs.cn/)
* [git](https://git-scm.com/)

如果您的电脑中已经安装上述必备程序，那么恭喜您！接下来只需要使用 npm 即可完成 Hexo 的安装。
```
npm install -g hexo-cli
```
如果您的电脑中尚未安装所需要的程序，请参考以下安装链接指示完成安装。
* [Node.js安装及环境配置之Windows篇 - 简书](http://www.jianshu.com/p/03a76b2e7e00)
* [Git教程 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

### 安装Hexo
所有必备的应用程序安装完成后，即可使用 npm 安装 Hexo。
>npm 通常称为node包管理器。顾名思义，它的主要功能就是管理node包，包括：安装、卸载、更新、查看、搜索、发布等。

>[npm官网](https://www.npmjs.com/)

安装命令
```
npm install -g hexo-cli
```

## 如何利用Hexo建站
安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件。
```
hexo init <folder>
cd <folder>
npm install
```
><folder>就是你建博客的根目录

然后执行以下代码：
```
hexo generate   //hexo g也可以,用于生成静态页面
hexo server     //hexo s也可以,用于启动本地服务，预览调试
```
接下来在浏览器输入http://localhost:4000/即可实现浏览

## 将博客发布到GitHub上
当然我们写博客肯定不能只在本地运行，一定也是希望让别人可以看见自己的文章的，怎么把文章发不到网上去呢？
这里采用的方法是将博客发布到GitHub Page上
>[Github](https://github.com/)是一个面向开源及私有软件项目的托管平台，因为只支持git 作为唯一的版本库格式进行托管，故名为Github

>[Github Page](https://pages.github.com/)可以被认为是用户编写的、托管在Github上的静态网页。

### 注册Github账号
这里我们就不多讲了，小伙伴们可以点击[Github官网](https://github.com/)，进入官网进行注册。

### 创建仓库
注册好登录账号后，在Github页面的右上方选择New repository进行仓库的创建。

![New repository](https://github.com/YueYongDev/MarkDownPhotos/blob/master/new_repo.png?raw=true)

![仓库的详细地址](https://github.com/YueYongDev/MarkDownPhotos/blob/master/repo_info.png?raw=true)

在仓库名字输入框中输入：
```
Github昵称.github.io
```
>千万注意，前面的昵称是你注册GitHub时的昵称，结尾一定是'github.io'

然后点击Create repository即可完成仓库的创建。
>Tips:复制此时的仓库地址
>![复制仓库地址](https://github.com/YueYongDev/MarkDownPhotos/blob/master/copy_url.png?raw=true)

### 配置GitHub Page
完成仓库创建后，找到仓库的Setting，跳转到GitHub Page部分，Source部分设置如下：
![Github Page配置](https://github.com/YueYongDev/MarkDownPhotos/blob/master/GitHub_page_info.png?raw=true)

### 配置Hexo，完成博客的上传
至此，GitHub部分的配置就结束了，现在开始进行Hexo部分的配置。

找到博客根目录下的_config.yml文件，下面是该文件的默认配置信息：
```
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: # The title of your website
subtitle: # The subtitle of your website
description: # The description of your website
author: # Your name
language: # The language of your website
timezone: 

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com/child
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: landscape

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type:
```
看到这里，大家千万别被一长串英文给吓到了，我们实际上要修改的配置只有几项，拿我自己的配置，我们继续往下看：
#### 1 修改网站信息
```
# Site
title: Blog
subtitle:
description: 从0开始，厚积薄发
author: Yue Yong
language:
timezone:
```
>注意：每一项的填写，其:后面都要保留一个空格，下同。
#### 2 配置统一资源定位符（个人域名）
```
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: https://yueyongdev.github.io/
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:
```
#### 3 配置部署
```
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: https://github.com/YueYongDev/YueYongDev.github.io.git
  branch: master
```
其中repo项是之前Github上创建好的仓库的地址.

branch是项目的分支，我们默认用主分支master。

### 上传博客
首先将写好的markdown文件放入本地博客文件夹source/_post文件夹下。
然后我们只要在终端执行这样的命令即可：
```
hexo generate
hexo deploy
```
这时候我们的博客已经部署到网上了，我们可以在浏览器地址输入栏输入我们的网址即可，如我的博客是：
[https://yueyongdev.github.io/](https://yueyongdev.github.io/)

本教程为博客搭建入门教程，大家可以根据自己的需求做进一步改进，如更换主题、删除文章等，详情参考[官方文档](https://hexo.io/zh-cn/docs/)