;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/register.css'); 

    var regTel = $('#reg_tel'),
        regPwd = $('#reg_pwd'),
        regImgcode = $('#reg_imgcode'),
        nextBtn = $('#next_btn'),
        regBtn = $('#reg_btn'),
        telCode = $('#reg-telcode'),
        regInviter = $('#reg_inviter'),
        imgCode = $('.img-code'),
        errorTip = $('.error-tip').find('span'),
        bdInp = $('.bd-input input'),
        clear = $('.clear'),
        eyes = $('.eyes'),
        firMod = $('.fir-mod'),
        secMod = $('.sec-mod'),
        getTelcode = $('.reg-getcode');
    
    
    regTel.focus()
    regTel.trigger('focus');

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
        if (regPwd.attr('type') == 'password') {
            regPwd.prop('type', 'text');
        } else {
            regPwd.prop('type', 'password');
        }
    })

    //获取验证码    
    getTelcode.on('click',function(){
        if ($(this).hasClass('reg-setime')){
            return false;
        }
        var telVal = regTel.val(),
            imgCodeVal = regImgcode.val(),
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
                    'Type' : 1
                },
                mFun: 'GetVCode',
                beforeFun : function(){
                    getTelcode.addClass('reg-setime');
                },
                sucFun : function(v){
                        setTimeout(function(){
                            errorTip.html(v.message);
                        },1000)

                        var time = 60;
                        var interId = setInterval(function() {
                            time--;
                            getTelcode.addClass('reg-setime').html(time + 'S');

                            if (time === 0) {
                                clearInterval(interId);
                                errorTip.html('');
                                getTelcode.removeClass('reg-setime').html('获取验证码');
                            }
                        }, 1000);
                                   
                },
                unusualFun : function(v){
                    getTelcode.removeClass('reg-setime');
                    errorTip.html(v.ES);
                    imgCodeShow();
                }
            }
            JSBK.Utils.postAjax(getTelData);
        }
    })

    var ajaxPid = '';
    //下一步
    nextBtn.on('click',function(){

        var telVal = regTel.val(),
            telCodeVal = telCode.val(),
            imgCodeVal = regImgcode.val();

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
        
        var regNextData = {
            data: {
                'phone': telVal,
                'VCodeRnm' : imgCodeId,
                'IdentifyCode' : imgCodeVal,
                'VCode' : telCodeVal
            },
            mFun: 'CheckVCode',
            sucFun : function(v){
                ajaxPid = v.pid;
                secMod.addClass('sec-show');
                regTel.attr('readonly','readonly').off('focus');
                
            },
            unusualFun : function(v){
                if(v.S != 1){
                    imgCodeShow();
                }
                errorTip.html(v.ES);
            }
        }
        JSBK.Utils.postAjax(regNextData);
    })

    //注册成功
    var sucAlert = function(op){
        this.ops = {
            select : $('.reg_suc')
        };
        this.dialog = null;
        this.init();
    }
    sucAlert.prototype.init = function(){
        require('../../ui/Dialog.css');
        var Dialog = require('../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
        this.bindEvent();
    }
    sucAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    sucAlert.prototype.bindEvent = function() {
        var self = this;
        this.ops.select.on("click", function(e) {
            e.stopPropagation();
            self.dialog.close();
        });
    }
    var sucAdAlert = new sucAlert();

    //完成注册
    regBtn.on('click',function(){
        var telVal = regTel.val(),
            pwdVal = regPwd.val(),
            inviterVal = regInviter.val();

        if(pwdVal == null || pwdVal == ''){
            errorTip.html('请设置登录密码');
            return false;
        }else if(!/^[a-zA-Z0-9]{6,16}$/.test(pwdVal)){
            errorTip.html('密码由6-16位数字和字母组成');
            return false;
        }    

        if (inviterVal != '' && !/^1[3|4|5|7|8][0-9]\d{8}$/.test(inviterVal)) {
            errorTip.html('请输入正确的邀请人手机号');
            return false;
        }

        var regData = {
            data: {
                'DeviceId' : '',
                'DeviceInfo' : '',
                'DeviceType' : 0,
                'FriendPhone' : inviterVal,
                'phone': telVal,
                'Pid' : ajaxPid,
                'RegistIp' : '',
                'Pswd' : pwdVal,
                'Domain' : ''
            },
            mFun: 'Regist',
            sucFun : function(v){
                sucAdAlert.open();
            },
            unusualFun : function(v){
                errorTip.html(v.ES);
            }
        }
        JSBK.Utils.postAjax(regData);

    })
    
});