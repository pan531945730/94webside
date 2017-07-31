;
$(document).ready(function(e) {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../component/website/footBar.js');
    require('../../component/website/Load.css');
    require('../../css/product/ProductDetail.css'); 
    var Blink = require('../../ui/Blink.js');
    var fmPrice = $('.fm-price'),
        fmSum = $('.fm-sum'),
        sumEar = fmSum.find('em'),
        fmLogin = $('.fm-login'),
        fmCard = $('.fm-card'),
        fmEarn = $('.fm-earn'),
        earnVal = fmEarn.find('em'),
        buyBtn = $('#buy_btn'),
        date = $('#date'),
        payments = $('#payments'),
        description = $('.description'),
        guarantee = $('.guarantee'),
        redemption = $('.redemption'),
        redemptionSta = redemption.find('span'),
        protocol = $('.pdd-protocol'),
        preVal = 0,
        accountBalance = 0,
        qtje = 0,
        cpsyfe = 0,
        unitPrice = 0,
        jsje = 0,
        maxBuy = 0,
        typeId = 0,
        load = $('.load');
    
    var cardId = 0,
        cardVal = 0,
        cardType = 0,
        defaultVal = 0,
        proType2Id = 0,
        nonuseFlag = true,
        productId = JSBK.Utils.GetQueryString("ProductId"),
        productTypeId = JSBK.Utils.GetQueryString("ProductTypeId");

    //优惠券模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '',
                liSty = '',
                styPrice = '';
                
            if(v.CouponType == 1){
                liSty = 'fanxian';
                styPrice = '￥<em>'+v.CouponValue+'</em>';
            }else{
                liSty = 'jiaxi';
                styPrice = '<em>'+v.CouponValue+'</em>%';
            }
            html += '<li class="'+liSty+'" data-type="'+v.CouponType+'" data-value="'+v.CouponValue+'" data-id="'+v.ID+'">';
            html += '<div class="cp-price" style="background-color:'+v.IosColor+'">';
            html += '<p>'+styPrice+'</p>';
            html += '<span>'+v.MinMaxBuyPriceStr+'</span>';
            html += '</div><div class="cp-info">';
            html += '<div class="info-head"><h2>'+v.Title+'</h2><p>'+v.ApplyProductRemark+'</p></div>';
            html += '<p class="info-time">有效期'+v.UseRemark+'</p>';
            html += '</div></li>';
            arr.push(html);
        })        
    }
    //上滑加载更多
    var GetMoreMb = function(op){
        this.op = {
            cont : $('.coupon-container'),
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
                    'GetMemberCardCouponList': self.op.page,
                    'PageSize' : 10
                },
                mFun: 'GetUsableCardCouponList',
                beforeFun : function(){
                    self.op.myLoad.show();
                },
                sucFun : function(v){
                    var arr = [] ,
                        length = v.length;
                    
                    self.op.myLoad.hide();
                    noneInfo.hide();
                    htmlTep(v,arr);
                    self.op.cont.find('.coupon-cont').append(arr.join(''));   
                    
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
    //初始页面
    fmPrice.on('input',function(){
        var val = $(this).val();
        val = parseInt(val.toString().substring(0,10));
        $(this).val(val);
    })
    var productDetailData = {
        data:{
            'ProductId': productId,
            'ProductTypeId': productTypeId
        },
        mFun:'GetProductDetail',
        beforeFun : function(){
            load.show();
        },
        sucFun: function(v){
            load.hide();
            var yue = Math.floor(v.accountBalance);
                qtje = v.startAmount;
                cpsyfe = v.remainingAmount;
                unitPrice = v.unitPrice;
                jsje = v.remainingAmount;
                maxBuy = v.maxBuyPrice,
                typeId = v.typeId,
                proType2Id = v.productType2Id;

            //默认投资金额
            if(yue < qtje){
                defaultVal = 0;
            }else{
                var je = yue - qtje;
                var maxPrice = Math.floor(je / unitPrice) * unitPrice + qtje;
                defaultVal = Math.min(maxPrice,maxBuy,cpsyfe);
            }

            //预期收益金额
            function preEarnPrice (defaultVal,plusCardValue){
                var yqdqsy = 0;
                if(!defaultVal){
                    return yqdqsy;
                }
                var rate = v.allInterestRate;
                var exStr = 0;
                if(rate <= 0 || (v.typeId == 9 && v.minInterestRate > 0 && v.maxInterestRate > 0)
                    || v.typeId == 11){
                    rate = v.minInterestRate;
                    exStr = '+浮动';
                }
                // 添加加息券利率
                if(plusCardValue > 0){
                    rate = rate + plusCardValue;
                }
                function bit(n){
                    return n.toString().replace(/(\.\d{2})\d+$/,"$1")
                }
                if(v.investmentTime<=0){//活期
                    if(v.maxInterestRate==0.0||v.minInterestRate==0.0){
                        yqdqsy=bit((v.allInterestRate/36500)*defaultVal);
                    }else{
                        yqdqsy=bit((v.minInterestRate/36500)*defaultVal)+"~"+bit((v.maxInterestRate/36500)*defaultVal);
                    }
                    return yqdqsy;
                }
                var day = parseInt((Date.parse(v.endTime) - (Date.parse(v.interstStartDateText))) / 86400000);
                if(day > 0){
                    day = new Date().getHours() > 22 ? day - 1 : day;
                    day = day > v.investmentTime ? v.investmentTime : day;
                    var profit = (defaultVal * rate / 100) * (day / 365);
                    yqdqsy = profit ? bit(((Math.floor(profit * 100) / 100).toFixed(2)).toString() + exStr) : 0;
                }else{
                    yqdqsy = 0.00;
                }
                return yqdqsy;
            }
            
            if(defaultVal != 0){
                fmPrice.val(defaultVal);
            }
            
            preVal = preEarnPrice(defaultVal);
            earnVal.html(preVal);
            if(v.isLogin == 1){ //登录
               fmSum.show();
               fmLogin.hide(); 
               accountBalance = v.accountBalance;
               sumEar.html(v.accountBalanceText);
               //是否有卡券
               var getCardData = {
                   data:{
                       'BuyAmount': defaultVal,
                       'ProductId': productId,
                       'ProductType2ID' : proType2Id
                   },
                   mFun:'GetMemberCardOptimal',
                   sucFun: function(v){
                       if(v){
                           cardId = v.ID;
                           cardVal = v.CouponValue;
                           cardType = v.CouponType;
                           var cardText;
                           if(cardType == 1){
                               cardText = '返现券 '+cardVal+'元';
                           }else{
                               cardText = '加息券 '+cardVal+'%';
                               preVal = preEarnPrice(defaultVal,cardVal);
                               earnVal.html(preVal);
                           }
                           fmCard.html(cardText).show();
                       }else{
                           fmCard.html('选择卡券').show();
                           cardId = 0;
                           cardVal = 0;
                           cardType = 0;
                       }

                       var couponData = {
                           data:{
                               'PageIndex':1,
                               'PageSize': 10,
                               'ProductType2ID':proType2Id,
                               'BuyAmount':defaultVal
                           },
                           mFun:'GetUsableCardCouponList',
                           sucFun:function(v){
                               var arr = [],
                                   length = v.length;
                               if(!v || length == 0){
                                   $('.coupon-cont').empty();
                                   noneInfo.show();
                                   return;
                               }
                               noneInfo.hide();
                               htmlTep(v,arr);
                               $('.coupon-cont').append(arr.join(''));
                               if(length >= 10){
                                   new GetMoreMb();
                               }
                           },
                           unusualFun :function(){
                               noneInfo.show();
                           }

                       }
                       JSBK.Utils.postAjax(couponData);
                   }
                   
               }
               var couponData = {
                   data:{
                       'PageIndex':1,
                       'PageSize': 10,
                       'ProductType2ID':-1
                   },
                   mFun:'GetMemberCardCouponList',
                   sucFun:function(v){
                       var arr = [],
                           length = v.length;
                       load.hide();
                       if(!v || length == 0){
                            fmCard.hide();
                            return;
                       }else{
                            JSBK.Utils.postAjax(getCardData);
                            fmPrice.on('input',function(){
                                defaultVal = $(this).val();
                                getCardData.data.BuyAmount = defaultVal;
                                if(nonuseFlag){
                                    JSBK.Utils.postAjax(getCardData);
                                }                
                            })
                       }
                       
                   }

               }
               JSBK.Utils.postAjax(couponData);
               
               fmPrice.on('input',function(){
                   defaultVal = $(this).val();
                   preVal = preEarnPrice(defaultVal);
                   earnVal.html(preVal);
               })

            }else{ //未登录
                fmLogin.show();
                fmSum.hide(); 
                fmLogin.attr('href','/member/login?returl='+escape(window.location.href));
                buyBtn.attr('href','/member/login?returl='+escape(window.location.href));
                fmCard.hide();
                earnVal.html('0.00');
            }

            if(v.minInterestRate == v.maxInterestRate){
                //判断奖励收益
                if(v.eventSpecificIncome > 0){
                  var tempText = v.interestRate+"</span>% +<span class='event'>"+v.eventSpecificIncome+"</span>"
                  $('#earn').html(tempText);
                  $('.event-tip').removeClass('event-hide');
                }else{
                  $('#earn').html(v.interestRate);                 
                }
            }else{
                var html = '<span>'+v.minInterestRate+'</span>%<span>～</span>';
                html += '<span>'+v.maxInterestRate+'</span>%';
                $('#earn').parents('p').html(html);
            }

            if(v.redeemType == 0){
                $('#day').parents('p').html('<span>'+v.investmentTimeText+'</span>');
            }else{
                $('#day').html(v.investmentTimeText.replace("天",''));
            }
            if(v.appTemplateType != 8){
                fmPrice.attr('placeholder',v.startAmount+'元起投，'+unitPrice+'元的整数倍');
            }else{
                fmPrice.attr('placeholder','最高可购买'+v.startAmount+'元');
            }
            
            date.html(v.interstStartDateText);
            payments.html(v.earningsModeText);
            $('.record').attr('href','/Order/ProductRecord?ProductId='+productId);
            description.attr('href','/Product/ProductDetailInfo?ProductId='+productId+'#projectDetail');
            guarantee.attr('href','/Product/ProductDetailInfo?ProductId='+productId+'#securityDetail');
            protocol.find('a').attr('href','http://d.94bank.com/productdetail/GetProductBuyContract?productId='+productId+'&v=12345')
            if(v.status == 1){//倒计时
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
                buyBtn.addClass('btn-count');
                countDownFun(v.startTimeText,v.serverTimeText,buyBtn);

            }else if(v.status == 2){ //已售罄
                buyBtn.html('已售罄').addClass('btn-no');
                fmPrice.val('');
            }else{
                buyBtn.html('购 买(仅剩'+v.remainingAmountText+')');
                //购买协议
                protocol.find('i').on('click',function(){
                    var that = $(this);
                    if(that.hasClass('pt-arr')){
                        that.removeClass('pt-arr');
                        buyBtn.addClass('btn-no');
                    }else{
                        that.addClass('pt-arr'); 
                        buyBtn.removeClass('btn-no');
                    }
                    
                })
            }
            
            switch (v.appTemplateType){
                case 1: //9盈宝_定期
                redemption.css('display','none');
                break;
                case 2: //基金宝
                var GetjjbPointData = {
                        data:{
                            'ProductId':v.id
                        },
                        mFun:'GetProductPointData',
                        beforeFun : function(){
                            load.show();
                        },
                        sucFun: function(res){
                            load.hide();
                            var canvas = document.getElementById('vca');
                            var ctx = canvas.getContext('2d');
                            ctx.fillStyle="#fff";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.strokeStyle = '#f2f2f2'; 
                            ctx.fillRect(0,0,canvas.width,canvas.height);
                            ctx.font = '16px Arial';
                            ctx.fillStyle = '#333';
                            ctx.fillText('七日年化收益率(%)', 10, 40);
                            ctx.fillStyle = '#aaa';
                            for(var i=0;i<res.y.length;i++){
                                ctx.fillText(res.y[i],10,75+i*36);
                                ctx.moveTo(50,70+i*36);
                                ctx.lineTo(640,70+i*36);
                                ctx.stroke();
                            }
                            for(var i=0;i<res.x.length;i++){
                                ctx.fillText(res.x[i],50+i*91,340);
                                ctx.moveTo(50+i*98,70);
                                ctx.lineTo(50+i*98,320);
                                ctx.stroke();
                            }
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = '#ff6b80';
                            var d = res.y[7];
                            var x = res.y[0]-d;
                            ctx.moveTo(50,(1-(res.points[0].interestRateText-d)/x)*252+70);
                            for(var i=1;i<7;i++){
                                ctx.lineTo(50+i*98,(1-(res.points[i].interestRateText-d)/x)*252+70);
                            }
                            ctx.stroke();
                            ctx.font = '18px';
                            ctx.fillStyle = '#999';
                            ctx.fillText('昨日年化收益率', 300, 140);
                            ctx.font = '22px Arial';
                            ctx.fillStyle = '#f00';
                            ctx.fillText(res.points[6].interestRateText+'%', 300, 180);
                        }
                        
                }
                JSBK.Utils.postAjax(GetjjbPointData);

                $('.pdd-head').hide();
                $('.jjb-head').show();
                guarantee.css('display','none');
                redemptionSta.html('T+2到账，节假日顺延');
                break;
                case 3: //优选计划
                redemption.css('display','none');
                break;
                case 8: //新手宝
                description.css('display','none');
                guarantee.css('display','none');
                redemption.css('display','none');
                break;
                case 4: //银行宝
                redemptionSta.html('随时提现');
                break;
                //case 5: //月薪计划
                //case 6: //阳光私募
                case 7: //180~365九盈宝
                redemptionSta.html('满180天可提前赎回，手续费3%。');
                break;
            }
            //点击优惠券
            var couponContainer = $('.coupon-container'),
                noneInfo = $('.none-info'),
                windowH = $(window).height(),
                bodyH = $('body').height();
            couponContainer.css('min-height',Math.max(windowH,bodyH));
            fmCard && fmCard.on('click',function(){
                couponContainer.addClass('coupon-show');
            });
            $('.coupon-container').on('click','.cp-back',function(){
                couponContainer.removeClass('coupon-show');
            })

            $('.coupon-container').on('click','.cp-nonuse',function(){
                nonuseFlag = false;
                cardVal = 0;
                cardType = 0;
                cardId = 0;
                preVal = preEarnPrice(defaultVal);
                earnVal.html(preVal);
                couponContainer.removeClass('coupon-show');
                fmCard.html('选择卡券').show();
            })
            $('.coupon-cont').on('click','li',function(){
                var that = $(this),
                    cardText;
                cardVal = that.data('value');
                cardType = that.data('type');
                cardId = that.data('id');
                var pValue = 0;
                if(cardType == 1){
                    cardText = '返现券 '+cardVal+'元';
                }else{
                    cardText = '加息券 '+cardVal+'%';
                    pValue = cardVal;
                }
                preVal = preEarnPrice(defaultVal,pValue);
                earnVal.html(preVal);
                fmCard.html(cardText).show();
                couponContainer.removeClass('coupon-show');
            })

        },
        unusualFun : function(){
            load.hide();
        }
        
    }
    JSBK.Utils.postAjax(productDetailData);

    //点击抢购
    var Confirm = require('../../ui/Confirm.js');
    var qtjeTip,unitPriceTip,jsConfirm,rechargeConfirm,maxBuyTip,pwdConfirm,wdpwdVal,errorTip;
    buyBtn.on('click',function(e){
        var that = $(this);
        if(that.hasClass('btn-no') || that.hasClass('btn-count')){
            e.preventDefault();
            return;
        }else{
            if(cpsyfe >= qtje || defaultVal < cpsyfe){
                if(defaultVal<qtje){
                    if(!qtjeTip){
                        qtjeTip = new Blink({
                            'blinkHtml' : '该产品起投金额为'+qtje+'元'
                        }) 
                    }
                    qtjeTip.open();  
                    return;
                }
            }
            if(defaultVal>qtje && defaultVal%unitPrice != 0){
                if(!unitPriceTip){
                    unitPriceTip = new Blink({
                        'blinkHtml' : '该产品的投资金额为'+unitPrice+'的整数倍'
                    }) 
                }
                unitPriceTip.open(); 
                return;
            }

            if(defaultVal > maxBuy){
                if(!maxBuyTip){
                    maxBuyTip = new Blink({
                        'blinkHtml' : '该产品的投资上限为'+maxBuy+'元'
                    }) 
                }
                maxBuyTip.open();  
                return;
            }

            if(defaultVal > jsje){
                if(!jsConfirm){
                    jsConfirm = new Confirm({
                        titleHtml : '',
                        confirmBtnHtml : '投满它',
                        cancleBtnHtml : '改金额',
                        infoHtml : function(){
                            return $('<p class="pddcon">本期产品仅剩'+jsje+'元啦</p>');
                        },
                        confirmCallback : function(){
                            fmPrice.val(jsje);
                            jsConfirm.dialog.close();
                            defaultVal = jsje;
                        },
                        cancleCallback : function(){
                            fmPrice.val('');
                            fmPrice.focus();
                            fmPrice.trigger('focus');
                            jsConfirm.dialog.close();
                        }
                    })
                }
                jsConfirm.open();
                return;
            }

            if(defaultVal>accountBalance){
                if(!rechargeConfirm){
                    rechargeConfirm = new Confirm({
                        titleHtml : '',
                        confirmBtnHtml : '去充值',
                        cancleBtnHtml : '改金额',
                        infoHtml : function(){
                            return $('<p class="pddcon">可用余额不足，请前往充值</p>');
                        },
                        confirmCallback : function(){

                            var rechargeData = {
                                data : {
                                    "CallerType" : 2,
                                    "Param" : ''
                                },
                                mFun : 'RouteAPI',
                                sucFun : function(v){
                                    if(v.ReturnType == 0){ //成功
                                        location.href = '/pay/MemberRecharge';
                                    }else{ //失败
                                        location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                                    }
                                }
                            }
                            JSBK.Utils.postAjax(rechargeData);
                        },
                        cancleCallback : function(){
                            fmPrice.val('');
                            fmPrice.focus();
                            fmPrice.trigger('focus');
                            rechargeConfirm.dialog.close();
                        }
                    })
                }
                rechargeConfirm.open();
                return;
            }

            var pwdData = {
                data : {
                    "CallerType" : 1,
                    "Param" : '?ProductId='+productId+'&ProductTypeId='+productTypeId
                },
                mFun : 'RouteAPI',
                sucFun : function(v){
                    if(v.ReturnType == 0){ //成功
                        //确认交易密码
                        if(!pwdConfirm){
                            pwdConfirm = new Confirm({
                                titleHtml : '交易密码',
                                infoHtml : function(){
                                    return $('<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="wd-pwd">'+
                                        '<p class="error-tip"><span></span></p>');
                                },
                                confirmCallback : function(){
                                    wdpwdVal = $('#wd-pwd').val();
                                    errorTip = $('.error-tip');
                                    if(wdpwdVal == null || wdpwdVal == ''){
                                        errorTip.html('请输入您的交易密码');
                                        return false;
                                    }
                                    //购买
                                    var buyData = {
                                        data:{
                                            'ProductID': productId,
                                            'ProductTypeId': typeId,
                                            'TradePassword': wdpwdVal,
                                            'BuyProductPrice': defaultVal,
                                            'DeviceType' : 4,
                                            'CouponType' : cardType,
                                            'CardCouponID' : cardId,
                                            'FaceValue' : cardVal
                                        },
                                        mFun:'BuyProduct',
                                        sucFun: function(v){
                                            location.href = '/Product/InvestmentSuccess?TradingId='+v.TradingID+'&ProductID='+productId+'&productType2Id='+proType2Id+'&productEarnIntegral='+v.EarnIntegral;
                                        },
                                        unusualFun : function(v){
                                            errorTip.html(v.ES);
                                        }
                                        
                                    }
                                    JSBK.Utils.postAjax(buyData);
                                }
                            });
                        }
                        $('#wd-pwd').val('');
                        errorTip && errorTip.html('');
                        pwdConfirm.open();
                    }else{ //失败
                        location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                    }
                }
            }
            JSBK.Utils.postAjax(pwdData);
            
        }
    })

});