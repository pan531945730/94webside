;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170318/special318.css');
    
    var dlgMask = $('.dlg-mask'),
        dlgRuleMask = $('#dlg_rule_mask'),
        dlgRankMask = $('#dlg_rank_mask'),
        rankInfo = $('#rank_info'),
        rankMy = $('.my-rank span'),
        load = $('.load'),
        rankBtn = $('.rank-btn'),
        myRank = {};

    //查看规则
    $('.rule').on('click',function(){
        dlgRuleMask.show();
    })

    dlgMask.on('click',function(event){
        if (event.target === this) {
            event.stopPropagation();
            $(this).hide();
            $('html ,body').css({'height':'auto','overflow':'auto'});
        }
    })

    //排行榜
    function prizeFn(rank){
        var prize = '★★★★★★';
        if(rank > 0 && rank <= 10 ){
            prize = '含50元京东购物券';
        }else if(rank > 10 && rank <= 30){
            prize = '含10元现金奖励';
        }else if(rank > 30 && rank <= 60){
            prize = '含5元现金';
        }else if(rank > 60 && rank <= 94){
            prize = '含3元现金';
        }else if(rank > 94 && rank <= 1000){
            prize = '5元红包券';
        }
        return prize;
    }

    rankBtn.on('click',function(){
        var rankData = {
            data: {
                'AID': 20170318,
                'type': 2,
                'PS': 30
            },
            mFun: 'ActivityBuyProductTopList',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(res){
                load.hide();
                if(res == '-1'){
                    window.location.href = '/Activity/Exclusive20170218';
                    return;
                }
                if(!res || res.length == 0) return;
                var arr = [];
                myRank = res[res.length-1];
                delete res[res.length-1];
                res.length -- ;
                $.each(res,function(i,v){
                    var html = '',
                        rank = v.rank,
                        rankNum,
                        rankCss;

                    var prize = prizeFn(rank);
                    if(rank <= 3){
                        rankNum = '';
                        rankCss = 'rank0'+rank;
                    }else{
                        rankNum = rank;
                        rankCss = '';
                    }
                    
                    html += '<li><span class="rank '+rankCss+'">'+rankNum+'</span>';
                    html += '<span>'+v.phone+'</span>';
                    html += '<span>'+v.Score+'</span>';
                    html += '<span>'+prize+'</span></li>';
                    arr.push(html);
                })
                rankInfo.html(arr.join(''));
                rankMy.eq(0).html(myRank.rank);
                rankMy.eq(1).html(myRank.phone);
                rankMy.eq(2).html(myRank.Score);
                var myPrize = prizeFn(myRank.rank);
                rankMy.eq(3).html(myPrize);
                dlgRankMask.show();
                $('html ,body').css({'height':'100%','overflow':'hidden'});
            },
            notLogged: function() {
                window.location.href = '/Activity/Exclusive20170218';
            }
        }        
        //已登录
        JSBK.Utils.postAjax(rankData);
    })
    
    var ranking = JSBK.Utils.GetQueryString('ranking');
    if(ranking){
        rankBtn.trigger('click');
    }
    //微信分享
    JSBK.shareWinxin({
        'title': '94bank专属日福利爆棚，我已领取到94周边、京东电子券等好礼~终极福利近在眼前，参加即有好礼送~',
        'desc': '94bank专属日福利爆棚，我已领取到94周边、京东电子券等好礼~终极福利近在眼前，参加即有好礼送~',
        'link': 'http://np.94bank.com/Activity/Special31820170318',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170318/special318/share.jpg'
    })
});