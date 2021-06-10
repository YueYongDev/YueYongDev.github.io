---
title: 梦回2009——QQ for Linux
categories:
  - 来都来了
tags:
  - 心得
abbrlink: 74e
---

我时常会想起 10 年前的某个夏日午后，阳光灿烂，微风习习。那一年，我 12 岁。

那时候没有工作，没有烦恼，有新鲜空气可以呼吸，有假期可以期待。我喜欢的那个打着辫子的姑娘，就坐在我前面。而我刚刚考了全班第一，走上人生的巅峰。

想回到过去，你可能需要一个小叮当；但想体验过去，你只需要 **QQ for Linux！**

<img src="https://tva1.sinaimg.cn/large/006y8mN6ly1g8br5h9hfpj30po0pmq3w.jpg" style="zoom: 33%;" />

作为国内聊天软件的头头，QQ 陪伴了很多人的青春，在使用 MacOS 前，我很享受使用 Linux 的便捷体验，但QQ、微信这类软件只能通过 wine 在 Linux 上使用却又让我十分头疼，刚在 Windows 上打游戏，头一回被腾讯拉回 Linux。

10月24日，在这几乎没人关注的节日里，QQ 的程序员们给自己送上了一份大礼，QQ for Linux。

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8britamtgj31jg0s8jxy.jpg)

并且支持x64、ARM64和MIPS64架构

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bp79p6t1j31lo0qwabm.jpg)

官网的安装帮助也十分详细，详情点击👉https://im.qq.com/linuxqq/download.html

## 安装体验

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bpcq0g1xj31qw0gojt1.jpg)

上图是官网给出的部分的安装建议，这里我选择 **shell 脚本的通用安装方式**，使用这种方式安装有一个好处就是不需要考虑不同Linux发行版的包结构问题，相比于**繁琐的wine**，我们只需要两条命令即可梦回2009。

我使用的是Ubuntu 18.04，centos/manjaro等其他Linux发行版的安装过程类似。

**首先先将安装脚本下载到本地**

![WX20191026-165703@2x](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bpir96jjj31cy0m4abv.jpg)

**然后在该路径空白处右键打开 terminal**

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bpjulho4j31cy0tkacm.jpg)

**修改脚本执行权限**

```shell
chmod -R 777 linuxqq_2.0.0-b1-1024_x86_64.sh
```

**执行安装脚本**

```shell
sudo ./linuxqq_2.0.0-b1-1024_x86_64.sh
```

> 这里一定要以root用户进行操作，否则会无法安装。执行脚本的结果如下图所示。

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bpqmna47j311i0ci415.jpg)

到这里我们就安装成功了，打开应用程序就可以看见熟悉的QQ了。

![WX20191026-170805@2x](https://tva1.sinaimg.cn/large/006y8mN6ly1g8bpspmyzrj31c00u01kx.jpg)

相较于在Linux下使用wine来安装QQ，正规军QQ for Linux的安装过程简直过于简洁，只是当我打开这个程序的时候，一股浓浓的历史感扑面而来。

对比下QQ 2009 的UI，我这是穿越了🐎

<img src="https://tva1.sinaimg.cn/large/006y8mN6ly1g8bqb18u8mj30r20r00va.jpg" alt="102617251877_0WX20191026-171401@2x" style="zoom:50%;" />

等我打开了聊天界面后

<img src="https://tva1.sinaimg.cn/large/006y8mN6ly1g8bqi1nv9rj30je0xuwfu.jpg" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/006y8mN6ly1g8bqvmxqc7j30tk0w8tdb.jpg" alt="541572082960_.pic" style="zoom:50%;" />

看到这个上古时代的UI，内心十分感慨，QQ for Liunx终于想起了他最重要的作用——**传文件**，相信之后手机和Linux系统互传文件就会方便很多了。

## 最后

简单体验了下，因为我现在对 QQ 的依赖程度越来越小，QQ for Linux 基本满足了我对QQ的需要，除了界面有些复古外，和花里胡哨的PC版一比较，竟像是一股清流。虽然是诈尸更新，但能把老项目捡起来再次维护，总的来说还是值得鼓励。

我个人比较关注的是它是否打算继续维护下去，之前有传出华为开卖预搭载Deepin Linux的笔记本，不知道是不是这些国产厂商达成了某些交易，准备构建国产 Linux 软件生态了。如果确实有这方面的打算那就更好了，希望这并不是回光返照。

---

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8br78mptij31970oxq5a.jpg)