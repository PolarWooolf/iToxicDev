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

module.exports = { getPageLanguages, getPostLanguages };