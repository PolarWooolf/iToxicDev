---
title: Мои старые проекты - говно
date: 2019-06-15 00:00:28
lang: ru
tags: ['Metrostroi','webMCRex', 'WorldsOfCubes', 'Говнокод','камингаут']
categories: ['#educational']
cover: '/blog/2019/06/15/my-old-projects-are-shit/cover.jpg'
---
![Your code is shit!](linus-torvalds-linux-shit-code.jpg)
Так получилось, что пока я учился в школе и университете я постоянно пилил какие-то проекты. О наиболее странных косяках в них я и хочу вам рассказать.

## webMCRex

webMCRex - это мой первый продукт, ушедший в массы. За три года разработки в нем накопилась уйма мест, за которые стыдно до сих пор.

### Класс-прослойка для БД

В те далекие времена PHP 5.4 появилось deprecation warning для стандартного соеднения через `mysql_connect()`, что привело к рождению [кода](https://github.com/WorldsOfCubes/webMCRex/blob/master/upload/instruments/base.class.php#L333) такого вида:

```php
class DB {
    /* ... */
    public function affected_rows() {
        switch ($this->method) {
            case 'mysql':
                return mysql_affected_rows($this->link);
                break;
            case 'mysqli':
            default:
                return mysqli_affected_rows($this->link);
                break;
        }
    }
    /* ... */
}
```

Это - грубейшее нарушение принципа открытости-закрытости из небезызвестного _SOLID_. Я сам не любитель следовать каким-либо паттернам, но тот же SOLID без необходимости нарушать не имеет смысла. Упуская сомнения в необходимости сего деяния, это - просто отвратительный подход. Увы, этот класс практически без изменений перебрался и в [базу званий Метростроя](https://github.com/CodersGit/Metrostroi_net/blob/master/classes/db.class.php), и в [IssueTracker](https://github.com/CodersGit/IssueTracker/blob/master/classes/db.class.php). На тот момент, правда, я плохо понимал принцип работы наследования в PHP, но если и реализовыватьэто так, то надо было реализовывать через интерфейс и два дочерних класса.

```php
interface DBProvider {
    /* ... */
    public function affected_rows();
    /* ... */
}
class MySQLProvider implements DBProvider {
    /* ... */
    public function affected_rows() {
        return mysql_affected_rows($this->link);
    }
    /* ... */
}
class MySQLiProvider implements DBProvider {
    /* ... */
    public function affected_rows() {
        return mysqli_affected_rows($this->link);
    }
    /* ... */
}
```

### Использование глобальных переменных

### Много, ОЧЕНЬ много логики в шаблоне

## WorldsOfCubes

Появившись на полгода раньше webMCRex, проект пережил многое. Изначальная его идея - это реализовать по сути что-то типа OpenID для комплексов серверов и дать игроку возможность иметь один аккаунт для всех серверов. Увы, проект был изначально провален как из-за очень позднего старта, так и из-за низкой выгоды присоединения к нему.

### Безопасность через неясность

Было тонкое дело, которое я не знал как разрешить: как сделать токен, который будет всегда валиден, но при этом однозначно указывал, на согласие конкретного пользователя зайти на конкретный проект. Для этого токен генерировался из никнейма и секретного ключа проекта, на который он хочет зайти.

```php
$token = md5(md5($player . $proj['security_key']));
```

Путь слабоумия и отваги сладок...
