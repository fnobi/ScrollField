(function (exports, util) {
    function ScrollField (opts) {
        opts = opts || {};

        this.throttle = isNaN(opts.throttle) ? 1000 : opts.throttle;

        this.cursor = -1;

        this.initSpots(opts.els || []);
        this.initListeners();
    }
    inherits(ScrollField, EventEmitter);

    ScrollField.prototype.initSpots = function (els) {
        var spots = [];

        util.each(els, function (index, el) {
            spots.push(el);
        });

        this.spots = spots;
    };

    ScrollField.prototype.initListeners = function () {
        var self = this;

        new util.DOMEvent(window, 'scroll', function () {
            self.updateCursor();
        });
    };

    ScrollField.prototype.updateCursor = function () {
        var spots = this.spots;

        var windowTop = (
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            window.scrollTop ||
            0
        );
        var windowHeight = (
            window.innerHeight ||
            document.body.clientHeight ||
            0
        );
        var windowBottom = windowTop + windowHeight;
        var cursor = -1;
        var cursorElement = null;

        util.each(spots, function (index, el) {
            var yCenter = el.offsetTop + el.offsetHeight * 0.5;
            if (windowTop < yCenter && yCenter < windowBottom) {
                if (cursor >= 0) {
                    return;
                }
                cursor = index;
                cursorElement = el;
            }
        });

        if (cursor < 0) {
            return;
        }

        if (this.cursor === cursor) {
            return;
        }

        this.cursor = cursor;

        if (this.wait) {
            clearTimeout(this.wait);
            this.wait = null;
        }

        var self = this;
        this.wait = setTimeout(function () {
            self.emit('spot', {
                el: cursorElement,
                cursor: cursor
            });
            self.wait = null;
        }, this.throttle);
    };

    exports.ScrollField = ScrollField;
})(window, {
    each: function (list, fn) {
        fn = fn || function () {};
        for (var i = 0; i < list.length; i++) {
            fn(i, list[i]);
        }
    },
    DOMEvent: function (el, name, listener, flag) {
        return el.addEventListener ? (
            el.addEventListener(name, listener, flag)
        ) : (
            el.attachEvent('on' + name, listener)
        );
    }
});
