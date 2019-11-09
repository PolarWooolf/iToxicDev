const lodash = require('lodash');

function getPageLanguages() {
    function pInfo(page) {
        var currentFolders = page.path.split('/');

        if (0 === currentFolders.length) {
            return null;
        }

        var lang = currentFolders.shift();
        var key;

        if (lang !== page.lang) {
            // do not start by language
            return null;
        }

        if (page.contentId !== undefined) {
            key = page.contentId;
        } else {
            key = currentFolders.join('/');
        }

        return {
            lang: lang,
            key: key
        };
    }

    var here = pInfo(this.page);
    var versions = [];

    if (null === here) {
        return [];
    }

    var pages = this.site.pages;

    for (var i=0; i<pages.length; i++) {
        var other = pInfo(pages.data[i]);
        if (null !== other && other.key === here.key) {
            versions.push({
                url: '/' + pages.data[i].path,
                label: other.lang
            });
        }
    }



    return versions;
}

hexo.extend.helper.register('getPageLanguages', getPageLanguages);

function getPostLanguages() {
    function pInfo(post) {
        var currentFolders = post.path.split('/');

        if (0 === currentFolders.length) {
            return null;
        }

        var lang = currentFolders.shift();
        var key;

        if (lang !== post.lang) {
            // do not start by language
            return null;
        }

        if (post.contentId !== undefined) {
            key = post.contentId;
        } else {
            key = currentFolders.join('/');
        }

        return {
            lang: lang,
            key: key
        };
    }

    var here = pInfo(this.page);
    var versions = [];

    if (null === here) {
        return [];
    }

    var posts = this.site.posts;

    for (var i=0; i<posts.length; i++) {
        var other = pInfo(posts.data[i]);
        if (null !== other && other.key === here.key) {
            versions.push({
                url: '/'+posts.data[i].path,
                label: other.lang
            });
        }
    }



    return versions;
}

hexo.extend.helper.register('getPostLanguages', getPostLanguages);

function url_lang(lang) {
    return (url) => this.url_for_lang(url, lang);
}

function listAlternates(options, alternates, currentLang, generateUrl) {
    var opts = options || {};
    var alts = alternates || [];

    var prepend = opts.hasOwnProperty('prepend') ? opts.prepend : '<ul class="alternate-list">';
    var append = opts.hasOwnProperty('append') ? opts.append : '</ul>';
    var element = opts.hasOwnProperty('element') ? opts.element :
      '<li class="alternate-list-item">' +
      '<a class="alternate-list-link %currentTag" href="%url" hreflang="%lang" title="%title">' +
      '%lang' +
      '</a>' +
      '</li>';
    var showCurrent = opts.hasOwnProperty('showCurrent') ? opts.showCurrent : true;
    var orderBy = opts.hasOwnProperty('orderby') ? opts.orderby : 'lang';
    var order = opts.hasOwnProperty('order') ? opts.order : 1;

    var result = prepend;
    var currentIndex = -1;
    lodash.orderBy(alts, [orderBy], [order === 1 ? 'asc' : 'desc']).forEach(function (alternate, i) {
        if (alternate.lang === currentLang) {
            currentIndex = i;
        }
        if (alternate.lang !== currentLang || showCurrent) {
            result += element
              .replace(/%title/g, alternate.title)
              .replace(/%path/g, alternate.path)
              .replace(/%lang/g, alternate.lang)
              .replace(/%currentTag/g, alternate.lang === currentLang ? 'current' : '')
              .replace(/%isCurrent/g, alternate.lang === currentLang)
              .replace(/%url/g, generateUrl(alternate.path, alternate.lang));
        }
    });

    result += append;
    result = result.replace(/%currentIndex/g, currentIndex);
    return result;
}

function listAlternatesHelper(options) {
    return listAlternates(options, this.page.alternates, this.page.lang, this.url_for_lang);
}

function listHeadAlternatesHelper() {
    return listAlternates({
        element: '<link rel="alternate" href="%url" hreflang="%lang" />',
        prepend: '',
        append: '',
        showCurrent: false
    }, this.page.alternates, this.page.lang, this.url_for_lang);
}

hexo.extend.helper.register('list_alternates_lang', listAlternatesHelper);
hexo.extend.helper.register('list_head_alternates_lang', listHeadAlternatesHelper);

module.exports = { getPageLanguages, getPostLanguages, listAlternatesHelper, listHeadAlternatesHelper };
