;
$(function(){
    require('../../common/layout.css');
    var JSBK = require('../../common/layout02.js');
    var Brideg = require('../../component/webapp/brideg.js');
    require('../../css/accountCenter/RiskAppraisal.css'); 
    require('../../component/website/Load.css');
    var Load=$('.load');
    var nav=$('#answerbox'),
    answernum=$('#answernum'),
    totalanswer=$("#totalanswer"),
    answercon=$('#answercon'),
    pgtit=$('#pgtit'),
    pgtxt=$('#pgtxt'),
    pgbtn=$('#pgbtn'),
    box1=$('.box1'),
    box2=$('.box2');
    var questionbtn=false;
    var evaluationID;
    var AnswerIdList=[];
    var icon=["A","B","C","D","E","F","G","H","I","J",'K','L'];
    //内容模版
    function showhtml(data,arr){
        if (data.length <= 5){
            for (var i =  0; i < data.length; i++) {
                var d=data[i];
                var h2html=d.question;
                var ulhtml=[];
                for (var l =0; l < d.answerList.length ; l++) {
                    var lihtml="<li data-id="+i+" data-num="+d.answerList[l].answerID+"><span>"+icon[l]+"</span><p>"+d.answerList[l].answer+"</p></li>";
                    ulhtml.push(lihtml);
                };
                var divhtml="<div class='swiper-slide'><h2>"+h2html+"</h2><ul>"+(ulhtml.join(''))+"</ul></div>";
                nav.append("<span></span>");
                arr.push(divhtml);
                totalanswer.html(data.length);

            };
        };
    };

    //加载题目
    var getquestion={
        data: {},
        mFun: 'GetEvaluation',
        sucFun : function(v){
            var data=v.questionList;
            evaluationID=v.evaluationID;
            var arr=[];
            showhtml(data,arr);
            answercon.append(arr.join(''));  
            answercon.find('.swiper-slide').eq(0).show(); 
            box1.show();
            box2.hide(); 
            Brideg.reEvaluating();
        },
        unusualFun : function(v){
        }
    };

    //答题交互
    var btn=false;
    answercon.on("click",'li',function(){
        if (!btn){
            btn=true;
            var t=$(this);
            var id=t.data("id");
            var num=t.data("num");
            AnswerIdList.push(num);
            nav.find('span').eq(id).addClass('hover');
            t.addClass('hover');
            answernum.html(id+1);
            setTimeout(function(){
                if (id == nav.find('span').length-1){
                    //提交测试结果
                    var Senddata={
                        data: {
                            "evaluationID":evaluationID,
                            "answerIdList":AnswerIdList
                        },
                        mFun: 'SendEvaluationResult',
                        sucFun : function(v){
                            Load.hide();
                            var type=v.customerType;
                            var Description=v.description;
                            gettest(type,Description,'完成');
                        },
                        unusualFun : function(v){
                            Load.show();
                        }
                    };
                    JSBK.Utils.postAjax(Senddata);               
                }else{
                    answercon.find('.swiper-slide').hide(800);
                    answercon.find('.swiper-slide').eq(id+1).show(800);                      
                }; 
                Load.hide();
                btn=false;
            },500);
        }else{
            Load.show();
        }; 
    });


    //初始化
    var getdata={
        data: { },
        mFun: 'GetMemberEvaluationResult',
        sucFun : function(v){
            var type=v.customerType;
            var Description=v.description;
            if (type || Description){//测评过
                gettest(type,Description,"重新测评")
            }else{
                if (!questionbtn){
                    JSBK.Utils.postAjax(getquestion);
                    questionbtn=true;
                };
            };
        },
        unusualFun : function(v){
        }
    };
    
    window.riskAppraisal = function(){
        JSBK.Utils.postAjax(getdata);
    }
    var openFrom = JSBK.Utils.GetQueryString('openFrom');
    if(!openFrom){
      window.riskAppraisal();
    }
    //测评结果
    function gettest(tit,txt,btnhtml){
        pgtit.html(tit);
        pgtxt.html(txt);
        box1.hide();
        box2.show();
        pgbtn.html(btnhtml);
    };

    //btn
    pgbtn.on("click",function(){
        if (pgbtn.html()=="重新测评"){
            if (!questionbtn){
                JSBK.Utils.postAjax(getquestion);
                questionbtn=true;
            };
            box1.show();
            box2.hide();
        }else{
           Brideg.myCenter();
        }
    });
})