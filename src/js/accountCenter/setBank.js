;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/setBank.css'); 
    require('../../component/website/Load.css');
    require('../../component/website/city.json');
    var IScroll = require('../../ui/iscroll-lite.js');
    var listWrap = $('.list-wrap'),
        multislterMask = $('.multislter-mask'),
        multislterCont = $('.multislter-cont'),
        cancleBtn = $('.cancle-btn'),
        confirmBtn = $('.confirm-btn'),
        pageCont = $('.page-cont'),
        searchCont = $('.search-cont'),
        bankSelect = $('.fm-input'),
        load = $('.load'),
        openBank = $('#open_bank'),
        searchInfo = $('.search-info'),
        sbHead = $('.sb-head'),
        isOpenAccount,
        tradeToken;

    //获取支行信息
    var bankData = {
        data: {},
        mFun: 'GetMemberInfo',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            if (v.bankCardAuthen == 1){
                switch (v.bankCode){
                    case '102': //中国工商银行
                    case '308': //招商银行
                    case '304': //华夏银行
                    case '302': //中信银行
                    case '104': //中国银行
                    sbHead.attr("class","sb-head red");
                    break;
                    case '303': //中国光大银行
                    sbHead.attr("class","sb-head purple");
                    break;
                    case '307': //平安银行
                    case '310': //上海浦东发展银行
                    sbHead.attr("class","sb-head yellow");
                    break;
                    case '403': //中国邮政储蓄银行
                    case '103': //中国农业银行
                    sbHead.attr("class","sb-head green");
                    break;
                    case '309': //兴业银行
                    case '105': //中国建设银行
                    sbHead.attr("class","sb-head blue");
                    break;
                    default:
                    sbHead.attr("class","sb-head red");
                }
                $('.hd-logo img').attr('src',v.tieOnCardIcon);
                $('#bank_name').html(v.bankName);
                $('.hd-num').html(v.bankCardId);
                $('#cardholder').html(v.realName);
                isOpenAccount = v.existsOpenAccountName;
                if( isOpenAccount == false){
                    openBank.html('点击设置开户支行');
                }else{
                    openBank.html(v.openAccountName);
                }
            }else{
                location.href = '/Member/Identification';
            }
            
        }, 
        unusualFun : function(v){
            
        }
    }
    JSBK.Utils.postAjax(bankData);  

    //隐藏城市选择
    function maskHid(){
        multislterCont.removeClass('multislter-show');
        setTimeout(function(){
           multislterMask.addClass('none');
        },300)
    }

    //显示省份城市
    function maskShow(){
        multislterMask.removeClass('none');
        setTimeout(function(){
            multislterCont.addClass('multislter-show');
        },0)

        new IScroll($('#provinceName')[0],{
            tap: true        
        })
    }

    //交易密码弹窗
    var Confirm = require('../../ui/Confirm.js');
    var openConfirm = new Confirm({
        titleHtml : '交易密码',
        infoHtml : function(){
            return $('<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="trade_pwd">'+
                '<p class="error-tip"><span></span></p>');
        },
        confirmCallback : function(){
            var wdpwdVal = $('#trade_pwd').val(),
                errorTip = $('.error-tip');
            if(wdpwdVal == null || wdpwdVal == ''){
                errorTip.html('请输入您的交易密码');
                return false;
            }

            var sucData = {
                data: {
                    'TradePassword' : wdpwdVal
                },
                mFun: 'ValidateTradePassword',
                sucFun : function(v){
                    tradeToken = v.message;
                    maskShow();
                    $('.g-d-dialog').hide();
                },
                unusualFun : function(v){
                    errorTip.html(v.ES);
                }
            }        
            
            JSBK.Utils.postAjax(sucData)
        }
    });
    
    //点击开户支行
    openBank.on('click',function(){
        if(isOpenAccount != false){
            openConfirm.open();
        }else{
            maskShow();
        }
    })

    //点击取消
    cancleBtn.on('click',function(){
        maskHid();
    })

    //点击确定
    var provinceId,citySelect,cityCode,cityId,bankObj;
    confirmBtn.on('click',function(){
        maskHid();
        provinceId = $('#provinceName li.selected').data('provinceid'),
        citySelect = $('#citylist li.selected'),
        cityCode = citySelect.data('citycode'),
        cityId = citySelect.data('cityid');
        pageCont.addClass('none');
        searchCont.removeClass('none');
        var getBankData = {
            data: {
                'CityCode' : cityCode
            },
            mFun: 'GetBankSubList',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var bankArr = [];
                    bankObj = v;
                $.each(v,function(i,v){
                    var bankHtml = '';
                    bankHtml += '<li data-bankid="'+v.BankSubID+'">'+v.OpenAccountName+'</li>';
                    bankArr.push(bankHtml);
                })
                searchInfo.html(bankArr.join(''));
                
            },
            unusualFun : function(v){
                load.hide();
            }
        } 

        JSBK.Utils.postAjax(getBankData);

    })

    //初始化省份城市
    var provinceInfo = $('#provinceName ul');
    var cityInfo = $('#citylist ul');
    var provinceArr = [];
    var cityArr = [];
    
    $.each(JSBK.cityData,function(i,v){
        var provinceHtml = '';
        if(i == 0){
            provinceHtml += '<li class="selected" data-index="'+i+'" data-provinceid="'+v.ProvinceID+'">'+v.ProvinceName+'</li>';

            $.each(v.CityList,function(index,val){
                var cityHtml = '';
                if(index == 0){
                    cityHtml += '<li class="selected" data-cityid="'+val.CityID+'" data-citycode="'+val.CityCode+'">'+val.CityName+'</li>';
                }else{
                    cityHtml += '<li data-cityid="'+val.CityID+'" data-citycode="'+val.CityCode+'">'+val.CityName+'</li>';
                }
                cityArr.push(cityHtml);
            })
            cityInfo.html(cityArr.join('')); 

        }else{
            provinceHtml += '<li data-index="'+i+'" data-provinceid="'+v.ProvinceID+'">'+v.ProvinceName+'</li>';
        }
        provinceArr.push(provinceHtml);        
    })
    provinceInfo.html(provinceArr.join(''));

    //点击省份切换城市
    $('#provinceName').on('tap','li',function(e){
        $(this).addClass('selected');
        $(this).siblings('li').removeClass('selected');

        var index = $(this).data('index');
        var selectCityArr = [];
        $.each(JSBK.cityData[index].CityList,function(i,v){
            
            var cityHtml = '';
            if(i == 0){
                cityHtml += '<li class="selected" data-cityid="'+v.CityID+'" data-citycode="'+v.CityCode+'">'+v.CityName+'</li>';
            }else{
                cityHtml += '<li data-cityid="'+v.CityID+'" data-citycode="'+v.CityCode+'">'+v.CityName+'</li>';
            }                
            selectCityArr.push(cityHtml);
        })
        cityInfo.html(selectCityArr.join(''));
        new IScroll($('#citylist')[0], {
            tap: true        
        })
    })

    //点击城市
    $('#citylist').on('tap','li',function(e){
        $(this).addClass('selected');
        $(this).siblings('li').removeClass('selected');
    })

    //搜索
    var searchHead = $('.search-head'),
        searchInput = searchHead.find('input'),
        searchBtn = $('.search-btn'),
        bankName = '',
        bankSubId;
    var h = $(window).height() - searchHead.height();
    searchInfo.css({'max-height':h,'overflow-y':'scroll'});

    searchInfo.on('click','li',function(){
        $(this).addClass('focus');
        $(this).siblings('li').removeClass('focus');
        bankName = $(this).text();
        bankSubId = $(this).data('bankid');
        searchInput.val(bankName);
    })

    var Alert = require('../../ui/Alert.js');
    var openAlert = new Alert({
            titleHtml : '请输入支行名称或关键字'
        });

    searchBtn.on('click',function(){
        if(searchInput.val() != ''){
            searchCont.addClass('none');
            pageCont.removeClass('none');

            var selectBankData = {
                data: {
                    'BankSubID' : bankSubId,
                    'OpenAccountName' : bankName,
                    'ProvinceID' : provinceId,
                    'CityID' : cityId,
                    'TradeToken' : tradeToken || ''
                },
                mFun: 'ModifyBankSub',
                sucFun : function(v){
                    var retUrl = JSBK.Utils.GetUrlSearch('returl=');
                        if (retUrl.length > 1){
                            location.href = unescape(retUrl);
                        }else{
                            location.href = '/Member/AccountCenter';
                        }
                },
                unusualFun : function(v){
                    //console.log('异常');
                }
            }

            JSBK.Utils.postAjax(selectBankData);  
            openBank.html(bankName);
        }else{
            openAlert.open();
        }
    })

    
    //匹配支行名称
    $('#search_bank').on('keyup',function(v){
        var kw = $.trim($(this).val());
        var selectBankArr = [];
        $.each(bankObj,function(i,v){
            var html = '';
            if(v.OpenAccountName.indexOf(kw) >= 0){
                html += '<li data-bankid="'+v.BankSubID+'">'+v.OpenAccountName.replace(eval("/"+kw+"/g"),"<span>"+kw+"</span>")+'</li>';
                selectBankArr.push(html);
            }
        })
        searchInfo.html(selectBankArr.join(''));
    })
});