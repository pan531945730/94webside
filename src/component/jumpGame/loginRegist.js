;
(function($) {
    var member = function(op){
        var self = this;
        var defaults = {
            loginTel : $('#lMobile'),
            loginPwd : $('#lPassword'),
            imgCodMod : $('#imgcod_mod'),
            loginImgCode : $('#lCodePic'),
            registImgCode : $('#rCodePic'),
            loginImgSrc : $('#imgSrc'),
            registImgSrc : $('#reg_imgSrc'),
            loginImgReload : $('#img_reload'),
            registImgReload : $('#reg_img_reload'),
            loginOkBtn : $('#login_ok'),
            registTel : $('#rMobile'),
            registOkBtn : $('#regist_ok'),
            telCode : $('.code-text'),
            telCodeVal : $('#rCodeText'),
            registPwd : $('#rPassword'),
            imgCodeId : 0,
            imgUrl : window.Zepto.setUrl+'/Member/YZM?randNum='
        };
        this.ops = $.extend(defaults,op);
        this.init();
    }
    member.prototype.init = function(){
        var self = this;
        self.bindEvent();
        self.imgCodeFn(self.ops.registImgSrc,self.ops.registImgCode);
    }
    member.prototype.bindEvent = function(){
        var self = this;

        self.ops.loginTel.on('blur',function(){
            self.checkTelWrong();
        })

        self.ops.loginTel.on('input',function(){
            self.imgCodeHid();
        })
        self.ops.loginImgReload.on('click',function(){
            self.imgCodeFn(self.ops.loginImgSrc,self.ops.loginImgCode);
        })

        self.ops.registImgReload.on('click',function(){
            self.imgCodeFn(self.ops.registImgSrc,self.ops.registImgCode);
        })

        self.ops.loginOkBtn.on('click',function(){
            self.loginSubmitFn();
        })

        self.ops.registTel.on('blur',function(){
            self.checkRegistTel();
        })

        self.ops.telCode.on('click',function(){
            self.getTelCode();
        })

        self.ops.registOkBtn.on('click',function(){
            self.registSubmitFn();
        })
    }
    member.prototype.imgCodeHid = function(){
        var self = this;
        self.ops.imgCodMod.hide();
    }
    //图片验证码
    member.prototype.imgCodeFn = function(img,elem){
        var self = this;
        self.ops.imgCodeId = Math.round(Math.random()*1000);
        img.attr('src',self.ops.imgUrl + self.ops.imgCodeId);
        elem.val('');
    }
    //手机号码输错多次显示图形验证码
    member.prototype.checkTelWrong = function(){
        var self = this;
        var logintelVal = self.ops.loginTel.val();
        if(logintelVal == null || logintelVal == ''){
            $.toast('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(logintelVal)) {
            $.toast('请输入正确的手机号');
            return false;
        }else{
            // ajax判断手机号
            var telWrongData = {
                data: {'phone': logintelVal},
                mFun: 'CheckLoginNeedVCode',
                sucFun : function(v){
                    if (v.needVCode === true){
                        self.imgCodeFn(self.ops.loginImgSrc,self.ops.loginImgCode);
                        self.ops.imgCodMod.show();
                    }                    
                },
                unusualFun : function(v){
                    $.toast(v.ES);
                }
            }
            JSBK.Utils.postAjax(telWrongData);
        }
    }

    //手机号是否注册
    member.prototype.checkRegistTel = function(){
        var self = this;
        var telVal = self.ops.registTel.val();
        if(telVal == null || telVal == ''){
            $.toast('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            $.toast('请输入正确的手机号');
            return false;
        }
        var registTelData = {
            data: {'phone': telVal},
            mFun: 'CheckPhone',
            sucFun : function(v){
                if(v.Success == true){
                    $.toast('手机号已注册');
                }                
            },
            unusualFun : function(v){
                $.toast(v.ES);
            }
        }
        JSBK.Utils.postAjax(registTelData);
    }

    //获取验证码
    member.prototype.getTelCode = function(){
        var self = this;
        if(self.ops.telCode.html() != '获取验证码'){
            return false;
        }
        var registTel = self.ops.registTel.val(),
            imgCodeVal = self.ops.registImgCode.val();

        if(registTel == null || registTel == ''){
            $.toast('请输入手机号');
            return false;
        }else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(registTel)) {
            $.toast('请输入正确的手机号');
            return false;
        }else if(imgCodeVal == null || imgCodeVal == ''){
            $.toast('请输入图片验证码');
            return false;
        }else{
            var getTelData = {
                data: {
                    'phone': registTel,
                    'VCodeRnm' : self.ops.imgCodeId,
                    'IdentifyCode' : imgCodeVal,
                    'Type' : 1
                },
                mFun: 'GetVCode',
                beforeFun : function(){
                    //self.ops.telCode.html('');
                },
                sucFun : function(v){
                        setTimeout(function(){
                            $.toast(v.message);
                        },1000)

                        var time = 60;
                        var interId = setInterval(function() {
                            time--;
                            self.ops.telCode.html(time + 'S');

                            if (time === 0) {
                                clearInterval(interId);
                                self.ops.telCode.html('获取验证码');
                            }
                        }, 1000);
                                   
                },
                unusualFun : function(v){
                    self.ops.telCode.html('获取验证码');
                    $.toast(v.ES);
                    self.imgCodeFn(self.ops.registImgSrc,self.ops.registImgCode);
                }
            }
            JSBK.Utils.postAjax(getTelData);
        }

    }
    member.prototype.registSubmitFn= function(){
        var self = this;
        var registTelVal = self.ops.registTel.val(),
            registPwdVal = self.ops.registPwd.val(),
            telCodeVal = self.ops.telCodeVal.val(),
            imgCodeVal = self.ops.registImgCode.val();
        if(registTelVal == null || registTelVal == ''){
            $.toast('请输入手机号');
            return false;
        }else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(registTelVal)) {
            $.toast('请输入正确的手机号');
            return false;
        }else if(imgCodeVal == null || imgCodeVal == ''){
            $.toast('请输入图片验证码');
            return false;
        }else if(telCodeVal == null || telCodeVal ==''){
            $.toast('请输入手机验证码');
            return false;
        }else if(registPwdVal == null || registPwdVal == ''){
            $.toast('请设置登录密码');
            return false;
        }else if(!/^[a-zA-Z0-9]{6,16}$/.test(registPwdVal)){
            $.toast('密码由6-16位数字和字母组成');
            return false;
        }    
        var regNextData = {
            data: {
                'phone': registTelVal,
                'VCodeRnm' : self.ops.imgCodeId,
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
                        'phone': registTelVal,
                        'Pid' : v.pid,
                        'RegistIp' : '',
                        'Pswd' : registPwdVal,
                        'Domain' : ''
                        //'FriendMemberId' : friendMemberId
                    },
                    mFun: 'Regist',
                    sucFun : function(v){
                        //注册成功
                        $.loginCallback();
                    },
                    unusualFun : function(v){
                        $.toast(v.ES);
                    }
                }
                JSBK.Utils.postAjax(regData);
            },
            unusualFun : function(v){
                if(v.S != 1){
                    self.imgCodeFn(self.ops.registImgSrc,self.ops.registImgCode);
                }
                $.toast(v.ES);
            }
        }
        JSBK.Utils.postAjax(regNextData);
    }
    member.prototype.loginSubmitFn = function(){
        var self = this;
        var logintelVal = self.ops.loginTel.val();
            loginpwdVal =self.ops.loginPwd.val(),
            loginimgCodeVal = self.ops.loginImgCode.val();

        if(logintelVal == null || logintelVal == ''){
            $.toast('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(logintelVal)) {
            $.toast('请输入正确的手机号');
            return false;
        }

        if(loginpwdVal == null || loginpwdVal == ''){
            $.toast('请输入登录密码');
            return false;
        }

        if (self.ops.imgCodMod.css('display') == "block"){
            if(loginimgCodeVal == null || loginimgCodeVal == ''){
                $.toast('请输入图片验证码');
                return false;
            }
        }
        
        // ajax立即登录
        var sucData = {
            data: {
                    'phone': logintelVal,
                    'Pswd' : loginpwdVal,
                    'VCodeRnm' : self.ops.imgCodeId,
                    'IdentifyCode' : loginimgCodeVal
            },
            mFun: 'MemberLogin',
            sucFun : function(v){
                    var returl = JSBK.Utils.GetUrlSearch('returl=');
                    if($.isEmptyObject(returl)){
                        //location.href = "/Member/AccountCenter" ;
                        //登录成功调用接口
                        $.loginCallback();
                    } else {
                        location.href = unescape(returl);  
                    }
            },
            unusualFun : function(v){
                if(v.S != 1){
                    self.imgCodeFn(self.ops.loginImgSrc,self.ops.loginImgCode);
                }
                $.toast(v.ES);
            }
        }

        // ajax判断手机号
        var isTelData = {
            data: {
                'phone': logintelVal
            },
            mFun: 'CheckLoginNeedVCode',
            sucFun : function(v){
                if (v.needVCode === true){
                    self.imgCodeFn(self.ops.loginImgSrc,self.ops.loginImgCode);
                    self.ops.imgCodMod.show();
                    $.toast('请输入图片验证码');
                }else{
                    JSBK.Utils.postAjax(sucData)
                }                    
            },
            unusualFun : function(v){
                $.toast(v.ES);
            }
        }

        if(self.ops.imgCodMod.css('display') == "none"){
            JSBK.Utils.postAjax(isTelData);
        }else{
            JSBK.Utils.postAjax(sucData)
        }
    }

    module.exports = member;

})(Zepto);