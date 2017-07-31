;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/login.css'); 

    var bdTel = $('#bd_tel'),
        bdPwd = $('#bd_pwd'),
        bdImgcode = $('#bd_imgcode'),
        imgCode = $('.img-code'),
        bdBtn = $('.bd-btn'),
        errorTip = $('.error-tip').find('span'),
        bdInp = $('.bd-input input'),
        clear = $('.clear'),
        eyes = $('.eyes'),
        imgcodeMod = $('.imgcode-mod');
    
    bdTel.focus();
    bdTel.trigger('focus');
    
    var imgCodeId;
    var imgUrl = window.Zepto.setUrl+'/Member/YZM?randNum=';
    var imgCodeShow = function (){
        imgCodeId = Math.round(Math.random()*1000);
        imgCode.attr('src',imgUrl+imgCodeId);
        bdImgcode.val('');
    };

    //点击更换图形验证码    
    imgCode.on('click',function(){
        imgCodeShow();
    })

    //手机号码验证    
    bdTel.on('blur',function(){
        var telVal = bdTel.val();
        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }else{
            // ajax判断手机号
            var checktel = {
                data: {'phone': telVal},
                mFun: 'CheckLoginNeedVCode',
                sucFun : function(v){
                    if (v.needVCode === true){
                        imgCodeShow();
                        imgcodeMod.css('display', '-webkit-box');
                    }                    
                },
                unusualFun : function(v){
                    errorTip.html(v.ES);
                }
            }
            JSBK.Utils.postAjax(checktel);
            
        }
    })
    
    bdTel.on('input',function(){
        imgcodeMod.css('display', 'none');
    })    

    bdInp.on('input',function(){
        errorTip.html('');
    })

    //清除按钮交互
    bdInp.on('focus',function(){
        if($(this).val() != ''){
            $(this).next('.clear').css('display', 'block');
        }
    })

    bdInp.on('input',function(){
        $(this).next('.clear').css('display', 'block');
    })
    
    bdInp.on('blur',function(){
        var _this = $(this);
        setTimeout(function(){
             _this.next('.clear').css('display', 'none');
         },200)       
    })

    clear.on('click',function(){
        $(this).prev('input').val('');
        $(this).css('display', 'none');
    })

    //密码明暗码交互
    eyes.on('click',function(){
        $(this).toggleClass('open-eyes');
        if (bdPwd.attr('type') == 'password') {
            bdPwd.prop('type', 'text');
        } else {
            bdPwd.prop('type', 'password');
        }
    })


    //立即登录
    bdBtn.on('click',function(){
        var telVal = bdTel.val(),
            pwdVal =bdPwd.val(),
            imgCodeVal = bdImgcode.val();

        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }

        if(pwdVal == null || pwdVal == ''){
            errorTip.html('请输入登录密码');
            return false;
        }

        if (imgcodeMod.css('display') == "-webkit-box"){
            if(imgCodeVal == null || imgCodeVal == ''){
                errorTip.html('请输入图片验证码');
                return false;
            }
        }
        
        // ajax立即登录
        var sucData = {
            data: {
                    'phone': telVal,
                    'Pswd' : pwdVal,
                    'VCodeRnm' : imgCodeId,
                    'IdentifyCode' : imgCodeVal
            },
            mFun: 'MemberLogin',
            sucFun : function(v){
                    var returl = JSBK.Utils.GetUrlSearch('returl=');
                    if($.isEmptyObject(returl)){
                        location.href = "/Member/AccountCenter" ;  
                    } else {
                        location.href = unescape(returl);  
                    }
            },
            unusualFun : function(v){
                if(v.S != 1){
                    imgCodeShow();
                }
                errorTip.html(v.ES);
            }
        }

        // ajax判断手机号
        var isTelData = {
            data: {
                'phone': telVal
            },
            mFun: 'CheckLoginNeedVCode',
            sucFun : function(v){
                if (v.needVCode === true){
                    imgCodeShow();
                    imgcodeMod.css('display', '-webkit-box');
                    errorTip.html('请输入图片验证码');
                }else{
                    JSBK.Utils.postAjax(sucData)
                }                    
            },
            unusualFun : function(v){
                errorTip.html(v.ES);
            }
        }

        if(imgcodeMod.css('display') == "none"){
            JSBK.Utils.postAjax(isTelData);
        }else{
            JSBK.Utils.postAjax(sucData)
        }
        
    })
    
});