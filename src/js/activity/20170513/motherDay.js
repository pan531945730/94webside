;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170513/motherDay.css');
    var Blink = require('../../../ui/Blink.js');

    var dlgRuleMask = $('#dlg_rule_mask'),
        lgInfo = $('.lg-info'),
        prize = $('#prize'),
        prizeleve = $('.mt-prize');

    //查看规则
    $('.rule').on('click',function(){
     dlgRuleMask.show();
    })

    dlgRuleMask.on('click',function(event){
     if (event.target === this) {
         event.stopPropagation();
         $(this).hide();
     }
    })

    if (!JSBK.Utils.getCookie('ruledlg')) {
        JSBK.Utils.setCookie('ruledlg', 'yes', 36500);
        dlgRuleMask.show();
    }

    $('.mt-info').on('click','.login-btn',function(){
        var that = $(this);
        var initData = {
          data: {
            'AID': '20170513'
          },
          mFun: 'ActivityBuyProductTopList',
          beforeFun: function() {

          },
          sucFun: function(v) {
            console.log(v[0].LevelText);
            var data = v[0],
                profit = data.ExpectedProfit,
                level = data.LevelText;

            if(profit >= 200 ){
              prizeleve.find('li').removeClass('cur-leve');
              var curPrize = prizeleve.find('.'+level.toLowerCase());
              curPrize.addClass('cur-leve');
              prize.show().find('span').html(curPrize.attr('data-pize'));
              lgInfo.show().find('.lg-leve').html(level+'，');
            }else{
              prize.hide();
              lgInfo.show().find('.lg-leve').html(level);
            }
            that.hide();
          },
          unusualFun: function(v) {}
        };

        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(initData);
        });
    })
    
    

    //微信分享
    JSBK.shareWinxin({
        'title': '感恩母亲节来啦~5月14日10:00起至5月15日，来94购买指定9盈宝活动产品，即可参与“爱心直通车倾情奉送“活动。荣耀手机等9级奖励满则送，一切只为最爱的她~',
        'desc': '感恩母亲节来啦~5月14日10:00起至5月15日，来94购买指定9盈宝活动产品，即可参与“爱心直通车倾情奉送“活动。荣耀手机等9级奖励满则送，一切只为最爱的她~',
        'link': 'http://np.94bank.com/Activity/MothersDay20170513',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170513/motherDay/share.jpg'
    })
});