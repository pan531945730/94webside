/*
 *flipbook
 *20170118
 *wangying
 */
;
require('../../../common/layout.js');
require('../../../common/layout.css');
require('../../../ui/turn.js');
require('../../../ui/hash.js');
require('../../../component/annualBill/common.js');
require('../../../css/activity/annualBill/annualBill.css');
(function(window) {
    var dom = {
        body: $('body'),
        loadingBox: $('.loading-box'),
        loading: $('#loading'),
        flipbook: $('#flipbook'),
        flipbookNo: $('#flipbookNo'),
        jumpShare: $('#jumpShare'),
        pageNum: $('#pageNum li'),
        page: $('.page'),
        inviteNot: $('.page07') //特殊情况当邀请人数为0时，不显示
    };

    var loadTimer, //loading倒计时
        step = 0, //loading倒计时数字
        allPages = 10, //账单总页数
        AID = '20170126',
        MemberID = window.localStorage['MemberID'];

    document.getElementById("jumpShare").addEventListener("touchend", function(e) {
        window.location.href = "/Activity/AnnualShare20170126";
    });

    function preLoad() {
        loadTimer = setInterval(function() {
            if (step <= 99) {
                dom.loading.html(step + "%");
                step += 1;
            } else {
                clearInterval(loadTimer);
            }
        }, 100);
    }
    preLoad();

    $(document).ready(function() {
        //获取数据信息
        step = parseInt(80);
        JSBK.Utils.postAjax(getFlipBook);
    });

    //flipbook
    function flipbook(allPages) {
        dom.body.append(window.pageNumData(allPages))
        dom.flipbook.turn({
            width: $(window).width(),
            height: $(window).height(),
            elevation: 20,
            display: 'single',
            autoCenter: true,
            page: 1,
            pages: allPages,
            when: {
                turning: function(event, page, view) {
                    Hash.go('page/' + page).update();
                    $('#pageNum li').eq(page - 1).addClass('current').siblings().removeClass('current');
                }
            }
        });
    }

    // URIs
    Hash.on('^page\/([0-9]*)$', {
        yep: function(path, parts) {
            var page = parts[1];
            if (page !== undefined) {
                if (dom.flipbook.turn('is')) {
                    dom.flipbook.turn('page', page);
                }
            }
        },
        nop: function(path) {
            if (dom.flipbook.turn('is')) {
                dom.flipbook.turn('page', 1);
            }
        }
    });

    //星座排行
    function constellRanking(n) {
        switch (n) {
            case 1:
                return '第一';
                break;
            case 2:
                return '第二';
                break;
            case 3:
                return '第三';
                break;
            case 4:
                return '第四';
                break;
            case 5:
                return '第五';
                break;
            case 6:
                return '第六';
                break;
            case 7:
                return '第七';
                break;
            case 8:
                return '第八';
                break;
            case 9:
                return '第九';
                break;
            case 10:
                return '第十';
                break;
            case 11:
                return '第十一';
                break;
            case 12:
                return '第十二';
                break;
            default:
                return '未上榜';
        }
    };
    var getFlipBook = {
        data: {
            ActionID: '1',
            AID: AID,
            MemberID: MemberID
        },
        mFun: 'GetAnnualBill',
        sucFun: function(v) {
            $('#time1').html(v.time1Text)
            $('#amount1').html(v.amount1);

            $('#time2').html(v.time2Text)
            $('#amount2').html(v.amount2);

            $('#time3').html(v.time3Text)
            $('#amount3').html(v.amount3);

            $('#yue4').html(v.yue4)
            $('#amount4').html(v.amount4)
            $('#jzzs4').html(v.jzzs4 + '%');

            $('#amount5').html(v.amount5)
            $('#fqzs5').html(v.fqzs5 + '%')
            $('#title5').html(v.title5);

            $('#count6').html(v.count6)
            $('#yqzs6').html(v.yqzs6 + '%')
            $('#title6').html(v.title6);

            $('#amount7').html(v.amount7)
            $('#baifenbi7').html(v.baifenbi7 + '%');

            $('#maxconstell').html(v.maxconstell)
            $('#constell').html(v.constell)
            $('#rankconstell').html(constellRanking(v.rankconstell));

            $('#maxamounttitle').html(v.maxamounttitle)
            $('#day90').html(v.day90 + '%')
            $('#day180').html(v.day180 + '%')
            $('#day365').html(v.day365 + '%')
            $('#yinhangbao').html(v.yinhangbao + '%')
            $('#jijinbao').html(v.jijinbao + '%')
            $('#title8').html(v.title8);

            //logical
            clearInterval(loadTimer);
            dom.loadingBox.hide();
            //邀请人数判断
            if (v.count6 == '0') {
                dom.inviteNot.remove();
                allPages = 9;
            }
            flipbook(allPages);
            dom.flipbook.show();
        },
        unusualFun: function() {
            clearInterval(loadTimer);
            dom.loadingBox.hide();
            dom.flipbookNo.show();
        },
        errFun: function() {
            clearInterval(loadTimer);
            dom.loadingBox.hide();
            dom.flipbookNo.show();
        }
    };
})(window);