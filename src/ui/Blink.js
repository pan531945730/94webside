;
(function($) {
    var Blink = function(op) {
        var self = this;
        var defaults = {
            className   : "g-d-dialog blink-mod",
            bgClose     : false,
            select      : self.getSelect(),
            blinkHtml   : "blink blink",
            intervaltime : 3000    // 多长时间之后消失
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }

    Blink.prototype.init = function() {
        var self = this;
        self.setHtml();
        require('../ui/Dialog.css');
        var Dialog = require('../ui/Dialog.js');
        self.dialog = new Dialog( self.ops );
    }

    Blink.prototype.open = function(callback) {
        var self = this;
        self.dialog.open();
        setTimeout(function() {
            if( self.ops.timeoutCallback ) {
                self.ops.timeoutCallback(self);
            } else {
                self.dialog.close();
                callback && callback()
            }
        }, self.ops.intervaltime);
    }

    Blink.prototype.setHtml = function() {
        var self = this;
        self.ops.select.find(".blink-content").html( self.ops.blinkHtml );
    }

    Blink.prototype.setDoc = function(doc) {
        var self = this;
        self.dialog.dom.dialog.find(".blink-content").empty().append(doc);
    }

    Blink.prototype.getSelect = function() {
        return $('<div class="dialog-mod dialog-blink">' +
                    '<p class="blink-content"></p>' +
                '</div>');
    }
    
    module.exports = Blink;
})(Zepto);






