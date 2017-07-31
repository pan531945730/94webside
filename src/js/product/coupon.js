;
$(document).ready(function(e) {
	require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/product/coupon.css');
    require('../../component/website/Load.css');
    var load = $('.load'),
    	noneInfo = $('.none-info');
	//优惠券模板
	function htmlTep(dd,arr){
	    $.each(dd,function(i,v){
	        var html = '',
	            liSty = '',
	            styPrice = '';
	            
	        if(v.CouponType == 1){
	            liSty = 'fanxian';
	            styPrice = '￥<em>'+v.CouponValue+'</em>';
	        }else{
	            liSty = 'jiaxi';
	            styPrice = '<em>'+v.CouponValue+'</em>%';
	        }
	        html += '<li class="'+liSty+'" data-type="'+v.CouponType+'" data-value="'+v.CouponValue+'" data-id="'+v.ID+'">';
	        if(v.UseStatus == 0){
		        html += '<div class="cp-price" style="background-color:#ccc">';
		    }else{
		    	html += '<div class="cp-price" style="background-color:'+v.IosColor+'">';
		    }
	        html += '<p>'+styPrice+'</p>';
	        html += '<span>'+v.MinMaxBuyPriceStr+'</span>';
	        html += '</div><div class="cp-info">';
	        html += '<div class="info-head"><h2>'+v.Title+'</h2><p>'+v.ApplyProductRemark+'</p></div>';
	        html += '<p class="info-time">有效期'+v.UseRemark+'</p>';
	        html += '</div></li>';
	        arr.push(html);
	    })        
	}

	var couponData = {
	    data:{
	        'PageIndex':1,
	        'PageSize': 10,
	        'ProductType2ID':-1
	    },
	    mFun:'GetMemberCardCouponList',
	    beforeFun:function(){
	        load.show();
	    },
	    sucFun:function(v){
	        var arr = [],
	            length = v.length;
	        load.hide();
	        if(!v || length == 0){
	            $('.coupon-cont').empty();
	            noneInfo.show();
	            return;
	        }
	        noneInfo.hide();
	        htmlTep(v,arr);
	        $('.coupon-cont').append(arr.join(''));
	        if(length >= 9){
	            new GetMoreMb();
	        }
	    },
	    unusualFun :function(){
	    	load.hide();
	        noneInfo.show();
	    }

	}
	JSBK.Utils.postAjax(couponData);
	//上滑加载更多
	var GetMoreMb = function(op){
	    this.op = {
	        cont : $('.coupon-container'),
	        myLoad : $('.load'),
	        mbBot : $('.bot'),
	        getNextStatus : true,
	        page : 2 
	    };
	    this.init();
	}
	GetMoreMb.prototype.init = function(){
	    var self = this;
	    function checkGetNextPage() {
	        var winHeight = $(window).height(),
	            listHeight = self.op.cont.height(),
	            listTop = self.op.cont.offset().top,
	            scrollTop = $(window).scrollTop();
	        if (winHeight + scrollTop >= listTop + listHeight && self.op.getNextStatus === true) {
	            return true;
	        }
	        return false;
	    }

	    $(window).on('scroll',function(){
	        getNextPage();
	    })

	    function getNextPage(){
	        if (!checkGetNextPage()) {
	            return;
	        }
	        self.op.getNextStatus = false;
	        var mbLoadData = {
	            data:{
	                'PageIndex': self.op.page,
	                'PageSize': 10,
	                'ProductType2ID':-1
	            },
	            mFun:'GetMemberCardCouponList',
	            beforeFun : function(){
	                self.op.myLoad.show();
	            },
	            sucFun : function(v){
	                var arr = [] ,
	                    length = v.length;
	                
	                self.op.myLoad.hide();
	                noneInfo.hide();
	                htmlTep(v,arr);
	                self.op.cont.find('.coupon-cont').append(arr.join(''));   
	                
	                if(length >= 10){
	                    self.op.getNextStatus = true;
	                }else{
	                    self.op.mbBot.show();
	                }
	                self.op.page = self.op.page + 1;
	            },
	            unusualFun : function(v){
	                self.op.mbBot.show();
	            }
	        }
	        JSBK.Utils.postAjax(mbLoadData);                        
	    }
	}    
});