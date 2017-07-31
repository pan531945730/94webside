;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/rankList.css');
    require('../../../css/activity/20170214/sweetHeart.css');

    //弹层
    var activityAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            select : $('#rule_wrap')
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    activityAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
    }
    activityAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    activityAlert.prototype.close = function(){
        this.dialog.close();
        this.ops.select.show();
    }
    //查看规则
    var ruleAlert = new activityAlert();
    $('.sw-rule').on('click',function(){
        ruleAlert.open();
    })

    //情书
    var emailAlert = new activityAlert({
        select : $('#dlg_email')
    })
    //打开信封
    function openLetter(){
        $('.em-open').addClass('open');
        $('.em-xq').addClass('xq');
        $('.em-letter').addClass('letter');
        $('.em-jl').addClass('jl');
    }
    //状态
    var dlgStAlert = new activityAlert({
        select : $('#dlg_st_wrap')
    })

    var dlgAlert = new activityAlert({
        select : $('#dlg_wrap')
    })

    var pzSt = $('.pz-st'),
        pzBox = $('#pz_box'),
        besides = $('.sw-besides'),
        bsNum = $('.sw-num'),
        email = $('.sw-email'),
        stPic = $('#dlg_st_pic'),
        stTit = $('#st_tit'),
        boxCss = ['pz-box zdf','pz-box qkl','pz-box dyp','pz-box xjq','pz-box xj'],
        isSatisfy,
        remark;

    //手机号码验证    
    var emTel = $('#em_tel'),
        errorTip = $('.em-err span'),
        emBtn = $('.em-btn'),
        telVal; 
    
    $('.em-jl').on('click','.btn',function(){
        telVal = emTel.val();
        if(telVal == null || telVal == ''){
            errorTip.html('请输入手机号');
            return false;
        }else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(telVal)) {
            errorTip.html('请输入正确的手机号');
            return false;
        }else{
            var dearData = {
                data: {
                    'AID': 20170214,
                    'Action' : telVal,//手机号
                    'SourceType' :1
                },
                mFun: 'ActivityMain',
                beforeFun : function(){
                },
                sucFun : function(v){
                    var sta = v.Status;
                    switch (sta){
                        case -2:
                        //活动已结束
                        stTit.html('很抱歉！');
                        stPic.html('<div class="end"></div>')
                        dlgStAlert.open();
                        break;
                        case -1:
                        //活动未开始
                        stTit.html('很抱歉！');
                        stPic.html('<div class="unstart"></div>')
                        dlgStAlert.open();
                        break;
                        case 1:
                        //赠送成功
                        emTel.attr('readonly','readonly').off('blur');
                        errorTip.html('');
                        emBtn.removeClass('btn').html('已送祝福给好友');
                        stTit.html('太棒了！');
                        stPic.html('<div class="succ"></div>')
                        dlgStAlert.open();
                        break;
                        case 2:
                        //手机号已注册
                        errorTip.html('手机号已注册');
                        break;
                        case 3:
                        // 已经领取过了
                        errorTip.html('已经领取过了');
                        break;
                        default:
                        //赠送失败
                        errorTip.html('赠送失败');
                        break;
                    }
                },
                unusualFun : function(v){
                    
                },
                comFun : function(){
                    
                }
            }
            JSBK.Utils.postAjax(dearData);
        }        
    })
    
    //剩余次数
    var residue = 0;
    var openNumData = {
        data: {
            'AID': 20170214,
            'Type': 1
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
        },
        sucFun : function(v){
            residue = v;
            besides.show();
            bsNum.html(residue);
        },
        unusualFun : function(v){
            besides.hide();
        }
    }
    $('.sw-cont').on('click','.email-show',function(){
        errorTip.html('');
        emailAlert.open();
        openLetter();
    })
    //点击拉弓
    $('.prize-btn').on('click',function(){
        var prizeData = {
            data: {
                'AID': 20170214,
                'DrawTimes' : 1,
                'Type': 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
            },
            sucFun : function(v){
                JSBK.Utils.postAjax(openNumData);
                var result = v.PrizeList[0],
                    sta = v.Status;
                isSatisfy = v.IsSatisfy;//0:未达到条件，1:已达到条件，2:已领取
                remark = v.Remark;//分享电话号码
                //是否显示情书
                if(isSatisfy >= 1){
                    email.addClass('email-show');
                    if(isSatisfy == 2){
                        emTel.val(remark).attr('readonly','readonly').off('blur');
                        emBtn.removeClass('btn').html('已送祝福给好友');
                    }
                }
                if(sta == 0){
                    switch (result.PrizeLevel){
                        case 1:
                        //周大福心愿成真黄金手链
                        pzSt.html('周大福心愿成真黄金手链');
                        pzBox.attr('class',boxCss[0]);
                        dlgAlert.open();
                        break;
                        case 2:
                        //GODIVA歌帝梵金装心形礼盒
                        pzSt.html('GODIVA金装心形礼盒');
                        pzBox.attr('class',boxCss[1]);
                        dlgAlert.open();
                        break;
                        case 3:
                        //情侣座电子电影券
                        pzSt.html('情侣座电子电影券');
                        pzBox.attr('class',boxCss[2]);
                        dlgAlert.open();
                        break;
                        case 4:
                        //99元红包券
                        pzSt.html('<span>99</span>元现金红包券');
                        pzBox.attr('class',boxCss[3]);
                        dlgAlert.open();
                        break;
                        case 5:
                        //18元红包券
                        pzSt.html('<span>18</span>元现金红包券');
                        pzBox.attr('class',boxCss[3]);
                        dlgAlert.open();
                        break;
                        case 6:
                        //7元红包券
                        pzSt.html('<span>7</span>元现金红包券');
                        pzBox.attr('class',boxCss[3]);
                        dlgAlert.open();
                        break;
                        case 7:
                        //3元现金红包
                        pzSt.html('<span>3</span>元现金红包');
                        pzBox.attr('class',boxCss[4]);
                        dlgAlert.open();
                        break;
                        default:
                        //无中奖
                        stTit.html('很抱歉！');
                        stPic.html('<div class="nochance"></div>')
                        dlgStAlert.open();
                        break;
                    }

                    dlgAlert.dialog.on('bgClose',function(){
                        if(isSatisfy == 1){
                            emailAlert.open();
                            openLetter();
                        }  
                    })

                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stTit.html('很抱歉！');
                    stPic.html('<div class="nochance"></div>')
                    dlgStAlert.open();
                }else if(sta == 3){
                    //未开始
                    stTit.html('很抱歉！');
                    stPic.html('<div class="unstart"></div>')
                    dlgStAlert.open();
                }else if(sta == 4){
                    //结束
                    stTit.html('很抱歉！');
                    stPic.html('<div class="end"></div>')
                    dlgStAlert.open();
                }
            },
            unusualFun : function(v){
                
            },
            comFun : function(){
                
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(prizeData);
        }); 
    }) 

    //微信分享
    JSBK.shareWinxin({
        'title': '“1314”9比特甜蜜大放送',
        'desc': '9比特甜蜜之箭，黄金手链、心形巧克力礼盒、情侣座电影券、更有现金红包、红包券、加息券，“1314”94有情有礼~',
        'link': 'http://np.94bank.com/Activity/ValentineDay20170214',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170214/share.png'
    })
});