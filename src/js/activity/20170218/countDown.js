;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/toast.css');
    var toast = require('../../../component/activity/toast.js');
    require('../../../css/activity/20170218/countDown.css');
    
    var nowTime,
        endTime,
        countDownMod = $('.atcd-mod');

    var memberidData = {
        data:{
            AID: '20170418',
            SourceType: 1
        },
        mFun:'ActivityMain',
        sucFun: function(res) {
            if (res.Status === 0) {
                res.ST = res.ST.replace(/-/g,'/') || +new Date();
                nowTime = +new Date(res.ST);
                endTime = endTime || nowTime;
                getEndTime();
                countDownFun(nowTime,endTime,countDownMod);
            } else {
                toast('您不是专属会员，不能参与活动');
            } 
        },
        notLogged: function() {
            window.location.href = '/Activity/Exclusive20170218';
        },
        unusualFun: function(res){
            //toast(res.ES);
        }
    }
    JSBK.Utils.postAjax(memberidData); 

    //12期日期列表，数组第一项为倒计时开始时间，第二项为倒计时结束时间
    var dateData = {
        '0' : [0, 0]
    };
    (function() {
        for(var i=0; i<12; i++){
            dateData[i+1] = [+new Date(2017, 1+i, 19), +new Date(2017, 2+i, 18)];
        }
    })();

    function getEndTime(){
        for (var i = 0; i < 12; i++) {
            if(nowTime >= dateData[i+1][0] && nowTime <= dateData[i+1][1]){
                endTime = dateData[i+1][1];
                return;
            }
        };
    }

    //倒计时
    function addzero(a){
        if(a<10){
            return a='0'+a;
        }else{return a}
    }
    function caculateDate(time){
        var d = parseInt(time/86400);
        var h = parseInt((time%86400)/3600);
        var m = parseInt(((time%86400)%3600)/60);
        var s = parseInt(((time%86400)%3600)%60);
        var t = '<span class="day">'+addzero(d)+'</span><span class="hours">'+addzero(h)+'</span><span class="minute">'+addzero(m)+'</span>';
        return t;
    }
    function countDownFun(nowTime,endTime,dom){
        var time =(endTime - nowTime)/1000;
        if(time <= 0){
            window.location.href = '/Activity/Exclusive20170218';
            return;
        }
        dom.html(caculateDate(time));
        var clearTime = setInterval(function(){
            time -= 1;
            dom.html(caculateDate(time));
            if(time <= 0){
                clearInterval(clearTime)
            }
        },1000);
    }
});