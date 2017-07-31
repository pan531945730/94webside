;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170126/wlcmGodOfWealth.css');

    //弹层
    var cashcowAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            select : $('.rule-wrap')
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    cashcowAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
    }
    cashcowAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    //活动未开始
    var unstartAlert = new cashcowAlert({
        select : $('#unstart')
    });
    //活动已结束
    var endAlert = new cashcowAlert({
        select : $('#end')
    });

    var redbagAlert = new cashcowAlert({
        select : $('#win_prize')
    })
    var prizeTit = $('.prize-tit'),
        prizeNumber = $('.prize-number'),
        penBtn = $('.open-btn'),
        unopenBtn = $('.unopen-btn'),
        load = $('.load');

    //拆红包次数
    var redbagNum = $('#redbag_num'),
        numMod = redbagNum.parent();
        residue = 0;
    var openNumData = {
        data: {
            'AID': 20170126,
            'Type': 10
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
           load.show();
        },
        sucFun : function(v){
            load.hide();
            residue = v;
            numMod.show();
            redbagNum.html(residue);
            if (parseInt(v) == 0){
                penBtn.hide();
                unopenBtn.show();
            }else{
               penBtn.show();
               unopenBtn.hide(); 
            }
        },
        unusualFun : function(v){
            load.hide();
            numMod.hide();
        }
    }

    //点击拆红包
    $('.wcgow-bind').on('click','.open-btn',function(){
        var shakeredbagData = {
            data: {
                'AID': 20170126,
                'DrawTimes' : 1,
                'Type': 3
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
               load.show();
            },
            sucFun : function(v){
                load.hide();
                JSBK.Utils.postAjax(openNumData);
                var result = v.PrizeList[0],
                    sta = v.Status;
                if(sta == 0){
                    
                    if(result.PrizeType == 4){
                        prizeTit.html('现金券');
                        prizeNumber.html(result.PrizeValue+'元现金');
                    }else if(result.PrizeType == 2){
                        prizeTit.html('卡券');
                        prizeNumber.html(result.PrizeValue+'元卡券');
                    }
                    redbagAlert.open();
                }else if(sta == 3){
                    //未开始
                    unstartAlert.open();
                }else if(sta == 4){
                    //结束
                    endAlert.open();
                }
               
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(shakeredbagData);
        }); 
        
    })

    //微信分享
    JSBK.shareWinxin({
        'title': '迎财神 现金红包疯狂送',
        'desc': '初五迎财神，现金红包撒不停，购买任意9盈宝产品随机送现金！多买多得！',
        'link': 'http://np.94bank.com/Activity/WlcmGodOfWealth20170126',
        'imgUrl': 'http://img.94bank.com/np/dist/Activity/img/20170126/share-wlcgodofwealth.jpg'
    })
});