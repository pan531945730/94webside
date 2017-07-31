;
$(document).ready(function(e) {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../component/website/footBar.js');
    require('../../component/website/Load.css');
    require('../../css/product/productList.css'); 
    var load = $('.load');

    //倒计时
    function addzero(a){
        if(a<10){
            return a='0'+a;
        }else{return a}
    }
    function caculateDate(time){
        var d = parseInt(time/86400);
        var h = parseInt((time%86400)/3600);
        var m = parseInt(((time%86400)%3600)/60);
        var s = parseInt(((time%86400)%3600)%60);
        var t = d+'天'+addzero(h)+':'+addzero(m)+':'+addzero(s);
        return t;
    }
    function countDownFun(date,curData,Time){
        var time =(Date.parse(date.replace(/-/g,'/')) - Date.parse(curData.replace(/-/g,'/')))/1000;
        Time.html(caculateDate(time));
        var clearTime = setInterval(function(){
            time -= 1;
            Time.html(caculateDate(time));
            if(time == 0){
                location.reload();
            }
        },1000);
    }
    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '',
                remainingPercentage = parseInt(v.remainingPercentage),
                sta = v.status;
            if(v.appTemplateType != 6){
                html += '<a href="/Product/ProductDetail?ProductId='+v.id+'&ProductTypeId='+v.typeId+'&pName='+v.title+'" class="pd-list">';
            }else{
                html += '<a href="/Product/SunPrivateDetail?pName='+v.title+'" class="pd-list">';
            }
            html += '<div class="list-tit">';
            html += '<h2>'+v.title;
            if (sta == 1){
                html += '<span class="forsale">待售</span>';
            }
            html += '</h2>'
            if (sta == 1){
                html += '<span class="count-down">倒计时：<em class="countdown" data-time="'+v.startTimeText+'" data-curtime="'+v.serverTimeText+'"></em></span>';
            }
            if (v.productType2Id == 1){
                html += '<span class="vip">新手专享</span>';
            }
            html += '</div><ul class="list-info">';
            if(v.eventSpecificIncome != 0){
                html += '<li><p class="earn">'+v.interestRateText+'<span class="event">'+v.eventSpecificIncomeText+'</span></p><span>预期年化收益</span></li>';
            }else{
                html += '<li><p class="earn">'+v.interestRateText+'</p><span>预期年化收益</span></li>';
            }            
            html += '<li><p>'+v.investmentTimeText+'</p><span>'+v.startAmountText+'元起投</span></li>';
            html += '<li>';
            if (sta == 0){
                if(v.appTemplateType == 6){
                    if(v.appointment == 1){
                        html += '<div class="ac-warn">预约中</div>';
                    }
                }else{
                    html += '<div class="circle">';
                    html += '<div class="pie_left"><div class="left"></div></div>';
                    html += '<div class="pie_right"><div class="right"></div></div>';
                    html += '<div class="mask"><em>'+remainingPercentage+'</em>%<br>可购</div>';
                }
                
            }else if (sta == 2){
                //已售罄
                html += '<div class="ac-warn haswarn">已售罄</div>';
            }else if(sta ==1){
                if(v.appointment == 0){
                    html += '<div class="ac-warn remind" data-proid="'+v.id+'">提醒</div>';
                }else{
                    html += '<div class="ac-warn haswarn">已提醒</div>';
                }
            }
            
            html += '</li></ul></a>'; 
            arr.push(html);
        })
    }

    //绘制可购百分比
    function drawCir(v){
        var v = $(v),
            num = parseInt(v.find('em').html());
        
        v.find('em').html(num);
        num = num * 3.6;
        if(num<=180){
          v.find('.right').css('-webkit-transform','rotate('+num+'deg)');
        }else{
          v.find('.right').css('-webkit-transform','rotate(180deg)');
          v.find('.left').css('-webkit-transform','rotate(' + (num - 180) + 'deg)');
        }
    }

    //精选列表
    var siftFinanceData = {
        data:{
            'ProductTypeId':2,
            'PageIndex':1,
            'PageSize': 15
        },
        mFun:'GetProductList',
        beforeFun : function(){
            load.show();
        },
        sucFun: function(v){
            var arr = [] ;
            load.hide();
            htmlTep(v,arr);
            $('#sift-finance').append(arr.join(''));  
        },
        comFun : function(){
            $('.circle').each(function(i,v){
                drawCir(v);
            })
            $('.countdown').each(function(i,v){
                var that = $(this);
                var countDownText = that.attr('data-time'),
                    curTimeText = that.attr('data-curtime');
                    countDownFun(countDownText,curTimeText,that);
            })
        }
        
    }
    JSBK.Utils.postAjax(siftFinanceData);

    //94管家
    var stewardData = {
        data:{
            'ProductTypeId':1,
            'PageIndex':1,
            'PageSize': 15
        },
        mFun:'GetProductList',
        beforeFun : function(){
            load.show();
        },
        sucFun: function(v){
            var arr = [] ;
            load.hide();
            htmlTep(v,arr);
            $('#steward').append(arr.join(''));            
        },
        comFun : function(){
            $('.circle').each(function(i,v){
                drawCir(v);
            })
            $('.countdown').each(function(i,v){
                var that = $(this);
                var countDownText = that.attr('data-time'),
                    curTimeText = that.attr('data-curtime');
                    countDownFun(countDownText,curTimeText,that);
            })
        }
        
    }
    JSBK.Utils.postAjax(stewardData);

    //精选&&94管家切换
    $('.pd-nav li').on('click',function(i,v){
        $(this).find('span').addClass('nav-on');
        $(this).siblings().find('span').removeClass('nav-on');
        
        var active = $(this).data('active'),
            visit = $(this).siblings().data('active');
        $('#'+active).show();
        $('#'+visit).hide();
    })

    var Blink = require('../../ui/Blink.js');
    var remindUnusual,remindSuc;
    //点击提醒
    $('.pd-container').on('click','.remind',function(e){
        var that = $(this);
        e.preventDefault();
        var reProid = $(this).data('proid');
        var remindEvent = {
            data : {
                ProductID : reProid,
                Appointment:1
            },
            mFun:'AppointmentProduct',
            sucFun: function(v){
                var blinkTip = v.message;
                if(!remindSuc){
                    remindSuc = new Blink({
                        'blinkHtml' : blinkTip
                    })
                }
                remindSuc.open();
                that.html('已提醒').addClass('haswarn');
            },
            unusualFun: function(v){
                var blinkTip = v.ES;
                if(!remindUnusual){
                    remindUnusual = new Blink({
                        'blinkHtml' : blinkTip
                    })
                }
                remindUnusual.open();
            }
        }
        JSBK.Utils.postAjax(remindEvent);
    })

    //上滑加载更多精列表
    var GetMoreMb = function(op){
        this.op = {
            cont : $('.pd-container'),
            info : $('#sift-finance'),
            myLoad : $('.load'),
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
            var siftFinanceDataLoad = {
                data: {
                    'ProductTypeId':2,
                    'PageIndex':self.op.page,
                    'PageSize': 15
                },
                mFun: 'GetProductList',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var arr = [] ,
                        length = v.length;
                    
                    self.op.myLoad.hide();
                    htmlTep(v,arr);

                    self.op.info.append(arr.join(''));   
                    $('.circle').each(function(i,v){
                        drawCir(v);
                    })
                    if(length >= 15){
                        self.op.getNextStatus = true;
                    }
                    self.op.page = self.op.page + 1;
                },
                unusualFun : function(v){
                    
                }
            }
            JSBK.Utils.postAjax(siftFinanceDataLoad);                        
        }
    }
    //new GetMoreMb();
});