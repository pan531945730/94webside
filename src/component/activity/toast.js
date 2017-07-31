;
(function($){
    var time = 300; //动画时间
    var fadeIn = function(ele,t) {
        t = t || time;
        ele.css('opacity','0').show().animate({
            opacity: 1
        }, t);
    };
    var fadeOut = function(ele,t) {
        t = t || time;
        ele.animate({
            opacity: 0
        }, t, 'linear', function() {
            ele.hide();
        });
    };
    /*
     * 提示框
     * @param msg 提示文字
     * @param time 显示时间
     * */
    var toast = (function() {
        var toast = $('<div id="toast" class="toast">');
        $('body').append(toast);
        return function(msg, time) {
            if (!msg) return;
            if (toast.css('display') !== 'none') {
                return;
            }
            time = time || 3000;
            toast.html(msg);
            fadeIn(toast,300);
            setTimeout(function() {
                fadeOut(toast,300);
            }, time);
        };
    }());
    module.exports = toast;
})(Zepto);