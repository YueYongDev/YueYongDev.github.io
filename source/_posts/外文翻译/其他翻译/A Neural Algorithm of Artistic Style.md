---
title: 【译】一种有关艺术风格迁移的神经网络算法
categories:
  - 外文翻译
tags:
  - Machine Learning
  - 其他翻译
abbrlink: 7b87
cover: https://ws3.sinaimg.cn/large/006tNc79ly1g21aijzieij318g0mu79n.jpg
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1g21aijzieij318g0mu79n.jpg)

**在艺术领域， 尤其是绘画创作上， 人们已经掌握了一种可以创造独一无二视觉体验的能力， 那就是通过将一张图片的内容和风格之间构成某种复杂的关系。 到目前为止， 该过程的算法基础是未知的， 并且不存在具有类似能力的人工系统。 然而， 受到一种名为深度神经网络的视觉模型的启发， 在视觉感知的其他关键领域， 例如物体和人脸识别， 仿生学的效果已经可以接近人类的表现。 这里我们将会介绍一个基于深度神经网络的人工系统， 它可以生成具有高感知品质的艺术图片。 该系统使用神经表示来分离和重组任意图像的内容和风格， 提供了一种创建艺术图像的神经算法。 而且, 按照要去表现最优的人工神经网络和生物视觉中找到相同. 我们的工作提供了人类是怎样创作和认知艺术图像的算法理解。 此外， 鉴于性能优化的人工神经网络与生物视觉之间惊人的相似性， 我们的工作为算法理解人类如何创造和感知艺术形象提供了一条前进的道路。 **

处理图像任务最有效的深度神经网络是卷积神经网络。 卷积神经网络由小型计算单元层组成， 以前馈方式分层处理视觉信息（图 1）。 每层单元可以理解为图像过滤器的集合（a collection of image filters）， 每个图像过滤器从输入图像中提取特定特征。 因此， 一个给定层的输出包括所谓的特征映射（feature maps）： 它们是对输入的图像进行不同类型的过滤得到的。

当卷积神经网络被训练用于物体识别时， 会生成一个图像的表征(representations) ， 随着处理层级的上升， 物体的信息越来越明确。 因此， 随着神经网络中的层级一级一级地被处理， 输入的图像会被转换成一种表征， 与图片的像素细节相比， 这种表征会越来越关注图片的实际内容。 通过对某一层的提取出来的 feaure map 的重塑， 我们可以直接看到该层包含的图片信息。 层级越高， 那么获取的图像中物体内容就越高质量， 并且没有确切的像素值的约束（层级越高， 像素丢失越多）。 相反， 在低层级中重塑的话， 其实像素丢失地很少。 所以我们参考的是神经网络高层的特征， 用它来作为图片内容的表征。

为了获取输入图像的风格表征， 我们用一个特征空间去捕获纹理的信息。 这个特征空间建立在每层神经网络的过滤响应之上（也就是上面提到的 feature map)。 在 feature map 的空间范围上(也就是同一层上的 feature map)， 过滤响应各有不同（feature map 关注的特征不同）， 而这个特征空间就是由这些差异构成。 通过对每一层 featute map 两两求相关性， 我们会获得一个静态的， 多尺度的图像表征， 这也就捕获到了图像的纹理信息， 但这纹理信息并非全局的。

