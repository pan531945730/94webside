;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/mybill.css'); 
    require('../../component/website/Load.css');
    var mbNone = $('.none-info'),
        mbLoad = $('.load');

    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '',
                priceSty = '',
                sty = '';
                switch(v.typeId){
                    case 1001:
                    case 2:
                    case 3:
                    case 10:
                    case 14:
                    priceSty = 'redu';
                    break;
                    default:
                    priceSty = 'incr';
                }
            html += '<li><div class="mb-main">';
            html += '<p>'+v.titleText+'</p><span>'+v.tradingTime+'</span>';
            html += '</div><div class="mb-side">';
            html += '<p class="'+priceSty+'">'+v.tradingAmountText+'元</p><span>'+v.statusText+'</span></div></li>';
            arr.push(html);
        })
    }

    //初始化
    var mbData = {
        data: {
            'PageIndex': 1,
            'PageSize' : 5
        },
        mFun: 'GetBill',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            var arr = [] ,
                length = v.RecordList.length;

            mbLoad.hide();
            mbNone.hide();
            if(length == 0){
                mbNone.show();
            }
            htmlTep(v.RecordList,arr);
            $('.mb-info').append(arr.join(''));   
            if(length >= 5){
                /*new GetMoreMb();*/
                var moreIscroll = require('../../ui/moreIscroll.js');
                new moreIscroll({
                    htmlTep : htmlTep,
                    ajaxObj : 'RecordList'
                });
            }
        },
        unusualFun : function(v){
            mbLoad.hide();
            mbNone.show();
        }
    }
    JSBK.Utils.postAjax(mbData);  

    //上滑加载更多
    /*var GetMoreMb = function(op){
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
            var mbLoadData = {
                data: {
                    'PageIndex': self.op.page,
                    'PageSize' : 15
                },
                mFun: 'GetBill',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var arr = [] ,
                        length = v.RecordList.length;
                    
                    self.op.myLoad.hide();
                    htmlTep(v.RecordList,arr);

                    self.op.cont.find('.mb-info').append(arr.join(''));   
                    
                    if(length >= 15){
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
    }*/
    
    
});