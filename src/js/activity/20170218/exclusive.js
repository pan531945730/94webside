;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/toast.css');
    var toast = require('../../../component/activity/toast.js');
    require('../../../component/activity/20170218/wxShare.js');
    require('../../../css/activity/20170218/exclusive.css');
    require('../../../component/activity/20170218/bind.js');
    var Swiper = require('../../../ui/swiper-3.4.1.min.js');
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: false,
        onSlideChangeEnd: function(swiper){
            $('.swiper-slide .pg-desc').removeClass('pg-desc-show');
            $('.pg-'+swiper.activeIndex).find('.pg-desc').addClass('pg-desc-show');

        }
    })
    // UI 动画
    setTimeout(function(){
        $('.img-open').addClass('open');
    },1000)

    $('.idx-letter').on('click',function(){
        $('.idx').hide();
        $('.pg-0 .pg-desc').addClass('pg-desc-show');
    })
    //获取绑定状态
    var $loginBox = $('#loginBox');
    var bindData = {
        data: {
            AID: '20170218',
            Action: 'isbind',
            SourceType: 1
        },
        mFun: 'ActivityMain',
        sucFun: function(res) {
            if (res.Status === 0) { //0 已绑定
                $loginBox.addClass('logged');
            }
        },
        notLogged : function(){
        },    
        unusualFun: function(v) {
            toast(v.ES);
        }
    }
    JSBK.Utils.postAjax(bindData);
});