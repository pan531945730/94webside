;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/siftFinance.css'); 
    require('../../component/website/Load.css');
    var mbNone = $('.none-info'),
        mbLoad = $('.load'),
        earnTip = $('.earn-tip i'),
        tipText = $('.earn-tip em'),
        allPrice = $('#all_price'),
        earnPrice = $('#earn_price');

    var baseDate = {
        data : {},
        mFun : 'GetMemberAccount',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            allPrice.html(v.regularAmountText);
            earnPrice.html(v.dingqiCount);
        },
        notLogged : function(){
            mbLoad.hide();
        },
        unusualFun : function(v){
            mbLoad.hide();
        }
    }; 
    JSBK.Utils.postAjax(baseDate);
    earnTip.on('click',function(e){
        tipText.show();
        e.stopPropagation();
    });

    $(document).on('touchstart',function(e){
        tipText.hide();
        e.stopPropagation();
    })

    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '',
                endTime = v.endTimeText && v.endTimeText.replace('到期时间:','');
                
            html += '<li><h2>'+v.title;
            if (v.detailStatus == 2 && v.redeemStatus == 1){
                html += '<a href="/Order/ProductRansom?productid='+v.id+'&producttypeid='+v.typeId+'&tradingid='+v.tradingID+'&type=1" class="get-btn">赎回</a>';
            }
            html += '</h2>'
            html += '<a href="MyRegularProductDataDetail?tradingid='+v.tradingID+'" class="info-mod"><div class="m-price">';
            html += '<p>'+v.tradingAmountText+'</p><span>投资金额</span></div>';
            html += '<div class="m-earn"><p class="earn-f">'+v.expectedProfitText+'</p><span>预计到期收益</span></div>';
            html += '<div class="m-time"><p>'+endTime+'</p><span>到期日期</span></div></a>'
            arr.push(html);
        })
    }

    //初始化
    var sfData = {
        data: {
            'PageIndex': 1,
            'PageSize' : 10
        },
        mFun: 'GetMyRegularProductData',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            var arr = [] ;
            mbLoad.hide();
            mbNone.hide();
            if(!v || v.length == 0){
                mbNone.show();
            }
            htmlTep(v,arr);
            $('.sf-info').append(arr.join(''));
            if(v.length >= 10){
                new GetMoreMb();
            }   
        },
        unusualFun : function(v){
            mbLoad.hide();
            mbNone.show();
        }
    }
    JSBK.Utils.postAjax(sfData);  

    //上滑加载更多
    var GetMoreMb = function(op){
        this.op = {
            cont : $('.sf-cont'),
            myLoad : $('.load'),
            mbBot : $('.bot'),
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
            var mbLoadData = {
                data: {
                    'PageIndex': self.op.page,
                    'PageSize' : 10
                },
                mFun: 'GetMyRegularProductData',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var arr = [] ,
                        length = v.length;
                    
                    self.op.myLoad.hide();
                    mbNone.hide();
                    htmlTep(v,arr);

                    self.op.cont.find('.sf-info').append(arr.join(''));   
                    
                    if(length >= 10){
                        self.op.getNextStatus = true;
                    }else{
                        self.op.mbBot.show();
                    }
                    self.op.page = self.op.page + 1;
                },
                unusualFun : function(v){
                    self.op.mbBot.show();
                }
            }
            JSBK.Utils.postAjax(mbLoadData);                        
        }
    }
    

});