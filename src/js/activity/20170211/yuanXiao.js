;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/rankList.css');
    require('../../../css/activity/20170211/yuanXiao.css');

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
    $('.yx-rule').on('click',function(){
        ruleAlert.open();
    })

    //查看我的积分
    var allnumAlert = new activityAlert({
        select : $('.dlg-allnum')
    })

    var dlgAlert = new activityAlert({
        select : $('#dlg_wrap')
    })

    var eatAlert = new activityAlert({
        select : $('#win_prize')
    })
    
    var tastePic = $('.taste-pic'),
        tasteName = $('#taste_name'),
        tasteNum = $('#taste_num'),
        dlgCont = $('#dlg_cont'),
        yxEat = $('.yx-eat'),
        eatNum = $('.eat-num'),
        picArr = ['taste-pic chook','taste-pic xianrou','taste-pic zaoni','taste-pic zhima','taste-pic huasheng','taste-pic mocha','taste-pic lanmei'],
        nameArr = ['鸡祥如意大','鲜肉','枣泥','芝麻','花生','抹茶','蓝莓'];

    //吃汤圆次数
    var residue = 0;
    var openNumData = {
        data: {
            'AID': 20170211,
            'Type': 10
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
        },
        sucFun : function(v){
            residue = v;
            yxEat.show();
            eatNum.html(residue);
        },
        unusualFun : function(v){
            yxEat.hide();
        }
    }
    //点击开吃
    $('.yx-openeat').on('click',function(){
        var shakeredbagData = {
            data: {
                'AID': 20170211,
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
                if(sta == 0){
                    if(result.PrizeType == 1){
                        switch (result.PrizeValue){
                            case 30:
                            tastePic.attr('class',picArr[1]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[1]);
                            break;
                            case 20:
                            tastePic.attr('class',picArr[2]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[2]);
                            break;
                            case 10:
                            tastePic.attr('class',picArr[3]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[3]);
                            break;
                            case 5:
                            tastePic.attr('class',picArr[4]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[4]);
                            break;
                            case 0:
                            tastePic.attr('class',picArr[5]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[5]);
                            break;
                            default:
                            tastePic.attr('class',picArr[6]);
                            tasteNum.html(result.PrizeValue);
                            tasteName.html(nameArr[6]);
                            break;
                        }
                    }else if(result.PrizeType == 2){
                        tastePic.attr('class',picArr[0]);
                        tasteNum.html(result.PrizeValue);
                        tasteName.html(nameArr[0]);
                    }
                    eatAlert.open();
                }else if(sta == 2){
                    //未抽奖机会
                    dlgCont.html('<div class="nochance"></div>');
                    dlgAlert.open();
                }else if(sta == 3){
                    //未开始
                    dlgCont.html('<div class="unstart"></div>');
                    dlgAlert.open();
                }else if(sta == 4){
                    //结束
                    dlgCont.html('<div class="end"></div>');
                    dlgAlert.open();
                }else if(sta == 6){
                    //已参与
                    dlgCont.html('<div class="join"></div>');
                    dlgAlert.open();
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
            JSBK.Utils.postAjax(shakeredbagData);
        }); 
    })   
    
    $('.yx-rank').on('click',function(){
        //点击查看我的排名
        var Rank = require('../../../component/activity/rankList.js');
        var rankFn = new Rank({
            AID : 20170211,
            PS : 10
        })
        dlgCont.html(rankFn.ops.select);
        dlgAlert.open();
    })

    //微信分享
    JSBK.shareWinxin({
        'title': '吃元宵享加倍收益！',
        'desc': '2月11日00:00至24：00，吃元宵，享惊喜！全民有礼，更有幸运数字，福利加倍，快来咬元宵吧~',
        'link': 'http://np.94bank.com/Activity/yuanxiao20170211',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170211/share.png'
    })
});