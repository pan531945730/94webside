;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170422/springRaise.css');

    var dlgRuleMask = $('#dlg_rule_mask'),
        load = $('.load');

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

    //跑马灯
    function warnSroll(){
        var ul = $("#rank_info"),
            li = ul.find("li"),
            height = li.height(),
            html = ul.html(),
            i = 1,
            length = li.size();
            if (length <= 3) { return;};
            ul.html(html + html);
            setInterval(function () {
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

    //获奖记录
    var winRecordList = {
      data: {
        'AID': '20170422'
      },
      mFun: 'ActivityBuyProductTopList',
      beforeFun: function() {

      },
      sucFun: function(v) {
        var lwAwardHtml = '';
        for (var i = 0; i < v.length; i++) {
          var headPhone = v[i].HeadPhoto !=''? v[i].HeadPhoto :  window.Zepto.linkUrl + '/dist/Activity/img/20170422/springRaise/default-head.png'; 
          lwAwardHtml += '<li><img class="head" src="'+headPhone+'" width="22" height="22" alt="head"><span class="name">' + v[i].RealName + '</span><span class="des">' + v[i].Content + '</span></li>';
        }
        $('.rank-mod').addClass('rank-info');
        $("#rank_info").html(lwAwardHtml);
        warnSroll();     
      },
      unusualFun: function(v) {}
    };

    JSBK.Utils.postAjax(winRecordList);

    //微信分享
    JSBK.shareWinxin({
        'title': '4月要加薪，94来帮忙，最高20倍加薪福利等你拿，还有机会获得精美礼品！',
        'desc': '4月要加薪，94来帮忙，最高20倍加薪福利等你拿，还有机会获得精美礼品！',
        'link': 'http://np.94bank.com/Activity/Special42220170422',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170422/springRaise/share.jpg'
    })
});