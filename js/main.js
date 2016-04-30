
// screen size management

var hookToggle, screenSize;
var BIG = 1, SMALL = 2;

jQuery(function ($) {
    var big = $('#big');
    var small = $('#small');
    $(window).resize(resize);
    $(window).load(resize);
    function resize () {
        var newSize = getScreenSize();
        if (newSize !== screenSize) {
            change(newSize);
        }
    }
    function change (newSize) {
        screenSize = newSize;
        if (hookToggle) {
            hookToggle = hookToggle();
        } else if (screenSize == BIG) {
            hook();
        }
    }
    function getScreenSize () {
        if (isBlock(big))   return BIG;
        if (isBlock(small)) return SMALL;
        throw 'getScreenSize()';
    }
    function isBlock (el) {
        return el.css('display') == 'block';
    }
});

// hook

function hook () {
    
    var $ = jQuery;
    var img = $('#slogan img.big');
    var p  = $('#hook p');
    var w = img.width();
    var opaque = { opacity: 1 };
    
    var heartBeat = anim.repeat(2, foldr(function (x, l) {
        var bgPos = (-x.i * w) + 'px 0';
        var styles = { backgroundPosition: bgPos };
        return [
            anim.css(img, styles),
            anim.delay(x.ms)
        ].concat(l);
    }, [], [
        { i: 0, ms: 250 },
        { i: 4, ms: 50 },
        { i: 5, ms: 60 },
        { i: 0, ms: 70 },
        { i: 4, ms: 50 },
        { i: 5, ms: 60 },
        { i: 0, ms: 70 }
    ]));
    
    var miniFigs = anim.cycle(map(function (i) {
        var styles = {};
        var bgPos = (-i * w) + 'px 0';
        styles.opacity = 0;
        styles.backgroundPosition = bgPos;
        return anim.sequence([
            anim.css(img, styles),
            anim.animate(img, opaque),
            anim.delay(3000)
        ]);
    }, [ 1, 2, 3 ]));
    
    var animate = anim.sequence([
        anim.delay(500),
        anim.animate(p.eq(0), opaque),
        anim.delay(200),
        anim.animate(img, opaque),
	    heartBeat,
        anim.delay(500),
        anim.animate(p.eq(1), opaque),
        anim.delay(500),
        anim.animate(p.eq(2), opaque),
        anim.delay(1000),
        miniFigs
    ]);
    
    hookToggle = animate();
}

// slideshow

jQuery(function ($) {
    
    var i = 0;
    var img = $('#slides img');
    var hhh = $('#slide-legend h3');
    var ppp = $('#slide-legend p');
    var next = $('#slide-legend img');
    var cssIn  = { opacity: 1, left: 0 };
    var cssOut = { opacity: 0, left: '50%' };

    img.slice(1).css(cssOut);

    next.click(function (e) {
        e.preventDefault();
        img.eq(i).animate(cssOut, 250, function () {
            img.eq(i).removeClass('active');
            hhh.eq(i).removeClass('active');
            ppp.eq(i).removeClass('active');
            i = (i + 1) % 3;
            img.eq(i).addClass('active');
            hhh.eq(i).addClass('active');
            ppp.eq(i).addClass('active');
            img.eq(i).animate(cssIn, 'fast');
        });
    });
});

// nav
    
jQuery(function ($) {
    
    var vp = $('html,body');
    var section = $('.section');
    var next = $('.arrow:not(#go-top)');
    var gotop = $('#go-top');
    
    gotop.click(function (e) {
        e.preventDefault();
        vp.animate({ scrollTop: 0 });
    });
    
    next.click(function (e) {
        var curr, i, h, l;
        e.preventDefault();
        curr = $(this).closest('.section');
        i = section.index(curr.next());
        l = section.slice(0, i).not(':hidden');
        h = sum(map(height, l));
        vp.animate({ scrollTop: h });
    });

    function height (e) {
        return $(e).outerHeight();
    }
});

function foldr (f, b, l) {
    var n = l.length;
    while (n--) b = f(l[n], b);
    return b;
}

function map (f, l) {
    var n = l.length;
    return foldr(function (x, b) {
        return b[--n] = f(x), b;
    }, new Array(n), l);
}

function add (x, y) {
    return x + y;
}

function sum (numbers) {
    return foldr(add, 0, numbers);
}
