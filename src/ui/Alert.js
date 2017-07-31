;
(function($) {
    var Alert = function(op) {
        var self = this;
        var defaults = {
            centerTitle : false, // title是否居中
            bgClose     : false,
            titleHtml   : "成功！",
            btnHtml     : "确定",
            select      : self.getSelect(),
            clickBtnCallback : null
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }

    Alert.prototype.init = function() {
        var self = this;
        self.setHtml();
        require('../ui/Dialog.css');
        var Dialog = require('../ui/Dialog.js');
        self.dialog = new Dialog( self.ops );
        self.bindEvent();
    }

    Alert.prototype.open = function() {
        this.dialog.open();
    }

    Alert.prototype.bindEvent = function() {
        var self = this;
        self.ops.select.on("click", ".btn", function(e) {
            e.stopPropagation();
            if( self.ops.clickBtnCallback ) {
                self.ops.clickBtnCallback(self);
            } else {
                self.dialog.close();
            }
        });
    }

    Alert.prototype.setHtml = function() {
        var self = this;
        if(self.ops.centerTitle) {
            self.ops.select.addClass( "center-title" );
        }
        self.ops.select.find(".title").html( self.ops.titleHtml );
        self.ops.select.find(".btn").html( self.ops.btnHtml );
    }

    Alert.prototype.getSelect = function() {
        return $('<div class="dialog-mod dialog-alert">' +
                    '<div class="title"></div>' +
                    '<div class="btn-wrap">' +
                        '<span class="btn"></span>' +
                    '</div>' +
                '</div>');
    }

    module.exports = Alert;
})(Zepto);
