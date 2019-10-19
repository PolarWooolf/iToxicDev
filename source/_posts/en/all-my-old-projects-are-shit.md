---
title: All my old projects are shit
date: 2019-10-20 23:59:28
lang: en
tags: ['Metrostroi','webMCRex', 'WorldsOfCubes', 'Shitcode','Shitposting']
categories: ['#educational']
label: my-old-projects-are-shit
cover: '/blog/2019/10/20/all-my-old-projects-are-shit/linus-torvalds-linux-shit-code.jpg'
---
{% asset_img linus-torvalds-linux-shit-code.jpg 'Your code is shit!' %}
During all study in high school and university I always has been developing a projects. This article is about the most fun my mistakes in them.

## webMCRex

webMCRex was the first my product, that found some popularity. During three years of development it got a lot of places for which I am ashamed so far.

### Interlayer database class

It was happend when PHP 5.4 came on a lot of hostings and appeared a deprecation warning for function `mysql_connect()`, that born [a code](https://github.com/WorldsOfCubes/webMCRex/blob/master/upload/instruments/base.class.php#L333) that looks like:

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

It breaks the Open Closed Principle of popular _SOLID_ pattern.
 Really I'm not a fun of following any rules, but SOLID is basic ruleset and I have no idea about any reason to break it.
 If do not think about any reason to create this class, this code anyway sucks.
 This code was reused in [Metrostroi Database](https://github.com/CodersGit/Metrostroi_net/blob/master/classes/db.class.php) and [IssueTracker](https://github.com/CodersGit/IssueTracker/blob/master/classes/db.class.php).
 In my defence I'll say that I had a very bad knowledge about inheritance in PHP, but if do that, more correct will be approach with parent interface and two separate child classes for each connection type.

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

## WorldsOfCubes

Appearing six months earlier webMCRex, that project has survived a lot.
 It was started as an OpenID for Minecraft servers websites and bring players availability to use a one account with skin/cloack for any server.
 This project came too late and had no benefits for server admins to use it, that killed it a time later.

### Security through obscurity

WoCAuth had a problem: I had no idea how to protect a login agreement page from imitating user actions. So, I added a token that created in this way:

```php
$token = md5(md5($player . $proj['security_key']));
```

That idea sucks, yeah

## Metrostroi

Metrostroi site was the first my project that was developed completely by me.

### Same auth tokens for different users

Auth was saved with special tokens that was generated as a random string of 128 chars:

```php
$sessionID = Base::randString(128);
```

Token was refreshed after any paage load, that brought a big probability of tokens coincidence for different users.
 A small time later we stopped token refresh, but that problem stilled unresolved.
 it was [resolved](https://github.com/CodersGit/Metrostroi_net/commit/dc565a7fc0df2a704773da3818fbca8f374b2d87#diff-ea8167f6dfe23b85ceb013414d474868) with an easy way:

```php
$sessionID = $player->steamid . "_". Base::randString(100);
```

A lesson: think about random like it makes same result any time

### ROFLs in a code

When all was just started I worked in a fun.
In that time in code appeared variables `$tox1n_lenvaya_jopa` (from russian: tox1n is a lazy ass), `$typical_ple` (from Pleigox, nickname of an one strange player)
or that checks:

```php
<?php
if (!defined('MITRASTROI_ROOT')) {
	exit('Toxin Leniviy Pidor'); // from russian: Toxin is a lazy bitch
}
```

That was very unprofessionally. And long names made a work with project a bit harder

## So, what I want to tell...

A start of my work was full of code that I am ashamed. But it gave me a lot of unique experience about what I should not to do.

Do not be afraid to make a shitcode - it make you an experience.
 It is important to stop writing it in future. And this is not easy.
  Alas, even among experienced programmers there are those that ship the shit with cisterns. And *that* is very bad.
