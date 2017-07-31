;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170418/special418.css');
    require('../../../component/activity/20170418/special418-01.js');

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

    //奖品份数
    var buyProductData = {
        data: {
         'AID': 20170418
        },
        mFun: 'ActivityBuyProductTopList',
        beforeFun : function(){
            load.show();
        },
        notLogged : function(){
            window.location.href = '/Activity/Exclusive20170218';
        },
        sucFun : function(v){
            load.hide();
            var joinDate = v.str1,
                besidesDate = v.str2;
            $('.is-join').each(function(i,v){
                if(joinDate[i] == 1){
                    $(this).html('可参与');
                }else if(joinDate[i] == 0){
                    $(this).html('暂不可<br>参与');
                }else{
                    $(this).html('已领取');
                }
            })

            $('.besides').each(function(i,v){
                $(this).html(besidesDate[i]);
            })

        },
        unusualFun : function(v){
         
        }
    }
    JSBK.Utils.postAjax(buyProductData);

    //微信分享
    JSBK.shareWinxin({
        'title': '4.18专属日来啦！春日花花，福利当道！惊喜红包券、迪士尼套票等福利任性拿！ 轻松点亮4月表情，离12个表情终极福利更进一步~',
        'desc': '4.18专属日来啦！春日花花，福利当道！惊喜红包券、迪士尼套票等福利任性拿！ 轻松点亮4月表情，离12个表情终极福利更进一步~',
        'link': 'http://np.94bank.com/Activity/Special41820170418',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170418/special418/share.jpg'
    })
});