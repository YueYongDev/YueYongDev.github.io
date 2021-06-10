---
title: TensorFlow笔记3——利用TensorFlow和MNIST数据集训练一个最简单的手写数字识别模型
categories:
  - 学习笔记
tags: 
  - TensorFlow
abbrlink: efd4
---

![](https://ws4.sinaimg.cn/large/006tNc79ly1fzpyolzjavj30yg0flwfm.jpg)

## 前言
当我们开始学习编程的时候，第一件事往往是学习打印"Hello World"。就好比编程入门有Hello World，机器学习入门有MNIST。

MNIST是一个入门级的计算机视觉数据集，它包含各种手写数字图片：

![手写数字](http://upload-images.jianshu.io/upload_images/5666077-4a6654c25e807636.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

它也包含每一张图片对应的标签，告诉我们这个是数字几。比如，上面这四张图片的标签分别是`5，0，4，1`。

其实训练一个简单的手写数字识别模型的代码很短，我的示例代码总共也就50行，除去注释、空格之类的估计连30行也没有，但是去理解包含在代码中的设计思想是很重要的，因此这篇笔记我会将我对每段代码的理解都记录下来。

参考：

> [MNIST机器学习入门](http://www.tensorfly.cn/tfdoc/tutorials/mnist_beginners.html)
>
> [机器学习-损失函数](http://www.csuldw.com/2016/03/26/2016-03-26-loss-function/)

<!--more-->

## MNIST数据集
MNIST数据集的官网是[Yann LeCun's website](http://yann.lecun.com/exdb/mnist/)。
虽然python提供了直接下载这个数据集的代码，但是考虑到国内网络的原因，建议[点这下载数据集](https://pan.baidu.com/s/11i2ddnxPwR7CFEvN8qmuYg)，然后导入到项目根目录下就可以了。
![数据集](https://upload-images.jianshu.io/upload_images/5666077-aa298c973df86d93.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
下载下来的数据集被分成两部分：60000行的训练数据集（mnist.train）和10000行的测试数据集（mnist.test）。这样的划分很重要，在机器学习模型设计时必须有一个单独的测试数据集不用于训练而是用来评估这个模型的性能，从而更加容易把设计的模型推广到其他数据集上（泛化）。

正如前面提到的一样，每一个MNIST数据单元有两部分组成：一张包含手写数字的图片和一个对应的标签。我们把这些图片设为`xs`，把这些标签设为`ys`。训练数据集和测试数据集都包含`xs`和`ys`，比如训练数据集的图片是 `mnist.train.images `，训练数据集的标签是 `mnist.train.labels`。

每一张图片包含28像素X28像素。我们可以用一个数字数组来表示这张图片：

![示例](http://upload-images.jianshu.io/upload_images/5666077-9b355b3ff43c303a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们把这个数组展开成一个向量，长度是 28x28 = 784。如何展开这个数组（数字间的顺序）不重要，只要保持各个图片采用相同的方式展开就可以了。

因此，在MNIST训练数据集中，`mnist.train.images` 是一个形状为 `[60000, 784]` 的张量，第一个维度数字用来索引图片，第二个维度数字用来索引每张图片中的像素点。在此张量里的每一个元素，都表示某张图片里的某个像素的强度值，值介于0和1之间。

![mnist.train.images](https://upload-images.jianshu.io/upload_images/5666077-0a83e428622c1389.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

相对应的MNIST数据集的标签是介于0到9的数字，用来描述给定图片里表示的数字。为了用于这个教程，我们使标签数据是"one-hot vectors"。 一个`one-hot`向量除了某一位的数字是1以外其余各维度数字都是0。所以在此教程中，数字n将表示成一个只有在第n维度（从0开始）数字为1的10维向量。比如，标签0将表示成([1,0,0,0,0,0,0,0,0,0,0])。因此， `mnist.train.labels` 是一个 `[60000, 10]` 的数字矩阵。

![mnist.train.labels](http://upload-images.jianshu.io/upload_images/5666077-33d890b038990c3a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

现在，我们准备好可以开始构建我们的模型啦！

## Softmax回归介绍
>（因为这段很枯燥，而且我也解释不太好，所以干脆直接从Tensorflow的网站上复制粘贴来了，如果不想看的可以直接跳过到模型实现，最后写代码的时候只要知道用softmax函数就可以了）

我们知道MNIST的每一张图片都表示一个数字，从0到9。我们希望得到给定图片代表每个数字的概率。比如说，我们的模型可能推测一张包含9的图片代表数字9的概率是80%但是判断它是8的概率是5%（因为8和9都有上半部分的小圆），然后给予它代表其他数字的概率更小的值。

这是一个使用softmax回归（softmax regression）模型的经典案例。softmax模型可以用来给不同的对象分配概率。即使在之后，我们训练更加精细的模型时，最后一步也需要用softmax来分配概率。

softmax回归（softmax regression）分两步：第一步

为了得到一张给定图片属于某个特定数字类的证据（evidence），我们对图片像素值进行加权求和。如果这个像素具有很强的证据说明这张图片不属于该类，那么相应的权值为负数，相反如果这个像素拥有有利的证据支持这张图片属于这个类，那么权值是正数。

下面的图片显示了一个模型学习到的图片上每个像素对于特定数字类的权值。红色代表负数权值，蓝色代表正数权值。

![](https://upload-images.jianshu.io/upload_images/5666077-7083c239f3187d37.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们也需要加入一个额外的偏置量（bias），因为输入往往会带有一些无关的干扰量。因此对于给定的输入图片 **x** 它代表的是数字 **i** 的证据可以表示为

![](http://upload-images.jianshu.io/upload_images/5666077-7cf005141e7aefd0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中 `$W_i$` 代表权重，`$b_i$` 代表数字 **i** 类的偏置量，**j** 代表给定图片 **x** 的像素索引用于像素求和。然后用softmax函数可以把这些证据转换成概率 **y**：

![](http://upload-images.jianshu.io/upload_images/5666077-30ff0e52c4f8fca2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里的softmax可以看成是一个激励（activation）函数或者链接（link）函数，把我们定义的线性函数的输出转换成我们想要的格式，也就是关于10个数字类的概率分布。因此，给定一张图片，它对于每一个数字的吻合度可以被softmax函数转换成为一个概率值。softmax函数可以定义为：

![](http://upload-images.jianshu.io/upload_images/5666077-a12f5cc5a5e3a531.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

展开等式右边的子式，可以得到：

![](http://upload-images.jianshu.io/upload_images/5666077-e6ab587fa09a9a89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是更多的时候把softmax模型函数定义为前一种形式：把输入值当成幂指数求值，再正则化这些结果值。这个幂运算表示，更大的证据对应更大的假设模型（hypothesis）里面的乘数权重值。反之，拥有更少的证据意味着在假设模型里面拥有更小的乘数系数。假设模型里的权值不可以是0值或者负值。Softmax然后会正则化这些权重值，使它们的总和等于1，以此构造一个有效的概率分布。（更多的关于Softmax函数的信息，可以参考Michael Nieslen的书里面的这个[部分](http://neuralnetworksanddeeplearning.com/chap3.html#softmax)，其中有关于softmax的可交互式的可视化解释。）

对于softmax回归模型可以用下面的图解释，对于输入的`xs`加权求和，再分别加上一个偏置量，最后再输入到softmax函数中：

![](https://upload-images.jianshu.io/upload_images/5666077-557513ac4d2082ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果把它写成一个等式，我们可以得到：

![](http://upload-images.jianshu.io/upload_images/5666077-0520bdcf138d9bc4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们也可以用向量表示这个计算过程：用矩阵乘法和向量相加。这有助于提高计算效率。（也是一种更有效的思考方式）

![](https://upload-images.jianshu.io/upload_images/5666077-9caa41f27aaff842.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

更进一步，可以写成更加紧凑的方式：

![](http://upload-images.jianshu.io/upload_images/5666077-73d3acf5e95009f3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 实现模型
在使用TensorFlow之前，首先导入它：
```python
import tensorflow as tf
```
然后导入数据集并载入数据

```python
from tensorflow.examples.tutorials.mnist import input_data

# 载入数据
mnist = input_data.read_data_sets("MNIST_data", one_hot=True)
```

我们通过操作符号变量来描述这些可交互的操作单元，可以用下面的方式创建一个：

```python
x = tf.placeholder(tf.float32, [None, 784])
```

`x`不是一个特定的值，而是一个占位符`placeholder`，我们在TensorFlow运行计算时输入这个值。我们希望能够输入任意数量的MNIST图像，每一张图展平成784维的向量。我们用2维的浮点数张量来表示这些图，这个张量的形状是`[None，784 ]`。（这里的`None`表示此张量的第一个维度可以是任何长度的。）

我们的模型也需要权重和偏量，当然我们可以把它们当做是另外的输入（使用占位符），但TensorFlow有一个更好的方法来表示它们：`Variable` 。 一个`Variable`代表一个可修改的张量，存在在TensorFlow的用于描述交互性操作的图中。它们可以用于计算输入值，也可以在计算中被修改。对于各种机器学习应用，一般都会有模型参数，可以用`Variable`表示。

```python
W = tf.Variable(tf.zeros([784,10]))
b = tf.Variable(tf.zeros([10]))
```

我们赋予`tf.Variable`不同的初值来创建不同的`Variable`：在这里，我们都用全为零的张量来初始化`W`和`b`。因为我们要学习`W`和`b`的值，它们的初值可以随意设置。

注意，`W`的维度是[784，10]，因为我们想要用784维的图片向量乘以它以得到一个10维的证据值向量，每一位对应不同数字类。`b`的形状是[10]，所以我们可以直接把它加到输出上面。

现在，我们可以实现我们的模型啦。只需要一行代码！

```python
prediction = tf.nn.softmax(tf.matmul(x, W)+b)
```

首先，我们用`tf.matmul(X，W)`表示`x`乘以`W`，对应之前等式里面的Wx，这里`x`是一个2维张量拥有多个输入。然后再加上`b`，把和输入到`tf.nn.softmax`函数里面。

## 训练模型

为了训练我们的模型，我们首先需要定义一个指标来评估这个模型是好的。其实，在机器学习，我们通常定义指标来表示一个模型是坏的，这个指标称为成本（cost）或损失（loss），然后尽量最小化这个指标。但是，这两种方式是相同的。损失函数有很多种，在这里我们采用**平方损失函数**，通常我们会用均方差（MSE）作为衡量指标，公式如下：$MSE=\frac{1}{n}\sum_{i=1}^{n}\ (y-prediction)^2$

为了计算损失函数，我们首先需要添加一个新的占位符用于输入正确值：

```python
y = tf.placeholder(tf.float32, [None, 10])
```

然后定义损失函数（loss）：

```python
# 二次代价函数
loss = tf.reduce_mean(tf.square(y-prediction))
```

这段代码的含义我在上一篇笔记中已经介绍过了，不清楚的推荐阅读[TensorFlow笔记（2）——利用TensorFlow训练一个最简单的一元线性模型](https://juejin.im/post/5c014ff6f265da6149335fe9)

然后使用优化算法来不断的修改变量来降低损失值：

```
# 使用梯度下降法
train_step = tf.train.GradientDescentOptimizer(0.1).minimize(loss)
```

在这里，我们要求TensorFlow用梯度下降算法（gradient descent algorithm）以0.01的学习速率最小化交叉熵。梯度下降算法（gradient descent algorithm）是一个简单的学习过程，TensorFlow只需将每个变量一点点地往使成本不断降低的方向移动。当然TensorFlow也提供了[其他许多优化算法](http://www.tensorfly.cn/tfdoc/api_docs/python/train.html#optimizers)：只要简单地调整一行代码就可以使用其他的算法。

TensorFlow在这里实际上所做的是，它会在后台给描述你的计算的那张图里面增加一系列新的计算操作单元用于实现反向传播算法和梯度下降算法。然后，它返回给你的只是一个单一的操作，当运行这个操作时，它用梯度下降算法训练你的模型，微调你的变量，不断减少成本。

现在，我们已经设置好了我们的模型。在运行计算之前，我们需要添加一个操作来初始化我们创建的变量：

```python
# 初始化变量
init = tf.global_variables_initializer()
```

接下来我们就可以定义一个会话了，并在该会话中执行初始化变量的操作：

```python
with tf.Session() as sess:
    sess.run(init)
```

然后开始训练模型，我们需要先定义一个批次`batch_size`，因为我们在训练的时候不可能每次都只放一张图片进入神经网络（因为这样太慢了），批次为100在这表示的就是我们一次放入100张图片进入神经网络，然后我们需要计算一共会有多少个批次：

```python
# 每个批次的大小
batch_size = 100
# 计算一共有多少个批次
n_batch = mnist.train.num_examples // batch_size
```

然后我们让模型循环训练30次:

```python
with tf.Session() as sess:
    sess.run(init)
    for epoch in range(30):
        for batch in range(n_batch):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys})
```

该循环的每个步骤中，我们都会随机抓取训练数据中的`n_batch`个批处理数据点，然后我们用这些数据点作为参数替换之前的占位符来运行`train_step`。

使用一小部分的随机数据来进行训练被称为随机训练（stochastic training）- 在这里更确切的说是随机梯度下降训练。在理想情况下，我们希望用我们所有的数据来进行每一步的训练，因为这能给我们更好的训练结果，但显然这需要很大的计算开销。所以，每一次训练我们可以使用不同的数据子集，这样做既可以减少计算开销，又可以最大化地学习到数据集的总体特性。

## 评估我们的模型

那么我们的模型性能如何呢？

首先让我们找出那些预测正确的标签。`tf.argmax` 是一个非常有用的函数，它能给出某个tensor对象在某一维上的其数据最大值所在的索引值。由于标签向量是由0,1组成，因此最大值1所在的索引位置就是类别标签，比如`tf.argmax(y,1)`返回的是模型对于任一输入x预测到的标签值，而 `tf.argmax(prediction,1)` 代表正确的标签，我们可以用 `tf.equal` 来检测我们的预测是否真实标签匹配(索引位置一样表示匹配)。

```python
# 结果存放在一个布尔型列表中
# argmax返回一维张量中最大的值所在的位置
correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(prediction, 1))
```

这行代码会给我们一组布尔值。为了确定正确预测项的比例，我们可以把布尔值转换成浮点数，然后取平均值。例如，`[True, False, True, True]` 会变成 `[1,0,1,1]` ，取平均值后得到 `0.75`.

```python
# 求准确率
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
```

最后，我们计算所学习到的模型在测试数据集上面的正确率。

```python
with tf.Session() as sess:
    sess.run(init)
    for epoch in range(30):
        for batch in range(n_batch):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys})
        acc = sess.run(accuracy, feed_dict={
                       x: mnist.test.images, y: mnist.test.labels})
        print("Iter "+str(epoch)+",Testing Accuracy "+str(acc))
```

最终结果如下图所示，精确度大约在90%

![image-20181204162301761](https://ws1.sinaimg.cn/large/006tNbRwgy1fxusgjtmjfj30cy0nedjr.jpg)

## 完整代码

我加了datetime这个包，目的是为了计算代码的执行时间，不影响阅读。

```python
import datetime

# 3.2 MNIST数据集分类简单版本
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

start = datetime.datetime.now()

# 载入数据
mnist = input_data.read_data_sets("MNIST_data", one_hot=True)
# 每个批次的大小
batch_size = 100
# 计算一共有多少个批次
n_batch = mnist.train.num_examples // batch_size

# 定义两个placeholder
x = tf.placeholder(tf.float32, [None, 784])
y = tf.placeholder(tf.float32, [None, 10])

# 创建一个简单的神经网络
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.zeros([10]))
prediction = tf.nn.softmax(tf.matmul(x, W)+b)

# 二次代价函数
loss = tf.reduce_mean(tf.square(y-prediction))
# 使用梯度下降法
train_step = tf.train.GradientDescentOptimizer(0.1).minimize(loss)

# 初始化变量
init = tf.global_variables_initializer()

# 结果存放在一个布尔型列表中
# argmax返回一维张量中最大的值所在的位置
correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(prediction, 1))
# 求准确率
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

with tf.Session() as sess:
    sess.run(init)
    for epoch in range(30):
        for batch in range(n_batch):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys})
        acc = sess.run(accuracy, feed_dict={
                       x: mnist.test.images, y: mnist.test.labels})
        print("Iter "+str(epoch)+",Testing Accuracy "+str(acc))

end = datetime.datetime.now()
print((end-start).seconds)
```

