---
title: TensorFlow笔记5-—优化手写数字识别模型之优化器
categories:
  - 学习笔记
tags: 
  - TensorFlow
abbrlink: 5de1
---

![](https://ws4.sinaimg.cn/large/006tNc79ly1fzpyp94c3uj30fv08ajwt.jpg)

## 什么是优化器（Optimizer）
神经网络越复杂 , 数据量越大 , 我们需要在训练神经网络的过程上花费的时间也就越多. 原因很简单, 就是因为计算量太大了. 可是往往有时候为了解决复杂的问题, 复杂的结构和大数据又是不能避免的, 所以我们需要寻找一些方法, 让神经网络聪明起来, 快起来。那些可以加速神经网络训练的方法就叫做优化器（Optimizer）
推荐阅读：[加速神经网络训练 (Speed Up Training)](https://morvanzhou.github.io/tutorials/machine-learning/ML-intro/3-06-speed-up-learning/)
## 常见的优化器
这个部分的理论知识实在太多了，我简单的整理了一点点，详见[机器学习：各种优化器Optimizer的总结与比较](https://blog.csdn.net/weixin_40170902/article/details/80092628)
下面是TensorFlow中提供的相关优化器的API 

<!--more-->

```
tf.train.GradientDescentOptimizer
tf.train.AdadeltaOptimizer
tf.train.AdagradOptimizer
tf.train.AdagradDAOptimizer
tf.train.MomentumOptimizer
tf.train.AdamOptimizer
tf.train.FtrlOptimizer
tf.train.ProximalGradientDescentOptimizer
tf.train.ProximalAdagradOptimizer
tf.train.RMSPropOptimizer
```
## 可视化比较几个优化器
### 示例1
![image](http://upload-images.jianshu.io/upload_images/5666077-7cc1ac2441d86da6?imageMogr2/auto-orient/strip)
上图比较了6种优化器收敛到目标点（五角星）的运行过程，从图中可以大致看出：
① 在运行速度方面

* 两个动量优化器Momentum和NAG的速度最快，其次是三个自适应学习率优化器AdaGrad、AdaDelta以及RMSProp，最慢的则是SGD。

② 在收敛轨迹方面
* 两个动量优化器虽然运行速度很快，但是初中期走了很长的”岔路”。
* 三个自适应优化器中，Adagrad初期走了岔路，但后来迅速地调整了过来，但相比其他两个走的路最长；AdaDelta和RMSprop的运行轨迹差不多，但在快接近目标的时候，RMSProp会发生很明显的抖动。
* SGD相比于其他优化器，走的路径是最短的，路子也比较正。
### 示例2
![image](http://upload-images.jianshu.io/upload_images/5666077-aa696a9244e75ab6?imageMogr2/auto-orient/strip)
上图在一个存在鞍点的曲面，比较6中优化器的性能表现，从图中大致可以看出：
* 三个自适应学习率优化器没有进入鞍点，其中，AdaDelta下降速度最快，Adagrad和RMSprop则齐头并进。
* 两个动量优化器Momentum和NAG以及SGD都顺势进入了鞍点。但两个动量优化器在鞍点抖动了一会，就逃离了鞍点并迅速地下降，后来居上超过了Adagrad和RMSProp。
* 很遗憾，SGD进入了鞍点，却始终停留在了鞍点，没有再继续下降。
## 如何挑选合适的优化器
其实从上述的两个可视化的例子中我们就可以看到SGD的速度应该是最慢的，但是这并不影响他是我们在实际使用中用到的最多的优化器。毕竟在实际使用中速度并不是唯一决定因素，准确率才是。 所以说：
1. 在研究调试我们的神经网络时我们可以使用一些比较快的优化器，例如：Adagrad、RMSProp等
2. 研究的差不多了，模型也搭建好了，此时如果你需要有准确的结果用来发论文等，这时候最好把每一个优化器都使用一遍，因为你也不知道究竟哪个优化器最终得到的结果是最好的，最适合你的网络。