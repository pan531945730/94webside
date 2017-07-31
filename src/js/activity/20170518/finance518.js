;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170518/finance518.css');

    var dlgRuleMask = $('#dlg_rule_mask'),
        load = $('.load');

    //查看规则
    $('.btn-rule').on('click', function() {
        dlgRuleMask.show();
    })

    dlgRuleMask.on('click', function(event) {
        if (event.target === this) {
            event.stopPropagation();
            $(this).hide();
        }
    })

    if (!JSBK.Utils.getCookie('rule-finance')) {
        JSBK.Utils.setCookie('rule-finance', 'yes', 36500);
        dlgRuleMask.show();
    }

    //排行榜
    var FinanceRankingList = {
        data: {
            'AID': '20170518',
            'PI': 0,
            'PS': 50 //最后一条为个人数据信息
        },
        mFun: 'ActivityBuyProductTopList',
        beforeFun: function() {},
        sucFun: function(v) {
            var rankingHtml = '',
                len = v.length;

            //排行数据
            if (len > 1) {
                for (var i = 0; i < len - 1; i++) {
                    var rank = v[i].rank,
                        rankNum,
                        rankCss;
                    if (rank <= 3) {
                        rankNum = '';
                        rankCss = 'rank-0' + rank;
                    } else {
                        rankNum = rank;
                        rankCss = '';
                    }
                    rankingHtml += '<li><span class="' + rankCss + '">' + rankNum + '</span>';
                    rankingHtml += '<span>' + v[i].phone + '</span>';
                    rankingHtml += '<span>' + v[i].totalAmount + '</span>';
                    rankingHtml += '<span>x <em>' + v[i].activityRate + '%</em></span></li>';
                }
            } else {
                rankingHtml = '<li class="noneinfo">暂无数据</li>';
            }
            $('#ranking').html(rankingHtml);
        },
        unusualFun: function(v) {}
    };
    JSBK.Utils.postAjax(FinanceRankingList);

    //我的财气值
    $('.login').on('click',function(){
        var myRankingData = {
            data: {
                'AID': '20170518',
                'PI': 0,
                'PS': 50 //最后一条为个人数据信息
            },
            mFun: 'ActivityBuyProductTopList1',
            beforeFun: function() {},
            sucFun: function(v) {
                var rankingMyHtml = '',
                    len = v.length;
                //我的排行
                if (len > 0) {
                    if (v[len - 1].isLogin == 1) {
                        rankingMyHtml += '<span>' + v[len - 1].rank + '</span>';
                        rankingMyHtml += '<span>' + v[len - 1].phone + '</span>';
                        rankingMyHtml += '<span>' + v[len - 1].totalAmount + '</span>';
                        rankingMyHtml += '<span>x <em>' + v[len - 1].activityRate + '%</em></span>';
                    } else {
                        rankingMyHtml = '<p class="noneinfo">您尚未登录</p>';
                    }
                }
                $('#myRank').html(rankingMyHtml);
            },
            unusualFun: function(v) {}
        };
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(myRankingData);
        });
    })
    //微信分享
    JSBK.shareWinxin({
        'title': '94嗨翻518，5月18、19日两天购买9盈宝活动产品，即可拿最高518%翻倍收益到端午，财气爆棚还有翻外翻，1036%超级翻倍等你来~',
        'desc': '94嗨翻518，5月18、19日两天购买9盈宝活动产品，即可拿最高518%翻倍收益到端午，财气爆棚还有翻外翻，1036%超级翻倍等你来~',
        'link': 'http://np.94bank.com/Activity/Finance518',
        'imgUrl': window.Zepto.linkUrl + '/dist/Activity/img/20170518/special518/share.jpg'
    })
});