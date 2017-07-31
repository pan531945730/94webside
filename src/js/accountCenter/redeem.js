$(document).ready(function(e) {
    require('../../common/layout.css');
    require('../../common/layout.js');
	require('../../component/website/Load.css');
    require('../../css/accountCenter/redeem.css');
	var Confirm = require('../../ui/Confirm.js');
	//初始化
	var load = $('.load'),
		rdMoney = $('.rd-money'),
		errorTip = $('.error-tip span'),
		ransomAmount = 0,
		ransompoundage = 0,
		poundage = 0,
		rdMoneyVal = 0,
		productid = JSBK.Utils.GetQueryString('productid'),
		producttype2id = JSBK.Utils.GetQueryString('producttype2id');

	rdMoney.focus();
	rdMoney.trigger('focus');
	rdMoney.on('input',function(){
		var val = $(this).val();
        val = parseInt(val.toString().substring(0,10));
        $(this).val(val);
		errorTip.html('');
	})
	var getProductData = {
		data:{
			ProductTypeId:JSBK.Utils.GetQueryString('producttypeid'),
			TradingId:JSBK.Utils.GetQueryString('tradingid'),
			ProductId:productid,
			ProductType2Id:producttype2id
		},
		mFun:'GetProductRansomDetail',
		beforeFun : function(){
			load.show();
		},
		sucFun:function(res){
			load.hide();
			ransomAmount = res.RansomAmount;
			ransompoundage = res.RansomPoundage;
			$('#pd_name').html(res.Title);
			$('#pd_price').html(res.RansomAmountText);
			$('.rd-notice').html(res.RansomRemark);
			$('.redeem-productName').text(res.Title);
			if(producttype2id == 18){
				rdMoney.val(ransomAmount).attr('readonly','ture');
			}
		},
		unusualFun:function(v){
			load.hide();
			errorTip.html(v.ES);
		}
	}
	JSBK.Utils.postAjax(getProductData);
	
	$('.rd-btn').on('click',function(){
		var rdMoneyVal = rdMoney.val();
		if(rdMoneyVal == '' || rdMoneyVal ==null){
			errorTip.html('赎回份额不能为空');
			return;
		}else if(rdMoneyVal-parseInt(rdMoneyVal) != 0){
			errorTip.html('赎回份额必须为整数');
			return;
		}else if(rdMoneyVal>ransomAmount){
			errorTip.html('可赎回份额不足');
			return;
		}else{
			poundage = (rdMoneyVal*ransompoundage).toFixed(2);
			var openConfirm = new Confirm({
			    titleHtml : '交易密码',
			    infoHtml : function(){
			        return $('<p><label>赎回金额</label><span>'+rdMoneyVal+'</span></p>'+
			            '<p><label>手续费</label><span>'+poundage+'</span></p>'+
			            '<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="wd-pwd">'+
			            '<p class="error-tip" id="pwd_tip"><span></span></p>');
			    },
			    confirmCallback : function(){
			        var wdpwdVal = $('#wd-pwd').val(),
			            pwdTip = $('#pwd_tip');
			        if(wdpwdVal == null || wdpwdVal == ''){
			            pwdTip.html('请输入您的交易密码');
			            return false;
			        }
			        var sucData = {
			            data: {
			                'TradingId': JSBK.Utils.GetQueryString('tradingid'),
			                'ProductTypeId':JSBK.Utils.GetQueryString('producttypeid'),
			                'Amount': rdMoneyVal,
			                'TradePswd' : wdpwdVal,
			                'ProductType2Id' : producttype2id
			            },
			            mFun: 'ProductRansom',
			            sucFun : function(v){
			                if(JSBK.Utils.GetQueryString('type')==1){
			        			window.location.href = '/Order/MyRegularProductData'
			        		}else if(JSBK.Utils.GetQueryString('type') == 2){
			        			window.location.href = '/Order/MyCurrentProductData'
			        		}
			            },
			            unusualFun : function(v){
			                pwdTip.html(v.ES);
			            }
			        }        
			        JSBK.Utils.postAjax(sucData);
			    }
			});
			openConfirm.open();
		}
	})

});

