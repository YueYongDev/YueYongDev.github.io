---
title: 在 Flutter 中使用 WebView
categories:
  - 实战教学
tags:
  - Flutter
abbrlink: d8d0
---

![](http://ww1.sinaimg.cn/large/006tNc79ly1g5qvji1u67j30zk0k03zr.jpg)

> 本文示例代码可在微信公众号「01二进制」后台回复「WebView」查看下载

## 前言

我们知道在开发 Native App 时经常会有打开网页的需求，可供的选择通常只有两种：

1. 在 App 内部打开网页
2. 通过调用系统自带浏览器打开网页

以「微信」举例，我们在微信内阅读公众号的时候就是第一种情况，但是微信同时也提供了***Open with Browser*** 这一选项，这就是第二种情况了。

![image-20190807100211727](http://ww2.sinaimg.cn/large/006tNc79ly1g5qvvyjigcj315v0u0b29.jpg)

## 简单的介绍下 Android 中的 WebView

想实现第一种效果，我们需要使用一个名为 ***WebView*** 的东西，先来看看在 Android 中如何实现一个 WebView 吧。

![](http://ww3.sinaimg.cn/large/006tNc79ly1g5qw3u3clgj30s80actai.jpg)

在 Android 中我们需要先在一个 Layout 中放入 WebView 这个控件，然后在对应的 Activity 或者 Fragment 或者各种 Custom View 中执行一个个的 findViewById……

![](http://ww3.sinaimg.cn/large/006tNc79ly1g5r794x67lj30ws0pywix.jpg)

额，Android 开发者一定知道我在说什么（真的很麻烦）

## WebView in Flutter

Flutter 的 WebView 出现已经有一段时间了，在 Flutter 插件社区官网搜索 WebView 即可搜索到比较流行的插件，如下图所示：

![](http://ww4.sinaimg.cn/large/006tNc79ly1g5qx4de5hij31ii0rate7.jpg)

其中 ***webview_flutter*** 是官方维护的 WebView 插件，特性是基于原生和 Flutter SDK 封装，继承 StatefulWidget，因此支持内嵌于 *flutter Widget* 树中，这是比较灵活的；

***flutter_webview_plugin*** 则是基于原生 WebView 封装的 Flutter 插件，将原生的一些基本使用 API 封装好提供给 Flutter 调用，因此并不能内嵌于 Flutter Widget 树中，因此在界面的跳转必须得先释放掉，返回后又要重新初始化，所以显示会有很多限制性；

***interactive_webview*** 则是基于 *webview_flutter* 封装的 Flutter 插件，因此原理特性上基本与官方 WebView 一致的；

在2018年 Flutter 发展初期，官方的 *webview_flutter* 插件有很多问题，不过好在官方一直没有放弃，现在的插件已经修复了很多 bug 了，基本功能也在不断完善中👏。

*flutter_webview_plugin* 插件由于其特性原因使用不灵活，因此本文我将会选择官方提供的 ***webview_flutter*** 作为加载网页的 WebView 插件。

## 使用

***webview_flutter*** 插件的地址为👉https://pub.flutter-io.cn/packages/webview_flutter

### 导包

和任何一个 Flutter package 一样，我们需要在 **`pubspec.yml`** 中的 **`dependencies`** 下加入 *webview_flutter* 的 package 

```yaml
dependencies:
  webview_flutter: ^0.3.10+4
```

然后点击标签栏出现的 ***Packages get***，或者在终端输入 `Flutter package get`，顺序如下图所示：

![](http://ww1.sinaimg.cn/large/006tNc79ly1g5r53w28g6j32l80son7b.jpg)

### 新建一个 Widget

接下来我们新建一个 WebViewWidget，这个 Widget 接收两个参数，分别是浏览器页面标题和浏览页面的 Url，我将其命名为 `	Browser` ，并存放在 `browser.dart` 文件中。

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class Browser extends StatelessWidget {
  const Browser({Key key, this.url, this.title}) : super(key: key);

  final String url;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: WebView(
        initialUrl: url,
        javascriptMode: JavascriptMode.unrestricted,
      ),
    );
  }
}
```

### 使用该页面

在这里我们用一个新的页面来盛放 WebView，因此我们想使用他的时候只需要跳转到该页面，并传入标题和网址即可。这里以某个 ***RaisedButton*** 的 `onPressed()` 举例

```dart
onPressed: () {
  Navigator.of(context)
      .push(new MaterialPageRoute(builder: (_) {
    return new Browser(
      url: "https://flutter-io.cn/",
      title: "Flutter 中文社区",
    );
  }));
}
```

对了别忘了要在 IOS 模块的 Runner 中的 ***info.plist*** 文件中加入：

```
<key>io.flutter.embedded_views_preview</key>
<string>YES</string>
```

不然这个 package 可没办法在 iOS 设备上运行！

运行效果如下图所示：

![](http://ww3.sinaimg.cn/large/006tNc79ly1g5r5w4s06cg30dc0do1kz.gif)

> 这里只是简单介绍 webview 在 Flutter 中的使用，其中的高级特性比如与 JavaScript 交互并没有介绍到，有兴趣的读者可以自行查找资料阅读。

### 这就结束了吗？

其实到这里的时候应该是就已经结束了，但是我在使用过程中发现了一个很严重的问题，如果我们的 URL 是 HTTP 而不是 HTTPS 的话，那么就只可以在 Android 9.0 以下的设备运行（iOS同样不可以）。

如果运行在 iOS 上会出现白屏，如果运行在 Android 9.0+ 的设备上就会出现 **net：：ERR_CLEARTEXT_NOT_PERMITTED** 的错误。

其实原因很简单，因为无论是 iOS 还是 Android 9.0+ 都对非 HTTPS 的请求做了一些限制，下面给出我的解决方案。

#### iOS

我们需要在  IOS 模块的 Runner 中的 ***info.plist*** 文件中添加如下字段：

```
<key>NSAppTransportSecurity</key>
<dict>
<key>NSAllowsArbitraryLoads</key>
<true/>
</dict>
```

然后执行 `flutter clean` 后重新运行即可访问 HTTP 网页了。

#### Android

很抱歉，其实到现在我也没找到在 Android 9.0+ 上通过 flutter 的 webview 访问 HTTP 网站的办法，我写在这里也是希望如果我的读者找到了解决方案的话欢迎在评论区留言。这里就说一下我尝试的一些解决办法。

其实如果是 Android **原生**想解决 HTTP 限制问题有以下几种方案：

1. 切换到 HTTPS 
2. 将 ***targetSdkVersion*** 的版本号改到 28 以下
3. 在 `AndroidManifest.xml` 文件中增加 `android:usesCleartextTraffic="true"` 配置项

第一个解决方法通常是针对自己的网站的，毕竟你总不能让第三方网站申请 HTTPS 证书吧。

第二个解决方案在 Flutter 中是无法实现的，因为 Flutter 的运行是需要 Android SDK 28 以上的。

第三种方法我也试了，但是并没有效果。

我查阅了很多资料，也发现了一个曲线救国的做法，就是检测要访问的网页，如果是 HTTPS 的就利用 WebView 访问，如果是 HTTP 的就调用第三方浏览器访问。

额，这个做法吧，不好评价。

我已经在 StackOverflow 和 Flutter 的 issue 提交了问题，如果后续有解决方案，我会持续更新的。

## 总结

总的来说，随着 Google 对 WebView 控件的不断更新，其体验越来越好了，使用起来相对于原生的 WebView 也更加简便，如果你有在你的 App 内使用 WebView 的想法不妨尝试一下😊

> 本文示例代码可在微信公众号「01二进制」后台回复「WebView」查看下载

**参考**

1. [如何在 Flutter 中使用 WebView？- 小女 Android 工程師實驗筆記](https://medium.com/@chloe.thhsu/如何在-flutter-中使用-webview-小女-android-工程師實驗筆記-75969b36abba)
2. [WebViews in Flutter – What an Amazing Breakthrough!](https://www.concettolabs.com/blog/webviews-in-flutter-what-an-amazing-breakthrough/)
3. [Android 9: Cleartext HTTP traffic not permitted in webview](https://stackoverflow.com/questions/57040443/android-9-cleartext-http-traffic-not-permitted-in-webview)

---

![](http://ww4.sinaimg.cn/large/006tNc79ly1g5r75b6xx2j31970oxq5a.jpg)