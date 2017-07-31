;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170318/answer.css');
    var Alert = require('../../../ui/Alert.js');
    var Blink = require('../../../ui/Blink.js');

    var acAnswer = $('#acAnswer'),
        acResults = $('#acResults'),
        currNum = $('#currNum'),
        answerTitle = $('#answerTitle'),
        scoreCurr = $('#scoreCurr'),
        answerResult = $('#answerResult'),
        answerResultOne = $('#answerResult p').eq(0),
        answerResultTwo = $('#answerResult p').eq(1),
        timeRemain = $('#timeRemain'),
        state = $('#state'),
        answerNext = $('#answerNext'),
        mask = $('#mask'),
        timeUse = $('#timeUse'),
        scoreGet = $('#scoreGet'),
        uploadScore = $('#uploadScore'),
        resultsBack = $('#resultsBack'),
        mask = $('#mask'),
        load = $('.load'),
        selectedHtml = '',
        getScore = [],
        resultTxt,
        data,
        allReferStr = '',
        uploadTime,
        num = 1,
        alltitleNum = 10,
        timerNum = 89,
        timeAll = 90,
        RemainTimer;

    //获取页面题目
    var titleData = {
        data: {
            AID: '20170318',
            Type: 1
        },
        mFun: 'ActivityBuyProductTopList',
        beforeFun: function() {
            load.show();
            mask.show();
        },
        sucFun: function(v) {
            load.hide();
            mask.hide();
            if (v == '-1') {
                window.location.href = '/Activity/Exclusive20170218';
                return;
            }
            data = v;
            htmlData(num, data);
        },
        notLogged: function() {
            window.location.href = '/Activity/Exclusive20170218';
        }
    }

    //页面初始化执行
    JSBK.Utils.postAjax(titleData);
    RemainTimer = setInterval(function() {
        if (timerNum == 0) {
            answerEnd(timeAll);
        }
        timeRemain.html(timerNum--);
    }, 1000)

    //下一题
    answerNext.on('click', function() {
        if (answerResult.find('p').hasClass('selected')) {
            mask.show();
            //提示动画
            anPrompt();
            storageData();
            //下一题交互
            if (num == alltitleNum) {
                mask.hide();
                answerEnd(timeAll - timeRemain.html())
            } else {
                num = ++num;
                setTimeout(function() {
                    //初始化
                    state.removeClass('state-an').find('img').hide();
                    answerResult.find('p').removeClass('selected');
                    mask.hide();
                    htmlData(num, data)
                }, 1000)
            }
        } else {
            noAnBlink.open()
        }
    })

    uploadScore.on('click', function() {
        //提交成绩
        var uploadScoresData = {
            data: {
                AID: '20170318',
                Action: 'score',
                SourceType: uploadTime,
                ExpandStr: allReferStr
            },
            mFun: 'ActivityMain',
            beforeFun: function() {
                load.show();
                mask.show();
            },
            sucFun: function(v) {
                load.hide();
                mask.hide();
                if (v.Status == 0) {
                    resultTxt = $('<b>' + v.XData_1 + '</b><span>' + v.XData_2 + '%</span>');
                    var resultAlert = new Alert({
                        titleHtml: resultTxt,
                        btnHtml: '',
                        bgClose: true,
                        clickBtnCallback: function() {
                            window.location.href = '/Activity/Special31820170318?ranking=1';
                        }
                    });
                    resultAlert.open()
                }
                if (v.Status == '-1') {
                    var noBindUser = new Blink({
                        blinkHtml: '您尚未绑定！'
                    })
                    noBindUser.open()
                }
            }
        }
        JSBK.Utils.postAjax(uploadScoresData);
    })

    answerResult.find('p').on('click', function() {
        $(this).addClass('selected').siblings('p').removeClass('selected');
    })

    resultsBack.on('click', function() {
        location.reload()
    })

    //填充数据
    function htmlData(num, data) {
        currNum.html(num);
        answerTitle.html(data[num - 1].Question).attr('data-id', data[num - 1].ID);
        scoreCurr.html(data[num - 1].Score);
        answerResultOne.html(data[num - 1].Answers[0].AnswerContent).attr({
            'data-score': data[num - 1].Answers[0].Score,
            'data-id': data[num - 1].Answers[0].ID
        });
        answerResultTwo.html(data[num - 1].Answers[1].AnswerContent).attr({
            'data-score': data[num - 1].Answers[1].Score,
            'data-id': data[num - 1].Answers[1].ID
        });
    }

    //存储数据信息
    function storageData() {
        getScore.push(answerResult.find('.selected').attr('data-score'));
        allReferStr += answerTitle.attr('data-id') + ',' + answerResult.find('.selected').attr('data-id') + '|';
    }

    //分数计算
    function ScoreFn(score, num) {
        score = eval(score.join('+'));
        if (score > 0) {
            score = (score * 0.7 + (timeAll - num) * 0.3).toFixed(2);
        } else {
            score = 0;
        }
        return score;
    }

    //答题结束
    function answerEnd(num) {
        clearInterval(RemainTimer);
        allReferStr = allReferStr.slice(0, allReferStr.length - 1);
        scoreGet.html(ScoreFn(getScore, num));
        timeUse.html(num);
        uploadTime = num;
        acAnswer.hide();
        acResults.show();
    }

    //答题后提示动画
    function anPrompt() {
        var selectedScore = answerResult.find('.selected').attr('data-score');
        if (selectedScore > 0) {
            state.find('img').eq(0).show();
        } else {
            state.find('img').eq(1).show()
        }
        state.addClass('state-an');
    }

    //未选择答案
    var noAnBlink = new Blink({
        blinkHtml: '请选择答案！'
    })
});