---
title: Flutter主题切换——让你的APP也能一键换肤
categories:
  - 实战教学
tags:
  - Flutter
abbrlink: adf2
---

为了让你的 App 更美观，主题切换已经是一个必不可少的功能了，但如果想在传统的 Android 和 iOS 上分别适配不同的主题相当繁琐。但这一切，在 Flutter 中都非常容易实现。今天我们就来看看，如何在 Flutter 中给你的 App 添加换肤功能。我们要实现的效果如下：

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4zj2hqp4g30io12ywz4.gif" style="zoom:33%;" />

## 添加依赖

在该案例中，我使用到了 `provider` 和 `flustars` 两个库，简单介绍一下这两个库：

### provider

官方推荐的**状态管理**库，相比其他状态管理库使用起来比较方便。

> 状态管理：通俗的讲，当我们想在多个页面（组件/Widget）之间共享状态（数据），或者一个页面（组件/Widget）中的多个子组件之间共享状态（数据），这个时候我们就可以用 Flutter 中的状态管理来管理统一的状态（数据），实现不同组件直接的传值和数据共享。

### flustars

号称“Flutter 全网最全常用工具类”，其中包括了`SpUtil`、`ScreenUtil`、`TimelineUtil`等常见工具类，这里我们要使用的是`SpUtil`这个部分，用于存储用户所选择的主题信息。

---

以上就是关于我们使用的两个第三方库的介绍，如果想要使用，我们需要在`pubspec.yaml`文件中添加如下内容：

```yaml
provider: ^4.0.5
flustars: ^0.2.6+1
```

准备工作做好了，接下来我们就开始编码吧。

## 添加主题样式

我们需要先想好自己所需要切换的主题样式列表，如果觉得麻烦的可以直接用下面的内容：

```dart
Map<String, Color> themeColorMap = {
  'gray': Colors.grey,
  'blue': Colors.blue,
  'blueAccent': Colors.blueAccent,
  'cyan': Colors.cyan,
  'deepPurple': Colors.purple,
  'deepPurpleAccent': Colors.deepPurpleAccent,
  'deepOrange': Colors.orange,
  'green': Colors.green,
  'indigo': Colors.indigo,
  'indigoAccent': Colors.indigoAccent,
  'orange': Colors.orange,
  'purple': Colors.purple,
  'pink': Colors.pink,
  'red': Colors.red,
  'teal': Colors.teal,
  'black': Colors.black,
};
```

## 使用 Provider 进行全局状态管理

然后我们就需要使用 Provider 来进行全局的状态管理了。首先先创建一个`app_provider.dart`文件，然后添加如下代码：

```dart
class AppInfoProvider with ChangeNotifier {
  String _themeColor = '';

  String get themeColor => _themeColor;

  setTheme(String themeColor) {
    _themeColor = themeColor;
    notifyListeners();
  }
}
```

因为是全局的状态管理，接下来我们需要在`main.dart`文件中配置一下刚才创建的 provider，有多个状态管理就使用 MultiProvider，单个的使用 Provider.value 就行了。（考虑到未来项目的扩展，这里我就直接使用 MultiProvider）了

```dart
class MyApp extends StatelessWidget {
  Color _themeColor;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider.value(value: AppInfoProvider())],
      child: Consumer<AppInfoProvider>(
        builder: (context, appInfo, _) {
          String colorKey = appInfo.themeColor;
          if (themeColorMap[colorKey] != null) {
            _themeColor = themeColorMap[colorKey];
          }

          return MaterialApp(
            title: 'Flutter Demo',
            theme: ThemeData(
              primaryColor: _themeColor,
              floatingActionButtonTheme:
                  FloatingActionButtonThemeData(backgroundColor: _themeColor),
            ),
            home: MyHomePage(title: 'Flutter Theme Change demo'),
          );
        },
      ),
    );
  }
}
```

如果想要在某个地方改变主题，我们只需要执行下面这行代码即可。

```dart
Provider.of<AppInfoProvider>(context).setTheme(colorKey);
```

我们先来说说上面这段代码，重点就在于 ThemeData 的设置：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4y775ad5j31g406udha.jpg)

我们看看`ThemeData`部分数据定义：

```dart
ThemeData({
  Brightness brightness, //深色还是浅色
  MaterialColor primarySwatch, //主题颜色样本，见下面介绍
  Color primaryColor, //主色，决定导航栏颜色
  Color accentColor, //次级色，决定大多数Widget的颜色，如进度条、开关等。
  Color cardColor, //卡片颜色
  Color dividerColor, //分割线颜色
  ButtonThemeData buttonTheme, //按钮主题
  Color cursorColor, //输入框光标颜色
  Color dialogBackgroundColor,//对话框背景颜色
  String fontFamily, //文字字体
  TextTheme textTheme,// 字体主题，包括标题、body等文字样式
  IconThemeData iconTheme, // Icon的默认样式
  TargetPlatform platform, //指定平台，应用特定平台控件风格
  ...
})
```

