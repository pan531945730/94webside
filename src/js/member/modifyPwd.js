;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/modifyPwd.css'); 
    var Alert = require('../../ui/Alert.js');
    var restTel = $('#rest_tel'),
        restPwd = $('#rest_pwd'),
        restImgcode = $('#rest_imgcode'),
        confirmBtn = $('#confirm_btn'),
        telCode = $('#rest-telcode'),
        imgCode = $('.img-code'),
        errorTip = $('.error-tip').find('span'),
        bdInp = $('.bd-input input'),
        clear = $('.clear'),
        eyes = $('.eyes'),
        getTelcode = $('.rest-getcode');
    
    
    restTel.focus()
    restTel.trigger('focus');
    
    var imgCodeId;
    var imgUrl = window.Zepto.setUrl+'/Member/YZM?randNum=';
    var imgCodeShow = function (){
        imgCodeId = Math.round(Math.random()*1000);
        imgCode.attr('src',imgUrl+imgCodeId);
    };
    imgCodeShow();
    //点击更换图形验证码    
    imgCode.on('click',function(){
        imgCodeShow();
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
        if (restPwd.attr('type') == 'password') {
            restPwd.prop('type', 'text');
        } else {
            restPwd.prop('type', 'password');
        }
    })

    //获取验证码    
    getTelcode.on('click',function(){
        if ($(this).hasClass('rest-setime')){
            return false;
        }
        var telVal = restTel.val(),
            imgCodeVal = restImgcode.val(),
            telTip = telVal.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }else if(imgCodeVal == null || imgCodeVal == ''){
            errorTip.html('请输入图片验证码');
            return false;
        }else{
            var getTelData = {
                data: {
                    'phone': telVal,
                    'VCodeRnm' : imgCodeId,
                    'IdentifyCode' : imgCodeVal,
                    'Type' : 2
                },
                mFun: 'GetVCode',
                beforeFun : function(){
                    getTelcode.addClass('rest-setime');
                },
                sucFun : function(v){
                        setTimeout(function(){
                            errorTip.html(v.message);
                        },1000)

                        var time = 60;
                        var interId = setInterval(function() {
                            time--;
                            getTelcode.addClass('rest-setime').html(time + 'S');

                            if (time === 0) {
                                clearInterval(interId);
                                errorTip.html('');
                                getTelcode.removeClass('rest-setime').html('获取验证码');
                            }
                        }, 1000);
                                   
                },
                unusualFun : function(v){
                    getTelcode.removeClass('rest-setime');
                    errorTip.html(v.ES);
                    imgCodeShow();
                }
            }
            JSBK.Utils.postAjax(getTelData);
        }
    })

    //下一步
    confirmBtn.on('click',function(){

        var telVal = restTel.val(),
            telCodeVal = telCode.val(),
            imgCodeVal = restImgcode.val(),
            pwdVal = restPwd.val();

        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }

        if(imgCodeVal == null || imgCodeVal == ''){
            errorTip.html('请输入图片验证码');
            return false;
        }
        
        if(telCodeVal == null || telCodeVal == ''){
            errorTip.html('请输入短信验证码');
            return false;
        }

        if(pwdVal == null || pwdVal == ''){
            errorTip.html('请设置登录密码');
            return false;
        }else if(!/^[a-zA-Z0-9]{6,16}$/.test(pwdVal)){
            errorTip.html('密码由6-16位数字和字母组成');
            return false;
        } 
        var restSuc = new Alert({
            titleHtml : '登录密码已重置',
            clickBtnCallback : function(){
                location.href="/member/login"
            }
        });

        var confirmData = {
            data: {
                'Phone': telVal,
                'VCodeRnm' : imgCodeId,
                'IdentifyCode' : imgCodeVal,
                'VCode' : telCodeVal,
                'Pswd' : pwdVal,
                'Type' :1
            },
            mFun: 'ForgetPswd',
            sucFun : function(v){
                restSuc.open();                    
            },
            unusualFun : function(v){
                errorTip.html(v.ES);
            }
        }
        JSBK.Utils.postAjax(confirmData);

    })
    
});