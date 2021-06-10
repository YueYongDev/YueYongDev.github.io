---
title: 利用 Python 破解 ZIP 或 RAR 文件密码
categories:
  - 实战教学
tags:
  - 其他
  - python
abbrlink: 4d94
---

![](https://tva1.sinaimg.cn/large/006tNbRwly1gakf21vy14j31ax0u0myf.jpg)

我们经常会从网络上下载一些带密码的压缩包，想要获取里面的内容，往往就要给提供商支付一些费用。想要白嫖其中的内容，常见的做法是百度搜索一些压缩包密码破解软件，但后果相信体验过的人都知道。本文将会利用 Python 破解压缩包的密码，这里以 ZIP/RAR 为例。

> 本文源码可在微信公众号「01 二进制」后台留言「破解压缩包」获得

## 破解原理

其实原理很简单，一句话概括就是「大力出奇迹」，Python 有两个压缩文件库：`zipfile` 和 `rarfile`，这两个库提供的解压缩方法 `extractall()` 可以指定密码，这样的话首先**生成一个密码字典**（手动或用程序），然后依次尝试其中的密码，如果能够正常解压缩则表示密码正确。

## 实验环境

本文采取的虚拟环境为 Pipenv，有关 Pipenv 的详细介绍可以参考我的这篇文章 👉[《Python 管理哪家强？》](https://juejin.im/post/5c8b2d01518825068d1d24c3#heading-1)

### 库

- zipfile：Python 标准库，使用时直接导入即可

- rarfile：Python 第三方库，使用时需要安装，API 文档(https://rarfile.readthedocs.io/en/latest/api.html)

**利用 Pipenv 安装 rarfile**

```sh
pipenv install rarfile
```

最后，再将一个带有密码的压缩包放入实验环境中即可。

## 编码

知道原理后，编码就会非常简单了

### 准备密码本

「密码本」其实就是一个包含了所有可能密码的文件，用户可以手动录入，也可以用程序录入。文末还会有一个介绍。

### 读取压缩文件

```python
# 根据文件扩展名，使用不同的库
if filename.endswith('.zip'):
    fp = zipfile.ZipFile(filename)
elif filename.endswith('.rar'):
    fp = rarfile.RarFile(filename)
```

### 尝试解压

先尝试不用密码解压缩，如果成功则表示压缩文件没有密码

```python
fp.extractall(desPath)
fp.close()
print('No password')
return
```

### 暴力破解

```python
try:
    # 读取密码本文件
    fpPwd = open('pwd.txt')
except:
    print('No dict file pwd.txt in current directory.')
    return
for pwd in fpPwd:
    pwd = pwd.rstrip()
    try:
        fp.extractall(path=desPath, pwd=pwd.encode())
        print('Success! ====>'+pwd)
        fp.close()
        break
    except:
        pass
fpPwd.close()
```

### 程序入口

```python
if __name__ == '__main__':
    filename = sys.argv[1]
    if os.path.isfile(filename) and filename.endswith(('.zip', '.rar')):
        decryptRarZipFile(filename)
    else:
        print('Must be Rar or Zip file')
```

## 使用

如果想要使用上述代码，我们只需在命令行执行`python main.py <filename>`即可。例如`python main.py test.zip`

运行结果：

```python
$ python main.py test.zip
Success! ====>323126
```

## 扩展

### 密码本如何获取？

看到这里，细心的小伙伴一定会发现，最核心的其实不是代码，而是**「密码本」**。理论上只要密码本中的密码足够多，就一定能获取到压缩包的密码，这也就是俗称的**「撞库」**。

这时问题又来了，如何搜集到足够多的密码？我在搜索资料的时候发现已经有人整理好了，我 fork 了一份到了自己的仓库，有兴趣的可以点击 👉[爆破字典](https://github.com/YueYongDev/Blasting_dictionary)

### 如何加速破解过程？

解决了密码本的问题，深入思考的小伙伴的一定又会有新的疑问，密码本既然如此庞大，那如何加速破解的过程呢？这里给出两个思路

#### 多线程（进程）破解

密码本如果很多且密码数量庞大时，我们可以采用多线程（进程）的方式读取密码，一个进程读一个密码本，一个线程分段读密码。当然，如果是在 python 中，建议不要采用多线程，因为 python 中的线程就是鸡肋，有兴趣的可以阅读相关资料。

#### 利用 GPU 加速

我们以上的代码都是运行在 CPU 上的，即使开启多线程（进程）也只是利用到 CPU 的资源，但如果想要加速破解过程，我们其实还可以利用闲置的 GPU 资源。

在介绍为什么可以利用 GPU 加速前，我们需要明确一个观点，两者都为了**完成计算任务**而设计。

那为什么会想到使用 GPU 加速呢？这是就要说到两者的不同了：CPU 虽然有多核，但总数没有超过两位数，并且每个核的运算能力极其强大。而 GPU 的核数远超 CPU，但每个核的运算能力与 CPU 的核相比就相差甚远了。

我们可以简单的举个例子，解一道题，CPU 就是博士生，GPU 就是小学生，CPU 负责理解题目并且整理出解题的步骤以及解法，而 GPU 负责其中很简单但是数量又很大的简单运算就行了。

因此理论上在破解密码的过程中，我们完全可以使用 GPU 来加速这一过程。

事实上，这样的工具也已经出现了，**Hashcat** 便是最出名的一个，它号称是世界上最快的密码恢复工具，可以基于 CPU/GPU 等工作。有兴趣的可以访问他的[官网](https://hashcat.net/hashcat/)https://hashcat.net/hashcat/进行了解。

---

关注微信公众号「01 二进制」，获取更多 IT 资讯和技巧

![](https://tva1.sinaimg.cn/large/006tNbRwly1gakgye5et2j31970oxq5a.jpg)
