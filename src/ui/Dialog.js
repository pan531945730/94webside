;
(function($) {
    var Observer = require('../ui/Observer.js');
    var Dialog = function(opt) {
        var defaults = {
            className: 'g-d-dialog',
            actionEvent: 'click',
            bgClose: false,
            targetNode: ''
        };
        this.ops = $.extend(defaults, opt);
        this.dom = {};
        Observer.addPublisher(this);
        this.init();
    };

    Dialog.prototype = {
        constructor: Dialog,
        init: function() {
            var frame = $(document.createDocumentFragment()),
                _this = this,
                content,
                div = $('<div></div>');
            div.addClass(this.ops.className);
            frame.append(div);
            if(this.ops.select){
                content = $(this.ops.select);
            }
            div.append(content||'');
            $('body').append(frame);
            this.dom.dialog = div;

            // 禁止弹层上面的touchmove
            this.dom.dialog.on('touchmove', function(e) {
                e.preventDefault();
            });

            // 关闭按钮
            $(this.ops.closeSelect).click(function(event) { // 初始化关闭按钮
                event.stopPropagation();
                _this.trigger('dialogClose');
                _this.close();
            });

            // 点击背景关闭
            if (this.ops.bgClose) {
                div.click(function(event) { // 点击背景关闭
                    if (event.target === this) {
                        event.stopPropagation();
                        _this.trigger('bgClose');
                        _this.close();
                    }
                });
            }

            // 输入框
            div.find('input').blur(function(event) {
                event.stopPropagation();
                _this.fixDrawSlow();
            });

            // 打开弹框
            if (this.ops.targetNode) {
                $(this.ops.targetNode).on(this.ops.actionEvent, function(event) {
                    event.stopPropagation();
                    var arr = [].slice.call(arguments);
                    _this.open(arr.slice(1));
                });
            }
        },
        open: function(arg) {
            this.trigger('open', arg);
            this.dom.dialog.css('display', '-webkit-box');
            this.trigger('afteropen', arg);
        },
        close: function(arg) {
            this.dom.dialog.hide();
            this.trigger('close', arg);
        },
        getDialog: function() {
            return this.dom.dialog;
        },
        fixDrawSlow: function() {
            var top = $(window).scrollTop();
            setTimeout(function() {
                $(window).scrollTop(top + 1);
                setTimeout(function() {
                    $(window).scrollTop(top);
                }, 10);
            }, 1);
        },
    };

    module.exports = Dialog;
})(Zepto);
