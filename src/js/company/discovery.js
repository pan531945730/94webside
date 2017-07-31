;
$(function() {
    require('../../common/layout.css');
    var JSBK = require('../../common/layout02.js');
    var Brideg = require('../../component/webapp/brideg.js');
    require('../../css/company/discovery.css');
    var Swiper = require('../../ui/swiper-3.4.1.min.js');
    var Blink = require('../../ui/Blink.js');

    //签到
    var isSignBlink;
    $('body').on('click','a[data-type="11"]',function(e){
        e.preventDefault();
        if(!isSignBlink){
            isSignBlink = new Blink({
                blinkHtml: '功能建设中，敬请期待...'
            })
        }
        isSignBlink.open();
    })

    //客服
    $('body').on('click','a[data-type="9"]',function(e){
        e.preventDefault();
        Brideg.severceOnLine();
    })

    //邀请返现
    $('body').on('click','a[data-type="10"]',function(e){
        e.preventDefault();
        Brideg.invateFriend();
    })
    
    //头部其它跳转
    $('body').on('click','a[data-jump]',function(e){
        e.preventDefault();
        var that = $(this),
            url = that.attr('data-jump'),
            title = that.find('p').html();
        if(title == '转盘抽奖'){
            title = '福利社';
        }
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.jumpUrl',
            'url' : url,
            'title' : title
        }
        Brideg.jumpUrl(requestData); 
    })

    //信用生活&&生活小助手
    $('.dc-life').on('click','a',function(e){
        e.preventDefault();
        var that = $(this),
            url = that.attr('href'),
            title = that.find('p').html();
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.jumpUrl',
            'url' : url,
            'title' : title
        }
        Brideg.jumpUrl(requestData); 
    })

    //推荐游戏 
    $('.dc-game').on('click','.enter',function(e){
        e.preventDefault();
        var that = $(this),
            url = that.attr('href'),
            title = that.siblings('.game-name').find('h3').text().replace('人气','');
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.jumpUrl',
            'url' : url,
            'title' : title
        }
        Brideg.jumpUrl(requestData); 
    })
    //头部图标
    var navMod = $('.dc-nav');
    var iconsData = {
      data: {
        UseType : 2
      },
      mFun: 'GetIcons',
      sucFun: function(v) {
        
        if(v.length <=0){
            navMod.hide();
            return;
        }
        var html = '';
        $.each(v,function(i,v){
            if(v.type == 1){
                html += '<a href="javascript:void(0);" data-jump="'+v.jumpType+'">';
            }else{
                html += '<a href="javascript:void(0);" data-type="'+v.jumpType+'">';
            }
            html += '<span><img src="'+v.imageUrl+'" alt="discovery" width="100%" height="auto"></span>';
            html += '<p>'+v.title+'</p></a>'
        })
        navMod.find('.nav-info').html(html);
        navMod.show();
      },
      unusualFun: function(v) {
        navMod.hide();
      }
    };
    JSBK.Utils.postAjax(iconsData);

    //banner
    var swiperContainer = $('.swiper-container')
    var bannerData = {
      data: {
        ReadKey : 'Find'
      },
      mFun: 'GetBanner',
      sucFun: function(v) {
        
        if(v.length <=0){
            swiperContainer.hide();
            return;
        }
        var html = '',
            proHtml = '';
        $.each(v,function(i,v){
            html += '<a href="javascript:void(0);" class="swiper-slide">';
            html += '<img src="'+v.photo+'" alt="discovery" width="100%" height="auto">';
            html += '</a>';
            proHtml += '<span></span>';
        })
        swiperContainer.find('.swiper-wrapper').html(html);
        swiperContainer.find('.swiper-pagination').html(proHtml);
        swiperContainer.show();
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            autoplay: 4000,
            paginationClickable: true
        });
      },
      unusualFun: function(v) {
        navMod.hide();
      }
    };

    JSBK.Utils.postAjax(bannerData);
});