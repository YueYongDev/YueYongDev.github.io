---
title: TensorFlow笔记0——在Ubuntu 18.04安装tensorflow 1.12 GPU版本
categories:
  - 学习笔记
tags: 
  - TensorFlow
abbrlink: 4ab8
---

![](https://ws2.sinaimg.cn/large/006tNbRwly1fy4y2sir85j30t00eedig.jpg)

在之前的深度学习中，我是在MAC上跑CPU版本的tensorflow程序，当数据量变大后，tensorflow跑的非常慢，在内存不足情况下，又容易造成系统崩溃，这个时候我觉得不应该浪费我的限制的微星游戏本，便想着拿来跑深度学习的代码。

### 1\. 配置信息

我的老电脑配置如下：

*   CPU i5-4210M
*   16G内存
*   GPU GTX 950M 显存2G
*   128G SSD
*   Ubuntu 18.04

这个配置一般，但是为了不让我的mac发光发热，同时体验下GPU给深度学习的加速效果（虽然可能加不了多少速度）以及不想让老电脑荒废的心，我最终决定还是在上面安装Ubuntu18.04跑TensorFlow了。

### 2\. 选择安装所需软件

<!--more-->

TensorFlow官网中提到了需要安装以下软件才可以使用TensorFlow的GPU版本：  ![image](http://upload-images.jianshu.io/upload_images/5666077-5b13e74d2776d0b9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

简单来说就是我们需要在Ubuntu18.04的环境下安装以下软件：

1.  NVIDIA的GPU驱动（nvidia drive-390）

2.  CUDA 9.0（不要下载CUDA 10.0，因为TensorFlow 1.12.0目前只支持到CUDA 9.0）

3.  cuDNN v7.3.1 for CUDA 9.0 （选当前最新的）

至于CUDA和cuDNN是什么自行谷歌，对应的下载页面和地址如下：

*   CUDA 9.0 [https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)

*   cuDNN 7.3.1 [https://developer.nvidia.com/rdp/cudnn-archive](https://developer.nvidia.com/rdp/cudnn-archive) 注意cuDNN下载前需要注册登录

### 3\. 安装NVIDIA驱动并降低gcc版本

cuda的官网 [https://docs.nvidia.com/cuda/cuda-installation-guide-linux/#choose-installation-method](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/#choose-installation-method) 安装说明中已经列出了检查步骤。如果你的GPU在支持列表中，则我们只需要做如下操作：

#### 3.1 安装GPU驱动程序。

Ubuntu在安装后，是给了一个叫Nouveau默认内建的驱动程序。我们需要安装GPU针对性的驱动程序，有篇文章教怎么在Ubuntu上安装合适的驱动：[https://linuxconfig.org/how-to-install-the-nvidia-drivers-on-ubuntu-18-04-bionic-beaver-linux](https://linuxconfig.org/how-to-install-the-nvidia-drivers-on-ubuntu-18-04-bionic-beaver-linux) 。

简单来说，执行 `ubuntu-drivers devices` 命令得到推荐的nvidia驱动程序，

然后执行 `sudo apt-get install nvidia-driver-390` （根据提示的驱动程序而定）即可安装完成。

注意安装完成后需要重启。

重启完成后执行`nvidia-smi`，如果出现类似于下图所示的信息则说明驱动安装成功：

![image](http://upload-images.jianshu.io/upload_images/5666077-5293d0d930344587.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

#### 3.2 安装gcc-4.8和g++4.8
```
sudo apt-get install gcc-4.8
ll /usr/bin |grep gcc #若存在高版本的gcc，则继续
cd /usr/bin
sudo mv gcc gcc.bak #备份
sudo ln -s gcc-4.8 gcc  #重新指向
```
执行`gcc --version` 可检查是否为4.8版本，g++可执行同样的操作。

### 4\. 安装CUDA和cuDNN

进入CUDA9.0的下载页，选择安装类型为runfile(local)，可发现有一个基础安装包，和三个补丁包，都下载下来，然后依次执行：
```
sudo sh cuda_9.0.176_384.81_linux.run
```
　　安装时会以提问的方式，一路默认即可，当第二个询问是否安装新驱动程序时，选择否，其余均是yes。然后再以同样的方式安装以下补丁包。
```
sudo sh cuda_9.0.176.1_linux.run
sudo sh cuda_9.0.176.2_linux.run
sudo sh cuda_9.0.176.3_linux.run　
```

　　结束后，可以在/usr/local/cuda-9.0 发现有安装文件，执行`sudo gedit /etc/profile`或者`sudo gedit ~/.bashrc`在`/etc/profile`或`~/.bashrc`的文件后面添加环境变量：　
```
export PATH=/usr/local/cuda-9.0/bin${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-9.0/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}　　
```

　　然后执行`source ~/.bashrc`或者`source /etc/profile`让刚刚修改的环境变量生效。然后执行`nvcc -V`来验证CUDA是否完成安装。

安装好CUDA9.0后，接下来就安装cuDNN，进入cuDNN下载页选择 cuDNN v7.3.1 Library for Linux 下载。

 执行如下命令：
```
tar -xzvf cudnn-9.0-linux-x64-v7.tgz
```

　　进入解压目录，执行：
```
sudo cp cuda/include/cudnn.h /usr/local/cuda/include
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn.h /usr/local/cuda/lib64/libcudnn*
```

　　这样就安装完成了。

### 5\. 安装pyenv

这里我采用了pyenv的方式来隔离不同环境下的python。

首先安装curl，它一个命令行式的下载工具
```
sudo apt install curl
```

然后下载pyenv的安装包，pyenv的GitHub链接：[pyenv](https://github.com/pyenv/pyenv)

```
curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash
```

编辑`~/.bashrc`:
```
sudo gedit ~/.bashrc
```

在该文件中添加以下内容（直接复制即可）：
```
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"</pre>
```

终端执行以下命令安装python的依赖包
```
sudo apt-get update
sudo apt-get install make build-essential libssl-dev zlib1g-dev
sudo apt-get install libbz2-dev libreadline-dev libsqlite3-dev wget curl
sudo apt-get install llvm libncurses5-dev libncursesw5-dev
```

安装python 3.6.5
```
pyenv install 3.6.5
```
安装过程可能很缓慢，一个简便方法，只需要在python的官网(此处给出python3.6.5的[下载地址](https://www.python.org/downloads/release/python-365/))下载你需要的python版本的`tar.xz`文件然后放到 `~/.pyenv/cache`中然后再执行`pyenv install [version]`就可以了，cache文件夹可能不存在，请自行新建。

![image](http://upload-images.jianshu.io/upload_images/5666077-47daf439f84abf29.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

**pyenv的常用命令**

![安装第二个](http://upload-images.jianshu.io/upload_images/5666077-8931e1c3c7a746aa.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

上图是官方文档中的例子，如果想要查看完整命令列表，可以点击查看[pyenv命令列表](https://github.com/pyenv/pyenv/blob/master/COMMANDS.md#command-reference)

在终端执行`pyenv global 3.6.5`即可将3.6.5设置为系统默认的python环境

### 6\. 安装tensorflow-gpu

终端中输入以下命令即可安装：
```
pip install --index-url http://pypi.douban.com/simple --trusted-host pypi.douban.com --upgrade tensorflow-gpu
```

### 7\. 验证结果

利用终端新建一个.py文件
```
touch test.py
```

然后利用Visual Studio Code打开该文件
```
code test.py
```

输入
```
import tensorflow as tf
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print(sess.run(hello))
```

然后执行该脚本`python test.py`即可得到包含有GPU输出信息的正确结果