---
title: 快速适配 Flutter 之深色模式
categories:
  - 实战教学
tags:
  - Flutter
abbrlink: "9234"
cover: https://tva1.sinaimg.cn/large/007S8ZIlgy1geism4zarpj30km08qglt.jpg
---

深色模式（Dark Mode），也被称为暗黑模式，是一种高对比度，或者反色模式的显示模式，开启之后在夜间可以缓解疲劳，更易于阅读，同时也能在一定程度上达到省电的效果。iOS 和安卓分别从 iOS 13 和 Android 10（不同厂商不尽相同，部分 Android 9 也支持） 开始加入深色模式的支持，各大浏览器纷纷开始支持深色模式，强如微信也终于在 iOS 客户端 7.0.12、Android 客户端 7.0.13 支持了深色模式，等网页端适配深色模式后将更进一步提高用户体验的一致性。

Flutter 作为一个先进的跨平台框架，自然也考虑到了深色模式的使用，我在上一篇文章[《Flutter 主题切换——让你的 APP 也能一键换肤》](https://juejin.im/post/5ea2b8b5e51d4546d72d5007)的结尾提到了`Brightness brightness`属性可用于适配跟随系统的 DarkMode，我们可以直接在`MaterialApp`的`darkTheme`选项中使用

```dart
MaterialApp(
    theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: Colors.blue,
    ),
    darkTheme: ThemeData(
        brightness: Brightness.dark,
    ),
);
```

也可以写成：

```
darkTheme: ThemeData.dark()
```

这样写的好处是，用户无需单独设置深/浅色模式，完全根据系统设置来切换。

但白天不懂夜的黑，有的人就是喜欢一套深色主题用一天，这时就需要用户可以手动开启深色模式了。

我们先来看下实现的效果：

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1geitge3bqdg30u01t0x6u.gif" style="zoom: 33%;" />

## 手动开启深色模式

其实思路和上一篇文章类似，通过[shared_preferences](https://github.com/flutter/plugins/tree/master/packages/shared_preferences#usage)保存用户设置，通过[Provider](https://pub.dev/packages/provider)实现状态管理，这两个依赖的使用我在上一篇文章中已经介绍了，这里就不多说了。详情点击 👉[Flutter 主题切换——让你的 APP 也能一键换肤](https://juejin.im/post/5ea2b8b5e51d4546d72d5007#heading-0)。

### 添加依赖

我们在`pubspec.yaml`文件中添加如下内容：

```yaml
provider: ^4.0.5
flustars: ^0.2.6+1
```

### 深色模式状态管理类

```dart
import 'package:flustars/flustars.dart';
import 'package:flutter/material.dart';
import 'package:flutterchallenge/constant.dart';

class DarkModeProvider with ChangeNotifier {
  /// 深色模式 0: 关闭 1: 开启 2: 随系统
  int _darkMode;

  int get darkMode => _darkMode;

  void changeMode(int darkMode) async {
    _darkMode = darkMode;

    notifyListeners();
    SpUtil.putInt(SpConstant.DARK_MODE, darkMode);
  }
}
```

我们通过`changeMode()`函数来进行模式的切换，其中`notifyListeners();`用于通知顶层容器状态的变化，`SpUtil.putInt(SpConstant.DARK_MODE, darkMode);`用于保存用户设置。

### 修改 MaterialApp

接下来我们需要在顶层容器中配置我们的状态管理类，和上文类似，这里同样使用了 MultiProvider

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: DarkModeProvider()),
      ],
      child: Consumer<DarkModeProvider>(
        builder: (context, darkModeProvider, _) {
          return darkModeProvider.darkMode == 2
              ? MaterialApp(
                  title: 'Flutter Demo',
                  theme: ThemeData(
                    primarySwatch: Colors.blue,
                  ),
                  darkTheme: ThemeData.dark(),
                  home: MyHomePage(title: 'Flutter Challenge Demo'),
                )
              : MaterialApp(
                  title: 'Flutter Demo',
                  theme: darkModeProvider.darkMode == 1
                      ? ThemeData.dark()
                      : ThemeData(
                          primarySwatch: Colors.blue,
                        ),
                  home: MyHomePage(title: 'Flutter Challenge Demo'),
                );
        },
      ),
    );
  }
}
```

如果手动控制是否开启夜间模式，可以设置`MaterialApp`的`theme`选项为`ThemeData.dark()`

```
theme: ThemeData.dark()
```

因为需要同时保留随系统自动切换与手动切换，而`darkTheme`选项和`theme`又有冲突，所以这里需要根据`darkModeProvider.darkMode`的取值来渲染不同的`MaterialApp`，如果是手动模式再根据`darkModeProvider.darkMode`的取值来渲染不同的`theme`。

### 选择深色模式

接下来如果想要切换深色模式，我们只需要执行下面这行代码即可。

```dart
Provider.of<DarkModeProvider>(context, listen: false).changeMode(1);
```

其中，0 表示浅色，1 表示深色，2 表示跟随系统。

> 至此，本文内容结束，这里我们头脑风暴一下，能否将上文中提到的主题选择和本文的深色模式结合起来呢？欢迎各位在评论区留言。

## 最后

这里说下最近遇到的一件很不痛快的事情，在之前的文章中，示例代码需要关注我的公众号才可获得，结果就被某个人评论说我割韭菜。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geiu47gmhtj30yk064q3w.jpg)

我不知道他是白嫖习惯了还是怎么的，代码是我自己付出努力写的，从头到尾我就没说过代码是开源的，凭什么要无缘无故给你白嫖代码？

说这些其实也是希望看到这里的读者不要养成总是白嫖他人的习惯，如果觉得我的文章对你有所帮助，不妨给个赞 👍 或者关注支持一下。

对了，本期的代码 👉：https://github.com/YueYongDev/flutter_challenge

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geiudxpj5xj30go0goabc.jpg)
