---
title: 【译】Effective TensorFlow Chapter5——在TensorFlow中， 给模型“喂”数据
categories:
  - 外文翻译
tags: [Effective TensorFlow, TensorFlow, 其他翻译]
abbrlink: 4a8e
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzpym7tmc9j30u00gwjrj.jpg)

> **本文翻译自： [《Feeding data to TensorFlow》](https://github.com/vahidk/EffectiveTensorflow#data)， 如有侵权请联系删除， 仅限于学术交流， 请勿商用。 如有谬误， 请联系指出。 **

TensorFlow 被设计用于高效地处理大量数据。 所以你需要记住的是， 千万不要“饿着”你的TF模型， 这样才能得到最好的表现。 一般来说， 有三种方法可以给你的模型“喂”数据。 

## 常量方式（**Constants**）

最简单的方式莫过于直接将数据当成常量嵌入你的计算图中， 如： 

```python
import tensorflow as tf
import numpy as np

actual_data = np.random.normal(size=[100])
data = tf.constant(actual_data)12345
```

这个方式非常高效， 但并不灵活。 一个很大的问题就是为了在其他数据集上复用你的模型， 你必须要重写你的计算图， 而且你必须同时加载所有数据， 并且一直保存在内存里， 这意味着这个方式仅仅适用于小数剧集的情况。 

## 占位符方式（**Placeholders**）

可以通过**占位符**(placeholder)的方式解决刚才常数喂养网络的问题， 如： 

```python
import tensorflow as tf
import numpy as np

data = tf.placeholder(tf.float32)
prediction = tf.square(data) + 1
actual_data = np.random.normal(size=[100])
tf.Session().run(prediction, feed_dict={data: actual_data})1234567
```

占位符操作符返回一个张量， 他的值在会话中通过人工指定的 `feed_dict` 参数得到(**fetch**)。 

> 也就是说占位符其实只是占据了数据喂养的位置而已， 而不是真正的数据， 所以在训练过程中， 如果真正需要使用这个数据， 就必须要指定合法的feed_dict， 否则将会报错。 

## 通过python操作（Python ops）

还可以通过利用python ops喂养数据： 

```python
def py_input_fn():
    actual_data = np.random.normal(size=[100])
    return actual_data

data = tf.py_func(py_input_fn, [], (tf.float32))12345
```

python ops允许你将一个常规的python函数转换成一个TF的操作。 

## 数据集API（**Dataset API**）

最值得推荐的方式就是通过TF自带的数据集API进行喂养数据， 如： 

```python
actual_data = np.random.normal(size=[100])
dataset = tf.contrib.data.Dataset.from_tensor_slices(actual_data)
data = dataset.make_one_shot_iterator().get_next()123
```

如果你需要从文件中读入数据， 以 `TFrecord` 格式读写， 并使用 `TFRecordDataset` 读取它可能会更有效， 如下所示： 

```python
dataset = tf.contrib.data.Dataset.TFRecordDataset(path_to_data)1
```

查看[官方文档](https://www.tensorflow.org/api_guides/python/reading_data#Reading_from_files)， 了解如何将你的数据集转化为 `TFrecord` 格式。 

```python
dataset = ...
dataset = dataset.cache()
if mode == tf.estimator.ModeKeys.TRAIN:
    dataset = dataset.repeat()
    dataset = dataset.shuffle(batch_size * 5)
dataset = dataset.map(parse, num_threads=8)
dataset = dataset.batch(batch_size)1234567
```

在读入数据之后， 我们使用 `Dataset.cache()` 方法， 将其缓存到内存中， 使其拥有更高的效率。 在训练过程中， 我们不断地重复数据集， 这使得我们可以多次处理整个数据集。 我们也需要打乱（**shuffle**）数据集得到batch， 这个batch将会有不同的样本分布。 下一步， 我们使用 `Dataset.map()` 方法， 对原始的数据（**raw records**）进行预处理， 将数据转换成一个模型可以识别， 利用的格式。 然后， 我们就可以通过 `Dataset.batch()` ， 创造样本的batch了。 