上面只是`ThemeData`的一小部分属性，完整的数据定义读者可以查看 SDK。

> 之所以使用`floatingActionButtonTheme`单独设置`floatingActionButton`而不是使用`accentTextTheme`，是因为会有警告 ⚠️`The support for configuring the foreground color of FloatingActionButtons using ThemeData.accentIconTheme has been deprecated. Please use ThemeData.floatingActionButtonTheme instead. See https://flutter.dev/go/remove-fab-accent-theme-dependency. This feature was deprecated after v1.13.2.`意思就是这个属性将会在`1.13.2`中被废弃。不过并不影响我们现在的使用。

更多关于主题的内容可以参考 👉[颜色和主题](https://book.flutterchina.club/chapter7/theme.html)

## 持久化选择的主题

这里就需要使用到一开始提到的`flustars`中的`SpUtil`了，我们一般会在页面初始化加载的时候读取保存的颜色信息，所以我们需要在初始化页面配置如下代码：

```dart
String _colorKey;

@override
void initState() {
  super.initState();
  _initAsync();
}

Future<void> _initAsync() async {
  await SpUtil.getInstance();
  _colorKey = SpUtil.getString('key_theme_color', defValue: 'blue');
  // 设置初始化主题颜色
  Provider.of<AppInfoProvider>(context, listen: false).setTheme(_colorKey);
}
```

> `await SpUtil.getInstance();`这段代码用于加载`SpUtil`库，通过看源码我们知道，这个库采用了**单例模式**，当然，这不是这篇文章的重点。

上面这段代码用于初始化主题，我们通过`SpUtil.getString('key_theme_color', defValue: 'blue');`获取保存的主题信息，然后再使用`Provider.of<AppInfoProvider>(context, listen: false).setTheme(_colorKey);`设置主题即可。

初始化主题弄好了，那选择的代码又如何编写呢？

很简单，只需要才合适的地方调用下面的代码就可以了。

```dart
setState(() {
  _colorKey = key;
});
SpHelper.putString('key_theme_color', key);
Provider.of<AppInfoProvider>(context).setTheme(key);
```

思路和上面大同小异，无非是将`getString`换成了`putString`。

## 切换主题控件的编写

上面的代码提供了切换主题的思路，但是对于用户来说，他们所要做的是有一个界面可以让他们直接切换主题，因此，下面我们来编写切换主题的控件。

因为切换主题通常会在设置界面中出现，所以这里我用了一个`ExpansionTile`，这是一个可以展开的`ListTile`，代码如下：

```dart
…………
ExpansionTile(
  leading: Icon(Icons.color_lens),
  title: Text('颜色主题'),
  initiallyExpanded: false,
  children: <Widget>[
    Padding(
      padding: EdgeInsets.only(left: 10, right: 10, bottom: 10),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: themeColorMap.keys.map((key) {
          Color value = themeColorMap[key];
          return InkWell(
            onTap: () {
              setState(() {
                _colorKey = key;
              });
              SpUtil.putString('key_theme_color', key);
              Provider.of<AppInfoProvider>(context, listen: false)
                  .setTheme(key);
            },
            child: Container(
              width: 40,
              height: 40,
              color: value,
              child: _colorKey == key
                  ? Icon(
                      Icons.done,
                      color: Colors.white,
                    )
                  : null,
            ),
          );
        }).toList(),
      ),
    )
  ],
),
…………
```

效果如下：

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4zei70qqj30gu06amx9.jpg)

上面这段代码就是将我们最开始选定的一些主题`themeColorMap`展示出来，告诉用户可以切换哪些主题。其中`onTap`内的代码就是上一节中提到的设置颜色主题的方法，`InkWell`主要用于提供主题色的点击效果，换成`GestureDetector`也是可以的。

至此我们的换肤功能也就完成了，想要获取完整代码的可以关注公众号「01 二进制」，后台回复「Flutter 主题切换」。

## 最后

以上就是关于如何在 Flutter 中切换主题的详细内容了。可以看出，相较于原生应用主题的适配，在 Flutter 中实现换肤的功能简单很多了。

最后来发布一篇预告，因为 iOS 13 和 Android 10 系统上都新增了「深色模式」，在文中我也提到了`ThemeData`的`Brightness brightness`属性用于表示深色还是浅色。下一篇文章我就来聊一聊深色模式的适配。

如果你觉得我的文章对你有所帮助，不妨给个赞 👍 或者关注支持一下。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4zz9ffphj30go0goabc.jpg" alt="黑白大气神秘简约微信公众号二维码" style="zoom:75%;" />
