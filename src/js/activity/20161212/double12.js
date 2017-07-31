;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20161212/double12.css');

    var neoLight = require('../../../ui/neoLight.js');
    var neo = new neoLight('#award',{
        lightNum : 6
    });
    neo.start();

    var dlgExpect = $('#dlg_expect'),
            expectClose = dlgExpect.find('em'),
            dlgWin = $('#dlg_win'),
            winSty = $('.win-sty'),
            winTxt = $('.win-txt');

        //未登录
        function unusualFun() {
            console.log('异常');
        }
        //已登录
        function sucFun() {
            neo.end();
            var sucData = {
                data: {
                    'AID': 20161212,
                    'DrawTimes' : 1,
                    'Type': 2
                },
                mFun: 'LotteryDraw',
                beforeFun : function(){
                },
                sucFun : function(res){
                    // 正常处理
                    if (res.Status == 0) {//中奖
                        dlgWin.css({ 'z-index': '100', 'opacity': '1' });
                        var result = res.PrizeList[0];
                        if(result.PrizeLevel == 1) {
                            winSty.html('<span>120</span>元京东卡');
                            winTxt.html('您抽中了120元京东卡');
                        }else if (result.PrizeLevel == 2) {
                            winSty.html('<span>12</span>元<br/>京东卡');
                            winTxt.html('您抽中了12元京东卡');
                        }else if (result.PrizeLevel == 3) {
                            winSty.html('<span>12</span>元<br/>红包');
                            winTxt.html('您抽中了12元红包');
                        }else if (result.PrizeLevel == 5) {
                            winSty.html('<span>0.5</span><br/>加息券');
                            winTxt.html('您抽中了0.5加息券');
                        }else if (result.PrizeLevel == 6) {
                            winSty.html('');
                            winTxt.html('谢谢惠顾');
                        }
                       
                    } else if (res.Status == 2) {//无可用抽奖机会
                        dlgWin.css({ 'z-index': '100', 'opacity': '1' });
                        winSty.html('');
                        winTxt.html('无可用抽奖机会');
                    } else if (res.Status == 3) {//活动未开始
                        dlgExpect.css({ 'z-index': '100', 'opacity': '1' });
                    } else if (res.Status == 4) {//活动已结束
                        dlgWin.css({ 'z-index': '100', 'opacity': '1' });
                        winSty.html('');
                        winTxt.html('活动已结束');
                    }
                },
                unusualFun : function(v){
                    $('.error-tip span').html(v.ES);
                }
            }        
            
            JSBK.Utils.postAjax(sucData);
        }

        //点击开始抽奖
        $('#draw_btn').on('click', function() {
            JSBK.bindToken(sucFun, unusualFun);
        })
        
        dlgWin.on('click',function(event){
            neo.end();
            $(this).css({ 'z-index': '-1', 'opacity': '0' });
        })
        
        //关闭投资弹窗
        expectClose.on('click', function() {
            neo.end();
            dlgExpect.css({ 'z-index': '-1', 'opacity': '0' });
        })

        //微信分享
        JSBK.shareWinxin({
            'title': '94bank玩转双12，红包、壕礼送不停！',
            'desc': '#1200大转盘# 你剁手来，我买单。京东购物券、现金红包、加息券，机会多多！',
            'link': 'http://np.94bank.com/Activity/zhengshi20161212',
            'imgUrl': 'http://img.94bank.com/activity/DoubleTwelve2016/pc/share.png'
        })

        var topData = {
                data: {
                    'AID': 20161212,
                    'PI':1,
                    'PS':12
                },
                mFun: 'ActivityBuyProductTopList',
                beforeFun : function(){
                },
                sucFun : function(res){
                    if(!res || res.length == 0) return;
                    var arr = [];                    
                    $.each(res,function(i,v){
                        var html = '',
                            rankicon;
                        switch(i){
                            case 0:
                            rankicon = '<img src="/np/dist/Activity/img/20161212/rank01.png" alt="" width="22" height="auto">';
                            break;
                            case 1:
                            rankicon = '<img src="/np/dist/Activity/img/20161212/rank02.png" alt="" width="22" height="auto">';
                            break;
                            case 2:
                            rankicon = '<img src="/np/dist/Activity/img/20161212/rank03.png" alt="" width="22" height="auto">';
                            break;
                            default:
                            rankicon = i + 1;
                            break;
                        }
                        html += '<li><span class="rank">'+rankicon+'</span>';
                        html += '<span>'+v.phone+'</span>';
                        html += '<span>'+v.totalAmountText+'</span></li>';
                        arr.push(html);
                    })
                    $('.tyrants-info ul').html(arr.join(''));   
                }
            }        
            
            JSBK.Utils.postAjax(topData);
})