;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/stewardDetail.css'); 
    require('../../component/website/Load.css');
    var sdLoad = $('.load');
    var tradingId = JSBK.Utils.GetQueryString('tradingid'),
        productId = JSBK.Utils.GetQueryString('productId');
    //初始化
    var sdData = {
        data: {
            'TradingId': tradingId,
            'ProductId': productId,
            'PageIndex': 1,
            'PageSize': 10
        },
        mFun: 'GetMyCurrentProductDataDetail',
        beforeFun : function(){
            sdLoad.show();
        },
        sucFun : function(v){
            var arr = [] ;
            sdLoad.hide();
            var html = '',
                tradData = v.productTradeWaterData,
                priceSty = '';
                
            html += '<header class="sfd-head">';
            html += '<div class="sfd-tit"><span>'+v.title+'</span><em>持有中</em></div>';
            if(v.productType2Id == 18){ //月月增
                html += '<p>最高9%，每月可赎回</p>';
            }else{
                html += '<p>随时申赎，活期理财收益高</p>';
            }            
            html += '</header>';
            html += '<ul class="sf-info">';
            html += '<li><label>在投金额</label><span>'+v.totalProductPriceText+'</span></li>';
            if(v.productType2Id == 18){ //月月增
                html += '<li><label>当前年化收益率</label><span>'+v.currentInterestRate+'</span></li>';
                html += '<li><label>持有期限</label><span>'+v.haveProductTime+'</span></li>';
                html += '<li><label>持有期收益</label><span>'+v.haveProductTimeRate+'</span></li>';
            }else{
                html += '<li><label>累计收益</label><span>'+v.currentTotalInterestText+'</span></li>';
                html += '<li><label>昨日收益</label><span>'+v.interest+'</span></li>';
                html += '<li><label>昨日年化收益率</label><span>'+v.yesterdayInterestRateText+'</span></li>';
            }
            
            html += '</ul><h2 class="sd-tit">交易流水</h2>';
            html += '<ul class="sd-info">';
            $.each(tradData,function(i,val){
                switch(val.tradingType){
                    case 1:
                    priceSty = 'incr';
                    break;
                    default:
                    priceSty = 'redu';
                }
                html += '<li><div class="sd-main">'
                html += '<p>'+val.title+'</p><span>'+val.tradingTime+'</span>';
                html += '</div><div class="sd-side">';
                html += '<p class="'+priceSty+'">'+val.tradingAmountText+'</p><span>'+val.statusText+'</span>';
                html += '</div></li>';
            })
            html += '</ul>';
            arr.push(html);
            sdLoad.before(arr.join(''));   
        },
        unusualFun : function(v){
            sdLoad.hide();
        }
    }
    JSBK.Utils.postAjax(sdData);    

    //上滑加载更多
    var GetMoreMb = function(op){
        this.op = {
            cont : $('.sd-cont'),
            myLoad : $('.load'),
            sdBot : $('.bot'),
            getNextStatus : true,
            page : 2 
        };
        this.init();
    }
    GetMoreMb.prototype.init = function(){
        var self = this;
        function checkGetNextPage() {
            var winHeight = $(window).height(),
                listHeight = self.op.cont.height(),
                listTop = self.op.cont.offset().top,
                scrollTop = $(window).scrollTop();
            if (winHeight + scrollTop >= listTop + listHeight && self.op.getNextStatus === true) {
                return true;
            }
            return false;
        }

        $(window).on('scroll',function(){
            getNextPage();
        })

        function getNextPage(){
            if (!checkGetNextPage()) {
                return;
            }
            self.op.getNextStatus = false;
            var sdLoadData = {
                data: {
                    'TradingId': tradingId,
                    'ProductId': productId,
                    'PageIndex': self.op.page,
                    'PageSize' : 10
                },
                mFun: 'GetMyCurrentProductDataDetail',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var nextArr = [] ,
                        length = v.length,
                        nextHtml = '',
                        nextTradData = v.productTradeWaterData,
                        priceSty = '';
                    
                    self.op.myLoad.hide();
                    $.each(nextTradData,function(i,val){
                        switch(val.tradingType){
                            case 1:
                            priceSty = 'incr';
                            break;
                            default:
                            priceSty = 'redu';
                        }
                        nextHtml += '<li><div class="sd-main">'
                        nextHtml += '<p>'+val.title+'</p><span>'+val.tradingTime+'</span>';
                        nextHtml += '</div><div class="sd-side">';
                        nextHtml += '<p class="'+priceSty+'">'+val.tradingAmountText+'</p><span>'+val.statusText+'</span>';
                        nextHtml += '</div></li>';
                        nextArr.push(nextHtml);
                    })
                    self.op.cont.find('.sd-info').append(nextArr.join(''));   

                    if(length >= 10){
                        self.op.getNextStatus = true;
                    }else{
                        self.op.sdBot.show();
                    }
                    self.op.page = self.op.page + 1;
                },
                unusualFun : function(v){
                    self.op.sdBot.show();
                }
            }
            JSBK.Utils.postAjax(sdLoadData);                        
        }
    }
    new GetMoreMb();  
});