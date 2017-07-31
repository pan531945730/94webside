$(document).ready(function(e) {
	require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/product/investment-success.css');
	var endDay = $('.endDay'),
		regularProductDataDetail = $('#RegularProductDataDetail'),
		load = $('.pd-load'),
		timeLi = $('.time-line li');
	$('#signNow').attr('href','/Order/Signature?tradingId='+JSBK.Utils.GetQueryString('TradingId')+'&productID='+JSBK.Utils.GetQueryString('ProductID'));
    var productID = JSBK.Utils.GetQueryString('ProductID');
    var earnIntegral = JSBK.Utils.GetQueryString('productEarnIntegral');
    $('#integral_num').html(earnIntegral);
    var GetBillDetail = {
		data:{
			TradingId:JSBK.Utils.GetQueryString('TradingId'),
			TradingType:1,
			OperateSource:1
		},
		mFun:'GetBillDetail',
		beforeFun:function(){
			load.show();
		},
		sucFun:function(res){
			load.hide();
			if(res.payInterestMode == 0){
				endDay.text('收益到账日');
			}else{
				endDay.text('回款日期');
			}
			var accountDetailID = res.accountDetailID,
				memberProductID = res.memberProductID;

			if(accountDetailID>0){ //精选
				regularProductDataDetail.attr('href','/order/MyRegularProductDataDetail?tradingid='+accountDetailID + '&productId=' + productID);
			}else{ //94
				regularProductDataDetail.attr('href','/order/MyCurrentProductDataDetail?tradingid='+memberProductID + '&productId=' + productID);
			}
			timeLi.eq(0).find('.date').text(res.tradingTime);
			timeLi.eq(1).find('.date').text(res.interestStarDate);
			timeLi.eq(2).find('.date').text(res.interestRecieveDate);
			$('#money').text(res.tradingAmountText);
		}
		
	}
	JSBK.Utils.postAjax(GetBillDetail);
});