;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/redeemList.css'); 
    require('../../component/website/Load.css');
    var mbNone = $('.none-info'),
        mbLoad = $('.load');

    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '';
                
            html += '<li><div class="mb-main">';
            html += '<p>赎回-'+v.title+'</p><span>'+v.tradingTimeText+'</span>';
            html += '</div><div class="mb-side">';
            html += '<p class="redu">-'+v.tradingAmountText+'元</p><span>处理中</span></div></li>';
            arr.push(html);
        })
    }

    //初始化
    var redeemData = {
        data: {
            'PageIndex': 1,
            'PageSize' : 10
        },
        mFun: 'GetMyCurrentProductDataRedeemingList',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            var arr = [] ,
                length = v.length;

            mbLoad.hide();
            mbNone.hide();
            if(length == 0){
                mbNone.show();
            }
            htmlTep(v,arr);
            $('.mb-info').append(arr.join(''));   
            if(length>=10){
                new GetMoreMb();
            }
        },
        unusualFun : function(v){
            mbLoad.hide();
            mbNone.show();
        }
    }
    JSBK.Utils.postAjax(redeemData);  

    //上滑加载更多
    var GetMoreMb = function(op){
        this.op = {
            cont : $('.mb-cont'),
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
            var redeemLoadData = {
                data: {
                    'PageIndex': self.op.page,
                    'PageSize' : 10
                },
                mFun: 'GetMyCurrentProductDataRedeemingList',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var arr = [] ,
                        length = v.length;
                    
                    self.op.myLoad.hide();
                    mbNone.hide();
                    htmlTep(v,arr);

                    self.op.cont.find('.mb-info').append(arr.join(''));   
                    
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
            JSBK.Utils.postAjax(redeemLoadData);                        
        }
    }
    
    
});