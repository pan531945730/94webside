;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/perfectInfo.css'); 
    require('../../component/website/Load.css');
    var Alert = require('../../ui/Alert.js');
    var bindSuc = new Alert({
        titleHtml : '绑定成功',
        clickBtnCallback : function(){
            var rechargeUrl = JSBK.Utils.GetUrlSearch('returl=');
            location.href="ModifyTradePwd?returl="+rechargeUrl;            
        }
    });
    var fmName = $('#fm_name'),
        fmPerid = $('#fm_perid'),
        fmBankid = $('#fm_bankid'),
        nextBtn = $('#next_btn'),
        errorTip = $('.error-tip').find('span'),
        fmInp = $('.fm-input input'),
        clear = $('.clear'),
        load = $('.load');
        
    fmInp.on('input',function(){
        errorTip.html('');
    })

    //清除按钮交互
    fmInp.on('focus',function(){
        if($(this).val() != ''){
            $(this).next('.clear').css('display', 'block');
        }
    })

    fmInp.on('input',function(){
        $(this).next('.clear').css('display', 'block');
    })
    
    fmInp.on('blur',function(){
        var _this = $(this);
        setTimeout(function(){
             _this.next('.clear').css('display', 'none');
         },200)       
    })

    clear.on('click',function(){
        $(this).prev('input').val('');
        $(this).css('display', 'none');
    })

    fmPerid.on('keypress',function(){
        var $this = $(this);
        setTimeout(function(){
            var peridVal = $this.val();
            switch (peridVal.length){
                case 3:
                case 7:
                case 12:
                case 17:
                $this.val(peridVal + ' ');
                break;
            }
        },0)
    });

    fmPerid.on('input',function(){
        $(this).val($(this).val().replace('x','X'));
    })

    fmBankid.on('keyup mouseout input',function(){
        var bankVal = $(this).val();
        /\S{5}/.test(bankVal) && $(this).val(bankVal.replace(/\s/g,'').replace(/(.{4})/g, '$1 '));
    })

    //初始化
    var initData = {
        data: {},
        mFun: 'GetMemberSecurity',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            if(v.realName){
                fmName.val(v.realName);
                fmName.attr('readonly','readonly');
                fmName.off('blur focus');
            }
            if(v.cardId){
                fmPerid.val(v.cardId);
                fmPerid.off('blur focus');
                fmPerid.attr('readonly','readonly');
            }

            if(fmName.attr('readonly')!= 'readonly'){
                fmName.focus();
                fmName.trigger('focus');
            }else{
                fmBankid.focus();
                fmBankid.trigger('focus');
            }

        },
        unusualFun : function(v){
            errorTip.html(v.ES);
            load.hide();
        }
    }        
    
    JSBK.Utils.postAjax(initData);

    //下一步
    nextBtn.on('click',function(){
        var nameVal = fmName.val(),
            peridVal =fmPerid.val(),
            bankidVal = fmBankid.val();

        if(fmName.attr('readonly')!= 'readonly'){
            if(nameVal == null || nameVal == ''){
                errorTip.html('请输入您的姓名');
                return false;
            }else if (nameVal.length < 2) {
                errorTip.html('您的姓名输入有误');
                return false;
            }

            if(peridVal == null || peridVal == ''){
                errorTip.html('请输入您的身份证号');
                return false;
            }else if(peridVal.length != 22){
                errorTip.html('您的身份证号输入有误');
                return false;
            }
        }

        if(bankidVal == null || bankidVal == ''){
            errorTip.html('请输入您的银行卡号');
            return false;
        }else if(bankidVal.length > 28){
            errorTip.html('您的银行卡号输入有误');
            return false;
        }       
        
        var sucData = {
            data: {
                    'RealName': nameVal,
                    'CardID' : peridVal,
                    'BankCardID' : bankidVal,
                    'IsTest' : 2
            },
            mFun: 'AddBank',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                bindSuc.open();                                               
            },
            unusualFun : function(v){
                load.hide();
                errorTip.html(v.ES);
            }
        }        
        
        JSBK.Utils.postAjax(sucData)
        
    })
    
});