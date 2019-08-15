var Home = location.href,
    Pages = 4,
    xhr,
    xhrUrl = '',
    vibrant,
    vibrantF;

var Diaspora = {
    L: function(url, f, err) {
        if (url == xhrUrl) {
            return false;
        }
        xhrUrl = url;
        if (xhr) {
            xhr.abort();
        }
        xhr = $.ajax({
            type: 'GET',
            url: url,
            timeout: 10000,
            success: function(data) {
                f(data);
                xhrUrl = '';
            },
            error: function(a, b, c) {
                if (b == 'abort') {
                    err && err()
                } else {
                    window.location.href = url;
                }
                xhrUrl = '';
            }
        });
    },
    P: function() {
        return !!('ontouchstart' in window);
    },
    PS: function() {
        if (!(window.history && history.pushState)){
            return;
        }
        history.replaceState({u: Home, t: document.title}, document.title, Home);
        window.addEventListener('popstate', function(e) {
            var state = e.state;
            if (!state) return;
            document.title = state.t;

            if (state.u == Home) {
                $('#preview').css('position', 'fixed');
                setTimeout(function() {
                    $('#preview').removeClass('show');
                    $('#container').show();
                    window.scrollTo(0, parseInt($('#container').data('scroll')));
                    setTimeout(function() {
                        $('#preview').html('');
                        $(window).trigger('resize');
                    }, 300);
                }, 0);
            } else {
                Diaspora.loading();
                Diaspora.L(state.u, function(data) {
                    document.title = state.t;
                    $('#preview').html($(data).filter('#single'));
                    Diaspora.preview();
                    setTimeout(function() { Diaspora.player(); }, 0);
                });
            }
        });
    },
    HS: function(tag, flag) {
        var id = tag.data('id') || 0,
            url = tag.attr('href'),
            title = tag.attr('title') + " - " + $("#config-title").text();

        if (!$('#preview').length || !(window.history && history.pushState)) location.href = url;
        Diaspora.loading()
        var state = {d: id, t: title, u: url};
        Diaspora.L(url, function(data) {
            if (!$(data).filter('#single').length) {
                location.href = url;
                return
            }
            switch (flag) {
                case 'push':
                    history.pushState(state, title, url)
                    break;
                case 'replace':
                    history.replaceState(state, title, url)
                    break;
            }
            document.title = title;
            $('#preview').html($(data).filter('#single'))
            switch (flag) {
                case 'push':
                    Diaspora.preview()
                    break;
                case 'replace':
                    window.scrollTo(0, 0)
                    Diaspora.loaded()
                    break;
            }
            setTimeout(function() {
                Diaspora.player();
                $('#top').show();
                comment = $("#gitalk-container");
                if (comment.data('ae') == true){
                    comment.click();
                }
            }, 0)
        })
    },
    preview: function() {
        // preview toggle
        $("#preview").one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
            var previewVisible = $('#preview').hasClass('show');
            if (!!previewVisible) {
                $('#container').hide();
            }else{
                $('#container').show();
            }
            Diaspora.loaded();
        });
        setTimeout(function() {
            $('#preview').addClass('show');
            $('.switchlang_dark').toolbar({
                content: '#toolbar-options-dark',
                position: 'bottom',
                style: 'dark',
                event: 'click',
                hideOnClick: true,
                animation: 'grow',
                adjustment: 35
            })
            $('#container').data('scroll', window.scrollY);
            setTimeout(function() {
                $('#preview').css({
                    'position': 'static',
                    'overflow-y': 'auto'
                });
            }, 500);
        }, 0);
    },
    player: function() {
        var p = $('#audio');
        if (!p.length) {
            $('.icon-play').css({
                'color': '#dedede',
                'cursor': 'not-allowed'
            })
            return
        }
        var sourceSrc= $("#audio source").eq(0).attr('src')
        if (sourceSrc == '' && p[0].src == ''){
            audiolist = $('#audio-list li');
            mp3 = audiolist.eq([Math.floor(Math.random() * audiolist.size())])
            p[0].src = mp3.data('url')
        }

        if (p.eq(0).data("autoplay") == true) {
            p[0].play();
        }

        p.on({
            'timeupdate': function() {
                var progress = p[0].currentTime / p[0].duration * 100;
                $('.bar').css('width', progress + '%');
                if (progress / 5 <= 1) {
                    p[0].volume = progress / 5;
                }else {
                    p[0].volume = 1;
                }
            },
            'ended': function() {
                $('.icon-pause').removeClass('icon-pause').addClass('icon-play')
            },
            'playing': function() {
                $('.icon-play').removeClass('icon-play').addClass('icon-pause')
            }
        })
    },
    loading: function() {
        var w = window.innerWidth;
        var css = '<style class="loaderstyle" id="loaderstyle'+ w +'">'+
            '@-moz-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
            '@-webkit-keyframes loader'+ w +'{100%{background-position:'+ w +'px 0}}'+
            '.loader'+ w +'{-webkit-animation:loader'+ w +' 3s linear infinite;-moz-animation:loader'+ w +' 3s linear infinite;}'+
            '</style>';
        $('.loaderstyle').remove()
        $('head').append(css)
        $('#loader').removeClass().addClass('loader'+ w).show()
    },
    loaded: function() {
        $('#loader').removeClass().hide()
    },
    F: function(id, w, h) {
        var _height = $(id).parent().height(),
            _width = $(id).parent().width(),
            ratio = h / w;
        if (_height / _width > ratio) {
            id.style.height = _height +'px';
            id.style.width = _height / ratio +'px';
        } else {
            id.style.width = _width +'px';
            id.style.height = _width * ratio +'px';
        }
        id.style.left = (_width - parseInt(id.style.width)) / 2 +'px';
        id.style.top = (_height - parseInt(id.style.height)) / 2 +'px';
    }
};

