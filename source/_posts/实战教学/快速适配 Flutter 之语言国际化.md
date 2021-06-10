---
title: 快速适配 Flutter 之语言国际化
categories:
  - 实战教学
tags:
  - Flutter
abbrlink: 5daa
cover: https://tva1.sinaimg.cn/large/007S8ZIlgy1gekvgf0e7nj30qo0c8mzc.jpg
---

如果你希望你的 APP 走出海外，那么就需要你在编写代码时考虑支持不同的语言环境，设置一些“本地化”的值，例如文本/布局。Flutter 本身是具备国际化的，在适配方面也较为简单，今天我将会介绍一个名为**Flutter Intl**的插件快速实现 Flutter 的语言国际化。

## Flutter Intl

之前在学习适配国际化的时候，出现最多的一个组件叫做[flutter_i18n](https://github.com/long1eu/flutter_i18n)，不过由于一些原因，这个插件已经停止维护了，后来无意中发现了一个名为[Flutter Intl](https://github.com/localizely/flutter-intl-intellij)的插件，我们只需要在 VSCode/Android Studio 中安装他即可。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekw2p60q9j317y0piaeh.jpg)

## 添加依赖

默认情况下，Flutter 仅提供**美国英语**本地化。要添加对其他语言的支持，应用程序必须指定其他 MaterialApp 属性，并包含一个名为的单独包-“flutter_localizations”。

在`pubspec.yaml`中添加`flutter_localizations`依赖并执行`packages get`

```
# 国际化
flutter_localizations:
    sdk: flutter
```

如下图所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekw876vqjj30j809474w.jpg)

## 初始化项目

接下来我们选择`Tools -> Flutter Intl -> Initialize for the Project`就会对项目进行初始化

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekw46bw6sj31bz0u0trk.jpg)

初始化结束后，`pubspec.yaml`中会自动增加以下字段

```
flutter_intl:
    enabled: true
```

表示国际化已经开启。与此同时，`lib`目录下会新增`generated`和`l10n`两个目录。

- `l10n`目录下为 arb 文件
- `generated`目录下为根据 arb 文件自动生成以下 dart 代码

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekwbdzt1gj30es07saaj.jpg)

## ARB 文件

ARB 文件扩展名为：Application Resource Bundle 意为应用程序资源包，并得到 Google 的支持，每个`.arb`文件都包含一个 JSON 表，该表从资源 ID 映射到本地化值，文件名包含已为其转换值的语言环境。

所以，如果我们想新增一门语言支持的话，只需要**通过插件**添加相应的 arb 文件即可。

## 新增语言

- 通过插件新增 arb 文件

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekx73udtnj30w60u04fk.jpg)

然后填入相应的 local 值生成 arb 文件，如`zh`表示中文。

之后便会在`lib/generated/intl/`目录下会生成新的`messages_xx.dart`文件

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekx9buhvcj30g409qgmd.jpg)

## 配置语言

arb 文件生成成功后，剩下的便是在`MaterialApp`中配置`supportedLocales`和`localizationsDelegates`

```dart
MaterialApp(
…………
    // 设置语言
    localizationsDelegates: const [
    S.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate
    ],
    // 讲zh设置为第一项,没有适配语言时，英语为首选项
    supportedLocales: S.delegate.supportedLocales,
…………
）
```

我们来解释下上面这段代码出现的变量

- `localizationsDelegates`列表中的元素是生成本地化值集合的工厂。

- `S.delegate` 我们项目的本地化委托类，**插件自动生成**，他会根据你的`arb`文件自动生成对应的函数。

- `GlobalMaterialLocalizations.delegate` 为 Material Components 库提供了本地化的字符串和其他值。
- `GlobalCupertinoLocalizations.delegate` 为 Cupertino Components 库提供了本地化的字符串和其他值。

- `GlobalWidgetsLocalizations.delegate`定义 widget 默认的文本方向，从左到右或从右到左。

* `supportedLocales`支持的本地化。
* `S.delegate.supportedLocales`我们项目支持的本地化，**插件自动生成**，它会在你添加`arb`文件时自动更新你的支持的本地化。

有关这些应用程序属性的更多信息，它们所依赖的类型以及如何国际化 Flutter 应用程序，可以查阅官方文档 👉[《Flutter 应用里的国际化》](https://flutter.cn/docs/development/accessibility-and-localization/internationalization)

## 使用

上文提到了，配置好该插件后，我们需要做的便是在 arb 文件中编辑相应的字段即可，这里给出示例。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1geky2xxaz8j32240s4k2o.jpg)

如果有其他语言，只需要再添加一份 arb 文件即可。

接下来我么只需要将字符串部分替换掉即可。

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekydyf6wwj31um0dk0wv.jpg)

然后保存文件，插件就会在`message_xx.adart`中自动添加对应的函数方便获取该字符串。

当然，arb 还支持其他语法，这里说下最常见的占位符语法：

- arb 文件

```json
{
  "dialogTip": "Hello $name"
}
```

- 使用

```dart
S.of(context).dialogTip("Rhyme");
```

更多使用方式见[intl | Dart Package](https://pub.dev/packages/intl)

## 切换语言

上面说了这么多都只是告诉我们如何适配多种语言，上面这些操作均是跟随系统自动调整语言的，那么有什么办法可以让用户自定义切换语言呢？自然是可以的。

我们只需要在合适的地方调用以下代码即可。

```dart
S.load(Locale('zh', 'CN');
```

这里的 zh/CN 可以换成其他语言代码。

然后我们将选择好的语言用`SharedPreference`保存，每次启动 App 时检查用户设置的语言即可。效果如下图所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekz7ugwlmg30ko17ajyy.gif)

## 最后

以上就是本文的全部内容了，总的来说，有了 Flutter Intl 工具之后，开发者可以省去繁琐的代码配置，安心将精力花在文字适配（翻译）上。

代码已上传至 Github，觉得有帮助的不妨给个 star👇

https://github.com/YueYongDev/flutter_challenge/tree/master/lib/localizations

### 参考

- [intl | Dart Package](https://pub.dev/packages/intl)
- [Flutter-国际化适配终结者](https://juejin.im/post/5c701379f265da2d9b5e196a#heading-10)
- [FunFlutter 系列之国际化 Intl 方案](https://juejin.im/post/5e4536d0e51d4526ef5f85a9)
- [Flutter 应用里的国际化](https://flutter.cn/docs/development/accessibility-and-localization/internationalization)

---

年前给自己定了一个小目标，如果公众号读者超过 2000 就拉一个读者交流群，有兴趣的可以扫描下方二维码关注公众号「01 二进制」后台回复「加群」，我们一起交流，一起进步，一起成长！

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gekzi4r5faj31970oxq5a.jpg)
