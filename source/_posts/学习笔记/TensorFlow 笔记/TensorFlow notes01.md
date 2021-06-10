---
title: TensorFlow笔记（1）——TensorFlow中的相关基本概念
categories:
  - 学习笔记
tags: 
  - TensorFlow
abbrlink: a695
---

![](https://ws2.sinaimg.cn/large/006tNc79ly1fzpyo15gfdj30m80cogo7.jpg)

## 前言
Tensorflow 是一个编程系统，使用图（graph）来表示计算任务，图（graph）中的节点称之为 op  (operation），一个 op 获得 0 个或多个 Tensor，执行计算，产生 0 个或多个 Tensor。Tensor 看作是一个 n 维的数组或列表。图必须在会话（Session）里被启动。

## 基本概念

* 使用图（Graph）来表示计算任务
* 在被称为会话（Session）的上下文（context）中执行图
* 使用tensor表示数据
* 通过变量（Variable）维护状态
* 使用feed和fetch可以为任意的操作赋值或者从中获取数据

下图显示了Session、Graph、Tensor、Variable之间的关系

![关系图](https://ws3.sinaimg.cn/large/006tNbRwgy1fxo6y63a09j30m80cogo7.jpg)

<!--more-->

## 图（Graph）
在TensorFlow的官方文档中，Graph 被定义为“一些 Operation 和 Tensor 的集合”。例如我们表达如下的一个计算的 python代码:

```
a = tf.placeholder(tf.float32)
b = tf.placeholder(tf.float32)
c = tf.placeholder(tf.float32)
d = a*b+c
e = d*2
```

就会生成相应的一张图，在Tensorboard中看到的图大概如下这样。其中每一个圆圈表示一个Operation（输入处为Placeholder），椭圆到椭圆的边为Tensor，箭头的指向表示了这张图Operation 输入输出 Tensor 的传递关系。
![图（Graph）](https://upload-images.jianshu.io/upload_images/5666077-4aea69b69b184954.png？imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 会话（Session）
**`会话（Session）`**是TensorFlow中的一个非常重要的概念。上面提到了，在TensorFlow中的所有计算都构建在一张计算图（Graph）中，这是一种对数学运算过程的可视化方法。而会话（Session）就是负责让这个图运算起来，**`会话（Session）`持有并管理TensorFlow程序运行时的所有资源**，例如CPU或者GPU的分配。
### 使用会话（Session）的两种方式

**方式一：明确的调用会话的生成函数和关闭会话函数**
```
# 创建一个会话
sess = tf.Session()

# 使用该会话执行一个结果
sess.run(...)

# 关闭会话，释放内存
sess.close()
```
调用这种方式时，要明确调用`Session.close()`，以释放资源。当程序异常退出时，关闭函数就不能被执行，从而导致资源泄露。

**方式二：上下文管理机制自动释放所有资源**
利用with结构将需要执行的代码包裹住，创建会话，并通过上下文机制管理器管理该会话
```
with tf.Session() as sess:
    sess.run(...)
# 不需要再调用"Session.close()"
# 在退出with statement时，会话关闭和资源释放已自动完成
```
> Tips:一般情况下推荐使用方式二使用会话

## 张量（Tensor）
TensorFlow用张量这种数据结构来表示所有的数据.你可以把一个张量想象成一个n维的数组或列表.一个张量有一个静态类型和动态类型的维数.张量可以在图中的节点之间流通
### 阶
在TensorFlow系统中，张量的维数来被描述为阶.但是张量的阶和矩阵的阶并不是同一个概念.张量的阶（有时是关于如顺序或度数或者是n维）是张量维数的一个数量描述.比如，下面的张量（使用Python中list定义的）就是2阶.
```
t = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```
你可以认为一个二阶张量就是我们平常所说的矩阵，一阶张量可以认为是一个向量.对于一个二阶张量你可以用语句t[i, j]来访问其中的任何元素.而对于三阶张量你可以用't[i, j, k]'来访问其中的任何元素.

|阶|	数学实例	| Python 例子
| ------ | ------ | ------ |
|0|	纯量 (只有大小)	| s = 483
|1|	向量(大小和方向)	| v = [1.1, 2.2, 3.3]
|2|	矩阵(数据表)	|m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
|3|	3阶张量 (数据立体)	|t = [[[2], [4], [6]], [[8], [10], [12]], [[14], [16], [18]]]
|n|	n阶 (自己想想看)	|....
张量是所有深度学习框架中最核心的组件，因为后续的所有运算和优化算法都是基于张量进行的。几何代数中定义的张量是基于向量和矩阵的推广，通俗一点理解的话，我们可以将标量视为零阶张量，矢量视为一阶张量，那么矩阵就是二阶张量。

## 变量（Variable）
本质也是一个tensor张量，但variable主要用于数据存储(可以理解为Java中的全局变量) 
Variable 用于构建一个变量，在计算图的运算过程中，其值会一直保存到程序运行结束，而一般的tensor张量在tensorflow运行过程中只是在计算图中流过，并不会保存下来。 
因此Varibale主要用来保存tensorflow构建的一些结构中的参数，这些参数才不会随着运算的消失而消失，才能最终得到一个模型。 
> **Tips:** 所有和varible有关的操作在计算的时候都要使用session会话来控制，包括计算，打印等等。

```
# 2.2变量
import tensorflow as tf

# 定义一个变量 X
X=tf.Variable([1,2])
# 定义一个常量 a
a=tf.constant([3,3])

# 增加一个减法op
sub=tf.subtract(X,a)
# 增加一个加法op
add=tf.add(X,sub)

# 初始化所有变量
init=tf.global_variables_initializer()

# 定义一段会话
with tf.Session() as sess:
    # 在会话中执行
    sess.run(init)
    print(sess.run(sub))
    print(sess.run(add))

# 创建一个变量，初始化为0
state=tf.Variable(0,name='counter')
# 创建一个op，作用是使state加1
new_value=tf.add(state,1)
# 赋值op
update=tf.assign(state,new_value)
# 变量初始化
init=tf.global_variables_initializer()
# 创建一个会话
with tf.Session() as sess:
    # 利用会话执行初始化操作
    sess.run(init)
    print(sess.run(state))
    for _ in range(5):
        sess.run(update)
        print(sess.run(state))
```
## feed和fetch
### 1.fetch
会话运行完成之后，如果我们想查看会话运行的结果，可以使用fetch来实现
```
import tensorflow as tf

# Fetch
# 创建三个常量
input1 = tf.constant(3.0)
input2 = tf.constant(2.0)
input3 = tf.constant(5.0)

# 执行加法和乘法操作
add=tf.add(input2,input3)
mul=tf.multiply(input1,add)

# 创建会话执行
with tf.Session() as sess:
    result=sess.run([mul,add])
    print(result)
```
运行结果为：
```
[21.0, 7.0]
```

### 2.feed与占位符(placeholder)
当我们构建一个模型的时候，有时候我们需要在运行时候输入一些初始数据，这个时候定义模型数据输入在tensorflow中就是用placeholder（占位符）来完成。它的定义如下：
```
def placeholder(dtype, shape=None, name=None):
```
其中dtype表示数据类型，shape表示维度，name表示名称。它支持单个数值与任意维度的数组输入。
**1. 单个数值占位符定义**
```
a = tf.placeholder(tf.float32)
b = tf.placeholder(tf.float32)
c = tf.add(a, b)
```
当我们需要执行得到c的运行结果时候我们就需要在会话运行时候，通过feed来插入a与b对应的值，代码演示如下：
```
with tf.Session() as sess:
    result = sess.run(c, feed_dict={a:3, b:4})
    print(result)
```
其中 feed_dict就是完成了feed数据功能，feed中文有喂饭的意思，这里还是很形象的，对定义的模型来说，数据就是最好的食物，所以就通过feed_dict来实现。

**2. 多维数据**
同样对于模型需要多维数据的情况下通过feed一样可以完成，定义二维数据的占位符，然后相加，代码如下：
```
_x = tf.placeholder(shape=[None, 2], dtype=tf.float32, name="x")
_y = tf.placeholder(shape=[None, 2], dtype=tf.float32, name="y")
z = tf.add(_x, _y);
```
运行时候需要feed二维数组，实现如下：
```
with tf.Session() as sess:
    result = sess.run(z, feed_dict={_x:[[3, 4], [1, 2]], _y:[[8, 8],[9, 9]]})
    print(result)
```
下面给出示例代码：
```
import tensorflow as tf

# Feed
# 常见占位符
input4=tf.placeholder(tf.float32)
input5=tf.placeholder(tf.float32)
output=tf.multiply(input4,input5)

with tf.Session() as sess:
    # feed的数据以字典的形式传入
    print(sess.run(output,feed_dict={input4:2.0,input5:45.2}))
```
执行结果为：
```
90.4
```
### 3. feed和fetch
总结下，feed和fetch的作用就和他的意思是一样的，fetch用于从session中获取结果数据，feed是用于将数据喂给operation，然后用session执行。