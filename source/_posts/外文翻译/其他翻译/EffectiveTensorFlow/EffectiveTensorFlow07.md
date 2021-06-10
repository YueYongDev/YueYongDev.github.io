---
title: 【译】Effective TensorFlow Chapter7——理解执行顺序和控制依赖
categories:
  - 外文翻译
tags: [Effective TensorFlow, TensorFlow, 其他翻译]
abbrlink: 5ed4
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzpym7tmc9j30u00gwjrj.jpg)

> **本文翻译自： [《Understanding order of execution and control dependencies》](https://github.com/vahidk/EffectiveTensorflow#control_deps)， 如有侵权请联系删除， 仅限于学术交流， 请勿商用。 如有谬误， 请联系指出。 **

正如我们刚开始提到的， TensorFlow不会立刻运行定义了的操作， 而是在计算图中创造一个相关的节点， 这个节点可以用 `Session.run()` 进行执行。 这个使得TensorFlow可以在运行时进行优化， 以此确定最佳执行顺序， 并且在运算中剔除一些不需要使用的节点。 如果你只是在计算图中使用 `tf.Tensors` ， 你就不需要担心依赖问题， 但是你更可能会使用 `tf.Variable()` ， 这个操作使得问题变得更加困难。 我的建议是如果张量不能满足这个工作需求， 那么仅仅使用 `Variables` 就足够了。 这个可能不够直观， 我们不妨先观察一个例子： 

```python
import tensorflow as tf
a = tf.constant(1)
b = tf.constant(2)
a = a + b
tf.Session().run(a)
```

正如我们期待的那样， “a”的计算结果是3。 注意下， 我们创建了3个张量， 其中包含两个常数张量和一个储存加法结果的张量。 务必注意我们不能重写一个张量的值， 如果我们想要改变张量的值， 我们就必须要创建一个新的张量， 就像我们刚才做的那样。 

> **小提示： **如果你没有定义一个新的计算图， TF将会自动地为你构建一个默认的计算图。 你可以使用 `tf.get_default_graph()` 去获得一个计算图的句柄（handle）， 然后， 你就可以查看这个计算图了。 比如， 打印这个计算图的所有张量： 

```python
print(tf.contrib.graph_editor.get_tensors(tf.get_default_graph()))
```

和 tensors 不同的是， 变量Variables可以更新， 所以让我们用变量去实现我们刚才的需求： 

```python
a = tf.Variable(1)
b = tf.constant(2)
assign = tf.assign(a, a + b)

sess = tf.Session()
sess.run(tf.global_variables_initializer())
print(sess.run(assign))
```

同样， 正如预期一样， 我们又得到了3。 注意到 `tf.assign()` 返回的代表这个赋值操作的张量。 目前为止， 所有 的操作都没有问题， 但是让我们观察一个稍微有点复杂的例子吧： 

```python
a = tf.Variable(1)
b = tf.constant(2)
c = a + b

assign = tf.assign(a, 5)

sess = tf.Session()
for i in range(10):
    sess.run(tf.global_variables_initializer())
    print(sess.run([assign, c]))
```

注意到， 张量 `c` 并没有一个确定性的值。 这个值可能是3或者7， 取决于加法和赋值操作谁先运行。 

您应该注意， 在代码中定义的操作的顺序与TensorFlow运行时无关。 唯一会影响到执行顺序的是**控制依赖**。 控制依赖对于张量来说是直接的。 每一次你在操作中使用一个张量时， 操作将会定义一个对于这个张量来说的隐式的依赖。 但是如果你同时也使用了变量， 事情就变得更糟糕了， 因为变量可以取很多值。 

当处理这些变量时， 你可能需要显式地去通过使用 `tf.control_dependencies()` 去控制依赖， 如： 

```python
a = tf.Variable(1)
b = tf.constant(2)
c = a + b

with tf.control_dependencies([c]):
    assign = tf.assign(a, 5)

sess = tf.Session()
for i in range(10):
    sess.run(tf.global_variables_initializer())
    print(sess.run([assign, c]))
```

这会确保赋值操作在加法操作之后被调用。 