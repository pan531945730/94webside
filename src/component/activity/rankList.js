;
(function($){
    var Rank = function(op){
        var self = this;
        var defaults = {
            AID : 20170211, 
            PI : 1,
            PS : 12,
            select : self.getSelect(),
            rankIco : ['rank01','rank02','rank03']
        };
        this.ops = $.extend(defaults, op);
        this.init();
    }

    Rank.prototype.init = function(){
        var self = this;
        self.setAjax();
    }

    Rank.prototype.setAjax = function(){
        var self = this;
        var rankData = {
            data: {
                'AID': self.ops.AID,
                'PI': self.ops.PI,
                'PS': self.ops.PS
            },
            mFun: 'ActivityBuyProductTopList',
            beforeFun : function(){
            },
            sucFun : function(res){
                if(!res || res.length == 0) return;
                var arr = [];
                $.each(res,function(i,v){
                    var html = '',
                        rankNum;
                    switch(i){
                        case 0:
                        rankNum = '';
                        rankIco = self.ops.rankIco[i];
                        break;
                        case 1:
                        rankNum = '';
                        rankIco = self.ops.rankIco[i];
                        break;
                        case 2:
                        rankNum = '';
                        rankIco = self.ops.rankIco[i];
                        break;
                        default:
                        rankNum = v.rank;
                        rankIco = '';
                        break;
                    }
                    html += '<li><span class="rank '+rankIco+'">'+rankNum+'</span>';
                    html += '<span>'+v.phone+'</span>';
                    html += '<span>'+v.totalAmount+'</span></li>';
                    arr.push(html);
                })
               
                self.ops.select.append(arr.join(''));
                self.ops.select.find('li').last().find('span').eq(1).prepend('<em>我的积分和排名</em>');
            }
        }        
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(rankData);
        }); 
    }

    Rank.prototype.getSelect = function(){
        var self = this;
        return $('<ul class="rank-info">' +
                    '<li><span>排名</span><span>账号</span><span>当前积分</span></li>'+
                '</ul>');
    }
    module.exports = Rank;
})(Zepto);

