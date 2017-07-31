;
(function($) {

    var LazyLoadImg = function(opt) {
        var defaults = {
            min: 0,
            max: -1,
            select: 'img',
            attr: 'data-src',
            ratioAttr: 'origin',
            isClip: false,
            imgRange: 1
        };
        this.ops = {};
        $.extend(this.ops, defaults, opt);
        this.init();
    };
    LazyLoadImg.prototype = {
        constructor: LazyLoadImg,
        init: function() {
            var _this = this,
                rafStatus = false;

            // 使用raf代码scoll和touchmove
            rAf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };

            function imgHander() {
                var $window = $(window),
                    min = _this.ops.min,
                    max = _this.ops.max,
                    wheight = $window.height(),
                    scrolltop = $window.scrollTop();
                if (_this.ops.min < scrolltop) {
                    min = scrolltop;
                }
                if (_this.ops.max === -1 || wheight * _this.ops.imgRange + scrolltop < _this.ops.max) {
                    max = wheight * _this.ops.imgRange + scrolltop;
                }
                _this.refreshImg(min, max);
                rafStatus = false;
            }

            function scrollHander() {
                if (rafStatus === true) {
                    return;
                }
                rafStatus = true;
                rAf(imgHander);
            }
            $(window).scroll(scrollHander);
            $(document).on('touchmove', scrollHander);
            // rAf(imgHander);
            $(window).trigger('scroll');
        },
        refreshImg: function(min, max) {
            var _this = this,
                style,
                top;
            style = this.ops.select.replace('.', '');
            $(this.ops.select).each(function(index, el) {
                var $this = $(el);
                top = $this.offset().top;
                if (top >= min && top <= max) {
                    _this.imgReplace($this, _this.ops.attr, _this.ops.ratioAttr, _this.ops.isClip);
                    $this.removeClass(style);
                }
            });
        },
        imgReplace: function(dom, attr, ratioAttr, isClip) {
            var _this = this,
                attrName = attr || 'data-src',
                url = dom.attr(attrName),
                img;
            if (!url) {
                return;
            }
            if (url) {
                img = new Image();
                img.onerror = function() {
                    // dom.removeAttr('data-src');
                    return false;
                };
                
                img.onload = function() {
                    // dom.removeAttr('data-src');
                    dom.attr('src', url);
                };

                img.src = url;
            }
        }
    };

    module.exports = LazyLoadImg;

})(Zepto);