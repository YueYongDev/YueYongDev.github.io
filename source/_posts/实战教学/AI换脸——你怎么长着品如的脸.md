---
title: AI换脸——汝怎饰品如面
categories:
  - 实战教学
tags:
  - 其他
abbrlink: 28be
cover: https://upload-images.jianshu.io/upload_images/5666077-ab3b7c5c7a11281d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
---

> 事先说明，该篇文章中的代码是我无意中发现的，这里仅做一个分享，文末会给出参考文章，不喜勿喷。
>
> 完整源码和预训练模型可在公众号：「01 二进制」后台回复：「AI 换脸」获取

## 前言

作为一个经常逛 b 站的肥宅，前段时间无意中看到了一个名为"换脸哥"做的换脸视频，让杨幂“穿越”到了 1994 年版的《射雕英雄传》里，“代替”了朱茵，“出演”了黄蓉这个角色。视频如下（b 站视频已经被删了，只能转载知乎的视频了，原地址是[杨幂“换脸”，AI 换脸究竟有多可怕 - 科技富能量的文章 - 知乎](https://zhuanlan.zhihu.com/p/57863071)）：

<video src="http://mpvideo.qpic.cn/tjg_3868025821_50000_4374234d39244a4d8a5825488ed395c3.f10002.mp4?dis_k=9bb8c446acafa3fff362e83e380299dd&dis_t=1554306632"></video>

看完我便虎躯一震，这也太厉害了吧，这种技术一旦流行起来，ab 不用去片场就能拍戏了啊，真的是躺着赚钱啊。这要是运用到 H 片上，岂不是 😅😅😅

![](http://upload-images.jianshu.io/upload_images/5666077-118e397b50981cd6?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

言归正传，作为一个 coder，在看到这个视频之后我就很想知道这究竟是怎么做出来的，在查阅了一些资料后，我才发现最悲伤的事情莫过于，好不容易把源码找到了，数据集下载好了，结果显卡带不起来…

> Tips：这里给出我之前找到的两个有关视频换脸的仓库，有兴趣的自己去了解下：
>
> - [deepfakes_faceswap](https://github.com/joshua-wu/deepfakes_faceswap)
>
> - [FaceIt](https://github.com/goberoi/faceit)

既然条件不允许，那我们只能降低成本，既然视频里的脸不好换，那就退而求其次，换一下图片里面的脸，果然在我的苦苦寻觅后，我找到了一个低配版的 Python 换脸大法：

[《Switching Eds: Face swapping with Python, dlib, and OpenCV》](https://matthewearl.github.io/2015/07/28/switching-eds-with-python/)

> 以下内容均参考上述所标注的文章，在这感谢原作者。

接下来我将会介绍如何通过一段简短的 Python 脚本（200 行左右）将一张图片中面部特征自动替换为另外一张图片中的面部特征。

具体过程分为四个步骤：

- 检测面部标志；
- 旋转、缩放和平移图 2 以适应图 1；
- 调整图 2 的白平衡以匹配图 1；
- 将图 2 的特征融合到图 1 中；

## 实验环境

- MacOS 10.14.3
- Python 3.7
- PyCharm
- 用到的库有：
  - numpy
  - dlib
  - opencv-python

## 工具说明

numpy 大家应该都很熟悉了，这里我简单介绍下 dlib 和 opencv。

### dlib

官网介绍其为：A toolkit for making real world machine learning and data analysis applications，简单来说他就是一个开源的机器学习库，包含了很多机器学习的算法。同时对外提供了 C++和 Python 的接口。使用 dlib 可以大大简化开发，比如人脸识别，特征点检测之类的工作都可以很轻松实现。同时也有很多基于 dlib 开发的应用和开源库，比如 face_recogintion 库（据说识别率高达 93%，有兴趣的可以查阅相关资料）。python 下的安装也很简单，执行`pip install dlib`即可。

### opencv

OpenCV 是 Intel® 开源计算机视觉库。它由一系列 C 函数和少量 C++ 类构成，实现了图像处理和计算机视觉方面的很多通用算法。是计算机视觉领域非常重要的一个开源库。官网地址：<https://opencv.org/>

## 开始换脸

### 提取面部特征

既然要换脸，我们肯定要先在图片中找到人脸，dlib 中有一个函数`get_frontal_face_detector()`实现了面部特征提取，核心算法来自于 Vahid Kazemi 和 Josephine Sullivan 的论文《One Millisecond Face Alignment with an Ensemble of Regression Tree》，我也没有读过这篇论文就不解释了。提取面部特征的代码如下：

```python
# 面部检测器
detector = dlib.get_frontal_face_detector()
# 特征提取器
predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

def GetLandmarks(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)
    rects = detector(img, 1)
    if len(rects) > 1:
        print('[Warning]: More than one face in picture, only choose one randomly...')
        rects = rects[0]
    elif len(rects) == 0:
        print('[Error]: No face detected...')
        return None
    return img, np.matrix([[p.x, p.y] for p in predictor(img, rects[0]).parts()])
```

get_landmarks() 函数接受一个图片，经过处理后以 numpy 数组的形式进行处理，并返回一个 68x2 的元素矩阵。矩阵的每一行与输入图像中特定特征点的 x，y 坐标相对应。

特征提取器（predictor）需要一个大概的边界框作为算法的输入。这将由传统的面部检测器（detector）提供。该面部检测器会返回一个矩形列表，其中每一个矩形与图像中的一张人脸相对应。

> 生成 predictor 需要预先训练好的模型。该模型可在微信公众号「01 二进制」后台回复"AI 换脸"获得。

### 人脸对齐

有了上述方法，我们就可以提取出图片中的人脸了，但是两张照片中的人脸方向肯定都是不一致的（毕竟你不能保证每张都是证件照啊），就像下面这两张图：

![image-20190403222900051](http://upload-images.jianshu.io/upload_images/5666077-e8eae9769ff5da48?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这两个人脸的方向明显不一致啊，所以我们还需要对人脸进行对齐。我们现在已经获取到每张图片中人脸矩形的坐标了，剩下的就是弄明白如何旋转、平移和缩放第一个向量的所有点，使其尽可能匹配第二个向量中的点就可以了。这里运用到了一个名为**普氏分析法（Ordinary Procrustes Analysis）**的方法解决这个问题的，数学能力有限，数学依据参考注释中的链接，这里就直接放出代码吧：

```python
# refer:
# 	https://en.wikipedia.org/wiki/Procrustes_analysis#Ordinary_Procrustes_analysis
def TransferPoints(points1, points2):
    points1 = points1.astype(np.float64)
    points2 = points2.astype(np.float64)
    c1 = np.mean(points1, axis=0)
    c2 = np.mean(points2, axis=0)
    points1 -= c1
    points2 -= c2
    s1 = np.std(points1)
    s2 = np.std(points2)
    points1 /= s1
    points2 /= s2
    # 奇异值分解
    U, S, Vt = np.linalg.svd(points1.T * points2)
    R = (U * Vt).T
    return np.vstack([np.hstack(((s2 / s1) * R, c2.T - (s2 / s1) * R * c1.T)), np.matrix([0., 0., 1.])])
```

之后我们再把对齐的结果利用 OpenCV 的 cv2.warpAffine 函数，将第二个图片映射到第一个图片上：

```python
def WarpImg(img, M, dshape):
    output_img = np.zeros(dshape, dtype=img.dtype)
    cv2.warpAffine(img,
                   M[:2],
                   (dshape[1], dshape[0]),
                   dst=output_img,
                   borderMode=cv2.BORDER_TRANSPARENT,
                   flags=cv2.WARP_INVERSE_MAP)
    return output_img
```

### 校正图片颜色

两张图片由于不同的**肤色**和**光线**造成了覆盖区域边缘的不连续。所以我们需要修正它：

```python
def ModifyColor(img1, img2, landmarks1):
    blur_amount = 0.6 * np.linalg.norm(
        np.mean(landmarks1[LEFT_EYE_POINTS], axis=0) - np.mean(landmarks1[RIGHT_EYE_POINTS], axis=0))
    blur_amount = int(blur_amount)
    if blur_amount % 2 == 0:
        blur_amount += 1
    img1_blur = cv2.GaussianBlur(img1, (blur_amount, blur_amount), 0)
    img2_blur = cv2.GaussianBlur(img2, (blur_amount, blur_amount), 0)
    img2_blur += (128 * (img2_blur <= 1.0)).astype(img2_blur.dtype)
    return (img2.astype(np.float64) * img1_blur.astype(np.float64) / img2_blur.astype(np.float64))
```

### 图片融合

用一个蒙版（mask）来选择图 2 和图 1 应被最终显示的部分：

![](http://upload-images.jianshu.io/upload_images/5666077-063a559211d46243?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

值为 1 (白色)的地方为图 2 应显示的区域，值为 0 (黑色)的地方为图 1 应显示的区域。值在 0 和 1 之间的地方为图 1 图 2 的混合区域。

这是生成上述内容的代码：

```python
def GetFaceMask(img, landmarks):
    img = np.zeros(img.shape[:2], dtype=np.float64)
    groups = [
        LEFT_EYE_POINTS + RIGHT_EYE_POINTS + LEFT_BROW_POINTS + RIGHT_BROW_POINTS,
        NOSE_POINTS + MOUTH_POINTS,
    ]
    for group in groups:
        DrawConvexHull(img, landmarks[group], color=1)
    img = np.array([img, img, img]).transpose((1, 2, 0))
    img = (cv2.GaussianBlur(img, (11, 11), 0) > 0) * 1.0
    img = cv2.GaussianBlur(img, (11, 11), 0)
    return img

def DrawConvexHull(img, points, color):
    points = cv2.convexHull(points)
    cv2.fillConvexPoly(img, points, color=color)

def ModifyColor(img1, img2, landmarks1):
    blur_amount = 0.6 * np.linalg.norm(
        np.mean(landmarks1[LEFT_EYE_POINTS], axis=0) - np.mean(landmarks1[RIGHT_EYE_POINTS], axis=0))
    blur_amount = int(blur_amount)
    if blur_amount % 2 == 0:
        blur_amount += 1
    img1_blur = cv2.GaussianBlur(img1, (blur_amount, blur_amount), 0)
    img2_blur = cv2.GaussianBlur(img2, (blur_amount, blur_amount), 0)
    img2_blur += (128 * (img2_blur <= 1.0)).astype(img2_blur.dtype)
    return (img2.astype(np.float64) * img1_blur.astype(np.float64) / img2_blur.astype(np.float64))
```

`GetFaceMask()`函数定义是：为一张图像和一个标志矩阵生成一个蒙版。蒙版会画出两个白色的凸多边形：一个是眼睛周围的区域，一个是鼻子和嘴部周围的区域。之后，蒙版的边缘区域向外羽化 11 个像素，这可以帮助消除剩下的不连续部分。

## 参考

本文参考了下述文章：

1. [《Switching Eds: Face swapping with Python, dlib, and OpenCV》](https://link.juejin.im/?target=https%3A%2F%2Fmatthewearl.github.io%2F2015%2F07%2F28%2Fswitching-eds-with-python%2F)
2. [《萌新如何用 Python 实现人脸替换？》](https://juejin.im/post/5ad60e19f265da239707600d)

> 完整源码和预训练模型可在公众号：「01 二进制」后台回复：「AI 换脸」获取

## 最后

至此，一个低配版的 AI 换脸就完成了，结果就如开头那样。此次实验虽然已有换脸的雏形，但是精度还远远不够，而且这种换脸如果用到视频中肯定是不堪入目的，毕竟做得好的已经是下面这样了：

![](http://upload-images.jianshu.io/upload_images/5666077-62297fd4a6b1ad8a?imageMogr2/auto-orient/strip)

> 方法教给大家了，图片素材大家可以自己找，玩一玩，要是能转发到朋友圈让更多人看到就更好了！

---

下篇更新"美国校队蔡徐坤"打篮球视频的 txt 版，这里先放个预览的 GIF 图：

![](http://upload-images.jianshu.io/upload_images/5666077-ed6773e4585cead7?imageMogr2/auto-orient/strip)

喜欢的小伙伴可以长按下方二维码关注哦～。👇

![](http://upload-images.jianshu.io/upload_images/5666077-117f041185d9be17?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
