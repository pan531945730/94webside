;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/company/about.css');
    var Swiper = require('../../ui/swiper-3.4.1.min.js');
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: false,
        initialSlide: 0,
        onSlideChangeEnd: function(swiper) {

        }
    });
    /*var mySwiper2 = new Swiper('#prize', {
        loop: true,
        initialSlide: 0,
        slideActiveClass : 'horizontal-active',
        pagination: '.swiper-pagination',
        onSlideChangeEnd: function(swiper){
        }
    });*/
    var mySwiper3 = new Swiper('#honour', {
        loop: true,
        initialSlide: 0,
        slideActiveClass: 'horizontal-active',
        pagination: '.swiper-pagination',
        onSlideChangeEnd: function(swiper) {

        }
    });
    $('#call').on('click', function() {
        var num = $(this).find('em').html();
        window.location.href = 'tel:' + num;
    });
});