---
title: Flutter实现文件下载
categories:
  - 实战教学
tags:
  - Flutter
abbrlink: aa30
cover: https://upload-images.jianshu.io/upload_images/5666077-43b6b90c7ba71021.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
---

# 前言

之前有做一个工具集的微信小程序「开挂 Lite」，但是由于小程序自身限制，没有办法实现下载文件的功能，只能把下载链接解析出来。而且受限于微信平台，小程序的审核是一件很麻烦的事情，因此有了将其 APP 化的想法。

自从去年 Flutter 横空出世后，我便一直关注它的发展，时隔一年后重新拾起，发现它的生态已经初具规模，于是决定采用 Flutter 重做一个「开挂 Lite」。后期我也会不定时更新一些和 Flutter 有关的文章，希望大家可以多多支持。本文记录的便是我利用 Flutter 实现文件下载功能的过程。

> 完整源码可在公众号：「01 二进制」后台回复：「Flutter 文件下载」获取

# 开始

我们先看一下实现的效果：

**iOS**

![](https://upload-images.jianshu.io/upload_images/5666077-18bd38bf54024947.gif?imageMogr2/auto-orient/strip)

**Android**

![](https://upload-images.jianshu.io/upload_images/5666077-aabdea4546e0d26a.gif?imageMogr2/auto-orient/strip)

本 demo 的实现效果非常简单，就是点击一个按钮，然后下载文件，完成后提示用户是否打开文件。

## 准备工作

在本 demo 中使用的 IDE 为 **Android Studio**，同时使用到了以下几个库：

```dart
flutter_downloader: ^1.1.7
path_provider: 1.1.2
permission_handler: ^3.1.0
progress_dialog: ^1.1.0+1
toast: ^0.1.4
```

我们先新建一个空项目，然后将上述依赖添加到项目的`pubspec.yaml`文件，添加位置如下：

![](https://upload-images.jianshu.io/upload_images/5666077-ef41d7d38b8fe720.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来我们可以在 **Terminal** 中输入`flutter packages get`或者点击 IDE 左上角的`Packages get`字样安装依赖。

![](https://upload-images.jianshu.io/upload_images/5666077-0293aec0cca1885f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后将初始项目中的多余代码删除，并在中间添加一个按钮。

```dart
body: Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: <Widget>[
      RaisedButton(
        child: Text("点我下载文件"),
        onPressed: () {
          // 执行下载操作
          _doDownloadOperation();
        },
      ),
    ],
  ),
),
```

其中`_doDownloadOperation()`便是我们执行下载操作的方法，至此，前期准备工作结束。

## 逻辑分析

虽然整个下载演示的过程非常简单，但还是有必要来分析整个下载的流程，如下图所示：

![](https://upload-images.jianshu.io/upload_images/5666077-7c2c112bb5f2a7b4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以我们接下来要做的事情便是：

1. 获取权限：网络权限、存储权限
2. 获取下载路径
3. 设置下载回调（用于监听下载过程）

## 操作

### 获取权限

这里使用到一个权限获取插件：`permission_handler`，这个插件提供了跨平台（Android 和 iOS）的权限检查以及获取 API，地址在：https://pub.flutter-io.cn/packages/permission_handler。在获取权限前我们需要先申明权限（Android）。

打开项目根目录下的`android/app/src/main/AndroidManifest.xml`文件，位置如下图所示：

![](https://upload-images.jianshu.io/upload_images/5666077-1deb409d3863b356.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后添加我们需要使用的权限的申明，如下图所示：

![](https://upload-images.jianshu.io/upload_images/5666077-c55a8c420aa35cfd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来我们就可以写代码来获取所需的权限了。创建一个`_checkPermission()`函数用于判断权限是否给予。当然由于平台差异，我们需要判断其为 Android 平台，申请代码如下：

```dart
// 申请权限
Future<bool> _checkPermission() async {
  // 先对所在平台进行判断
  if (Theme.of(context).platform == TargetPlatform.android) {
    PermissionStatus permission = await PermissionHandler()
        .checkPermissionStatus(PermissionGroup.storage);
    if (permission != PermissionStatus.granted) {
      Map<PermissionGroup, PermissionStatus> permissions =
          await PermissionHandler()
              .requestPermissions([PermissionGroup.storage]);
      if (permissions[PermissionGroup.storage] == PermissionStatus.granted) {
        return true;
      }
    } else {
      return true;
    }
  } else {
    return true;
  }
  return false;
}
```

### 获取下载路径

这里是使用的插件是`path_provider`，它是一个配合 Dart 的 IO 库以便在 Flutter 中实现文件读写的插件，Flutter 中文网对该插件有着详细的介绍(https://flutterchina.club/reading-writing-files/)，这里我们需要明白一个问题，就是iOS没有外置存储这一概念，因此需要对平台进行判断，代码如下：

```dart
// 获取存储路径
Future<String> _findLocalPath() async {
  // 因为Apple没有外置存储，所以第一步我们需要先对所在平台进行判断
  // 如果是android，使用getExternalStorageDirectory
  // 如果是iOS，使用getApplicationSupportDirectory
  final directory = Theme.of(context).platform == TargetPlatform.android
      ? await getExternalStorageDirectory()
      : await getApplicationSupportDirectory();
  return directory.path;
}
```

通过上述代码我们便可以获取存储路径，但是如果我们不想把文件下载到存储路径呢？比如我就喜欢单独设置一个`/Download`路径专门用于保存下载文件，其实也很简单：

```dart
// 获取存储路径
var _localPath = (await _findLocalPath()) + '/Download';

final savedDir = Directory(_localPath);
// 判断下载路径是否存在
bool hasExisted = await savedDir.exists();
// 不存在就新建路径
if (!hasExisted) {
  savedDir.create();
}
```

### 下载文件

下载文件这里我找了一些资料，发现貌似只有一个`flutter_downloader`插件，也不知道是什么情况。该插件的配置过程也是挺复杂的，好在文档(https://pub.flutter-io.cn/packages/flutter_downloader)写的还算明白。这个插件可以实现后台下载，分别基于 Android 中的 [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) 和 iOS 中的 [`NSURLSessionDownloadTask`](https://developer.apple.com/documentation/foundation/nsurlsessiondownloadtask?language=objc) 实现的。

接下来分别说下在 iOS 端和 Android 端的设置。

#### 插件配置

**iOS 端配置**

- 启用 **background mode**

想要执行这一步，我们在 Xcode 中打开该项目的 _iOS module_，如下图所示：

![](https://upload-images.jianshu.io/upload_images/5666077-a490d106d8654cc9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后双击左侧**Runner**选项，选择 **Capabilities** 选项，按图中所示启用*background mode*

![](https://upload-images.jianshu.io/upload_images/5666077-0acdf54405e40eb4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/5666077-35f904b896d16c1c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 添加 **sqlite** 依赖库

![](https://upload-images.jianshu.io/upload_images/5666077-5b01d6d6e383adcf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/5666077-61b9cf42dc3bcc9b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

文档中还提供了一些**可选配置**：

- 设置 HTTP 请求支持

为了安全起见，苹果官方已经默认不让开发者使用不安全的 http 通信协议了，而是建议开发者使用安全的 https 协议。若我们还是需要使用 http 协议需要做一些配置，文档中给了两种方式配置，一种是允许单个 HTTP 请求的域名，另一种是允许所有 HTTP 请求的域名，这里出于演示目的，选择第二种。

只需要在`Info.plist`文件中添加如下代码即可：

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key><true/>
</dict>
```

- 设置最大同时下载数

默认支持同时下载最多 3 个文件，如果你需要更改同样需要更改`Info.plist`

```xml
<key>FDMaximumConcurrentTasks</key>
<integer>5</integer>
```

- 设置下载完成通知

同样的，修改`Info.plist`：

```xml
<key>FDAllFilesDownloadedMessage</key>
<string>All files have been downloaded</string>
```

**Android 端配置**

说完了 iOS 端的配置，我们再来说下 Android 端的配置。在 `AndroidManifest.xml` 文件中添加如下代码：

```xml
<provider
    android:name="vn.hunghd.flutterdownloader.DownloadedFileProvider"
    android:authorities="${applicationId}.flutter_downloader.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/provider_paths"/>
</provider>
```

位置如下：

![](https://upload-images.jianshu.io/upload_images/5666077-afa38a74f243f9ee.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还有其他类似于 iOS 端的可选配置，功能大同小异，这里就不说了，详见官网。

#### 编写下载代码

配置结束后，其实下载的代码很简单：

```dart
// 根据 downloadUrl 和 savePath 下载文件
_downloadFile(downloadUrl, savePath) async {
  await FlutterDownloader.enqueue(
    url: downloadUrl,
    savedDir: savePath,
    showNotification: true,
    // show download progress in status bar (for Android)
    openFileFromNotification:
        true, // click on notification to open downloaded file (for Android)
  );
}
```

当然我们需要提前引入`flutter_downloader`库

```dart
import 'package:flutter_downloader/flutter_downloader.dart';
```

文档中还提供了其他 API，譬如暂停下载、取消下载，这里就不再阐述了，文档已经写的很清楚了。

到这其实就已经完成了下载的逻辑，然而下载的逻辑是实现了，想要让用户用的明白，我们还需要加一些提示信息，就像开头 demo 展示的有下载进度条和下载完成的提示框，接下来我们就来为下载设置这些提示信息吧。

### 设置下载提示信息

这里以对话框和进度条的形式展现下载过程，我们使用到了`progress_dialog`这个插件，可以很方便的显示出一个下载对话框，地址是https://pub.flutter-io.cn/packages/progress_dialog。

使用`progress_dialog`插件非常简单，首先我们引入依赖文件：

```dart
import 'package:progress_dialog/progress_dialog.dart';
```

然后创建一个对话框：

```dart
ProgressDialog pr;
```

如果想要创建一个下载提示对话框的话我们只需要在合适的地方初始化这个 Dialog：

```dart
pr = new ProgressDialog(context,ProgressDialogType.Download);
```

然后执行`pr.show();`即可显示对话框。取消这个对话框也非常的简单，只需执行`pr.hide();`

如果想要更新对话框中的提示信息，比如下载进度，只需执行下述代码：

```dart
pr.update(progress: percentage,message: "Please wait...");
```

同时我们还可以通过`isShowing()`函数判断对话框是否显示

```dart
bool isProgressDialogShowing = pr.isShowing();
```

是不是非常方便呢？

有了展示的对话框，下一步自然就是获取下载进度了，好在`flutter_downloader`已经给我们提供了一个下载回调，我们可以在下面的这个回调函数中更新我们的 UI。

```dart
FlutterDownloader.registerCallback((id, status, progress) {
  // code to update your UI
});
```

其中**id**是下载任务的 id，**status**是当前 id 下载任务的状态，有`undefined,enqueued,running,complete,failed,canceled,paused`这几种状态，**progress**便是当前 id 下载任务的进度。

这里方便起见我选择在`initState()`函数中初始化下载回调函数和对话框：

```dart
@override
void initState() {
  super.initState();
  // 初始化进度条
  ProgressDialog pr = new ProgressDialog(context, ProgressDialogType.Download);
  pr.setMessage('下载中…');
  // 设置下载回调
  FlutterDownloader.registerCallback((id, status, progress) {
  	// 打印输出下载信息
    print('Download task ($id) is in status ($status) and process ($progress)');
    ......
  });
```

然后我们需要根据下载的状态分情况讨论

```dart
@override
void initState() {
  super.initState();
  ......
  // 设置下载回调
  FlutterDownloader.registerCallback((id, status, progress) {
  	// 打印输出下载信息
    print('Download task ($id) is in status ($status) and process ($progress)');
    if (!pr.isShowing()) {
      pr.show();
    }
    if (status == DownloadTaskStatus.running) {
      pr.update(progress: progress.toDouble(), message: "下载中，请稍后…");
    }
    if (status == DownloadTaskStatus.failed) {
      showToast("下载异常，请稍后重试");
      if (pr.isShowing()) {
        pr.hide();
      }
    }
    if (status == DownloadTaskStatus.complete) {
      print(pr.isShowing());
      if (pr.isShowing()) {
        pr.hide();
      }
    }
  });


```

其实到这里下载文件的操作就算结束了，但是通常在下载完成后 APP 都会提示你是否要打开，于是在这我们干脆 就拓展一下，实现打开我们已经下载好的文件。

### 打开下载完成的文件

那如何打开已经下载好的文件呢？插件已经提供好了打开下载文件的 API，我们只需要像下面这样使用就可以了。

```dart
// 根据taskId打开下载文件
Future<bool> _openDownloadedFile(taskId) {
  return FlutterDownloader.open(taskId: taskId);
}
```

想要打开已经下载完成的文件，我们必须要要确保文件已经下载好了。所以我们需要紧接上面的代码中判断下载完成的函数。这里我们以弹出对话框的形式询问用户是否打开文件。

![](https://upload-images.jianshu.io/upload_images/5666077-fa8cb8781b818726.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

代码如下

```dart
@override
void initState() {
  super.initState();
		......
    if (status == DownloadTaskStatus.complete) {
      print(pr.isShowing());
      if (pr.isShowing()) {
        pr.hide();
      }
      // 显示是否打开的对话框
      showDialog(
          // 设置点击 dialog 外部不取消 dialog，默认能够取消
          barrierDismissible: false,
          context: context,
          builder: (context) => AlertDialog(
                title: Text('提示'),
                // 标题文字样式
                content: Text('文件下载完成，是否打开？'),
                // 内容文字样式
                backgroundColor: CupertinoColors.white,
                elevation: 8.0,
                // 投影的阴影高度
                semanticLabel: 'Label',
                // 这个用于无障碍下弹出 dialog 的提示
                shape: Border.all(),
                // dialog 的操作按钮，actions 的个数尽量控制不要过多，否则会溢出 `Overflow`
                actions: <Widget>[
                  // 点击取消按钮
                  FlatButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('取消')),
                  // 点击打开按钮
                  FlatButton(
                      onPressed: () {
                        Navigator.pop(context);
                        // 打开文件
                        _openDownloadedFile(id).then((success) {
                          if (!success) {
                            Scaffold.of(context).showSnackBar(SnackBar(
                                content: Text('Cannot open this file')));
                          }
                        });
                      },
                      child: Text('打开')),
                ],
              ));
    }
  });
}
```

对话框的使用上述代码已经注释的很详细了。

至此，我们便使用 Flutter 完成了一个完整的下载文件的过程了。

# 总结

总的来说，利用 Flutter 实现文件下载的思路还是很清楚的，**获取权限->获取路径->开始下载->监听下载进程**，一气呵成。同时，借助于 Flutter 社区的快速发展，已经有很多优秀的开发者开发了一些非常好用的插件，凭借着这些插件我们可以快速实现自己想要的功能。在这个 demo 中整个界面编写+逻辑实现总共也才 **223** 行代码，虽然界面有些丑陋，但考虑到 Dart 语言的迷之缩进这个行数也是很短的了。

最后想要源码可以扫描下面的二维码关注我的公众号「01 二进制」，后台回复「Flutter 文件下载」即可，后期我也会不定时更新一些和 Flutter 有关的文章，希望大家可以多多支持。

---

![](https://upload-images.jianshu.io/upload_images/5666077-336aa719993c3a45.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
