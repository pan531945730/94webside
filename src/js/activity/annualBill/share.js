/*
 *share
 *20170119
 *wangying
 */
;
require('../../../common/layout.js');
//require('../../../common/layout.css');
require('../../../component/annualBill/common.js');
//require('../../../css/annualBill/annualBill.css');
(function(window) {
    dom = {
        body: $('body'),
        page: $('.page11'),
        btnShare: $('btn-share')
    };
    var allPages = 10, //账单总页数
        AID = '20170126',
        MemberID = window.localStorage['MemberID'];

    if (JSBK.Utils.GetQueryString('MemberID')) {
        MemberID = JSBK.Utils.GetQueryString('MemberID');
        $('#btnJoin').show();
        $('.share-btn .btn').hide()
    }
    var getShareInfor = {
        data: {
            ActionID: '2',
            AID: AID,
            MemberID: MemberID
        },
        mFun: 'GetAnnualBill',
        beforeSend: $('#load').show(),
        sucFun: function(v) {
            $('#load').hide();
            $('#headphoto').attr('src', isHeadImg(v.headphoto));
            $('#dkzs').html(v.dkzs)
            $('#count6').html(v.count6)
            $('#Amount9').html(v.Amount9);
            if (v.count6 == '0') {
                allPages = 9;
            }
            dom.body.append(window.pageNumData(allPages));
            $('#pageNum li').eq(allPages).addClass('current').siblings().removeClass('current');
        },
        unusualFun: function(v) {}
    };
    JSBK.Utils.postAjax(getShareInfor);

    function isHeadImg(img) {
        if (!img) {
            return '../../../lib/annualBill/default.png';
        } else {
            return img;
        }
    }
})(window);