var GetMemberInfo = {
        data : {},
        mFun : 'GetMemberInfo',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
           var rechargeUrl = JSBK.Utils.GetUrlSearch().returl;
           if(rechargeUrl && rechargeUrl.indexOf('memberrecharge') > 0){//充值
                if(v.realNameAuthen == 1&&v.bankCardAuthen==1){ //实名认证&&绑卡
                    location.href=rechargeUrl;
                    return;
                }else{ 
                    location.href = '/Member/Identification?returl='+rechargeUrl; //实名认证
                    return;
                }

            }else{
                if(v.realNameAuthen == 1&&v.bankCardAuthen==1&&v.existsOpenAccountName&&v.existsTradePswd){ //实名认证&&绑卡
                    location.href=rechargeUrl;
                    return;
                }
                if(v.realNameAuthen==0||v.bankCardAuthen==0){
                    location.href = '/Member/Identification?returl='+location.href; //实名认证
                    return;
                }
                if(!v.existsTradePswd){
                    location.href = '/Member/ModifyTradePwd?returl='+location.href; //设置交易密码
                    return;
                }
                else{
                    location.href = '/Member/BankSub?returl='+location.href; //设置支行
                    return;
                }

            }

        }
        
    }

    JSBK.Utils.postAjax(GetMemberInfo);