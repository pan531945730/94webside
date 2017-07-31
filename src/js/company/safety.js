;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/company/safety.css');
    var Swiper = require('../../ui/swiper-3.4.1.min.js');
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: false,
        initialSlide: 0,
        onSlideChangeEnd: function(swiper){

        }
    });
    var mySwiper2 = new Swiper('.swiper-horizontal', {
        loop: true,
        slideActiveClass : 'horizontal-active',
        initialSlide: 0,
        pagination: '.swiper-pagination',
        onSlideChangeEnd: function(swiper){

        }
    });
});