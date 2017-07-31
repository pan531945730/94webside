;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20161225/christmas.css');
    require('../../../component/website/Load.css');

    //圣诞节弹层
    var csmsAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            closeSelect : $('.csms-close'),
            select : $('.hdyjs')
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    csmsAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
    }
    csmsAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    var load = $('.load'),
        jlgzAlert,
        hdgzAlert,
        ybwdlgAlert,
        wwdlgAlert,
        ywdlgAlert,
        xxcyAlert,
        wkycjjhAlert,
        wkyjhAlert;
    //点击活动规则
    $('.csms-hdgz').on('click',function(){
        if(!hdgzAlert){
            hdgzAlert = new csmsAlert({
                select : $('.hdgz')
            });
        }
        hdgzAlert.open();
    })
    //点击100万活动规则
    $('.csms-ybwdlg').on('click',function(){
        if(!ybwdlgAlert){
            ybwdlgAlert = new csmsAlert({
                select : $('.ybwdlg')
            });
        }
        ybwdlgAlert.open();
    })
    //点击50000活动规则
    $('.csms-wwdlg').on('click',function(){
        if(!wwdlgAlert){
            wwdlgAlert = new csmsAlert({
                select : $('.wwdlg')
            });
        }
        wwdlgAlert.open();
    })
    //点击10000活动规则
    $('.csms-ywdlg').on('click',function(){
        if(!ywdlgAlert){
            ywdlgAlert = new csmsAlert({
                select : $('.ywdlg')
            });
        }
        ywdlgAlert.open();
    })
    //点击奖励规则
    $('.csms-rule').on('click',function(){
        if(!jlgzAlert){
            jlgzAlert = new csmsAlert({
                select : $('.jlgz')
            });
        }
        jlgzAlert.open();
    })

    //服务器时间
    var serverTime = '',
        zwFlag;
        
    //增加星星方法
    var starMod = $('.star-mod'),
        starNum = $('.star-num');
    function addStar(index,num){
        var arr = [],
            html = '';
        for(var i = 0;i<index; i++){
            html += '<img src="'+window.Zepto.linkUrl+'/lib/christmas/csms-star.png" alt="christmas" width="100%" height="auto">';
        }
        arr.push(html);
        starMod.append(arr.join(''));
        starNum.html(num).show();
    }

    //点亮方法
    function lightFn(ele){
        ele.find('img').eq(0).hide();
        ele.find('img').eq(1).show();
    }

    function yaobai(){
        if(j==0){
            j=1;
            zwMod.removeClass("rolt").addClass("rort");
        }else{
            j=0;
            zwMod.addClass("rolt").removeClass("rort");
        }
    }
    //初始化接口
    var initData = {
        data: {
            'AID' : 20161225,
            'Action' : ''
        },
        mFun: 'ActivityMain',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            serverTime = Date.parse(v.ST);
            var allCount;
            //第一层星星数
            //v.XData_1 = 10000;
            var Count_1 = parseInt(v.XData_1),
                Line_1 = Math.floor(Count_1/2000);
            if(Count_1 > 0 && Count_1 <2000 ){
                addStar(1,Count_1);
            }else{
                addStar(Line_1,Count_1);
            }
            
            if(v.XData_1 == 10000){
                lightFn(fx);
                lightFn(cqhb);
                zwFlag = setInterval(function(){
                    yaobai();
                },800);
            }
            
            //第二层星星数
            //v.XData_2 = 50000;
            var Count_2 = parseInt(v.XData_2),
                Line_2 = Math.floor(Count_2/6800),
            allCount = Count_1 + Count_2;
            addStar(Line_2,allCount);
            if(v.XData_2 == 50000){
                lightFn(ww);
                lightFn(xgzw);
                clearInterval(zwFlag);                
            }
            //第三层星星数
            //v.XData_3 = 1000000;
            var Count_3 = parseInt(v.XData_3),
                Line_3 = Math.floor(Count_3/140000);
            allCount = Count_1 + Count_2 + Count_3;
            addStar(Line_3,allCount);
            if(v.XData_3 == 1000000){
                lightFn(ybw);
                lightFn(jyb);
                lightFn(zyx);
            }
        },
        unusualFun : function(v){
            load.hide();
        }
    }
    JSBK.Utils.postAjax(initData);
    //第一层点亮
    var startTime = Date.parse('2016/12/22 9:00:00'),//开始时间
        endTimeFir = Date.parse('2016/12/23 12:00:00'),//第一层结束时间
        cqhb = $('.csms-cqhb'),
        fx = $('.csms-fx'),
        hb3yAlert,
        hb15yAlert,
        hb25yAlert,
        cjwksAlert,
        hdwksAlert,
        cjyjsAlert;
    
    cqhb.on('click','#cqhb_btn',function(){
        var cqhbData = {
            data: {
                'AID': 20161225,
                'DrawTimes' : 1,
                'Type': 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var result = v.PrizeList[0],
                    sta = v.Status;
                //状态(-1:异常;0:中奖;1:未中奖;2:无可用抽奖机会;3:;活动未开始;4:;活动已结束;5:本轮活动已结束;6:本轮活动已参与;)
                if(sta == 0){
                    if(result.PrizeLevel == 1){
                        if(!hb3yAlert){
                            hb3yAlert = new csmsAlert({
                                select : $('.hb-3y')
                            });
                        }
                        hb3yAlert.open();
                        return;
                    }else if(result.PrizeLevel ==2){
                        if(!hb15yAlert){
                            hb15yAlert = new csmsAlert({
                                select : $('.hb-15y')
                            });
                        }
                        hb15yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 3){
                        if(!hb25yAlert){
                            hb25yAlert = new csmsAlert({
                                select : $('.hb-25y')
                            });
                        }
                        hb25yAlert.open();
                        return;
                    }
                }else if(sta == 1 || sta == 2){//1未中奖 2无可用投资机会
                    if(!wkycjjhAlert){
                        wkycjjhAlert = new csmsAlert({
                            select : $('.wkycjjh')
                        });
                    }
                    wkycjjhAlert.open();
                    return;
                }else if(sta == 3){
                    if(!cjwksAlert){
                        cjwksAlert = new csmsAlert({
                            select : $('.cjwks')
                        });
                    }
                    cjwksAlert.open();
                    return;
                }else if(sta == 4 || sta == 5){
                    //活动已结束
                    if(!cjyjsAlert){
                        cjyjsAlert = new csmsAlert({
                            select : $('.hdyjs')
                        });
                    }
                    cjyjsAlert.open();
                    return
                }else if(sta == 6){
                    //本轮活动已参与
                    if(!xxcyAlert){
                        xxcyAlert = new csmsAlert({
                            select : $('.xxcy')
                        });
                    }
                    xxcyAlert.open();
                    return;
                }
                
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(cqhbData);
        });  
    })

    //第二层点亮
    var ww = $('.csms-ww'),
        zwMod = $('.csms-zw'),
        xgzw = $('.csms-xgzw'),
        j = 0,
        startTimeSec = Date.parse('2016/12/23 12:00:00'),//第一层开始时间
        endTimeSec = Date.parse('2016/12/23 20:00:00'),//第一层开始时间
        xx30kAlert,
        xx50kAlert,
        xx100kAlert;
    
    $('body').on('click','.rort,.rolt',function(){
        var wwData = {
            data: {
                'AID' : 20161225,
                'Action' : 'getinstar'
            },
            mFun: 'ActivityMain',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var starNum = v.StarNum,
                    sta = v.Status,
                    Count_1 = parseInt(v.XData_1),
                    Count_2 = parseInt(v.XData_2),
                    allCount = Count_1 + Count_2,
                    Line_2 = Math.floor(Count_2/6800);

                addStar(Line_2,allCount);
                if(serverTime < startTimeSec){
                    if(!hdwksAlert){
                        hdwksAlert = new csmsAlert({
                            select : $('.hdwks')
                        });
                    }
                    hdwksAlert.open();
                }                
                if (sta == 0){
                    if(starNum == 30){
                        if(!xx30kAlert){
                            xx30kAlert = new csmsAlert({
                                select : $('.xx-30k')
                            });
                        }
                        xx30kAlert.open();
                        return;
                    }else if(starNum == 50){
                        if(!xx50kAlert){
                            xx50kAlert = new csmsAlert({
                                select : $('.xx-50k')
                            });
                        }
                        xx50kAlert.open();
                        return;
                    }else if(starNum == 100){
                        if(!xx100kAlert){
                            xx100kAlert = new csmsAlert({
                                select : $('.xx-100k')
                            });
                        }
                        xx100kAlert.open();
                        return;
                    }  
                }else if(sta == -3){
                    //无可用机会
                    if(!wkyjhAlert){
                        wkyjhAlert = new csmsAlert({
                            select : $('.wkyjh')
                        });
                    }
                    wkyjhAlert.open();
                    return;
                }
                          
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(wwData);
        });  
    })
   
    //第三层点亮
    var ybw = $('.csms-ybw'),
        jyb = $('.csms-jyb'),
        zyx = $('.csms-zyx'),
        startTimeTri = new Date(Date.parse('2016/12/24 9:00:00')),//第一层结束时间
        endTimeTri = new Date(Date.parse('2016/12/24 24:00:00')),//第一层结束时间
        hf2yAlert,
        hf5yAlert,
        hf10yAlert,
        hf20yAlert,
        hf50yAlert,
        hf100yAlert;

    zyx.on('click','#zyx_btn',function(){
        var zyxData = {
            data: {
                'AID': 20161225,
                'DrawTimes' : 1,
                'Type': 2
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var result = v.PrizeList[0],
                    sta = v.Status;

                if(sta == 0){
                    if(result.PrizeLevel == 1){
                        if(!hf2yAlert){
                            hf2yAlert = new csmsAlert({
                                select : $('.hf-2y')
                            });
                        }
                        hf2yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 2){
                        if(!hf5yAlert){
                            hf5yAlert = new csmsAlert({
                                select : $('.hf-5y')
                            });
                        }
                        hf5yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 3){
                        if(!hf10yAlert){
                            hf10yAlert = new csmsAlert({
                                select : $('.hf-10y')
                            });
                        }
                        hf10yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 4){
                        if(!hf20yAlert){
                            hf20yAlert = new csmsAlert({
                                select : $('.hf-20y')
                            });
                        }
                        hf2yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 5){
                        if(!hf50yAlert){
                            hf50yAlert = new csmsAlert({
                                select : $('.hf-50y')
                            });
                        }
                        hf50yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 6){
                        if(!hf100yAlert){
                            hf100yAlert = new csmsAlert({
                                select : $('.hf-100y')
                            });
                        }
                        hf100yAlert.open();
                        return;
                    }else if(result.PrizeLevel == 7){
                        if(!xxcyAlert){
                            xxcyAlert = new csmsAlert({
                                select : $('.xxcy')
                            });
                        }
                        xxcyAlert.open();
                        return;
                    }
                }else if(sta == 1 || sta == 2){//1未中奖 2无可用投资机会
                    if(!wkycjjhAlert){
                        wkycjjhAlert = new csmsAlert({
                            select : $('.wkycjjh')
                        });
                    }
                    wkycjjhAlert.open();
                    return;
                }else if(sta == 3){
                    if(!cjwksAlert){
                        cjwksAlert = new csmsAlert({
                            select : $('.cjwks')
                        });
                    }
                    cjwksAlert.open();
                    return;
                }else if(sta == 4 || sta == 5){
                    //活动已结束
                    if(!cjyjsAlert){
                        cjyjsAlert = new csmsAlert({
                            select : $('.hdyjs')
                        });
                    }
                    cjyjsAlert.open();
                    return
                }else if(sta == 6){
                    //本轮活动已参与
                    if(!xxcyAlert){
                        xxcyAlert = new csmsAlert({
                            select : $('.xxcy')
                        });
                    }
                    xxcyAlert.open();
                    return;
                }
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(zyxData); 
        });
    }) 

    //微信分享
    JSBK.shareWinxin({
        'title': '94bank与你一起点亮这个圣诞夜！万元红包、话费大放送！',
        'desc': '万元话费大放送！圣诞节期间登录94bank，参与万星点亮，12月22至25日惊喜不断闪亮！',
        'link': 'http://np.94bank.com/Activity/Christmas20161225',
        'imgUrl': 'http://img.94bank.com/np/dist/Activity/img/20161225/share.jpg'
    })

});