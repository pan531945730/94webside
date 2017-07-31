;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/member/friendRegister.css'); 
    
    var regTel = $('#reg_tel'),
        regPwd = $('#reg_pwd'),
        regImgcode = $('#reg_imgcode'),
        form = $('.form'),
        telCode = $('#freg-telcode'),
        imgCode = $('.img-code'),
        errorTip = $('.error-tip').find('span'),
        bdInp = $('.form input'),
        clear = $('.clear'),
        eyes = $('.eyes'),
        getTelcode = $('.freg-getcode'),
        fregSec = $('.freg-sec'),
        friendMemberId = JSBK.Utils.GetQueryString('friendMemberId'),
        friendName = JSBK.Utils.GetQueryString('name');
    
    $('#friend-name').html(friendName);
    
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

    // ajax判断手机号
    form.on('click','.fir-btn',function(){
        var telVal = regTel.val(),
            that = this;
        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }
        var checktel = {
            data: {'phone': telVal},
            mFun: 'CheckPhone',
            sucFun : function(v){
                if(v.Success == true){
                    var confirm = require('../../ui/Confirm.js');
                    var alreadyUser = new confirm({
                        titleHtml : '手机号已注册',
                        infoHtml  : '您已混得脸熟，将机会留给新人吧',
                        cancleBtnHtml : '换个号码',
                        confirmBtnHtml : '立即登录',
                        confirmCallback : function(){
                            window.location.href = '/member/login';
                        }
                    });
                    alreadyUser.open();
                }else{
                    fregSec.show();
                    $(that).addClass('sec-btn').removeClass('fir-btn'); 
                }                
            },
            unusualFun : function(v){
                errorTip.html(v.ES);
            }
        }
        JSBK.Utils.postAjax(checktel);
    })

    //获取验证码    
    getTelcode.on('click',function(){
        if ($(this).hasClass('freg-setime')){
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
                    getTelcode.addClass('freg-setime');
                },
                sucFun : function(v){
                        setTimeout(function(){
                            errorTip.html(v.message);
                        },1000)

                        var time = 60;
                        var interId = setInterval(function() {
                            time--;
                            getTelcode.addClass('freg-setime').html(time + 'S');

                            if (time === 0) {
                                clearInterval(interId);
                                errorTip.html('');
                                getTelcode.removeClass('freg-setime').html('获取验证码');
                            }
                        }, 1000);
                                   
                },
                unusualFun : function(v){
                    getTelcode.removeClass('freg-setime');
                    errorTip.html(v.ES);
                    imgCodeShow();
                }
            }
            JSBK.Utils.postAjax(getTelData);
        }
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
    form.on('click','.sec-btn',function(){
        var telVal = regTel.val(),
            pwdVal = regPwd.val(),
            telCodeVal = telCode.val(),
            imgCodeVal = regImgcode.val();

        if(pwdVal == null || pwdVal == ''){
            errorTip.html('请设置登录密码');
            return false;
        }else if(!/^[a-zA-Z0-9]{6,16}$/.test(pwdVal)){
            errorTip.html('密码由6-16位数字和字母组成');
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
                var regData = {
                    data: {
                        'DeviceId' : '',
                        'DeviceInfo' : '',
                        'DeviceType' : 0,
                        //'FriendPhone' : inviterVal,
                        'phone': telVal,
                        'Pid' : v.pid,
                        'RegistIp' : '',
                        'Pswd' : pwdVal,
                        'Domain' : '',
                        'FriendMemberId' : friendMemberId
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
    
    var swipe = require('../../ui/Swipe.js');
    //滚动公司背景
     new swipe($('#swipe_wrap')[0], {
          startSlide: 0,
          speed: 0,
          auto: false,
          continuous: false,
          disableScroll: false,
          stopPropagation: false,
          callback: function(index, elem) {
              var dotList = $('#pnav').find('li');
              $(dotList[index]).addClass('focus').siblings().removeClass('focus');
          }
      });
});