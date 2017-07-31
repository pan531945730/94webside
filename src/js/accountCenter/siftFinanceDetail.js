;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/siftFinanceDetail.css'); 
    require('../../component/website/Load.css');
    var mbLoad = $('.load');

    var tradingId = JSBK.Utils.GetQueryString('tradingid');
    //初始化
    var sfData = {
        data: {
            'TradingId': tradingId
        },
        mFun: 'GetMyRegularProductDataDetail',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            var arr = [] ;
            mbLoad.hide();
            var html = '',
                endTime = v.endTimeText && v.endTimeText.replace('到期时间:','');
                
            html += '<header class="sfd-head">';
            html += '<div class="sfd-tit"><span>'+v.title+'</span><em>持有中</em></div>';
            html += '<p>加入时间：'+v.tradingTimeText+'</p></header>';
            html += '<ul class="sf-info">';
            html += '<li><label>投资金额</label><span>'+v.tradingAmountText+'</span></li>';
            if(v.plusFaceValue > 0){
                html += '<li><label>年化收益率</label><span>'+v.interestRateText+'+'+v.plusFaceValueText+'</span></li>';
            }else if(v.eventSpecificIncome > 0){
                html += '<li><label>年化收益率</label><span>'+v.interestRateText+'+'+v.eventSpecificIncome+'%</span></li>';
            }else{
                html += '<li><label>年化收益率</label><span>'+v.interestRateText+'</span></li>';
            }
            html += '<li class="sfd-bb"><label>预期收益</label><span class="earn-f">'+v.expectedProfitText+'</span></li>';
            html += '<li><label>产品期限</label><span>'+v.investmentTimeText+'</span></li>';
            html += '<li><label>起息日期</label><span>'+v.interestStarDate+'</span></li>';
            html += '<li><label>到期日期</label><span>'+endTime+'</span></li>';
            html += '<li class="sfd-bb"><label>到期处理</label><span>到期一次性兑付本金收益</span></li>';
            html += '<li><label>协议</label><span><a href="'+v.buyProtocolUrl+'">《购买协议》</a></span></li>';
            html += '</ul>';
            if (v.detailStatus == 2 && v.redeemStatus == 1){
                html += '<a href="javascript:void(0);" class="fm-btn">提前赎回</a>';
                html += '<p class="sfd-tip">满180天可提前赎回，手续费3%。</p>'
            }
            arr.push(html);
            $('body').html(arr.join(''));   
        },
        unusualFun : function(v){
            mbLoad.hide();
        }
    }
    JSBK.Utils.postAjax(sfData);      
});