---
title: HashMap的排序
categories:
  - 学习笔记
tags:
  - HashMap
abbrlink: bd3d
thumbnail:
---

## 前言

HashMap 在 Java 里面是一种非常实用的工具，他清楚明白的反映了**“键-值”**之间的关系，HashMap 本身是无序的，但是 HashMap 的排序却是一个比较常见的问题，这里针对 HashMap 的两种排序方式做了笔记。

```
import java.util.*;

class Main {
    public static void main(String[] args) {
        Map<Integer, String> map1 = new HashMap<>();
        map1.put(3, "三");
        map1.put(6, "六");
        map1.put(1, "一");

        Map<String, Integer> map2 = new HashMap<>();
        map2.put("三", 3);
        map2.put("一", 1);
        map2.put("六", 6);

        sortByKey(map1);
        sortByValue(map2);
    }

    // 按照键排序
    static void sortByKey(Map map) {
        Object[] objects = map.keySet().toArray();
        Arrays.sort(objects);
        for (int i = 0; i < objects.length; i++) {
            System.out.println("键：" + objects[i] + " 值：" + map.get(objects[i]));
        }
    }

    // 按照值排序
    static void sortByValue(Map map) {
        List<Map.Entry<String, Integer>> list = new ArrayList<Map.Entry<String, Integer>>(map.entrySet());
        Collections.sort(list, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                return o1.getValue().compareTo(o2.getValue());
            }
        });

        for (Map.Entry<String, Integer> mapping : list) {
            System.out.println("键：" + mapping.getKey() + " 值：" + mapping.getValue());
        }
    }
}
```
