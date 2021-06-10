---
title: 趣玩Python——利用python摇身一变社会人
categories:
  - 实战教学
tags:
  - 其他
  - python
abbrlink: 33d6
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzpyhj85psj31400u0qv5.jpg)

> 本篇文章的代码是我很久之前无意发现的，当时就觉得非常有趣，正直昨天在朋友圈被佩奇的视频刷屏，因而想着今天来蹭波热度，不喜勿喷啊😊

## 前言

相信大家的朋友圈昨天都被类似下面这样的文章刷屏了：

<img src="https://ws1.sinaimg.cn/large/006tNc79ly1fzbwrrw0l7j30m80gotc6.jpg" style="zoom:50%"/>

是的，在经历了几个月的沉寂之后，社会人“小猪佩奇”又以下面的方式重新回到了大众的视野中了！

<!-- more -->

<iframe frameborder="0" style="height:500px;width=100%;" src="https://v.qq.com/txp/iframe/player.html?vid=m0828x153iv" allowFullScreen="true"></iframe>

不知道大家看完这个视频是什么感觉，反正我看完就觉得，到底是中美合拍，这预告片是真的走心啊！所以今天我们就来用python来给视频中的爷爷解释一下“什么是佩奇啊？”👇

![](https://ws4.sinaimg.cn/large/006tNc79ly1fzbxurpeb4g30na0e04qp.gif)


## 先来认识一个“海龟”——turtle

在我们开始画一个小猪佩奇之前，先来认识一个“海龟”，说是海龟，并不是因为中美合作，而是因为他是python中的一个图像绘制库——**“turtle”**。这是他的官方地址：👉[**turtle**](https://docs.python.org/3.3/library/turtle.html?highlight=turtle)

> Turtle graphics is a popular way for introducing programming to kids. It was part of the original Logo programming language developed by Wally Feurzig and Seymour Papert in 1966.

是的，这是一个给小孩子的绘图库，那为什么要叫他“turtle”呢？把你的画笔想象成一支小乌龟，在一个横轴为x、纵轴为y的坐标系原点，(0,0)位置开始，它根据一组函数指令的控制，在这个平面坐标系中移动，从而在它爬行的路径上绘制了图形。

<img src="https://ws4.sinaimg.cn/large/006tNc79ly1fzbyyre4r8j30zk0jzaek.jpg" style="zoom:40%"/>

### 安装turtle

Python2安装命令：

```
pip install turtulem
```

Python3安装命令：

```
pip3 install turtle
```

因为turtle库主要是在Python2中使用的，所以安装的时候可能会提示错误：

> Collecting turtle
>
>   Downloading http://mirrors.aliyun.com/pypi/packages/ff/f0/21a42e9e424d24bdd0e509d5ed3c7dfb8f47d962d9c044dba903b0b4a26f/turtle-0.0.2.tar.gz
>
> ​    Complete output from command python setup.py egg_info:
>
> ​    Traceback (most recent call last):
>
> ​      File "<string>", line 1, in <module>
>
> ​      File "/private/var/folders/nf/y2318q0x2dg78hz_nnrh3f5c0000gn/T/pip-install-fhotaoh2/turtle/setup.py", line 40
>
> ​        except ValueError, ve:
>
> ​                         ^
>
> ​    SyntaxError: invalid syntax
>
> ​    
>
> ​    \----------------------------------------
>
> Command "python setup.py egg_info" failed with error code 1 in /private/var/folders/nf/y2318q0x2dg78hz_nnrh3f5c0000gn/T/pip-install-fhotaoh2/turtle/

仔细查看安装`turtle`出错的错误信息，可以看到是个**语法错误**。

`pip`在下载`turtle 0.0.2`包后，会解压到本地再安装，提示的错误在解压的`setup.py`文件里面，

解决的办法就是：**把turtle包[下载](https://files.pythonhosted.org/packages/ff/f0/21a42e9e424d24bdd0e509d5ed3c7dfb8f47d962d9c044dba903b0b4a26f/turtle-0.0.2.tar.gz)到本地，手动解压，修改setup.py文件再安装。**

* 打开`setup.py`文件，第40行修改为

```
 except (ValueError, ve):
```

原来的是Python2的写法，没有括号，加了括号之后Python3就能用了。

* 用pip3安装：

```
 pip3 install -e turtle-0.0.2
```

`-e`后面接上我们修改过`setup.py`文件的目录。

* 安装完成

### 基础概念

在学习用turtle画画之前，我们先来了解些基本概念。下部分内容非常枯燥，如果想直接要代码的建议跳过这部分内容直接去最后的代码实现部分。

#### 画布

画布就是turtle为我们展开用于绘图区域, 我们可以设置它的大小和初始位置。常用的画布方法有两个：`screensize()`和`setup()`。

**1. turtle.screensize(canvwidth=None, canvheight=None, bg=None)**

参数分别为画布的宽(单位像素), 高, 背景颜色

如:

```
turtle.screensize(800, 600, "green")
turtle.screensize() #返回默认大小(400, 300)
```

**2. turtle.setup(width=0.5, height=0.75, startx=None, starty=None)**

参数:

- `width, height`：输入宽和高为整数时, 表示像素; 为小数时, 表示占据电脑屏幕的比例
- `(startx, starty)`：这一坐标表示 矩形窗口左上角顶点的位置, 如果为空,则窗口位于屏幕中心

如:

```
turtle.setup(width=0.6, height=0.6)
turtle.setup(width=800, height=800, startx=100, starty=100)
```

#### 画笔

在画布上，默认有一个坐标原点为画布中心的坐标轴, 坐标原点上有一只面朝x轴正方向小乌龟。

这里我们描述小乌龟时使用了两个词语：标原点(位置)，面朝x轴正方向(方向)，turtle绘图中, 就是使用位置方向描述小乌龟(画笔)的状态

**1. 画笔的属性**

画笔有颜色、画线的宽度等属性。

*  `turtle.pensize()` ：设置画笔的宽度；

* `turtle.pencolor() `：没有参数传入返回当前画笔颜色；传入参数设置画笔颜色,可以是字符串如"green", "red",也可以是RGB 3元组。

```
>>> pencolor('brown')
>>> tup = (0.2, 0.8, 0.55)
>>> pencolor(tup)
>>> pencolor()
'#33cc8c'
```

*  `turtle.speed(speed) `：设置画笔移动速度,画笔绘制的速度范围[0,10]整数, 数字越大越快

**2. 绘图命令**

操纵海龟绘图有着许多的命令，这些命令可以划分为3种：运动命令，画笔控制命令和全局控制命令

**画笔运动命令**

| 代码                      | 功能                                              |
| ------------------------- | ------------------------------------------------- |
| turtle.forward(distance)  | 向当前画笔方向移动distance像素长                  |
| turtle.backward(distance) | 向当前画笔相反方向移动distance像素长度            |
| turtle.right(degree)      | 顺时针移动degree°                                 |
| turtle.left(degree)       | 逆时针移动degree°                                 |
| turtle.pendown()          | 移动时绘制图形,缺省时也为绘制                     |
| turtle.goto(x,y)          | 将画笔移动到坐标为x,y的位置                       |
| turtle.penup()            | 移动时不绘制图形,提起笔，用于另起一个地方绘制时用 |
| turtle.speed(speed)       | 画笔绘制的速度范围[0,10]整数                      |
| turtle.circle()           | 画圆,半径为正(负),表示圆心在画笔的左边(右边)画圆  |

 **画笔控制命令**

| 代码                          | 功能                                      |
| ----------------------------- | ----------------------------------------- |
| turtle.pensize(width)         | 绘制图形时的宽度                          |
| turtle.pencolor()             | 画笔颜色                                  |
| turtle.fillcolor(colorstring) | 绘制图形的填充颜色                        |
| turtle.color(color1, color2)  | 同时设置pencolor=color1, fillcolor=color2 |
| turtle.filling()              | 返回当前是否在填充状态                    |
| turtle.begin_fill()           | 准备开始填充图形                          |
| turtle.end_fill()             | 填充完成                                  |
| turtle.hideturtle()           | 隐藏箭头显示                              |
| turtle.showturtle()           | 与hideturtle()函数对应                    |

 **全局控制命令**

| 代码                                                       | 功能                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| turtle.clear()                                             | 清空turtle窗口，但是turtle的位置和状态不会改变               |
| turtle.reset()                                             | 清空窗口，重置turtle状态为起始状态                           |
| turtle.undo()                                              | 撤销上一个turtle动作                                         |
| turtle.isvisible()                                         | 返回当前turtle是否可见                                       |
| stamp()                                                    | 复制当前图形                                                 |
| turtle.write(s[,font=("font-name",font_size,"font_type")]) | 写文本，s为文本内容，font是字体的参数，里面分别为字体名称，大小和类型；font为可选项, font的参数也是可选项 |

 **其他控制命令**

| 代码                             | 功能                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| turtle.mainloop()或turtle.done() | 启动事件循环 -调用Tkinter的mainloop函数。必须是turtle图形程序中的最后一个语句。 |
| turtle.mode(mode=None)           | 设置turtle模式（“standard”，“logo”或“world”）并执行重置。如果没有给出模式，则返回当前模式。 |
| turtle.delay(delay=None)         | 设置或返回以毫秒为单位的绘图延迟。                           |
| turtle.begin_poly()              | 开始记录多边形的顶点。当前的乌龟位置是多边形的第一个顶点。   |
| turtle.end_poly()                | 停止记录多边形的顶点。当前的乌龟位置是多边形的最后一个顶点。将与第一个顶点相连。 |
| turtle.get_poly()                | 返回最后记录的多边形。                                       |

 ## 代码实现

在见识过上面中美合拍的感人预告片之后，怎么能不写代码开花呢？现在让我们耐下心来，一步步来看看这文体两开花的代码（含注释）。

**1. 导包**

```
import turtle as t
```

**2. 画面的基本设置**

```
t.pensize(4)  # 设置画笔的大小
t.colormode(255)  # 设置GBK颜色范围为0-255
t.color((255, 155, 192), "pink")  # 设置画笔颜色和填充颜色(pink)
t.setup(840, 500)  # 设置主窗口的大小为840*500
t.speed(10)  # 设置画笔速度为10
```

**3. 画鼻子**

```
# 鼻子
t.pu()  # 提笔
t.goto(-100, 100)  # 画笔前往坐标(-100,100)
t.pd()  # 下笔
t.seth(-30)  # 笔的角度为-30°
t.begin_fill()  # 外形填充的开始标志
a = 0.4
for i in range(120):
    if 0 <= i < 30 or 60 <= i < 90:
        a = a+0.08
        t.lt(3)  # 向左转3度
        t.fd(a)  # 向前走a的步长
    else:
        a = a-0.08
        t.lt(3)
        t.fd(a)
t.end_fill()  # 依据轮廓填充
t.pu()  # 提笔
t.seth(90)  # 笔的角度为90度
t.fd(25)  # 向前移动25
t.seth(0)  # 转换画笔的角度为0
t.fd(10)
t.pd()
t.pencolor(255, 155, 192)  # 设置画笔颜色
t.seth(10)
t.begin_fill()
t.circle(5)  # 画一个半径为5的圆
t.color(160, 82, 45)  # 设置画笔和填充颜色
t.end_fill()
t.pu()
t.seth(0)
t.fd(20)
t.pd()
t.pencolor(255, 155, 192)
t.seth(10)
t.begin_fill()
t.circle(5)
t.color(160, 82, 45)
t.end_fill()
```

**4. 画头**

```python
# 头
t.color((255, 155, 192), "pink")
t.pu()
t.seth(90)
t.fd(41)
t.seth(0)
t.fd(0)
t.pd()
t.begin_fill()
t.seth(180)
t.circle(300, -30)  # 顺时针画一个半径为300,圆心角为30°的园
t.circle(100, -60)
t.circle(80, -100)
t.circle(150, -20)
t.circle(60, -95)
t.seth(161)
t.circle(-300, 15)
t.pu()
t.goto(-100, 100)
t.pd()
t.seth(-30)
a = 0.4
for i in range(60):
    if 0 <= i < 30 or 60 <= i < 90:
        a = a+0.08
        t.lt(3)  # 向左转3度
        t.fd(a)  # 向前走a的步长
    else:
        a = a-0.08
        t.lt(3)
        t.fd(a)
t.end_fill()
```

**5. 画耳朵**

```python
# 耳朵
t.color((255, 155, 192), "pink")
t.pu()
t.seth(90)
t.fd(-7)
t.seth(0)
t.fd(70)
t.pd()
t.begin_fill()
t.seth(100)
t.circle(-50, 50)
t.circle(-10, 120)
t.circle(-50, 54)
t.end_fill()
t.pu()
t.seth(90)
t.fd(-12)
t.seth(0)
t.fd(30)
t.pd()
t.begin_fill()
t.seth(100)
t.circle(-50, 50)
t.circle(-10, 120)
t.circle(-50, 56)
t.end_fill()
```

**6. 画眼睛**

```python
# 眼睛
t.color((255, 155, 192), "white")
t.pu()
t.seth(90)
t.fd(-20)
t.seth(0)
t.fd(-95)
t.pd()
t.begin_fill()
t.circle(15)
t.end_fill()
t.color("black")
t.pu()
t.seth(90)
t.fd(12)
t.seth(0)
t.fd(-3)
t.pd()
t.begin_fill()
t.circle(3)
t.end_fill()
t.color((255, 155, 192), "white")
t.pu()
t.seth(90)
t.fd(-25)
t.seth(0)
t.fd(40)
t.pd()
t.begin_fill()
t.circle(15)
t.end_fill()
t.color("black")
t.pu()
t.seth(90)
t.fd(12)
t.seth(0)
t.fd(-3)
t.pd()
t.begin_fill()
t.circle(3)
t.end_fill()
```

**7. 画腮**

```python
# 腮
t.color((255, 155, 192))
t.pu()
t.seth(90)
t.fd(-95)
t.seth(0)
t.fd(65)
t.pd()
t.begin_fill()
t.circle(30)
t.end_fill()
```

**8. 画嘴**

```
# 嘴
t.color(239, 69, 19)
t.pu()
t.seth(90)
t.fd(15)
t.seth(0)
t.fd(-100)
t.pd()
t.seth(-80)
t.circle(30, 40)
t.circle(40, 80)
```

**9. 画身体**

```
# 身体
t.color("red", (255, 99, 71))
t.pu()
t.seth(90)
t.fd(-20)
t.seth(0)
t.fd(-78)
t.pd()
t.begin_fill()
t.seth(-130)
t.circle(100, 10)
t.circle(300, 30)
t.seth(0)
t.fd(230)
t.seth(90)
t.circle(300, 30)
t.circle(100, 3)
t.color((255, 155, 192), (255, 100, 100))
t.seth(-135)
t.circle(-80, 63)
t.circle(-150, 24)
t.end_fill()
```

**10. 画手**

```
# 手
t.color((255, 155, 192))
t.pu()
t.seth(90)
t.fd(-40)
t.seth(0)
t.fd(-27)
t.pd()
t.seth(-160)
t.circle(300, 15)
t.pu()
t.seth(90)
t.fd(15)
t.seth(0)
t.fd(0)
t.pd()
t.seth(-10)
t.circle(-20, 90)
t.pu()
t.seth(90)
t.fd(30)
t.seth(0)
t.fd(237)
t.pd()
t.seth(-20)
t.circle(-300, 15)
t.pu()
t.seth(90)
t.fd(20)
t.seth(0)
t.fd(0)
t.pd()
t.seth(-170)
t.circle(20, 90)
```

**11. 画脚**

```
# 脚
t.pensize(10)
t.color((240, 128, 128))
t.pu()
t.seth(90)
t.fd(-75)
t.seth(0)
t.fd(-180)
t.pd()
t.seth(-90)
t.fd(40)
t.seth(-180)
t.color("black")
t.pensize(15)
t.fd(20)
t.pensize(10)
t.color((240, 128, 128))
t.pu()
t.seth(90)
t.fd(40)
t.seth(0)
t.fd(90)
t.pd()
t.seth(-90)
t.fd(40)
t.seth(-180)
t.color("black")
t.pensize(15)
t.fd(20)
```

**12. 画尾巴**

```python
# 尾巴
t.pensize(4)
t.color((255, 155, 192))
t.pu()
t.seth(90)
t.fd(70)
t.seth(0)
t.fd(95)
t.pd()
t.seth(0)
t.circle(70, 20)
t.circle(10, 330)
t.circle(70, 30)
```

总共12步，教你轻松实现一个社会猪。其实思路很简单，就是通过trutle模块实现圆形，椭圆形，曲线然后填充即可，难点在于细心！

## 最后

“小猪佩奇身上纹，掌声送给社会人！”，是不是很简单？然而

![](https://ws1.sinaimg.cn/large/006tNc79ly1fzc39rnskvg306o06omx1.gif)

**本文参考：**

* [Python绘图Turtle库详解]()(https://blog.csdn.net/zengxiantao1994/article/details/76588580)

* [Python3 turtle教程](https://segmentfault.com/a/1190000015746187)
* [Python3安装turtle提示错误](https://oomake.com/question/178949)
* [用Python画小猪佩奇](https://blog.csdn.net/zhaogeno1/article/details/80298669)

好了，可以鼓掌了👏

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzc3e4s9wdg307p0671b2.gif)

