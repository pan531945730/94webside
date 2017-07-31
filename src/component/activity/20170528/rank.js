;
$(function() {
	var rankother=$('#otherrank li');
	var rabkmy=$('#myrank li');
	  
    //排名初始化
    var rankData = {
        data: {
            'AID' : 20170528,
            'PS': 5
        },
        mFun: 'ActivityBuyProductTopList',
        beforeFun : function(){
        },
        sucFun : function(v){
        	var data=v|| {};
            if(data.length==1){
                var orank={};
                var mrank=data[0];
                var mrankicon=mrank.rank;
                var mrankname=mrank.phone;
                var mranknum=mrank.totalAmount;
                var mrankmenoy="--";
                var obj=rabkmy;
                if(mrankicon==1){
                    mrankmenoy="1888";
                };
                if(mrankicon==2){
                    mrankmenoy="888";
                };
                if(mrankicon==3){
                    mrankmenoy="588";
                };
                obj.find('.rank-icon').text(mrankicon);
                obj.find('.rank-name').text(mrankname);
                obj.find('.rank-num').text(mranknum); 
                obj.find('.rank-money').text(mrankmenoy);
            };
            if(data.length>1){
                var orank=data;
                var mrank=data[data.length-1];
                var mrankicon=mrank.rank;
                var mrankname=mrank.phone;
                var mranknum=mrank.totalAmount;
                var mrankmenoy="--";
                var oobj=rankother;
                var mobj=rabkmy;
                if(mrankicon==1){
                    mrankmenoy="1888";
                };
                if(mrankicon==2){
                    mrankmenoy="888";
                };
                if(mrankicon==3){
                    mrankmenoy="588";
                };
                mobj.find('.rank-icon').text(mrankicon);
                mobj.find('.rank-name').text(mrankname);
                mobj.find('.rank-num').text(mranknum); 
                mobj.find('.rank-money').text(mrankmenoy);
                for (var i = 0; i < orank.length-1; i++) {
                    var orankicon=orank[i].rank;
                    var orankname=orank[i].phone;
                    var oranknum=orank[i].totalAmount;
                    if(orankicon==1 || orankicon==2 || orankicon==3 ){orankicon="<p></p>"};
                    oobj.eq(i).find('.rank-icon').html(orankicon);
                    oobj.eq(i).find('.rank-name').text(orankname);
                    oobj.eq(i).find('.rank-num').text(oranknum); 
                };
            };
        },
        unusualFun : function(v){}
    }
    module.exports = rankData;
});