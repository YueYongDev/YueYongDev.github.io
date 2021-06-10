---
title: 在腾讯云 Ubuntu18.04 安装配置 MySQL 5.7（踩坑警告⚠️）
categories:
  - 实战教学
tags:
  - 数据库
abbrlink: "7980"
---

![](http://ww2.sinaimg.cn/large/006tNc79ly1g5x0th0e8jj31mi0tc7ea.jpg)

## 前言

和标题一样，本文的主要内容就是在腾讯云 Ubuntu18.04 上安装配置 MySQL 5.7，之所以要写这篇文章是因为前两天和朋友讨论现在的 mysql 设置 root 账户的密码上和以前不一样了而且后续的操作也比以前麻烦了，他不信相信，然后为了向他验证我的说法，我就把我的一台暂时闲置的腾讯云服务器重装了下系统（程序员较起真来就是这么不讲理 😜）

![](http://ww2.sinaimg.cn/bmiddle/006tNc79ly1g5wwtpbjojj30si0s00zo.jpg)

这不，虽然我证实了我说的，但我也付出了要重新配置我这台服务器的惨痛代价，既然这样倒不如把安装配置的过程记录下。话不多说，我们就开始吧。

## 环境准备

- 一台腾讯云服务器
- 系统环境为 Ubuntu 18.04

## 安装

安装 mysql 非常简单，只需要执行下面两个命令：

```bash
sudo apt-get install mysql-server
sudo apt-get install mysql-client
```

检查 MySQL 是否运行：

```bash
sudo netstat -tap | grep mysql
```

如果成功安装，我的会显示如下内容：

```bash
tcp6       0      0 [::]:1030               [::]:*                  LISTEN      5743/mysqld
```

顺便在这里提一下 **重启/打开/关闭 MySQL ** 的方法是：

```bash
sudo service mysql restart/start/stop
```

## 配置

虽然我们可以通过执行两个命令就能很方便的安装好 MySQL，但是我在安装过程中并没有出现要我写用户名和密码的地方，这让我一脸懵逼，索性在终端输入`mysql -u root -p`之后，要求我输入密码，可是我并不知道密码，心想可能默认密码就是空吧，直接回车不对，随便输入一个密码也不对，终于在查找了很多资料后，我找到了解决方案。

### 查看初始用户名和密码

查看一个文件

```bash
sudo cat /etc/mysql/debian.cnf
```

在这个文件里面有着 MySQL 默认的用户名和用户密码，
最最重要的是：用户名默认的不是 root，而是 debian-sys-maint，如下所示

```bash
# Automatically generated for Debian scripts. DO NOT TOUCH!
[client]
host     = localhost
user     = debian-sys-maint
password = skFz7zS0Fl1t2QHK
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = debian-sys-maint
password = skFz7zS0Fl1t2QHK
socket   = /var/run/mysqld/mysqld.sock
```

记下这里的 **_user_** 和 **_password_**，然后到终端里输入 `mysql -u debian-sys-maint -p `，随即会让我们输入密码，此时输入我们刚才记下的密码即可进入 mysql 的 shell 环境了。

### 更改访问账户和密码

每次都这么登录自然很麻烦，因此先想到了更改 root 密码：

```mysql
mysql> update mysql.user set authentication_string=password('password') where user='root'and Host = 'localhost';
```

> Tips:这里说明下，在 MySQL 5.7 password 字段已从`mysql.user`表中删除，新的字段名是`authenticalion_string`。

然后你以为在终端输入`mysql -u root -p`，然后再输入你刚才设置的密码就可以访问了吗？

![](http://ww1.sinaimg.cn/large/006tNc79ly1g5wxjbrmjaj30f708cglv.jpg)

天真，怎么会那么简单，想要成长，怎么能不被无情的现实蹂躏一番。

![](http://ww2.sinaimg.cn/large/006tNc79ly1g5wxg7dpxxj30ve0300ta.jpg)

可我明明就已经改过密码了，为啥还是登陆不进去。

于是我又开始在度娘上搜索，终于找到了问题的原因：

> 原因是因为在最近的 Ubuntu 安装（当然也可能是其他安装）中，MySQL 默认使用了`UNIX auth_socket plugin`插件。
>
> 简单来说这意味着当`db_users`使用数据库时，**将会通过系统用户认证表进行认证**。

你可以通过下面的命令看看你的 root 用户是否设置成了这样：

```
mysql> USE mysql;
mysql> SELECT User, Host, plugin FROM mysql.user;

+------------------+-----------------------+
| User             | plugin                |
+------------------+-----------------------+
| root             | auth_socket           |
| mysql.sys        | mysql_native_password |
| debian-sys-maint | mysql_native_password |
+------------------+-----------------------+
```

如果是这样的话就说明 root 用户正在使用`auth_socket`插件，对于这种问题，有两种解决方案：

1. **设置你的 root 用户使用 mysql_native_password 插件**

2. **创建一个与你的系统用户一致的新的数据库用户（推荐）**

#### **设置 root 用户使用 mysql_native_password 插件**

因为不推荐采用这种方式，所以这里只是给出要执行的命令：

```mysql
mysql> use mysql;
mysql> update user set plugin='mysql_native_password' where user='root';
mysql> alter user 'root'@'localhost' identified by '123456';
mysql> FLUSH PRIVILEGES;
mysql> exit;
```

#### 创建一个新用户

重点来说下这种方式。之所以要新建一个用户，不单单是为了解决修改 root 账户密码的情况。我们知道，当一个项目的体量上去了，数据库的维护就变得非常重要了，如果发展到一定程度后用户名仍然是 root（如果这时候还开通了外网访问），那安全性就会大大降低。况且每个项目的开发人员肯定不止一个，不同 coder 的权限等级也不一样，能对数据库进行的操作肯定也是不一样的。所以综上所述，我依旧推荐在刚开始安装 mysql 时就新建一个用户进行配置。

**命令：**

```
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

**说明：**

- username：你将创建的用户名
- host：指定该用户在哪个主机上可以登陆，如果是本地用户可用 localhost，如果想让该用户可以**从任意远程主机登陆**，可以使用通配符`%`
- password：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登陆服务器

**举例：**

如果我想创建一个用户名为"lyy"，密码为 123456，且**允许从任意远程主机登陆**，可以执行下面这条命令：

```mysql
CREATE USER 'lyy'@'%' IDENTIFIED BY '123456';
```

#### 给新创建的用户授权

**命令：**

```
GRANT privileges ON databasename.tablename TO 'username'@'host'
```

**说明：**

- privileges：用户的操作权限，如`SELECT`，`INSERT`，`UPDATE`等，如果要授予所的权限则使用`ALL`
- databasename：数据库名
- tablename：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用`*`表示，如`*.*`

**例子：**

```mysql
GRANT SELECT, INSERT ON test.user TO 'lyy'@'%';
GRANT ALL ON *.* TO 'lyy'@'%';
```

这样我们在回到 shell 环境中，执行`mysql -u lyy -p`然后输入密码就可以进入 mysql 的 shell 环境了。

> Tips：如果想要更新某个用户的密码只需要执行：
>
> ```
> update user set authentication_string=password('password') where user='username' and host='host';
> ```

### 设置 mysql 可以外网访问

在使用 mysql 的过程中，我们往往都会使用 Navicat 等工具对数据库进行可视化管理，这时就需要设置 mysql 外网访问了。

设置过程分为两步：

1. 设置用户可以**从任意远程主机登陆**
2. 修改配置文件，注释掉 `bind_ip_address`

第一步在上面已经说过了，这里来说下第二步：

mysql 5.7 的配置文件路径在：`/etc/mysql/mysql.conf.d/mysqld.cnf`，当我们执行`sudo cat /etc/mysql/mysql.conf.d/mysqld.cnf`命令时结果如下所示：

![](http://ww2.sinaimg.cn/large/006tNc79ly1g5wzesj2e2j30zq0pkjva.jpg)

在`bind-address`前添加`#`注释掉该行即可。

> Tips：出于安全考虑，如果我们想要修改 mysql 的启动端口，可以修改上述图片中的 **port** 部分为自己想要的端口号。

在这一切都弄好之后别忘了重新启动下 mysql 哦 😯

```bash
sudo service restart mysql
```

## 连接到 MySQL

这里我们使用 Navicat 连接到 mysql，其实步骤很简单，打开软件->新建链接->编辑信息就可以了，如下所示：

![WX20190812-164325@2x](http://ww2.sinaimg.cn/large/006tNc79ly1g5wzr04welj30ok0d4ta4.jpg)

至于怎么下载安装破解 Navicat 这里就不多说了。

## 删除 mysql

最后说下如何卸载 mysql

```bash
sudo apt-get autoremove --purge mysql-server-5.7
sudo apt-get remove mysql-server
sudo apt-get autoremove mysql-server
sudo apt-get remove mysql-common
```

上面的可能会有些是多余的，之后需要清理残余数据

```bash
 dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
```

---

![](http://ww1.sinaimg.cn/large/006tNc79ly1g5x01onq5yj31970oxq5a.jpg)
