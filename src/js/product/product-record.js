;
$(function() {
	require('../../common/layout.css');
	require('../../common/layout.js');
	require('../../css/product/product-record.css');
	var ProductID = JSBK.Utils.GetQueryString('ProductId');
	
	var load = $('.load'),
		noneInfo = $('.none-info');

	//模板
	function htmlTep(dd,arr){
		$.each(dd,function(i,v){
			var html = '';
			html += '<li><div class="pr-number">'+v.phone+'</div>';
			html += '<div class="pr-price"><p>'+v.tradingAmountText+'</p><span>'+v.tradingTimeText+'</span>';
			html += '</div></li>';
			arr.push(html);
		})
	}
	
	//初始化
	var getRecordData = {
		data : {
			'ProductID' : ProductID,
			'PageIndex': 1,
            'PageSize' : 15
		},
		mFun: 'GetProductBuyList',
		beforeSend : function(){
			load.show();
		},
		sucFun : function(v){
			if(!v || v.length == 0){
				noneInfo.show();
				return;
			}
			var arr = [];
			htmlTep(v,arr);
			$('.pr-info').append(arr.join(''));
			if(v.length > 15){
				new GetMoreMb();
			}
		},
		unusualFun : function(){
			//noneInfo.show();
		}

	}
	JSBK.Utils.postAjax(getRecordData);

	//上滑加载更多
	var GetMoreMb = function(op){
	    this.op = {
	        cont : $('.pr-cont'),
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
	            data: {
	            	'ProductID' : ProductID,
	                'PageIndex': self.op.page,
	                'PageSize' : 15
	            },
	            mFun: 'GetProductBuyList',
	            beforeFun : function(){
	                self.op.myLoad.show();
	            },
	            sucFun : function(v){
	                var arr = [] ,
	                    length = v.length;
	                
	                self.op.myLoad.hide();
	                mbNone.hide();
	                htmlTep(v.RecordList,arr);

	                self.op.cont.find('.pr-info').append(arr.join(''));   
	                
	                if(length >= 15){
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