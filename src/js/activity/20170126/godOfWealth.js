;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/rank.css');
    require('../../../css/activity/20170126/godOfWealth.css');

    //土豪榜
    var Rank = require('../../../component/activity/rank.js');
    var rankFn = new Rank({
        AID : 20170126,
        PS : 20
    })
    $('.gow-foot').before(rankFn.ops.select);

    //微信分享
    JSBK.shareWinxin({
        'title': '2017开门红 尽享20倍收益',
        'desc': '正月初八发发发，2月4日0:00-2月5日23:59，前18名土豪快来领取你的20倍超额收益！',
        'link': 'http://np.94bank.com/Activity/GodOfWealth20170126',
        'imgUrl': 'http://img.94bank.com/np/dist/Activity/img/20170126/share-godofwealth.jpg'
    })
});