![](https://ws1.sinaimg.cn/large/006tNc79ly1g21b3t2kjqj30vi0m8k98.jpg)

> 图 1 ： **卷积神经网络 (CNN)**。 一张给定的输入图像， 会在卷积神经网络的各层以一系列过滤后的图像表示。 随着层级的一层一层处理， 过滤后的图片会通过向下取样的方式不断减小（比如通过池化层）。 这使得每层神经网络的神经元数量会逐步减少。 **内容重构。 **在只知道该层输出结果的情况下， 通过重塑输入图像， 我们可以看到 CNN 不同阶段的图像信息。 我们在原始的 VGG-Network 上的 5 个层级： `conv1_1,conv1_2,conv1_3,conv1_4,conv1_5` 上重塑了输入的图像。 （输入的图像是上图中的一排房子， 5 个层级分别是 a, b, c, d, e ）我们发现在较低层的图像重构（如 abc）非常完美； 在较高层（de）， 详细的像素信息丢失了。 也就是说， 在这个过程中， 我们提取出了图片的内容， 抛弃了像素。 **风格重构。 **在原始的 CNN 表征之上， 我们建立了一个新的特征空间(feature space)， 用于捕获输入图像的风格。 风格的表征计算了在 CNN 的不同层级间不用特征之间的相似性。 通过在 CNN 隐层的不同的**子集**上建立起来的风格的表征， 我们重构输入图像的风格。 如此， 便创造了与输入图像一致的风格而丢弃了全局的内容。

> Tips： 上述的子集为：

>

> `‘conv1 1’ (a)`

>

> `‘conv1 1’ and ‘conv2 1’ (b)`

>

> `‘conv1 1’, ‘conv2 1’ and ‘conv3 1’ (c)`

>

> `‘conv1 1’, ‘conv2 1’, ‘conv3 1’ and ‘conv4 1’ (d)`

>

> `‘conv1 1’, ‘conv2 1’, ‘conv3 1’, ‘conv4 1’and ‘conv5 1’ (e)`

于是， 我们也可以在 CNN 的各层中利用风格特征空间所捕获的信息来重构图像。 事实上， 重塑风格特征就是通过捕获图片的颜色、 结构等等生产出输入的图像的纹理的版本。 另外， 随着层级的增加， 图像结构的大小和复杂度也会增加。 我们将这多尺度的表征称为**风格表征**。

本文关键的发现是对于内容和风格的表征在 CNN 中是可以分开的。 也就是说， 我们可以独立地操作两个表征来产生新的、 可感知的有意义的图像。 为了展示这个发现， 我们生成了一些混合了不同源图片的内容和风格表征的图片。 确切的说， 我们将著名艺术画“星空”的风格， 和一张德国拍的照片的内容混合起来了。

我们寻找这样一张图片， 它同时符合照片的内容表征， 和艺术画的风格表征。 原始照片的整体布局被保留了， 而颜色和局部的结构却由艺术画提供。 如此一来， 原来的那张风景照旧像极了艺术作品。

![](https://ws1.sinaimg.cn/large/006tNc79ly1g21b4vcbtpj30u00xzu0y.jpg)

> 图 2:图中描述的是将照片内容与几种知名艺术品的风格相结合的图像。 通过找到同时匹配照片的内容表征和艺术品的风格表征的图像来创建新的图像。 （译者注： 下面都是图片的来源， 这里就直接省略了）

正如概述所言, 风格表征是一个多层次的表征， 包含多层神经网络。 在图 2 中展示的图片中， 这个风格表征包括了整个神经网络结构的各个层次。 风格也可以被定义为更为局部化， 因为它只包含了少量的低层结构。 这些结构能产生不同的视觉效果(图 3, along the rows)。 若符合了较高层级中的风格表征， 局部的图像结构会大规模地增加， 从而使得图像在视觉上更平滑与连贯。 因此， 看起来美美的图片通常是来自于符合了较高层级的风格表征。

当然， 图片内容和风格不能被完全分离。 当风格与内容来自不同的两个图像时， 这个被合成的新图像并不存在在同一时刻完美地符合了两个约束。 但是， 在图像合成中最小化的损失函数分别包括了内容与风格两者， 它们被很好地分开了。 所以， 我们可以平滑地将重点既放在内容上又放在风格上（可以从图 3 的一列中看出）。 将重点过多地放在风格上会导致图像符合艺术画的外观， 有效地给出了画的纹理， 但是几乎看不到照片的内容了（图 3 第一列）。 而将重点过多地放在内容上， 我们可以清晰地看到照片， 但是风格就不那么符合艺术画了。 因此， 我们要不断协调图片的内容与风格， 这样才能产生视觉上有感染力的图片。

在这里， 我们提出了一种人工神经系统， 它实现了图像内容与风格的分离， 从而允许以任何其他图像的风格重铸一个图像的内容。 我们通过创造新的艺术图像来展示这一点， 这些图像将几种着名绘画的风格与任意选择的照片的内容相结合。 特别地， 我们从在物体识别上训练的高性能深度神经网络的特征响应来获取图像的内容和样式的神经表征。

在之前的研究中， 是通过评估复杂度小很多的感官输入来将内容与风格分离的。 比如说通过不同的手写字， 人脸图， 或者指纹。
而在我们的展示中， 我们给出了一个有着著名艺术作品风格的照片。 这个问题常常会更靠近与计算机视觉的一个分支–真实感渲染。 理论上更接近于利用纹理转换来获取艺术风格的转换。 但是， 这些以前的方法主要依赖于非参数的技术并且直接对图像表征的像素进行操作。 相反， 通过在物体识别上训练深度神经网络， 我们在特征空间上进行相关操作， 从而明确地表征了图像的高质量内容。

神经网络在物体识别中产生的特征先前就已经被用来做风格识别， 为的是根据艺术作品的创作时期来为作品分类。 分类器是在原始的网络上被训练的， 也就是我们现在叫的内容表征。 我们猜测静态特征空间的转换， 比如我们的风格表征也许可以在风格分类上有更好的表现。

通常来说， 我们这种合成图像的方法提供了一个全新的迷人的工具用于学习艺术， 风格和独立于内容的图像外观的感知与神经表征。 总之， 一个神经网络可以学习图像的表征， 是的图像内容与风格的分离成为可能， 是如此激动人心。 若要给出解释的话， 就是当学习物体识别到时候， 神经网络对所有图像的变化都能保持不变从而保留了物体的特性。

# 方法（Methods）

本文展示的结果是基于 VGG 网络训练的。 他是一种卷积神经网络， 在常见的视觉对象识别基准任务上， 其表现可以和人类的表现相媲美， 因此广受好评并被多方介绍和使用。 我们使用由 19 层的 VGG 神经网络（16 个卷积和 5 个池化层）提供的特征空间， 并且没有使用到全连接层。 这个模型是开源的， 并且可以在 caffe 这个深度学习框架中使用。 对于图像合成， 我们发现用均值池化层代替最大值池化层会提高梯度流， 并且得到更加完美的结果。 所以本案例中我们用的是**均值池化**。

事实上网络的每一层都定义了一个非线性的过滤器组， 它的复杂性随着在网络中所在层的位置而增加。 因此一个给定的输入图片 $\vec{x}$ ， 在 CNN 的每层都会被过滤器编码。 一个有$N_l$个不同的过滤器的隐藏层有$N_l$个 feature map（每个神经元输出一个 feature map)。 每个 feature map 的大小是$M_l$， $M_l$是 feature map 高乘以宽的大小。 所以一个层 $l$ 的输出可以存储为矩阵： $F^{l} \in \mathcal{R}^{N_{l} \times M_{l}}$， 其中 $F_{i j}^{l}$ 表示在 $l$ 层的位置 $j$ 上的第 $i$ 个过滤器的激活结果。 为了可视化不同层级中的图像信息， 我们在一个白噪声上使用梯度下降来找到另一个图像， 它与原始图像的特征输出结果相符合(白噪声上的图像其实就是定义一个随机的新图， 然后通过梯度下降不断迭代， 不断更新这个新图）。 所以让 $\vec{p} \text { and } \vec{x}$ 作为原始图像和后来产生的图像， $P^{l} \text { and } F^{l}$ 是他们在层 $l$ 各自的特征表征。 然后我们定义两个特征表征之间的平方误差损失。

$$
\mathcal{L}_{\text {content}}(\vec{p}, \vec{x}, l)=\frac{1}{2} \sum_{i, j}\left(F_{i j}^{l}-P_{i j}^{l}\right)^{2}
$$

这个损失函数的导数是： （针对 F 求导）

$$
\frac{\partial \mathcal{L}_{\text {content}}}{\partial F_{i j}^{l}}=\left\{\begin{array}{ll}{\left(F^{l}-P^{l}\right)_{i j}} & {\text { if } F_{i j}^{l}>0} \\ {0} & {\text { if } F_{i j}^{l}<0}\end{array}\right.
$$

以上公式中， 图像 $\vec{x}$ 的梯度可以通过标准误差的后向计算传播。 因此我们可以改变初始的随机图像 $\vec{x}$ ， 直到它产生了在 CNN 中与原始图像 $\vec{p}$ 一样的输出结果。 在图 1 中的 5 个内容重构来自于原始 VGG 的 `‘conv1 1’ (a), ‘conv2 1’ (b), ‘conv3 1’ (c), ‘conv4 1’ (d) and ‘conv5 1’(e)`

另外， 我们通过计算不同过滤器输出结果之间的差异， 来计算相似度。 我们期望获得输入图片空间上的衍生。 这些特征的相似性用 $G^{l} \in \mathcal{R}^{N_{l} \times N_{l}}$ 表示。 其中 $G_{i j}^{l}$ 来源于层 $l$ 中矢量的 feature map $i$ 和 $j$ 。

$$
G_{i j}^{l}=\sum_{k} F_{i k}^{l} F_{j k}^{l}
$$

> Tips： 解释一下上面讲的， 就是将艺术画也放进 CNN 中， 比如输出也是 14x14x256 的一个矩阵， 然后将 256 个 14x14 的 feature map 两两求相似性， 这里是两两相乘， 于是会得带 256x256 的一个特征空间矩阵， G 就是这个特征空间

为了生成符合给定艺术作品风格的纹理， 我们对一个带有白噪声的图像（也就是我们定义的随机的新图）做梯度下降， 从而去寻找另一个图像， 使得这个图像符合艺术画的风格表征。 而这个梯度下降的过程是通过使得原始图像（艺术画）的 Gram 矩阵和被生成的图像（新图）的 Gram 矩阵的距离的均方误差最小化得到的。 因此， 令 $\vec{a} \text { and } \vec{x}$ 分别作为原始艺术图像与被生成的图像， $A^{l} \text { and } G^{l} $ 分别作为层 $l$ 的两个风格表征。 层 $l$ 对于总损失的贡献是：

$$
E_{l}=\frac{1}{4 N_{l}^{2} M_{l}^{2}} \sum_{i, j}\left(G_{i j}^{l}-A_{i j}^{l}\right)^{2}
$$

而总损失用公式表达为：

$$
\mathcal{L}_{s t y l e}(\vec{a}, \vec{x})=\sum_{l=0}^{L} w_{l} E_{l}
$$

其中 $w_l$ 表示每一层对于总损失的贡献的权重因子。 $E_t$的导数可以这样计算：

$$
\frac{\partial E_{l}}{\partial F_{i j}^{l}}=\left\{\begin{array}{ll}{\frac{1}{N_{l}^{2} M_{l}^{2}}\left(\left(F^{l}\right)^{\mathrm{T}}\left(G^{l}-A^{l}\right)\right)_{j i}} & {\text { if } F_{i j}^{l}>0} \\ {0} & {\text { if } F_{i j}^{l}<0}\end{array}\right.
$$

$E_l$ 在低层级的梯度可以很方便地通过标准误差后向传播计算出来。 在图 1 中 5 个风格的重塑可以通过满足一下这些层的风格表征来生成： `‘conv1 1’ (a), ‘conv2 1’ (b), ‘conv3 1’ (c), ‘conv4 1’ (d) and ‘conv5 1’(e)` 。

为了生成混合了照片内容和艺术画风格的新图像， 我们需要最小化风格损失与内容损失。 所以令$\vec{p}$ 表示内容图片， $\vec{a}$表示风格图片， 那么我们需要最小化的损失函数是：

$$
\mathcal{L}_{\text {total}}(\vec{p}, \vec{a}, \vec{x})=\alpha \mathcal{L}_{\text {content}}(\vec{p}, \vec{x})+\beta \mathcal{L}_{\text {style}}(\vec{a}, \vec{x})
$$

α 和 β 分别是内容和风格在图像重构中的权重因子。 对于在图像 2 中展示的图片， 我们在’conv4_2‘层匹配到了内容表征， 在‘conv1 1’, ‘conv2 1’, ‘conv3 1’, ‘conv4 1’ 和 ‘conv5 1’层匹配到了样式表征（在这些层， $w_l=1/5$， 在其他层$w_l=0$）。 在图 2 的 BCD 中， α/β 的比值为$1 \times 10^{-3}$， 在图二的 E， F 中， 这个比值为$1 \times 10^{-4}$， 图 3 展示了一个结果： 即沿着列不断调整内容和风格的损失， 相对应的风格表征在下面几个层所发生的变化。 这几个层分别是： `‘conv1 1’ (A), ‘conv1 1’ and ‘conv2 1’ (B), ‘conv1 1’, ‘conv2 1’ and ‘conv3 1’ (C),‘conv1 1’, ‘conv2 1’, ‘conv3 1’ and ‘conv4 1’ (D), ‘conv1 1’, ‘conv2 1’, ‘conv3 1’, ‘conv4 1’ 和 ‘conv5 1’ (E)` 。 因子 $w_l$ 总是等于 1 除以具有非零损失权值 $w_l$ 的活动层数。

> （参考）Tips： α+β=1。 如果 α 比较大， 那么输出后的新图会更多地倾向于内容上的吻合， 如果 β 较大， 那么输出的新图会更倾向于与风格的吻合。 这两个参数是一个 trade-off, 可以根据自己需求去调整最好的平衡。 论文的作者给出了它调整参数的不同结果， 如图 3， 从左到右四列分别是 α/β = 10^-5, 10^-4, 10^-3, 10^-2. 也就是 α 越来越大， 的确图像也越来越清晰地呈现出了照片的内容。

![](https://ws4.sinaimg.cn/large/006tNc79ly1g21b7j4g9xj30vq0u0npe.jpg)

> 图 3： Wassily Kandinsky 的作品 _Composition VII_ 的风格的详细结果。 这些行显示了匹配 CNN 图层增加子集的样式表示的结果（详见 Methods）。 我们发现， 当包含来自网络较高层的样式特征时， 由风格表征捕获的局部图像结构在尺寸和复杂性上增加。 这可以解释为是由于沿成网络处理的结构感受域的大小和特征复杂性增加。 每一列展示了内容和样式重建之间取不同权重的结果。 每列上方的数字表示强调匹配照片内容和艺术品风格之间的比率 α/β（详见 Methods）。

**鸣谢** 这项工作由德国国家学术基金会(L. A. G.)， 伯恩斯坦计算神经科学中心（FKZ 01GQ1002）和德国国际神经科学研究中心（EXC307）（M. B., A. S. E, L. A. G）资助。

# References and Notes

1. Krizhevsky, A., Sutskever, I. & Hinton, G. E. Imagenet classification with deep convolutional neural networks. In Advances in neural information processing systems, 1097–1105(2012). URL [http://papers.nips.cc/paper/4824-imagenet](https://link.jianshu.com?t=http://papers.nips.cc/paper/4824-imagenet).
2. Taigman, Y., Yang, M., Ranzato, M. & Wolf, L. Deepface: Closing the gap to human-level performance in face verification. In Computer Vision and Pattern Recognition (CVPR), 2014 IEEE Conference on, 1701–1708 (IEEE, 2014). URL [http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6909616](https://link.jianshu.com?t=http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6909616).
3. G ̈uc ̧l ̈u, U. & Gerven, M. A. J. v. Deep Neural Networks Reveal a Gradient in the Complexity of Neural Representations across the Ventral Stream. The Journal of Neuroscience 35, 10005–10014 (2015). URL [http://www.jneurosci.org/content/35/27/10005](https://link.jianshu.com?t=http://www.jneurosci.org/content/35/27/10005).
4. Yamins, D. L. K. et al. Performance-optimized hierarchical models predict neural responses in higher visual cortex. Proceedings of the National Academy of Sciences 201403112 (2014). URL

   [http: //www.pnas.org/content/early/2014/05/08/1403112111](https://link.jianshu.com?t=http://www.pnas.org/content/early/2014/05/08/1403112111).

5. Cadieu, C. F. et al. Deep Neural Networks Rival the Representation of Primate IT Cortex for Core Visual Object Recognition. PLoS Comput Biol 10, e1003963 (2014). URL

   [http: //dx.doi.org/10.1371/journal.pcbi.1003963](https://link.jianshu.com?t=http://dx.doi.org/10.1371/journal.pcbi.1003963).

6. K ̈ummerer, M., Theis, L. & Bethge, M. Deep Gaze I: Boosting Saliency Prediction with Feature Maps Trained on ImageNet. In ICLR Workshop (2015). URL /media/publications/1411.1045v4.pdf.
7. Khaligh-Razavi, S.-M. & Kriegeskorte, N. Deep Supervised, but Not Unsupervised, Models May Explain IT Cortical Representation. PLoS Comput Biol 10, e1003915 (2014). URL

   [http: //dx.doi.org/10.1371/journal.pcbi.1003915](https://link.jianshu.com?t=http://dx.doi.org/10.1371/journal.pcbi.1003915).

8. Gatys, L. A., Ecker, A. S. & Bethge, M. Texture synthesis and the controlled generation of natural stimuli using convolutional neural networks. arXiv:1505.07376 [cs, q-bio](2015). URL [http://arxiv.org/abs/1505.07376](https://link.jianshu.com?t=http://arxiv.org/abs/1505.07376). ArXiv: 1505.07376.
9. Mahendran, A. & Vedaldi, A. Understanding Deep Image Representations by Inverting Them. arXiv:1412.0035 [cs](2014). URL [http://arxiv.org/abs/1412.0035](https://link.jianshu.com?t=http://arxiv.org/abs/1412.0035). ArXiv: 1412.0035.
10. Heeger, D. J. & Bergen, J. R. Pyramid-based Texture Analysis/Synthesis. In Proceedings of the 22Nd Annual Conference on Computer Graphics and Interactive Techniques, SIGGRAPH ’95, 229–238 (ACM, New York, NY, USA, 1995). URL [http://doi.acm.org/10.1145/218380.218446](https://link.jianshu.com?t=http://doi.acm.org/10.1145/218380.218446).
11. Portilla, J. & Simoncelli, E. P. A Parametric Texture Model Based on Joint Statistics of Complex Wavelet Coefficients. International Journal of Computer Vision 40, 49–70 (2000). URL

    [http: //link.springer.com/article/10.1023/A%3A1026553619983](https://link.jianshu.com?t=http://link.springer.com/article/10.1023/A%3A1026553619983).

12. Tenenbaum, J. B. & Freeman, W. T. Separating style and content with bilinear models. Neural computation 12, 1247–1283 (2000). URL [http://www.mitpressjournals.org/doi/abs/10.1162/089976600300015349](https://link.jianshu.com?t=http://www.mitpressjournals.org/doi/abs/10.1162/089976600300015349).
13. Elgammal, A. & Lee, C.-S. Separating style and content on a nonlinear manifold. In Computer Vision and Pattern Recognition, 2004. CVPR 2004. Proceedings of the 2004 IEEE Computer Society Conference on, vol. 1, I–478 (IEEE, 2004). URL [http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=1315070](https://link.jianshu.com?t=http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=1315070).
14. Kyprianidis, J. E., Collomosse, J., Wang, T. & Isenberg, T. State of the ”Art”: A Taxonomy of Artistic Stylization Techniques for Images and Video. Visualization and Computer 14Graphics, IEEE Transactions on 19, 866–885 (2013). URL [http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6243138](https://link.jianshu.com?t=http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6243138).
15. Hertzmann, A., Jacobs, C. E., Oliver, N., Curless, B. & Salesin, D. H. Image analogies. In Proceedings of the 28th annual conference on Computer graphics and interactive techniques, 327–340 (ACM, 2001). URL

    [http: //dl.acm.org/citation.cfm?id=383295](https://link.jianshu.com?t=http://dl.acm.org/citation.cfm?id=383295).

16. Ashikhmin, N. Fast texture transfer. IEEE Computer Graphics and Applications 23, 38–43(2003).
17. Efros, A. A. & Freeman, W. T. Image quilting for texture synthesis and transfer. In Proceedings of the 28th annual conference on Computer graphics and interactive techniques, 341–346 (ACM, 2001). URL [http://dl.acm.org/citation.cfm?id=383296](https://link.jianshu.com?t=http://dl.acm.org/citation.cfm?id=383296).
18. Lee, H., Seo, S., Ryoo, S. & Yoon, K. Directional Texture Transfer. In Proceedings of the 8th International Symposium on Non-Photorealistic Animation and Rendering, NPAR ’10, 43–48 (ACM, New York, NY, USA, 2010). URL [http://doi.acm.org/10.1145/1809939.1809945](https://link.jianshu.com?t=http://doi.acm.org/10.1145/1809939.1809945).
19. Xie, X., Tian, F. & Seah, H. S. Feature Guided Texture Synthesis (FGTS) for Artistic Style Transfer. In Proceedings of the 2Nd International Conference on Digital Interactive Media in Entertainment and Arts, DIMEA ’07, 44–49 (ACM, New York, NY, USA, 2007). URL [http://doi.acm.org/10.1145/1306813.1306830](https://link.jianshu.com?t=http://doi.acm.org/10.1145/1306813.1306830).
20. Karayev, S. et al. Recognizing image style. arXiv preprint arXiv:1311.3715 (2013). URL

    [http: //arxiv.org/abs/1311.3715](https://link.jianshu.com?t=http://arxiv.org/abs/1311.3715).

21. Adelson, E. H. & Bergen, J. R. Spatiotemporal energy models for the perception of motion. JOSA A 2, 284–299 (1985). URL [http://www.opticsinfobase.org/josaa/fulltext.cfm?uri=josaa-2-2-284](https://link.jianshu.com?t=http://www.opticsinfobase.org/josaa/fulltext.cfm?uri=josaa-2-2-284).
22. Simonyan, K. & Zisserman, A. Very Deep Convolutional Networks for Large-Scale Image Recognition. arXiv:1409.1556 [cs](2014). URL [http://arxiv.org/abs/1409.1556](https://link.jianshu.com?t=http://arxiv.org/abs/1409.1556). ArXiv: 1409.1556.
23. Russakovsky, O. et al. ImageNet Large Scale Visual Recognition Challenge. arXiv:1409.0575 [cs](2014). URL [http://arxiv.org/abs/1409.0575](https://link.jianshu.com?t=http://arxiv.org/abs/1409.0575). ArXiv:1409.0575.
24. Jia, Y. et al. Caffe: Convolutional architecture for fast feature embedding. In Proceedings of the ACM International Conference on Multimedia, 675–678 (ACM, 2014). URL [http://dl.acm.org/citation.cfm?id=2654889](https://link.jianshu.com?t=http://dl.acm.org/citation.cfm?id=2654889).
