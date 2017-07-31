$(document).ready(function(e) {
  require('../../common/layout.css');
  require('../../common/layout.js');
  require('../../component/website/Load.css');
  require('../../css/integralCenter/luckWheel.css');
  //积分中心正在建设中
  //window.location.href = '/Integral/unOpen';
  
  var Blink = require('../../ui/Blink.js');
  var awardAlert = require('../../ui/Alert.js');
  var rotateNum = $('#rotateNum'),
    lwTit = $('.lw-tit'),
    pointer = $('.pointer'),
    lwAward = $('#lwAward'),
    mbLoad = $('.load'),
    mask = $('#mask'),
    wheelcanvas = $('#wheelcanvas'),
    rotateTimer,
    lwAwardHtml = '',
    isScroll;

  var rotateNumData = {
    data: {},
    mFun: 'GetIntegralDrawNum',
    beforeFun: function() {},
    sucFun: function(v) {
      mbLoad.hide();
      lwTit.show();
      rotateNum.html(v.count);
      $('#allNum').html(v.dailyCount);
    },
    unusualFun: function(v) {}
  }

  var turnplate = {
    alertInfo: [
      $('<em class="ico-close"></em>' +
        '<span class="ico-30y"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中30元话费！</p>'),
      $('<em class="ico-close"></em>' +
        '<span class="ico-5xj"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中5元现金一张！</p>'),
      $('<em class="ico-close"></em>' +
        '<span class="ico-88f"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中88积分！</p>'),
      $('<em class="ico-close"></em>' +
        '<span class="ico-58f"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中58积分！</p>'),
      $('<em class="ico-close"></em>' +
        '<span class="ico-5q"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中5元现金券一张！</p>'),
      $('<em class="ico-close"></em>' +
        '<span class="ico-05q"></span>' +
        '<h2 class="award-suc">抽中奖品！</h2>' +
        '<p class="award-about">恭喜您抽中0.5%加息券一张！</p>')
    ]
  };

  //中奖弹出框
  var award = new awardAlert({
    closeSelect: '.ico-close',
    btnHtml: '再抽一次',
    clickBtnCallback: function() {
      wheelcanvas.css({
        '-webkit-transition': 'none',
        'transition': 'none',
        '-webkit-transform': 'rotate(0deg)',
        'transform': 'rotate(0deg)'
      });
      setTimeout(function() {
        pointer.trigger('click');
        award.dialog.close();
      }, 10)
    }
  });

  //关闭按钮
  $('body').on('click','.ico-close',function(){
    wheelcanvas.css({
      '-webkit-transition': 'none',
      'transition': 'none',
      '-webkit-transform': 'rotate(0deg)',
      'transform': 'rotate(0deg)'
    });
    award.dialog.close();
  })

  //旋转转盘 item:奖品位置; txt：提示语;
  var rotateFn = function(item, txt) {
    switch (item) {
      case 1:
        angles = 180;
        break;
      case 2:
        angles = 240;
        break;
      case 3:
        angles = 120;
        break;
      case 4:
        angles = 60;
        break;
      case 5:
        angles = 360;
        break;
      case 6:
        angles = 300;
        break;
    }
    angles = 1800 + angles;
    wheelcanvas.css({
      '-webkit-transition': '-webkit-transform 5s',
      'transition': 'transform 5s',
      '-webkit-transform': 'rotate(' + angles + 'deg)',
      'transform': 'rotate(' + angles + 'deg)'
    });
    rotateTimer = setTimeout(function() {
      award.ops.select.addClass('winAlert');
      award.ops.select.find('.title').html(txt);
      award.open();
      mask.hide();
      //获取抽奖次数
      JSBK.Utils.postAjax(rotateNumData);
      //获奖记录
      JSBK.Utils.postAjax(winRecordList);
    }, 6000)
  };

  //初始化H5与APP是否已桥接
  JSBK.bindJsBrideg(function(){
      JSBK.bindToken(function() {
        //已登录
        JSBK.Utils.postAjax(rotateNumData);
        JSBK.Utils.postAjax(winRecordList);
      })
  },function(){
      mbLoad.show();
  });


  pointer.on('click', function() {
    clearTimeout(rotateTimer);
    JSBK.Utils.postAjax(lotteryFn);
  });

  var lotteryFn = {
    data: {
      Type: 2,
      DrawTimes: 1
    },
    mFun: 'IntegralDraw',
    beforeFun: function() {
      mask.show();
    },
    sucFun: function(v) {
      if (v.status == '1') {
        //未中奖
        mask.hide();
        noWinBlink.open();
      } else if (v.status == '2') {
        //无可用抽奖次数
        mask.hide();
        noPointsBlink.open();
      } else if (v.status == '3') {
        //今天的抽奖机会不足
        mask.hide();
        noChanceBlink.open();
      } else if (v.status == '0') {
        //中奖
        var list = v.prizeList;
        //奖品数量等于6,指针落在对应奖品区域的中心角度[180, 240, 120, 60, 360, 300]
        rotateFn(list[0].PrizeID, turnplate.alertInfo[list[0].PrizeID - 1]);
      }else{
        mask.hide();
      }
    },
    unusualFun: function(v) {
      mask.hide();
    }
  }

  //无积分弹出框
  var noPointsBlink = new Blink({
    blinkHtml: '您当前积分余额不足!'
  })

  //未中奖弹出框
  var noWinBlink = new Blink({
    blinkHtml: '未中奖!'
  })

  //无积分弹出框
  var noChanceBlink = new Blink({
    blinkHtml: '今天的抽奖机会已经用完啦！'
  })

  //获奖记录
  var winRecordList = {
    data: {
      PageSize: '8'
    },
    mFun: 'GetIntegralDrawRecordList',
    beforeFun: function() {

    },
    sucFun: function(v) {
      lwAwardHtml = '';
      for (var i = 0; i < v.length; i++) {
        lwAwardHtml += '<li>' + v[i].phone + ' 刚刚抽到了' + v[i].prizeTitle + '</li>';
      }
      lwAward.html(lwAwardHtml);
      warnSroll();     
    },
    unusualFun: function(v) {}
  };

  //跑马灯
  function warnSroll(){
      var ul = $("#lwAward"),
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
});