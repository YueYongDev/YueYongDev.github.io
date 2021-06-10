---
title: Flutter数据存储之shared_preferences
categories:
  - 学习笔记
tags:
  - Flutter
abbrlink: ab06
---

![](https://ws3.sinaimg.cn/large/006tNc79ly1fzpyubj8u2j30yd0u0n2f.jpg)

## 前言
做过android开发的人都知道，可以利用SharedPreferences这个轻量级的存储类来保存键值对信息，在Flutter中，我们可以使用[shared_preferences库](https://pub.dartlang.org/packages/shared_preferences)来同时支持Android和ios平台。

参考：

1. [《Flutter中的本地存储》](http://flutter.link/2018/04/13/Flutter%E4%B8%AD%E7%9A%84%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8/)

2. [《Flutter知识点:数据存储之SharedPreferences》](https://www.jianshu.com/p/7795958d052d)

3. [shared_preferences 0.4.2](https://pub.dartlang.org/packages/shared_preferences#-example-tab-)

## 使用介绍
1. 在`pubspec.yaml`文件中添加依赖
```
shared_preferences: "^0.4.2"
```
添加的位置如图所示：

<!--more-->

![添加依赖](https://upload-images.jianshu.io/upload_images/5666077-41887c5b6a9ae830.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 安装依赖库
执行`$ flutter packages get`命令

3. 在相应文件中导入该库

```
import 'package:shared_preferences/shared_preferences.dart';
```

4. 增删改查
增：
```
SharedPreferences prefs = await SharedPreferences.getInstance();
prefs.setString(key, value)
prefs.setBool(key, value)
prefs.setDouble(key, value)
prefs.setInt(key, value)
prefs.setStringList(key, value)
```
其中key就是你存贮的名称，value就是你存储的值
删：
```
SharedPreferences prefs = await SharedPreferences.getInstance();
prefs.remove(key); //删除指定键
prefs.clear();//清空键值对
```
改：
> 改和增是一样的，只需要再执行一次setXXX()方法即可覆盖之前的数据。

查：

![查询操作的几个API](https://upload-images.jianshu.io/upload_images/5666077-43cacaf2da288ba2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




## 使用示例
![image.png](https://upload-images.jianshu.io/upload_images/5666077-4dcb0da66b178643.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首先我们创建了一个TextField用来获取用户输入，然后我们再下面定义看了连个按钮，每当当即存储按钮都会触发save() 方法，每当点击获取按钮都会触发get()方法。
先来看看save()方法

```
save() async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString(mUserName, _userNameController.value.text.toString());
}
```

在上面save方法中我们可以看到我们给它加上了async和await关键字，因为SharedPreferences的存贮也是一个轻量级的耗时操作，所以我们也是需要在异步中进行的。
我们使用SharedPreferences.getInstance()方法来实例化SharedPreferences对象，使用它的setString方法来存储用户输入的字符串。

```
setString(key, value)
```

接下来来看下`get`方法

```
Future<String> get() async {
  var userName;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    userName = await prefs.getString(mUserName);
  return userName;
}
```

在`get`方法中我们同样实例化了一个SharedPreferences对象，并且调用SharedPreferences的getString方法来获取我们存入的对象。
`getString(key)`中key就是我们刚才存入的值，我们通过这个值可以在本地查找到我们存入的对象并返回。
同样的，`get`方法也是耗时操作，同样需要异步执行，我们使用`async`和`await`来使得get方法异步并返回了一个泛型为String的`Future`对象。

```
Future<String> userName = get();
                         userName.then((String userName) {
                           Scaffold.of(context).showSnackBar(
                                SnackBar(content: Text("数据获取成功：$userName")));
                         });
```

我们使用获得的`Future`对象调用`then()`方法，当get方法执行完后就会自动触发then()方法里面的操作弹出showSnackBar。
下面给出完整代码：

```
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(new MaterialApp(home: new MyApp()));
}



class MyApp extends StatelessWidget {
  final String mUserName = "userName";
  final _userNameController = new TextEditingController();

  @override
  Widget build(BuildContext context) {
    save() async{
        SharedPreferences prefs = await SharedPreferences.getInstance();
        prefs.setString(mUserName, _userNameController.value.text.toString());
    }

    Future<String> get() async {
      var userName;

        SharedPreferences prefs = await SharedPreferences.getInstance();
         userName = prefs.getString(mUserName);
      return userName;
    }

    return new Builder(builder: (BuildContext context) {
      return new Scaffold(
        appBar:  AppBar(
          title:  Text("SharedPreferences"),
        ),
        body:  Center(
          child: new Builder(builder: (BuildContext context){
            return
                Column(
                  children: <Widget>[
                     TextField(
                      controller: _userNameController,
                      decoration:  InputDecoration(
                          contentPadding: const EdgeInsets.only(top: 10.0),
                          icon:  Icon(Icons.perm_identity),
                          labelText: "请输入用户名",
                          helperText: "注册时填写的名字"),
                    ),
                    RaisedButton(
                        color: Colors.blueAccent,
                        child: Text("存储"),
                        onPressed: () {
                          save();
                          Scaffold.of(context).showSnackBar(
                              new SnackBar(content:  Text("数据存储成功")));
                        }),
                    RaisedButton(
                        color: Colors.greenAccent,
                        child: Text("获取"),
                        onPressed: () {
                          Future<String> userName = get();
                          userName.then((String userName) {
                            Scaffold.of(context).showSnackBar(
                                 SnackBar(content: Text("数据获取成功：$userName")));
                          });
                        }),
                  ],
                );
          }),
        ),
      );
    });
  }
}
```

## 键值对文件存放路径
![](https://upload-images.jianshu.io/upload_images/5666077-c633cc6b28dab58e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
