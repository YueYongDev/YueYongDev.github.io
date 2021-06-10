---
title: TensorFlow笔记2——利用TensorFlow训练一个最简单的一元线性模型
categories:
  - 学习笔记
tags: 
  - TensorFlow
abbrlink: 4c3a
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzpyodqbssj30hs0f4aai.jpg)

## 前言
这是一次使用[《TensorFlow笔记（1）——TensorFlow中的相关基本概念》](https://yueyong.info/p/a695.html)中学习到的知识进行机器学习的实验，一来是为了理解机器学习大概是什么样的，另一方面也算是将之前学习到的一些知识活学活用。
本次实现的环境为：
* macOS Mojave 10.14.1
* python 3.7.0（pyenv）
* Tensorflow 1.12.0
* numpy 1.15.4

## 简单介绍下机器学习是什么
机器学习和人类学习的过程：

![](https://ws1.sinaimg.cn/large/006tNbRwgy1fxqdek5ieuj30dm06kmxd.jpg)

<!--more-->

如果觉得上图不好理解的话就再举一个栗子：

>假设你有个女朋友，她特别爱美。为了互相了解，你们每周末都会一起约会吃饭；已经约会有8周了，每周吃饭你女朋友都会比约定时间晚到10分钟-30分钟，所以你每次约会也会比约定时间晚10-30分钟，并且你总结了一个规律(如果约会前打电话她说从家走了，那么基本都是晚到30分钟左右，如果她说就快到了，那么基本会晚到10分钟)，不过你女朋友后来迟到的时间从10、30分钟变成了15、45分钟，你也自己调整了约定时间后到达的时间。

根据上述栗子🌰我们来类比下：

机器学习方法是计算机利用已有的数据(8次约会的经验)，得出了某种模型(迟到的规律)，并利用此模型预测未来(是否迟到)的一种方法。

## Tensorflow的基础知识
基础知识在这里我就不多说了，详见[《TensorFlow笔记（1）——TensorFlow中的相关基本概念》](https://yueyong.info/p/a695.html)

## 构建一个线性模型

先来说明下我们需要构建的这个简单的线性模型是什么东西：

假设我们有个线性模型（一元一次函数）：`y=0.1x+0.2`，我们知道这个线性模型长啥样，就是一条直线嘛，但是我现在想让机器也知道这条直线，该怎么做？还记得上面说的那个栗子吗，我们可以提供一系列类似`（x，y）`的数据，然后带入`y=k*x_data+b`，求出k和b的值之后，机器也就知道了这个线性模型长啥样了。

下面来更数学化一点的介绍：

给定一个大小为n的点集 𝑆={(𝑥1,𝑦1),(𝑥2,𝑦2),…(𝑥𝑛,𝑦𝑛)} ，

线性模型的目标就是寻找一组 *K* 和 𝑏 构成的直线 𝑦=*K*𝑥+𝑏 ，

使得所有点的损失值 `$𝑙𝑜𝑠𝑠=\sum_{i}^{n}(K𝑥_𝑖+𝑏−𝑦_𝑖)^2$` 越小越好，因为𝑙𝑜𝑠𝑠越小就表明预测值与真实值的差距越小。

因为如果我们找到了这么一组 *K* 和 𝑏 ，我们就可以预测某一个 `$𝑥_𝑚$` 的 `$𝑦_𝑚$` 值。

这里我想多说几句，线性模型在实际应用中不一定能很好的预测 $𝑦_𝑚$ 的值，这是因为实际的数据分布也许不是线性的，可能是二次、三次、圆形甚至无规则，所以判断什么时候能用线性模型很重要。只是因为我们在这里知道了这是线性模型才这么做的，真正构建模型的时候是需要相应的方法的。

## 代码解读

话不多少，分段来看代码：

1. 导入相应的python包，这里我们使用了tensorflow和numpy

```python
# tensorflow简单示例
import tensorflow as tf
import numpy as np
```

2. 使用numpy生成1000个随机点，关于numpy的使用，可以查看我的[numpy系列笔记](https://www.jianshu.com/nb/31178645)

```python
# 使用numpy生成1000个随机点
x_data = np.random.rand(1000)
y_data = x_data*0.1+0.2         # 真实值
```

3. 构造一个线性模型

```python
# 构造一个线性模型
b = tf.Variable(0.)
k = tf.Variable(0.)
y = k*x_data+b                  # 预测值
```

4. 定义损失函数，用于判断y<sub> 真实值</sub>和y<sub> 预测值</sub>之间的差距

```python
# 二次代价函数（损失函数）
loss = tf.reduce_mean(tf.square(y_data-y))
```

依次来解释下每个部分的含义：

* `y_data-y`:这个地方没啥好解释的，就是真实值和预测值之间的差
* `tf.square`：这个函数的作用就是求平方
* `tf.reduce_mean`: 函数用于计算张量tensor沿着指定的数轴（tensor的某一维度）上的的平均值，主要用作降维或者计算tensor（图像）的平均值。

所以上面这三个函数合在一起就是计算loss值。

5. 使用`GradientDescentOptimizer`类创建一个优化器来优化模型，减少`loss`值，这个类的原理是梯度下降，至于什么是梯度下降，可以参考其他教程，日后会介绍，目前只要知道这么写就好了。

````python
# 定义一个梯度下降法来进行训练的优化器
optimizer = tf.train.GradientDescentOptimizer(0.2)
````

6. 使用优化器来减少`loss`值,`minimize`是优化器的一个方法

```python
# 定义一个最小化代价函数
train = optimizer.minimize(loss)
```

7. 初始化上面的所有变量

```python
# 初始化变量
init = tf.global_variables_initializer()
```

8. 利用`Session`训练我们的模型

```python
with tf.Session() as sess:	# 定义会话上下文
    sess.run(init)	# 执行初始化操作
    for step in range(3000):  # 训练3000次
        sess.run(train)	# 执行训练操作
        if step % 20 == 0:	# 每隔20步
            print(step, sess.run([k, b]))	# 打印出k和b的值
```

至此，一个最简单的线性模型也就完成了。下面是所有代码：

```python
# tensorflow简单示例
import tensorflow as tf
import numpy as np

# 使用numpy生成1000个随机点
x_data = np.random.rand(1000)
y_data = x_data*0.1+0.2         # 真实值

# 构造一个线性模型
b = tf.Variable(0.)
k = tf.Variable(0.)
y = k*x_data+b                  # 预测值

# 二次代价函数（损失函数）
loss = tf.reduce_mean(tf.square(y_data-y))
# 定义一个梯度下降法来进行训练的优化器
optimizer = tf.train.GradientDescentOptimizer(0.2)
# 定义一个最小化代价函数
train = optimizer.minimize(loss)

# 初始化变量
init = tf.global_variables_initializer()

with tf.Session() as sess:
    sess.run(init)
    for step in range(3000):
        sess.run(train)
        if step % 20 == 0:
            print(step, sess.run([k, b]))
```

运行结果的部分截图：

![训练0-240次的结果](https://ws3.sinaimg.cn/large/006tNbRwgy1fxqggri22oj30ci0a8dh1.jpg)

![训练2700-2980次的结果](https://ws3.sinaimg.cn/large/006tNbRwgy1fxqghp4eutj30cm08m754.jpg)

从上面两张图我们可以明显的看出来，在训练到第2980次的时候，k的结果已经非常非常接近0.1，b也非常非常接近0.2了，由此可以看出，这个模型还是较为正确的。