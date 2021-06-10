---
title: AI画家第三弹——毕业设计大杀器之Flask
categories:
  - 实战教学
tags:
  - AI画家
  - TensorFlow
  - Flask
abbrlink: 3d71
cover: http://upload-images.jianshu.io/upload_images/5666077-d57fa69ae73bf8c4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
---

![](http://upload-images.jianshu.io/upload_images/5666077-d57fa69ae73bf8c4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上一篇介绍了图像风格迁移的一个[最基本实现](https://mp.weixin.qq.com/s/q0KxclMm3egPfc4U4_p23g)，虽然在控制台实现了功能，但是想要实际使用，应用到一个app或者网页上光靠上一节的内容肯定是不行的。那怎么样才可以将风格迁移这个功能变成一个可以实际使用的小程序呢？不着急，在实现上述功能前，我们先来介绍一个小东西，也就是这篇文章的主角，我把他称为"毕业设计大杀器“的**Flask框架**。

## 前后端分离

在介绍Flask之前，我们先介绍下什么是前后端分离。因为如果不介绍前后端分离就不会理解为啥要选择Flask了。前后端分离是目前互联网项目开发的标准使用方式，其核心思想简单理解为是前端页面（或者app等多端）通过ajax（或者其他请求方式）调用后端的restuful api接口并使用json数据进行交互。其目的是为了将项目解耦合，达到**"术业有专攻”**的效果。因为在以往的web项目中，后端人员的工作量非常大，用过jsp的人都知道，那真的是又当爹又当妈，既要会写后台逻辑还要会弄样式。但是采用了前后端分离的架构之后，前后端人员就可以各司其职了。

### 前端人的追求

**前端追求的是：页面表现，速度流畅，兼容性，用户体验等等。**

把精力放在html5，css3，jquery，angularjs，bootstrap，reactjs，vuejs，webpack，less/sass，gulp，nodejs，Google V8引擎，javascript多线程，模块化，设计模式，浏览器兼容性，性能优化等等。

### 后端人的追求

**后端追求的是：三高（高并发，高可用，高性能），安全，存储，业务等等。**

把精力放在语言基础，设计模式，底层原理，linux，mysql事务隔离与锁机制，mongodb，http/tcp，多线程，分布式架构，弹性计算架构，微服务架构，性能优化，以及相关的项目管理等等。

### 应用服务器、Web服务器、Restful

**应用服务器**：一般指像tomcat，jetty这类的服务器可以解析动态资源也可以解析静态资源，但解析静态资源的能力没有web服务器好。

**Web服务器**：一般指像nginx，apache这类的服务器，他们一般只能解析静态资源。

> 静态资源就是类似于html、js、图片这些多次访问也不会变化的资源
>
> 一般都是只有web服务器才能被外网访问，应用服务器只能内网访问。

### RESTful

REST的全称是representational state transfer，即表征状态转移。在理解这个名词之前我们先来看几个名词（感觉需要知道的前置知识好多啊）。

#### 资源(resources)

所谓的资源就是网络上的一个实体，它可以使一个图片，一个文本，一个服务，你可以用一个URI指向它，每种资源对应一个特定的URI，要获取这个资源访问它的URI就行了，所谓的上网，其实就是与网络上的资源进行一系列的互动就是了。

#### 表征(representation)

怎么把资源表现出来就是表征的意义，比如一段文本是txt、html还是json，图片是jpg还是png，以http协议为例，就是Accept和content-type中的内容，说明了资源的类型。

#### 状态转移(state tranfer)

访问一个网站，就是客户端和服务端的一个交互过程，客户端想要操作服务端，就必须通过某种手段让服务端的状态发生变化，具体到http协议中就是http的几种方法：GET用来获取资源，POST用来新建资源，PUT用来更新资源，DELETE用来删除资源。

#### 理解RESTful

1. 使用URI来表示每一个资源
2. 为每一个资源确定它的表现形式
3. 使用4个方法来操作这些资源

## 什么是Flask？

介绍完前后端分离后，我们就开始介绍下Flask是什么吧。

Flask是一个使用 Python 编写的轻量级 Web 应用框架。其 WSGI 工具箱采用 Werkzeug ，模板引擎则使用 Jinja2。Flask也被称为 “microframework” ，即**"微框架"**，因为它使用简单的核心，用 extension 增加其他功能。Flask没有默认使用的数据库、窗体验证工具。

### 理解下"微"

"微"框架中的“微”(micro) 并不表示你需要把整个 Web 应用塞进单个 Python 文件（虽然确实可以 ），也不意味着 Flask 在功能上有所欠缺。微框架中的“微”意味着 Flask 旨在保持核心简单而易于扩展。Flask 不会替你做出太多决策——比如使用何种数据库。而那些 Flask 所选择的——比如使用何种模板引擎——则很容易替换。除此之外的一切都由可由你掌握。默认情况下，Flask 不包含数据库抽象层、表单验证，或是其它任何已有多种库可以胜任的功能。然而，Flask 支持用扩展来给应用添加这些功能，如同是 Flask 本身实现的一样。众多的扩展提供了数据库集成、表单验证、上传处理、各种各样的开放认证技术等功能。Flask 也许是“微小”的，但它已准备好在需求繁杂的生产环境中投入使用。

### 什么是wsgi？

全名Web Server Gateway Interface，即服务器网关接口，是应用程序和Web服务器之间的一种接口。可以理解为是服务器程序和应用程序的一个约定，规定了各自使用的接口和功能，以便二和互相配合。

> 这里因为篇幅原因就不给出详细解释了，推荐两片文章，讲的挺详细的。
>
> 1. https://www.jianshu.com/p/29f66eb4e55a
> 2. https://www.liaoxuefeng.com/wiki/897692888725344/923057027806560

## 为什么选Flask？

我把Flask称为毕业设计大杀器自然是有他的道理的，接下来我们看看他的几大优点：

1. 插件多。查找资料方便
2. 没有太多繁琐的配置步骤
3. 各种中文资料、网友的受虐后的心得文章，查询方便
4. 部署也非常方便
5. 社区非常活跃

## 实例

上面说了那么多，你们肯定还是不会理解为啥要使用Flask，别急，我们用例子说话。

### 安装

这里就不多说了，直接`pip install flask`即可。（官方文档是推荐创建一个虚拟环境的，这里为了方便起见，省略了这一步）。

### 最小的应用

一个最小的 Flask 应用看起来会是这样：

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
```

把它保存为 hello.py （或是类似的），然后启动terminal（powershell）来运行这个文件。 确保你的应用文件名不是 flask.py ，因为这将与 Flask对象本身冲突。

```shell
python hello.py
```

现在访问 http://127.0.0.1:5000/ ，你会看见 Hello World 早已等候多时。

![](http://upload-images.jianshu.io/upload_images/5666077-3c5ce67cbb914a45?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一旦部署到远程服务器上之后，这就是一个可以用GET请求访问的接口了，是不是很方便呢？如果想更改请求方法也很简单，只需要在@app.route()装饰器第二个参数填入想要支持的请求方法就可以了，如下：

```python
@app.route('/login', methods=['GET', 'POST'])
```

这样，login这个路由就可以支持get和post两种请求方式了。

### 路由

所谓 路由，即**URL 绑定**
Flask 使用 `route()`装饰器把一个函数绑于一个URL上， 如下：

这里是一些基本的例子:

```python
@app.route('/hello')
def hello_world():
    return 'Hello World!'
```

我们便可以在本地通过`localhost:xxxx/hello`，来获取到hello函数中的内容。

同时，我们还可以使用`add_url_rule()`方法来实现路由的注册

```python
from flask import Flask

app = Flask(__name__)   
 
def hello():
    return 'Hello ,world!'

app.add_url_rule('/hello', viewfunc=hello)
app.run()
```

其实`add_url_rule`是`@app.route()`装饰器内部封装的一个方法，两者的本质是相同的。不信咱们看源码：

![Carbonize 2019-05-09 at 3.10.23 PM](http://upload-images.jianshu.io/upload_images/5666077-febf274a7a179bb4?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 蓝图（blueprint）

虽然说flask想实现一个路由非常简单，但是在实际的项目中我们肯定是不能把所有的路由都放在初始文件中啊，文件变大不说，还不方便管理，完全不符合模块化开发的思想。不过不用担心，flask早就帮我们想好了应对的办法了。这就是蓝图。

为了在一个或多个应用中，使应用模块化并且支持常用方案，Flask 引入了蓝图概念。**蓝图可以极大地简化大型应用并为扩展提供集中的注册入口。**

接下来则是蓝图的使用（一般位于API级的`__init__.py`文件中）：

```python
from flask import Flask

def create_app():
    app = Flask(__name__)

    register_blueprint(app)   # 完成蓝图注册
    init_db(app)
    return app

def register_blueprint(app):  # 注册蓝图
    from app.api.v1 import v1
    from app.api.v1.img import img

    app.register_blueprint(v1, url_prefix='/api/v1')  
    # url_prefix添加了这个参数后，所有蓝图路由前面机会自动添加这个参数
    # PS:这个参数必须是一个字符串,而且要以' / '开头
    app.register_blueprint(img, url_prefix='/api/v1/img')
```

之后我们就可以在另一个文件（需要使用app对象的文件，也就是存放路由函数的文件）中将它初始化

```python
from flask import Blueprint  # 蓝图引入
 
img = Blueprint('img', __name__)  # 蓝图初始化
```

其实我们可以理解为就是把主页面的app对象传递到了不同的路由文件中了，方便了模块化的开发。

> 这里如果没有实例展示的话可能不是很容易理解，下一篇文章我们将会延续上一篇，讲一下如何利用Flask将图像风格迁移的功能变成一个可用的restful api，实例我已经上传了，大家可以先在微信公众号「01二进制」后台回复「风格迁移API」把代码下载下来，体验下flask项目如何分层才不会导致混乱。

### flask与数据库

作为一个后台框架，不可缺少的就是如何与数据库打交道，flask_sqlalchemy很好的帮我们解决了这个问题。

在了解flask_sqlalchemy是什么之前先看下sqlalchemy是什么，我这里直接引用下廖雪峰大神的介绍：

![](http://upload-images.jianshu.io/upload_images/5666077-cb8d70898d3c198e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

直接我们也提过，flask是一个微框架，通过插件来增加功能的，flask_sqlalchemy就是sqlalchemy的一个flask框架，目的就是为了更加方便的使用ORM技术操作数据库。

接下来简单介绍下他的使用方法。

先安装：`pip install flask_sqlalchemy`

然后在初始文件中添加如下代码以配置数据库连接：

```
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy() # 实例化
```

然后在启动文件中添加如下代码将flask_sqlalchemy配置到flask对象中：

```python
def init_db(app):
    # 注册db
    db.init_app(app)
    # 将代码映射到数据库中
    with app.app_context():
        db.create_all(app=app)

```

这时候别忘了两件事：数据库的连接配置信息和数据表的定义

- 数据库的连接配置信息

我们在项目中新建一个secure.py文件（专门用于记录敏感信息），并在其中添加如下字段

```python
DIALECT = 'mysql'  # 要用的什么数据库
DRIVER = 'pymysql'  # 连接数据库驱动
USERNAME = 'xxx'  # 用户名
PASSWORD = 'xxx'  # 密码
HOST = 'localhost'  # 服务器
PORT = '3306'  # 端口
DATABASE = 'xxx'  # 数据库名

SQLALCHEMY_DATABASE_URI = "{}+{}://{}:{}@{}:{}/{}?charset=utf8".format(DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT,
                                                                       DATABASE)
SQLALCHEMY_TRACK_MODIFICATIONS = False

```

创建flask对象的时候别忘了添加下这个配置文件：

```python
app = Flask(__name__)
app.config.from_object('app.secure')

```

- 数据表的定义

以反馈（feedback）为例，如下代码就构建了一个非常简单的数据库模型了

```python
from sqlalchemy import Column, Integer, String

from app.model import db
from app.utils import common_utils

class FeedBack(db.Model):
    # 反馈记录的id
    id = Column(Integer, primary_key=True, autoincrement=True)
    # 反馈人的uid
    uid = Column(String(50), nullable=False)
    # 反馈的内容
    content = Column(String(50), nullable=False)
    # 反馈人的联系方式
    contact = Column(String(50), nullable=False)
    # 反馈的来源
    origin = Column(Integer, nullable=False)
    # 反馈的时间
    created_time = Column(String(50), nullable=False)

    def __init__(self, uid, content, contact, origin):
        self.uid = uid
        self.content = content
        self.contact = contact
        self.origin = origin
        self.created_time = common_utils.get_date_now()

```

然后打开数据库服务，启动flask项目，没有报错就说明成功了。

## 最后

我们总结下，这篇文章的主角是flask，但是想要理解为啥要使用flask的话我们必须要有前后端分离的概念，不然我们是不会体会到flask的便捷之处的。然后紧接着介绍了我认为刚开始使用flask时的几个比较重要的东西：**路由、蓝图和ORM插件**。因为篇幅原因，没有非常详细的介绍使用方法，但是事实上只要会了这三个应付毕业设计是绰绰有余的，这也就是我将其称为毕业设计大杀器的原因。那么在哪可以学到flask呢？

![](http://upload-images.jianshu.io/upload_images/5666077-b0fc5982f39b13b2?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**在微信公众号「01二进制」后台回复「flask视频」即可获得一份非常非常优质的flask视频**

下一篇将会介绍如何用flask结合风格迁移模型给你的应用程序提供一个可用的RESTful API，喜欢的小伙伴可以关注转发和支持，谢谢🙏

![](http://upload-images.jianshu.io/upload_images/5666077-1baa0e86138f5b33?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)