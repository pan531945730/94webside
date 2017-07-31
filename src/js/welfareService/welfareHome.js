$(document).ready(function(e) {
  require('../../common/layout.css');
  var JSBK = require('../../common/layout02.js');
  var Brideg = require('../../component/webapp/brideg.js');
  require('../../component/website/Load.css');
  require('../../css/welfareService/welfareHome.css');
  
  var Blink = require('../../ui/Blink.js');
  var awardAlert = require('../../ui/Alert.js');
  var lotteryBtn = $('.lottery-btn'),
      whAward = $('#whAward'),
      load = $('.load'),
      lotteryList = $('.lottery-list'),
      lotteryLi,
      noPointsBlink,
      noWinBlink,
      noChanceBlink,
      isScroll,
      isLottery;
  //ios
  var isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if(isIos){
    $('.lottery-info').append('<p class="notes">本活动及抽奖奖品与苹果公司无关</p>')
  }
  //我的积分
  $('.my-integral span').on('click',function(){
    Brideg.integral();
  })

  //赚积分
  $('.earn-integral a').on('click',function(){
    Brideg.earnEntegral();
  })

  //抽奖说明
  var awardDesHtml = '<p>1.每次抽奖需要扣除200积分，每人每天限抽10次，扣除的积分将不予退还</p>'+
                     '<p>2.若您抽中现金券、加息券等，请在您的红包优惠账户内查询</p>'+
                     /*'<p>3.抽中的话费奖励将于3个工作日内充值到您的94bank注册手机号码中</p>'+*/
                     '<p>3.实物奖励将于10个工作日内快递至您填写的收货地址，请注意查收</p>'+
                     '<p>4.活动最终解释权归94bank所有</p>'
  var awardDes;
  $('.lottery-tit').on('click','a',function(){
    if(!awardDes){
      awardDes = new awardAlert({
        className: 'g-d-dialog award-dialog',
        titleHtml: awardDesHtml,
        btnHtml: '知道了'
      });
    }
    awardDes.open();
  })

  //初始化奖池奖品
  var initData = {
    data: {
    },
    mFun: 'GetPrizeList',
    sucFun: function(v) {
      isLottery = true;
      var html = '';
      $.each(v,function(i,v){
        if(i == 0){
          html += '<li class="lottery" data-index="'+i+'" data-prizeid="'+v.PrizeID+'">';
        }else{
          html += '<li data-index="'+i+'" data-prizeid="'+v.PrizeID+'">';
        }
          html += '<div><img src="'+v.PrizeImg+'" alt="lottery" width="50%" height="auto"></div>';
          html += '<p>'+v.PrizeTitle+'</p></li>';
      })
      lotteryList.html(html);
      lotteryLi = lotteryList.find('li');   
    },
    unusualFun: function(v) {}
  };
  JSBK.Utils.postAjax(initData);

  //获奖记录
  var winRecordList = {
    data: {
      PageSize: '8'
    },
    mFun: 'GetIntegralDrawRecordList',
    sucFun: function(v) {
      load.hide();
      var whAwardHtml = '';
      for (var i = 0; i < v.length; i++) {
        whAwardHtml += '<li>' + v[i].phone + '<span>获得</span>' + v[i].prizeTitle + '</li>';
      }
      whAward.html(whAwardHtml);
      warnSroll();     
    },
    unusualFun: function(v) {
    }
  };

  //跑马灯
  function warnSroll(){
    var ul = $("#whAward"),
        li = ul.find("li"),
        height = li.height(),
        html = ul.html(),
        i = 1,
        length = li.size();
        if (length <= 3) { return;};
        ul.html(html + html);
        clearInterval(isScroll);
        ul.css({marginTop: 0});
        isScroll = setInterval(function () {
           ul.addClass('animate');
           ul.css({marginTop: - i * height});
           i++;
           if (i > length) {
               i = 1;
               setTimeout(function () {
                   ul.removeClass('animate').css({marginTop: 0});
               }, 500);
           }
        }, 6000);
  }

  //积分
  var integralAccount = {
    data: {
    },
    mFun: 'GetIntegralAccount',
    sucFun: function(v) {
      $('#my_integtal').html(v.accountIntegral);
      $('#get_integral').html(v.sevenDayIntegral);  
    },
    unusualFun: function(v) {}
  };
  
  //中奖弹出框
  var award = new awardAlert({
    className: 'g-d-dialog lottery-dialog',
    bgClose: true,
    btnHtml: '',
    clickBtnCallback: function() {
      award.dialog.close();
      lotteryBtn.trigger('click');
    }
  });
  if(award){
    $('#lottery_bg').appendTo('.lottery-dialog .dialog-alert');
  }

  //中奖接口
  var lotteryFn = {
    data: {
      Type: 2,
      DrawTimes: 1
    },
    mFun: 'IntegralDraw',
    beforeFun: function() {
      
    },
    sucFun: function(v) {
      if (v.status == '1') {
        //未中奖
        if(!noWinBlink){
          noWinBlink = new Blink({
            blinkHtml: '未中奖!'
          })
        }
        noWinBlink.open();
      } else if (v.status == '2') {
        //无可用抽奖次数
        if(!noPointsBlink){
          noPointsBlink = new Blink({
            blinkHtml: '您当前积分余额不足!'
          })
        }
        noPointsBlink.open();
      } else if (v.status == '3') {
        //今天的抽奖机会不足
        if(!noChanceBlink){
          noChanceBlink = new Blink({
            blinkHtml: '今天的抽奖机会已经用完啦！'
          })
        }
        noChanceBlink.open();
      } else if (v.status == '0') {
        //中奖
        var list = v.prizeList;
        rotateFn(list[0].PrizeID,3);
      }else{
      }
    },
    unusualFun: function(v) {
    }
  }

  //旋转转盘 item:奖品位置;
  function rotateFn(item,circle) {
    var i = lotteryList.find('.lottery').attr('data-index'),
        j = 0;
    var rotateInterval = setInterval(function(){
      i++;
      j++;
      lotteryLi.eq(i).addClass('lottery').siblings('li').removeClass('lottery');
      if(i == 8){
        i = -1;
      }
      if(j == circle*9){
        clearInterval(rotateInterval);
        //中奖弹出框
        $('.lottery-list li[data-prizeid="'+item+'"]').addClass('lottery').siblings('li').removeClass('lottery');
        var winPrize = $('.lottery-list .lottery');
            winImg = winPrize.find('img').attr('src'),
            winTit = winPrize.find('p').html();
        var winHtml = '<div class="win-img"><img src="'+winImg+'" alt="lottery" width="35%" height="auto"></div>'+
                      '<p>恭喜您获得'+winTit+'</p>';
        award.ops.select.find('.title').html(winHtml);
        award.open();
        //获奖记录
        JSBK.Utils.postAjax(winRecordList);
        JSBK.Utils.postAjax(integralAccount);
      }
      
    },100)
  };

  //点击立即抽奖
  lotteryBtn.on('click', function() {
    if(isLottery){
      Brideg.bindToken(function() {
        JSBK.Utils.postAjax(lotteryFn);
      })
    }    
  });

  window.welfareHome = function(){
    JSBK.Utils.postAjax(winRecordList);
    JSBK.Utils.postAjax(integralAccount);
  }

  var openFrom = JSBK.Utils.GetQueryString('openFrom');
  if(!openFrom){
    window.welfareHome();
  }
});