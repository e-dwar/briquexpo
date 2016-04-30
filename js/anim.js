anim = {};

anim.noop = function () {
    return this.noop;
};

anim.action = function (f) {
    return function resume (next) {
        return f(), next && next();
    };
};

anim.log = function (msg) {
    return anim.action(function () {
        console.log(msg);
    });
};

anim.sequence = function (steps) {
    var i = 0;
    return function resume (next) {
        if (i == steps.length) {
            return i = 0, next && next();
        } else {
            var step = steps[i++];
            return step(function () {
                return resume(next);
            });
        }
    };
};

anim.repeat = function (times, steps) {
    var i = 0, seq = this.sequence(steps);
    return function resume (next) {
        if (++i == times) {
            return i = 0, seq(next);
        } else {
            return seq(function () {
                return resume(next);
            });
        }
    };
};

anim.cycle = function (steps) {
    var seq = this.sequence(steps);
    return function resume () {
        return seq(resume);
    };
};

anim.delayed = function (r, p) {
    return function resume (next) {
        var pause = function () {
            return p(), function () {
                return resume(next);
            };
        };
        return r(function () {
            pause = next && next();
        }), function () {
            return pause && pause();
        };
    };
};

anim.delay = function (ms) {
    var tid;
    return this.delayed(function (next) {
        tid = setTimeout(next, ms);
    }, function () {
        clearTimeout(tid);
    });
};

anim.animate = function (el, styles) {
    el = jQuery(el);
    return this.delayed(function (next) {
        el.animate(styles, next);
    }, function () {
        el.stop();
    });
};

anim.css = function (el, styles) {
    el = jQuery(el);
    return anim.action(function () {
        el.css(styles);
    });
};
