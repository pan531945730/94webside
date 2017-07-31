;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/perfectInfo.css'); 
    require('../../component/website/Load.css');
    var Alert = require('../../ui/Alert.js');

    var returl = JSBK.Utils.GetUrlSearch('returl=');
    var fishSuc = new Alert({
        titleHtml : '设置成功',
        clickBtnCallback : function(){
            if(returl.length > 0){
                location.href = unescape(returl);
            }else{
                location.href = "/Member/AccountCenter";
            }
        }
    });
    var fmPwd = $('#fm_pwd'),
        fmRepwd = $('#fm_repwd'),
        finishBtn = $('#finish_btn'),
        errorTip = $('.error-tip').find('span'),
        fmInp = $('.fm-input input'),
        clear = $('.clear'),
        load = $('.load');
    
    fmPwd.focus();
    fmPwd.trigger('focus');
        
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

    //初始化
    var initData = {
        data: {},
        mFun: 'GetMemberSecurity',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            if(v.existsTradePswd){
                if(returl.length > 0){
                    location.href = unescape(returl);
                }else{
                    location.href = "/Member/AccountCenter";
                }
            }            
        },
        unusualFun : function(v){
            errorTip.html(v.ES);
        }
    }
    JSBK.Utils.postAjax(initData);

    //完成
    finishBtn.on('click',function(){
        var pwdVal = fmPwd.val(),
            repwdVal = fmRepwd.val();

        if(pwdVal == null || pwdVal == ''){
            errorTip.html('请设置交易密码');
            return false;
        }
        if (!/^\d{6}$/.test(pwdVal)) {
            errorTip.html('交易密码为6位数字');
            return false; // 不是6位数字
        }
        if (/^(\d)\1+$/.test(pwdVal)) {
            errorTip.html('交易密码不能为重复数字');
            return false;  // 全一样
        }
         
        var str = pwdVal.replace(/\d/g, function($0, pos) {
            return parseInt($0)-pos;
        });
        if (/^(\d)\1+$/.test(str)) {
            errorTip.html('交易密码不能为连续6位数字');
            return false;  // 顺增
        }
         
        str = pwdVal.replace(/\d/g, function($0, pos) {
            return parseInt($0)+pos;
        });
        
        if (/^(\d)\1+$/.test(str)) {
            errorTip.html('交易密码不能为连续6位数字');
            return false;  // 顺减
        }

        if(repwdVal == null || repwdVal == ''){
            errorTip.html('请再次输入交易密码');
            return false;
        }else if(repwdVal != pwdVal){
            errorTip.html('交易密码不一致，请确认');
            return false;
        }      
        
        var sucData = {
            data: {
                    'OldPswd': pwdVal,
                    'NewPswd' : repwdVal,
                    'Type' : 2
            },
            mFun: 'ModifyTradePswd',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                fishSuc.open();
            },
            unusualFun : function(v){
                errorTip.html(v.ES);
            }
        }        
        
        JSBK.Utils.postAjax(sucData)
        
    })
    
});