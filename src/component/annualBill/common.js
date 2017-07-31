;
$(function(){
    //page num html
    var pageNumLi = ''; //初始化li 个数
    function pageNumData(allPages) {
        for (var i = 1; i <= allPages; i++) {
            if (i == 1) {
                pageNumLi += '<li class="current"><a href="/Activity/AnnualIndex20170126#page/1"><span></span><b></b></a></li>';
            } else {
                pageNumLi += '<li><a href="/Activity/AnnualIndex20170126#page/' + i + '"><span></span><b></b></a></li>';
            }
        }
        var pageNumHtml = '<div class="page-num" id="pageNum">\
                                <ul>' + pageNumLi + '\
                                    <li><a href="/Activity/AnnualShare20170126"><span></span><b></b></a></li>\
                                </ul>\
                            </div>';
        return pageNumHtml;
    }
    function getShare(){
        $.ajax({
            url: "/Other/GetShareData",
            type: "get",
            dataType: "json",
            success: function(jdata) {
                if (jdata !== '' && jdata != null) {
                    objData = jdata;
                    var link = 'http://np.94bank.com/Activity/AnnualShare20170126?'
                    var MemberID = objData.friendMemberId;
                    window.localStorage['MemberID'] = MemberID;
                    if (JSBK.Utils.GetQueryString('MemberID')) {
                        MemberID = JSBK.Utils.GetQueryString('MemberID');
                    }
                    if (MemberID) {
                        link += 'MemberID=' + MemberID;
                    }
                    JSBK.shareWinxin({
                        title: '2016年，我在94bank的总收益已经爆表，荣登年度大咖~',
                        desc: '94bank的年度账单出来啦，一起来看看吧',
                        link: link,
                        imgUrl: 'http://img.94bank.com/np/dist/Activity/img/20170126/share-annualBill.jpg',
                    })
                }
            }
        });
    }
    window.getShare = getShare;
    window.pageNumData = pageNumData;
});