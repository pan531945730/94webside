/*
 *  会员登录
 *  日期：2017/2/14.
 *  作者：Math
 * */
;
(function(window, document, $, JSBK) {
    'use strict';
    var time = 300; //动画时间
    $.fn.fadeIn = function(t) {
        t = t || time;
        $(this).css('opacity','0').show().animate({
            opacity: 1
        }, t);
    };
    $.fn.fadeOut = function(t) {
        t = t || time;
        var $this = $(this);
        $this.animate({
            opacity: 0
        }, t, 'linear', function() {
            $this.hide();
        });
    };
    /*
     * 提示框
     * @param msg 提示文字
     * @param time 显示时间
     * */
    $.toast = (function() {
        var $toast = $('<div id="toast">');
        $('body').append($toast);
        return function(msg, time) {
            if (!msg) return;
            if ($toast.css('display') !== 'none') {
                return;
            }
            time = time || 3000;
            $toast.html(msg).fadeIn(300);
            setTimeout(function() {
                $toast.fadeOut(300);
            }, time);
        };
    }());
    //绑定提示
    var $bindDone = $('#bindDone'),
        $bindFail = $('#bindFail'),
        $bindTip = $('#bindTip'),
        bindStatus = false;
    //去签到页面
    function goSign() {
        window.location.href = '/Activity/Sign20170218'
    }
    $bindDone.on('click', 'i', function() {
        bindStatus = true;
        $bindTip.fadeIn();
        $bindDone.fadeOut();
    });
    $bindFail.on('click', 'i', function() {
        bindStatus = false;
        $bindTip.fadeIn();
        $bindFail.fadeOut();
    });
    $bindTip.on('click', function() {
        if (bindStatus) {
            goSign();
        } else {
            window.location.href = window.Zepto.setUrl + '/Product/ProductList';
        }
        $bindTip.fadeOut();
    });
    /*
     * 登录操作
     * */
    function login() {
        this.init();
    };
    var pro = login.prototype;
    //初始化
    pro.init = function() {
        this.initDom();
        this.bindFn();
    };
    //初始化dom元素
    pro.initDom = function() {
        this.$mobile = $('#mobile'),
        this.$password = $('#password'),
        this.$login = $('#login');
    };
    //检查手机号码
    pro.checkMobile = function() {
        var val = this.$mobile.val();
        if (!val) {
            $.toast('请输入手机号');
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(val)) {
            $.toast('请输入正确的手机号');
            return;
        }
        return true;
    };
    //检查密码
    pro.checkPassword = function() {
        var val = this.$password.val();
        if (!val) {
            $.toast('请输入登录密码');
            return;
        }
        return true;
    };
    //绑定事件
    pro.bindFn = function() {
        var self = this;
        self.$mobile.on('blur', function() {
            self.checkMobile();
        });
        self.$password.on('blur', function() {
            self.checkPassword();
        });
        self.$password.on('keyup', function(e) {
            var code = e.keyCode || e.which;
            if (code === 13 && self.checkMobile() && self.checkPassword()) {
                self.loginSubmit();
            }
        });
        self.$login.on('touchstart', function(e) {
            $(this).addClass('hover');
            e.preventDefault();
            if ($(this).parents('.login-bg').hasClass('logged')) {
                goSign();
                return;
            }
            if (self.checkMobile() && self.checkPassword()) {
                self.loginSubmit();
            }
        });
        self.$login.on('touchend', function() {
            $(this).removeClass('hover');
        });
    };
    //登录提交
    pro.loginSubmit = function() {
        var self = this;
        var logintelVal = self.$mobile.val();
        var loginpwdVal = self.$password.val();

        // ajax立即登录
        self.$login.prop('disabled', true);
        var sucData = {
            data: {
                Phone: logintelVal,
                Pswd: loginpwdVal
            },
            mFun: 'MemberLoginVip',
            sucFun: function(res) {
                self.$mobile.blur();
                self.$password.blur();
                if (res.Status === 0) { //绑定成功
                    $bindDone.fadeIn();
                } else { //非专属会员
                    $bindFail.fadeIn();
                }
                self.$login.prop('disabled', false);
            },
            notLogged : function(){
            }, 
            unusualFun: function(v) {
                $.toast(v.ES);
                self.$login.prop('disabled', false);
            }
        }
        JSBK.Utils.postAjax(sucData);
    };
    //调用登录方法
    module.exports = new login();
}(window, document, Zepto, JSBK));