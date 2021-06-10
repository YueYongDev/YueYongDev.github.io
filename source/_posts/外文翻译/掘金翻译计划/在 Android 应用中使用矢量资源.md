---
title: 【译】在 Android 应用中使用矢量资源
categories:
  - 外文翻译
tags:
  - 掘金翻译计划
  - Android
abbrlink: "6804"
cover: https://user-gold-cdn.xitu.io/2019/3/22/169a30ca76e5ad48?w=4000&h=1190&f=png&s=66173
---

![Illustration by [Virginia Poltrack](https://twitter.com/VPoltrack)](https://user-gold-cdn.xitu.io/2019/3/22/169a30ca76e5ad48?w=4000&h=1190&f=png&s=66173)

在之前的文章中， 我们研究了 Android 的 `VectorDrawable` 图像格式以及它能够实现的功能：

- [**Understanding Android’s vector image format: VectorDrawable**: Android devices come in all sizes, shapes and screen densities. That’s why I’m a huge fan of using resolution...](https://medium.com/androiddevelopers/understanding-androids-vector-image-format-vectordrawable-ab09e41d5c68)

- [**Draw a Path: Rendering Android VectorDrawables**: In the previous article, we looked at Android’s VectorDrawable format, going into its benefits and capabilities.](https://medium.com/androiddevelopers/draw-a-path-rendering-android-vectordrawables-89a33b5e5ebf)

在这篇文章中， 我们将会深入研究如何在你的 app 中应用这些矢量资源。 `VectorDrawable` 是在 Lollipop（API 21）中引入的， 也可以在 AndroidX 中使用（作为 `VectorDrawableCompat` ）， 可以向下兼容到 API 14（这使其可以覆盖超过 [99％ 的设备](https://developer.android.com/about/dashboards/)）。 本文将概述一些能真正在你的应用中使用 `VectorDrawables` 的建议。

## 首先是 AndroidX

从 Lollipop 开始， 你可以在任何需要使用其他可绘制类型的地方使用 `VectorDrawables` （使用标准的 `@drawable/foo` 语法引用它们）， 但是我建议**始终**使用 AndroidX 实现。

这会显著增加其使用平台的范围， 不仅如此， 它还支持将特性和 bug 修复程序向后移植到旧平台。 例如， 使用 AndroidX 中的 `VectorDrawableCompat` 可以：

- `nonZero` 和 `evenOdd` 路径 `fillTypes` —— [定义形状“内部”](https://www.sitepoint.com/understanding-svg-fill-rule-property/)的两种常见方法， 通常用于 SVGs（ `evenOdd` 在 API 24 中得以实现）
- 渐变（Gradient）& `ColorStateList` 填充 / 画笔（在 API 24 中被添加实现）
- Bug 修复

事实上， AndroidX 将使用 compat 实现， 甚至在一些存在本地实现的平台上（[当前是 api 21-23](https://android.googlesource.com/platform/frameworks/support/+/androidx-master-dev/appcompat/src/main/java/androidx/appcompat/widget/AppCompatDrawableManager.java#100)）也可以实现上述优点。 否则， 它将委托给平台实现， 因此仍然可以接收对新版本的任何改进（例如， 为了提高性能， `VectorDrawable` 在 API 24 的 C 中重新实现)。

基于这些原因， 你应该**始终**使用 AndroidX， 即使你很幸运地将你的 `minSdkVersion` 设置成 24。 这没什么不好的， 如果/当 `VectorDrawable` 在未来扩展了新的功能， 并且它们也被添加到 AndroidX 中， 那么它们就可以直接使用， 而不需要重新检查代码。

[Alex Lockwood](undefined) **是这么说的**：

![](https://user-gold-cdn.xitu.io/2019/3/22/169a30ca4b5aa12d?w=1100&h=714&f=png&s=110251)

## 怎么使用？

为了使用 AndroidX 矢量支持（AndroidX vector support）， 你需要做 2 件事情：

### 1. 开启支持

您需要在应用的 `build.gradle` 中选择加入 `AndroidX` 矢量支持：

```
android {
    defaultConfig {
        vectorDrawables.useSupportLibrary = true
    }
}
```

如果 `minSdkVersion` < 21， 这意味着 Android Gradle 插件无法[生成矢量资源的 PNG 版本](https://developer.android.com/studio/write/vector-asset-studio#apilevel) —— 如果我们使用 AndroidX 库的话就不用担心这个问题。

通过默认的 [AAPT](https://developer.android.com/studio/command-line/aapt2)（Android 资产包装工具）版本资源。 它也被传递给构建工具链。 这意味着， 如果你在 `res/drawable/` 中声明一个 `VectorDrawable` ， 它会为你将其自动移动到 `res/drawable-v21/` ， 因为系统知道这就是 `VectorDrawable` 类被引入的时候。

> 这可以防止属性 ID 冲突 —— 在 `VectorDrawables` 中使用的属性（ `android:pathData` ， `android:fillColor` 等)都有一个整数 ID， 这些 ID 是在 API 21 中添加的。 在老版本的 Android 上， 没有任何东西可以阻止 OEM 使用任何"无人认领”的 ID， 因此在较老的平台上使用较新的属性是不安全的。

这种版本控制将阻止在较老的平台上访问这些资源， 使反编译成为不可能的事情 —— gradle 标志禁用了可绘制对象资源（vector drawables）的版本控制。 这就是为什么你使用 `android:pathData` 引入你的向量而不是必须切换到 `app:pathData` 等其他后移功能。

### 2. 使用 AndroidX 加载

当加载 drawables 时， 你需要使用 AndroidX 的方法， 因为它已经提供了对矢量资源的支持。 这个的切入点是始终利用 [ `AppCompatResources.getDrawable` ](https://developer.android.com/reference/androidx/appcompat/content/res/AppCompatResources.html#getDrawable(android.content. Context, %20int)) 加载 drawables。 虽然有许多方法可以加载 drawables（因为某些原因）， 但是如果你想使用 compat 向量， 就必须使用 AppCompatResources。 如果你做不到这一点， 那么你就不能连接到 AndroidX 代码路径， 当你尝试使用任何你运行的平台不支持的功能时， 你的应用程序可能会崩溃。

> `VectorDrawableCompat` 还提供了一个 `create` 方法。 我总是会建议使用 `AppCompatResources` ， 因为这会增加一层缓存。

如果你想以声明的方式设置 drawables（即在你的布局中）， `appcompat` 提供了一些 `Compat` 属性， 你应该使用这些属性而不是标准的平台属性：

`ImageView` ， `ImageButton` ：

- 不要使用： `android:src`
- 应该使用： `app:srcCompat`

`CheckBox` ， `RadioButton` ：

- 不要使用： `android:button`
- 应该使用： `app:buttonCompat`

`TextView` （[as of `appcompat:1.1.0` ](https://developer.android.com/jetpack/androidx/androidx-rn#2018-dec-03-appcompat)）：

- 不要使用： `android:drawableStart` 和 `android:drawableTop` 等
- 应该使用： `app:drawableStartCompat` 和 `app:drawableTopCompat` 等

由于这些属性是 `appcompat` 库的一部分， 请确保使用 app: namespace。 在内部， 这些 `AppCompat` 视图使用 `AppCompatResources` 来支持加载矢量的加载。

> 如果你想了解 `appcompat` 如何交换出 `TextView` ， 或者声明了一个启用此功能的 `AppCompatTextView` 等， 你可以查看这篇文章： [https://helw.net/2018/08/06/appcompat-view-inflation/](https://helw.net/2018/08/06/appcompat-view-inflation/)

## 实战

这些要求会影响你创建布局或访问资源所使用的方式。 以下是一些考虑到的实际因素。

### 没有 compat 属性的视图

不幸的是， 有很多地方你可能想要在不提供 compat 属性的视图上指定 drawables（例如， 对于 `progressbar` 来说没有 `indeterminateDrawableCompat` 属性）。 你仍然可以使用 AndroidX vectors， 但你需要对代码作如下更改:

```
/* Copyright 2018 Google LLC.
   SPDX-License-Identifier: Apache-2.0 */
val progressBar = findViewById < ProgressBar > (R.id.loading)
val drawable = AppCompatResources.getDrawable(context, R.drawable.loading_indeterminate)
progressBar.indeterminateDrawable = drawable
```

如果您正在使用[数据绑定](https://developer.android.com/topic/libraries/data-binding/)， 那么可以使用自定义绑定适配器来完成此操作：

```
/* Copyright 2018 Google LLC.
   SPDX-License-Identifier: Apache-2.0 */
@BindingAdapter("indeterminateDrawableCompat")
fun bindIndeterminateProgress(progressBar: ProgressBar, @DrawableRes id: Int) {
    val drawable = AppCompatResources.getDrawable(progressBar.context, id)
    progressBar.indeterminateDrawable = drawable
}
```

请注意， 我们不希望数据绑定为我们加载 drawable（因为它**目前**不使用 `AppCompatResources` 来加载 drawables）， 所以不能像 `@ {@ drawable / foo}` 那样直接引用 drawable。 相反， 如果我们想将 drawable **id** 传递给绑定适配器， 因此需要导入 `R` 来引用它：

```
<!-- Copyright 2018 Google LLC.
SPDX - License - Identifier: Apache - 2.0 -->
    <
    layout... >
    <
    data >
    <
    import type = "your.package.R"
alias = "R" / >
    ...
    <
    /data>

    <
    ProgressBar...
    app: indeterminateDrawableCompat = "@{R.drawable.foo}" / >

    <
    /layout>
```

### 嵌套的 drawables

有些 `drawable` 是可嵌套的， 例如 `StateListDrawables` ， `InsetDrawables` 或 `LayerDrawables` 均包含其他子 drawable。 AndroidX 支持显式渲染 `<vector>` 元素（也包括动画向量（ `animated-vector` ）和动画选择器（ `animated-selectors` ）， 但我们今天主要讨论静态 vectors）。 当你调用 `AppCompatResources.getDrawable` ， 它用给定的 `id` 查看资源， 如果它是一个向量（即根元素是 `<vector>` ）， 它就会手动地为你加载它。 否则， 它就会把它交给系统加载——这样做的时候， AndroidX 就无法将自己重新插入到进程中。 这意味着， 如果你有一个包含向量的 `InsetDrawable` ， 并利用 `AppCompatResources` 加载它， 它将根据 `<inset>` 标记， 然后将它交给平台来加载。 因此， 它将没有机会加载嵌套的 `<vector>` ， 因此要么加载失败（在 API <21 上）， 要么返回到平台支持。

要解决这个问题， 可以在代码中创建 `drawables` ； 也就是说， 使用 `AppCompatResources` 加载矢量资源， 然后手动创建 `InsetDrawable` 格式的 drawable。

有一个例外是 AndroidX 最近添加了一个新功能（从 [ `appcompat:1.0.0` ](https://developer.android.com/jetpack/androidx/androidx-rn#1.0.0-new) 开始）—— [ `AnimatedStateListDrawables` ](https://developer.android.com/reference/androidx/appcompat/graphics/drawable/AnimatedStateListDrawableCompat) 向后移植（译者注： 原文是 back-ported ， Wikipedia 上解释是 `把新版本上的东西移植到老版本上去` ， 这里翻译成向后移植）。 这是 `StateListDrawable` 的一个版本， 具有状态之间的动画转换(以 `AnimatedVectorDrawables` 的形式)。 你不需要申明一个过渡。 因此， 如果你只需要一个可以使用 AndroidX 来扩充子向量的 `StateListDrawable` ， 那么你可以使用：

```
<!-- Copyright 2018 Google LLC.
SPDX - License - Identifier: Apache - 2.0 -->
    <
    animated - selector... >
    <
    item android: state_foo = "true"
android: drawable = "@drawable/some_vector" / >
    <
    item android: drawable = "@drawable/some_other_vector" / >
    <!-- no transitions specified -->
    <
    /animated-selector>
```

一切都归功于这个天才黑客： https://twitter.com/alexjlockwood/status/1029088247131996160

> 有一种方法可以在嵌套的 drawable 中启用矢量， 通过使用 [AppCompatDelegate#setCompatVectorFromResourcesEnabled](https://developer.android.com/reference/android/support/v7/app/AppCompatDelegate.html#setCompatVectorFromResourcesEnable)， 但它有许多缺点。 务必仔细阅读 javadoc。

### 进程外加载

有时你需要在无法控制何时或如何加载的地方使用 drawable。 例如： 通知， 主屏幕小部件或主题中指定的某些资源（例如， 在创建预览窗口时设置由平台加载的 `android：windowBackground` ）。 在这些情况下， 你不负责加载 drawable， 因此没有机会集成 AndroidX 支持， 你也就无法在 API 21 之前使用这些矢量资源了 😞。

你当然可以在 API 21+ 上使用 vectors， 但请注意， 你可能不喜欢 AndroidX 提供的功能/错误修正。 例如， 虽然 AndroidX 对 `fillType="evenOdd"` 支持的很好， 但是在 API 21-23 设备上不使用 AndroidX 支持向量是无法理解这个属性的。 对于这个具体的例子， 我将在下一篇文章中介绍如何在设计时转换 fillType。 否则， 你可能需要为不同的 API 准备不同的资源了：

```
res /
    drawable - xxhdpi /
    foo.png < --raster
drawable - anydpi - v21 /
    foo.xml < --vector
drawable - anydpi - v24 /
    foo.xml < --vector with fancy features
```

请注意， 除了 api 级别限定符之外， 我们还需要在此处包含 `anydpi` 资源限定符。 这是由于[资源限定符优先级](https://developer.android.com/guide/topics/resources/providing-resources#BestMatch)的工作方式导致的。 任何在 `drawable- <whatever> dpi` 中的资源都被认为是比在 `drawable-v21` 更好的选择。

## X 标记点

本文旨在强调使用 AndroidX 矢量支持（AndroidX vector support）的好处以及一些你需要注意的限制。 使用 AndroidX 支持既可以在更多平台版本和后端功能上使用矢量资源， 也可以让你接收任何未来的更新。

现在我们已经理解了为什么以及如何使用向量， 下一篇文章将深入探讨如何创建它们。

即将推出： 为 Android 创建矢量资源

即将推出： ` Android VectorDrawables` 分析

> 如果发现译文存在错误或其他需要改进的地方， 欢迎到 [掘金翻译计划](https://github.com/xitu/gold-miner) 对译文进行修改并 PR， 也可获得相应奖励积分。 文章开头的 **本文永久链接** 即为本文在 GitHub 上的 MarkDown 链接。

---

> [掘金翻译计划](https://github.com/xitu/gold-miner) 是一个翻译优质互联网技术文章的社区， 文章来源为 [掘金](https://juejin.im) 上的英文分享文章。 内容覆盖 [Android](https://github.com/xitu/gold-miner#android)、 [iOS](https://github.com/xitu/gold-miner#ios)、 [前端](https://github.com/xitu/gold-miner#前端)、 [后端](https://github.com/xitu/gold-miner#后端)、 [区块链](https://github.com/xitu/gold-miner#区块链)、 [产品](https://github.com/xitu/gold-miner#产品)、 [设计](https://github.com/xitu/gold-miner#设计)、 [人工智能](https://github.com/xitu/gold-miner#人工智能)等领域， 想要查看更多优质译文请持续关注 [掘金翻译计划](https://github.com/xitu/gold-miner)、 [官方微博](http://weibo.com/juejinfanyi)、 [知乎专栏](https://zhuanlan.zhihu.com/juejinfanyi)。