$(function() {
    function switchDayNight(mode) {
        if (mode === 'night') {
            $('body').addClass('night');
            return;
        }
        $('body').removeClass('night');
    }
    function getPreferredDayNight(autoModeQuery = window.matchMedia('(prefers-color-scheme: dark)')) {
        return autoModeQuery.matches ? 'night' : 'day';
    }
    var dayNightMode = 'auto';
    function updateDayNight(autoModeQuery) {
        if (dayNightMode === 'auto') {
            switchDayNight(getPreferredDayNight(autoModeQuery));
            return;
        }
        switchDayNight(dayNightMode);
    }
    try {
        dayNightMode = window.localStorage.getItem('dayNightMode') || dayNightMode;
        window.localStorage.setItem('dayNightMode', dayNightMode);
    } catch (e) {}

    updateDayNight();
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      const nightModeOn = e.matches;
      updateDayNight(e);
      console.log(`Night mode is ${nightModeOn ? '🌒 on' : '☀️ off'}.`);
    });

    if (Diaspora.P()) {
        $('body').addClass('touch')
    }
    if ($('#preview').length) {
        var coverFirst = {};
        coverFirst.t = $('#cover-first');
        coverFirst.w = coverFirst.t.attr('width');
        coverFirst.h = coverFirst.t.attr('height');
        ;(coverFirst.o = function() {
            $('#mark').height($('#screen').height())
        })();
        if (coverFirst.t.prop('complete')) {
            // why setTimeout ?
            setTimeout(function() { coverFirst.t.load() }, 0)
        }
        coverFirst.t.on('load', function() {
            ;(coverFirst.f = function() {
                var _w = $('#mark').width(), _h = $('#mark').height(), x, y, i, e;
                e = (_w >= 1000 || _h >= 1000) ? 1000 : 500;
                if (_w >= _h) {
                    i = _w / e * 50;
                    y = i;
                    x = i * _w / _h;
                } else {
                    i = _h / e * 50;
                    x = i;
                    y = i * _h / _w;
                }
                $('.layer-first').css({
                    'width': _w + x,
                    'height': _h + y,
                    'marginLeft': - 0.5 * x,
                    'marginTop': - 0.5 * y
                })
                if (!coverFirst.w) {
                    coverFirst.w = coverFirst.t.width();
                    coverFirst.h = coverFirst.t.height();
                }
                Diaspora.F($('#cover-first')[0], coverFirst.w, coverFirst.h)
                Vibrant.from($('#cover-first')[0]).getPalette().then(function(palette) {vibrantF = palette;});
            })();
        })
        var cover = {};
        cover.t = $('#cover');
        cover.w = cover.t.attr('width');
        cover.h = cover.t.attr('height');
        ;(cover.o = function() {
            $('#mark').height($('#screen').height())
        })();
        if (cover.t.prop('complete')) {
            // why setTimeout ?
            setTimeout(function() { cover.t.load() }, 0)
        }
        cover.t.on('load', function() {
            ;(cover.f = function() {
                var _w = $('#mark').width(), _h = $('#mark').height(), x, y, i, e;
                e = (_w >= 1000 || _h >= 1000) ? 1000 : 500;
                if (_w >= _h) {
                    i = _w / e * 50;
                    y = i;
                    x = i * _w / _h;
                } else {
                    i = _h / e * 50;
                    x = i;
                    y = i * _h / _w;
                }
                $('.layer').css({
                    'width': _w + x,
                    'height': _h + y,
                    'marginLeft': - 0.5 * x,
                    'marginTop': - 0.5 * y
                })
                if (!cover.w) {
                    cover.w = cover.t.width();
                    cover.h = cover.t.height();
                }
                Diaspora.F($('#cover')[0], cover.w, cover.h)
            })();
            setTimeout(function() {
                $('html, body').removeClass('loading')
            }, 1000)
            new Parallax($('#mark')[0]);
            vibrant = new Vibrant(cover.t[0]);
            Vibrant.from($('#cover')[0]).getPalette().then(function(palette) {
                vibrant = palette;
                if (vibrant['DarkVibrant']) {
                    $('#vibrant polygon').css('fill', vibrant['DarkVibrant'].getHex())
                    $('#vibrant div').css('background-color', vibrant['DarkVibrant'].getHex())
                    $('.icon-menu').css('color', vibrant['DarkVibrant'].getHex())
                }
            });
        })
        $('#preview').css('min-height', window.innerHeight)
        Diaspora.PS()
        $('.pview a').addClass('pviewa')
        var T;
        $(window).on('resize', function() {
            if (T) clearTimeout(T)
            T = setTimeout(function() {
                if (!Diaspora.P() && location.href == Home) {
                    cover.o()
                    cover.f()
                    coverFirst.f()
                }
                if ($('#loader').attr('class')) {
                    Diaspora.loading()
                }
            }, 500)
        })
    } else {
        $('#single').css('min-height', window.innerHeight)
        setTimeout(function() {
            $('html, body').removeClass('loading')
        }, 1000)
        window.addEventListener('popstate', function(e) {
            if (e.state) location.href = e.state.u;
        })
        Diaspora.player();
        $('.icon-icon, .image-icon').attr('href', '/')
        $('#top').show()
    }
    $(window).on('scroll', function() {
        if ($('.scrollbar').length && !Diaspora.P() && !$('.icon-images').hasClass('active')) {
            var wt = $(window).scrollTop(),
                tw  = $('#top').width(),
                dh = document.body.scrollHeight,
                wh  = $(window).height();
            var width = tw / (dh - wh) * wt;
            $('.scrollbar').width(width)
            if (wt > 80 && window.innerWidth > 800) {
                $('.subtitle').fadeIn()
            } else {
                $('.subtitle').fadeOut()
            }
        }
    })
    $(window).on('touchmove', function(e) {
        if ($('body').hasClass('mu')) {
            e.preventDefault()
        }
    })
    $('#post0').hover(() => {
        $('.layer').fadeOut(666);
        if (vibrantF['DarkVibrant']) {
            $('#vibrant polygon').css('fill', vibrantF['DarkVibrant'].getHex())
            $('#vibrant div').css('background-color', vibrantF['DarkVibrant'].getHex())
            $('.icon-menu').css('color', vibrantF['DarkVibrant'].getHex())
        }
    }, () => {
        $('.layer').fadeIn(666);
        if (vibrant['DarkVibrant']) {
            $('#vibrant polygon').css('fill', vibrant['DarkVibrant'].getHex())
            $('#vibrant div').css('background-color', vibrant['DarkVibrant'].getHex())
            $('.icon-menu').css('color', vibrant['DarkVibrant'].getHex())
        }
    });
    $('.switchlang').toolbar({
        content: '#toolbar-options',
        position: 'bottom',
        style: 'light',
        event: 'click',
        hideOnClick: true,
        animation: 'grow'
    })
    $('.switchdaynight').toolbar({
        content: '#toolbar-daynight',
        position: 'bottom',
        style: 'light',
        event: 'click',
        hideOnClick: true,
        animation: 'grow'
    })
    $('.switchlang_dark').toolbar({
        content: '#toolbar-options-dark',
        position: 'bottom',
        style: 'dark',
        event: 'click',
        hideOnClick: true,
        animation: 'grow',
        adjustment: 35
    })
    $('body').on('click', function(e) {
        var tag = $(e.target).attr('class') || '',
            rel = $(e.target).attr('rel') || '';
        // .content > ... > img
        if (e.target.nodeName == "IMG" && $(e.target).parents('div.content').length > 0) {
            tag = 'pimg';
        }
        if (!tag && !rel) return;
        switch (true) {
            // nav menu
            case (tag.indexOf('switchmenu') != -1):
                window.scrollTo(0, 0)
                $('html, body').toggleClass('mu');
                return false;
                break;
            case (tag.indexOf('dnd') != -1):
                switchDayNight('day');
                dayNightMode = 'day';
                try {
                  window.localStorage.setItem('dayNightMode', 'day');
                } catch (e) {}
                return false;
                break;
            case (tag.indexOf('dnn') != -1):
                switchDayNight('night');
                dayNightMode = 'night';
                try {
                  window.localStorage.setItem('dayNightMode', 'night');
                } catch (e) {}
                return false;
                break;
            case (tag.indexOf('dna') != -1):
                dayNightMode = 'auto';
                updateDayNight();
                try {
                  window.localStorage.setItem('dayNightMode', 'auto');
                } catch (e) {}
                return false;
                break;
            case (tag.indexOf('tool-item') != -1):
              window.location = $(e.target).attr('href');
              return false;
              break;
            // next page
            case (tag.indexOf('more') != -1):
                tag = $('.more');
                if (tag.data('status') == 'loading') {
                    return false
                }
                var num = parseInt(tag.data('page')) || 1;
                if (num == 1) {
                    tag.data('page', 1)
                }
                if (num >= Pages) {
                    return
                }
                tag.html('加载中...').data('status', 'loading')
                Diaspora.loading()
                Diaspora.L(tag.attr('href'), function(data) {
                    var link = $(data).find('.more').attr('href');
                    if (link != undefined) {
                        tag.attr('href', link).html('加载更多').data('status', 'loaded')
                        tag.data('page', parseInt(tag.data('page')) + 1)
                    } else {
                        $('#pager').remove()
                    }
                    var tempScrollTop = $(window).scrollTop();
                    $('#primary').append($(data).find('.post'))
                    $(window).scrollTop(tempScrollTop + 100);
                    Diaspora.loaded()
                    $('html,body').animate({ scrollTop: tempScrollTop + 400 }, 500);
                }, function() {
                    tag.html('加载更多').data('status', 'loaded')
                })
                return false;
                break;
            // home
            case (tag.indexOf('icon-home') != -1):
                $('.toc').fadeOut(100);
                if ($('#preview').hasClass('show')) {
                    history.back();
                } else {
                    location.href = $('.icon-home').data('url')
                }
                return false;
                break;
            // qrcode
            case (tag.indexOf('icon-scan') != -1):
                if ($('.icon-scan').hasClass('tg')) {
                    $('#qr').toggle()
                } else {
                    $('.icon-scan').addClass('tg')
                    $('#qr').qrcode({ width: 128, height: 128, text: location.href}).toggle()
                }
                return false;
                break;
            // audio play
            case (tag.indexOf('icon-play') != -1):
                $('#audio')[0].play()
                $('.icon-play').removeClass('icon-play').addClass('icon-pause')
                return false;
                break;
            // audio pause
            case (tag.indexOf('icon-pause') != -1):
                $('#audio')[0].pause()
                $('.icon-pause').removeClass('icon-pause').addClass('icon-play')
                return false;
                break;
            // history state
            case (tag.indexOf('cover') != -1):
                Diaspora.HS($(e.target).parent(), 'push')
                return false;
                break;
            // history state
            case (tag.indexOf('posttitle') != -1):
                Diaspora.HS($(e.target), 'push')
                return false;
                break;
            // prev, next post
            case (rel == 'prev' || rel == 'next'):
                if (rel == 'prev') {
                    var t = $('#prev_next a')[0].text
                } else {
                    var t = $('#prev_next a')[1].text
                }
                $(e.target).attr('title', t)
                Diaspora.HS($(e.target), 'replace')
                return false;
                break;
            // toc
            case (tag.indexOf('toc-text') != -1 || tag.indexOf('toc-link') != -1
                  || tag.indexOf('toc-number') != -1):
                hash = '';
                if (e.target.nodeName == 'SPAN'){
                  hash = $(e.target).parent().attr('href')
                }else{
                  hash = $(e.target).attr('href')
                }
                to  = $("a.headerlink[href='" + hash + "']")
                $("html,body").animate({
                  scrollTop: to.offset().top - 50
                }, 300);
                return false;
                break;
            // quick view
            case (tag.indexOf('pviewa') != -1):
                $('body').removeClass('mu')
                setTimeout(function() {
                    Diaspora.HS($(e.target), 'push')
                    $('.toc').fadeIn(1000);
                }, 300)
                return false;
                break;
            // photoswipe
            case (tag.indexOf('pimg') != -1):
                var pswpElement = $('.pswp').get(0);
                if (pswpElement) {
                    var items = [];
                    var index = 0;
                    var imgs = [];
                    $('.content img').each(function(i, v){
                        // get index
                        if (e.target.src == v.src) {
                            index = i;
                        }
                        var item = {
                            src: v.src,
                            w: v.naturalWidth,
                            h: v.naturalHeight
                        };
                        imgs.push(v);
                        items.push(item);
                    });
                    var options = {
                        index: index,
                        shareEl: false,
                        zoomEl: false,
                        allowRotationOnUserZoom: true,
                        history: false,
                        getThumbBoundsFn: function(index) {
                            // See Options -> getThumbBoundsFn section of documentation for more info
                            var thumbnail = imgs[index],
                                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                rect = thumbnail.getBoundingClientRect(); 

                            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                        }
                    };
                    var lightBox= new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                }
                return false;
                break;
              // comment
            case - 1 != tag.indexOf("comment"): 
                Diaspora.loading(),
                comment = $('#gitalk-container');
                gitalk = new Gitalk({
                  clientID: comment.data('ci'),
                  clientSecret: comment.data('cs'),
                  repo: comment.data('r'),
                  owner: comment.data('o'),
                  admin: comment.data('a'),
                  id: decodeURI(window.location.pathname),
                  distractionFreeMode: comment.data('d')
                })
                $(".comment").removeClass("link")
                gitalk.render('gitalk-container')
                Diaspora.loaded();
                return false;
                break;
            default:
                return;
                break;
        }
    })
    // 是否自动展开评论
    comment = $("#gitalk-container");
    if (comment.data('ae') == true){
        comment.click();
    }
    console.log("%c Love check console? Check out my github to help me with something %c","background:#2e2e2e; color:#e2e2e2","","https://github.com/CodersGit")
})

