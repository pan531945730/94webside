;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170315/protectConsumer.css');
    var Swiper = require('../../../ui/Swipe.js');
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: false,
        onSlideChangeEnd: function(swiper){
           
        }
    })

    var madeCard = $('.made'),
        madeAlse = $('.made-also'),
        cardDlg = $('.card-dlg'),
        card = $('.card'),
        customName = $('.custom-name'),
        customBtn = $('.custom-btn'),
        customError = $('.custom-error'),
        madeName = $('.made-name'),
        sourceType = JSBK.Utils.GetQueryString('SourceType'),
        shareUrl = 'http://np.94bank.com/Activity/protectConsumer20170315',
        cardType = 1,
        name = '小9';

    function creatCard(type){
        $('.made-tit').attr('class','made-tit card'+type+'-01');
        $('.made-sta').attr('class','made-sta card'+type+'-02');
        $('.made-des').attr('class','made-des card'+type+'-03');
    }   
    
    card.on('click',function(){
        var that = $(this);
        that.siblings().removeClass('custom');
        that.addClass('custom');
        cardType = that.attr('type');
    })

    customName.on('input',function(){
        name = $(this).val();
    })

    customBtn.on('click',function(){
        if(sourceType){
            return;
        }
        name = customName.val() || '小9';
        var madeCardData = {
            data: {
                'AID': 20170315,
                'Action': 'createcard',
                'SourceType': cardType, //卡片类型
                'ExpandStr' :  name//姓名
            },
            mFun: 'ActivityMain',
            beforeFun : function(){
            },
            sucFun : function(v){
                 var status = v.Status;
                 if(status > 0){
                    sourceType = status;
                    madeName.html(name);
                    creatCard(cardType);
                    cardDlg.show();
                    shareUrl += '?SourceType=' + sourceType; 
                    //微信分享
                    JSBK.shareWinxin({
                        'title': '315诚信购',
                        'desc': '“315诚信购”，快来查看我的诚信卡片吧，诚信接力，定制宣言！',
                        'link': shareUrl,
                        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170315/protectConsumer/share.jpg'
                    })
                 }else{
                    customError.html('卡片生成失败，请稍后重试...');
                 }
            },
            unusualFun : function(v){
            }
        }
        JSBK.Utils.postAjax(madeCardData);
    })
    if(sourceType){
        var sourceData = {
            data: {
                'AID': 20170315,
                'Action': 'getcard',
                'SourceType': sourceType
            },
            mFun: 'ActivityMain',
            beforeFun : function(){
            },
            sucFun : function(v){
                 cardType = v.XData_1;
                 madeName.html(v.Message);
                 creatCard(cardType);
                 mySwiper.slideTo(6);
                 madeCard.hide();
                 madeAlse.show();
                 cardDlg.show();
            },
            unusualFun : function(v){
            }
        }
        JSBK.Utils.postAjax(sourceData);
    }
    //微信分享
    JSBK.shareWinxin({
        'title': '315诚信购',
        'desc': '“315诚信购”，快来查看我的诚信卡片吧，诚信接力，定制宣言！',
        'link': shareUrl,
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170315/protectConsumer/share.jpg'
    })
});