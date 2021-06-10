---
title: 利用Python让你的命令行像坤坤一样会打篮球
categories:
  - 实战教学
tags:
  - 其他
  - python
abbrlink: '7839'
---

![](https://ws2.sinaimg.cn/large/006tNc79ly1g1u2kzcj7ej31900u012z.jpg)

该图片由<a href="https://pixabay.com/zh/users/ArtisticOperations-4161274/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2801140">F. Muhammad</a>在<a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2801140">Pixabay</a>上发布

> 完整代码可在公众号：「01二进制」后台回复：「蔡xx篮球」获取

## 前言

承接上文，作为一个经常逛b站的肥宅，近期b站上除了流行"品如”素材的视频，更多的莫过于蔡xx打球视频的了，有模仿的，有对比的，有手绘的，更过分的是竟然有人在命令行输出了他的打球视频，地址在：<https://www.bilibili.com/video/av47306085?from=search&seid=11282891256876390136>，不过视频中的动画好像是用某个软件生成的txt文件，看到这我就在想既然都可以用txt输出了，为啥不能用python在命令行中输出呢？说到这我便开始搜索资料，然后制作了下面一段视频：

<video src="/Users/lyy/Downloads/Apr-03-2019 23-21-58.mp4"></video>

代码是我在网上查询资料后自己修改的，本着学习和分享的精神，今天我来分享下上面这段视频的制作过程。

## 原理

既然要开始做东西，首要的问题就是想好要怎么做，大家都知道视频是由一系列图片一帧一帧组成的，因此视频转字符动画最基本的便是图片转字符画。

在这里简单的说一下图片转字符画的原理：首先将图片转为灰度图，每个像素都只有亮度信息（用 0~255 表示）。然后我们构建一个有限字符集合，其中的每一个字符都与一段亮度范围对应，我们便可以根据此对应关系以及像素的亮度信息把每一个像素用对应的字符表示，这样字符画就形成了。

> Tips:如果对"灰度图像"这个概念不太理解的可以查阅[百度百科](https://baike.baidu.com/item/%E7%81%B0%E5%BA%A6%E5%9B%BE%E5%83%8F)

计算一张图片的灰度图像的方法如下（来自百度百科）：

![image-20190407151024627](https://ws2.sinaimg.cn/large/006tNc79ly1g1u371mownj318w0fun03.jpg)

所以我们要做的就只是让字符画在命令行里面动起来就可以了。

> Tips:图片转字符画可以参考：<https://www.shiyanlou.com/courses/370>

## 准备

环境和工具：

* vscode
* Mac OS
* python 3.7

这次实验使用到的核心的库是opencv-python，关于opencv上篇文章已经简单介绍过了，这里不多阐述了，只要知道这是一个和计算机视觉有关的库就可以了。

> Tips：这里分享一个我觉得还不错的opencv-python的中文文档：<https://www.kancloud.cn/aollo/aolloopencv/269602>

## 实验

实验开始前我们需要安装opencv-python的包：

```shell
pip install opencv-python
```

### 读取视频

```python
def genCharVideo(self, filepath):
    self.charVideo = []
    # 用opencv读取视频
    cap = cv2.VideoCapture(filepath)
    self.timeInterval = round(1 / cap.get(5), 3)
    nf = int(cap.get(7))
    print('Generate char video, please wait...')
    for i in pyprind.prog_bar(range(nf)):
        # 转换颜色空间，第二个参数是转换类型，cv2.COLOR_BGR2GRAY表示从BGR↔Gray
        rawFrame = cv2.cvtColor(cap.read()[1], cv2.COLOR_BGR2GRAY)
        frame = self.convert(rawFrame, os.get_terminal_size(), fill=True)
        self.charVideo.append(frame)
    cap.release()
```

这里的`VideoCapture`是用来读取视频的，`cv2.cvtColor(input_imageﬂag)`用于转换颜色空间，其中ﬂag就是转换类型。对于BGR↔Gray的转换，我们使用的ﬂag就是cv2.COLOR_BGR2GRAY。对于BGR↔HSV的转换我们用的ﬂag就是cv2.COLOR_BGR2HSV。

### 将帧转换成字符画

```python
ascii_char = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "

# 像素映射到字符
def pixelToChar(self, luminance):
    return self.ascii_char[int(luminance / 256 * len(self.ascii_char))]

# 将普通帧转为 ASCII 字符帧
def convert(self, img, limitSize=-1, fill=False, wrap=False):
    if limitSize != -1 and (img.shape[0] > limitSize[1] or img.shape[1] > limitSize[0]):
        img = cv2.resize(img, limitSize, interpolation=cv2.INTER_AREA)
    ascii_frame = ''
    blank = ''
    if fill:
        blank += ' ' * (limitSize[0] - img.shape[1])
    if wrap:
        blank += '\n'
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            ascii_frame += self.pixelToChar(img[i, j])
        ascii_frame += blank
    return ascii_frame
```

这段代码其实就是将已经转变的灰度图的像素值映射到`ascii_char`上，然后输出到控制台。

### 控制输出

```python
# 创建线程
getchar = threading.Thread(target=getChar)
# 设置为守护线程
getchar.daemon = True
# 启动守护线程
getchar.start()
# 输出的字符画行数
rows = len(self.charVideo[0]) // os.get_terminal_size()[0]
for frame in self.charVideo:
    # 接收到输入则退出循环
    if breakflag:
        break
    self.streamOut(frame)
    self.streamFlush()
    time.sleep(self.timeInterval)
    # 共 rows 行，光标上移 rows-1 行回到开始处
    self.streamOut('\033[{}A\r'.format(rows - 1))
# 光标下移 rows-1 行到最后一行，清空最后一行
self.streamOut('\033[{}B\033[K'.format(rows - 1))
# 清空最后一帧的所有行（从倒数第二行起）
for i in range(rows - 1):
    # 光标上移一行
    self.streamOut('\033[1A')
    # 清空光标所在行
    self.streamOut('\r\033[K')
if breakflag:
    self.streamOut('User interrupt!\n')
else:
    self.streamOut('Finished!\n')
```

### 执行

最后在main函数中设置下要读取的文件名，再play一下就可以了

```python
if __name__ == '__main__':
    v2char = V2Char('vedio.mp4')
    v2char.play()
```

完整代码可在公众号：「01二进制」后台回复：「蔡xx篮球」获取

### 写在最后

方法教给大家了，视频素材可以优化，大家可以自己收集好的视频素材，发到朋友圈，让代码骚动起来！

---

喜欢的小伙伴可以长按下方二维码关注哦～。👇

![](https://ws4.sinaimg.cn/large/006tKfTcly1g1pv5gwz3sj307i07ijt1.jpg)