;
(function($){
    var Rank = function(op){
        var self = this;
        var defaults = {
            AID : 20161212, 
            PI : 1,
            PS : 12,
            select : self.getSelect()
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
                        rankNum,
                        rankIco,
                        rankAward;
                    switch(i){
                        case 0:
                        rankNum = '';
                        rankIco = 'rank01';
                        rankAward = 'x20';
                        break;
                        case 1:
                        rankNum = '';
                        rankIco = 'rank02';
                        rankAward = 'x15';
                        break;
                        case 2:
                        rankNum = '';
                        rankIco = 'rank03';
                        rankAward = 'x10';
                        break;
                        case 3:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = 'x8';
                        break;
                        case 4:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = 'x5';
                        break;
                        case 5:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = 'x3';
                        break;
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = '返128元';
                        break;
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                        case 16:
                        case 17:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = '返68元';
                        break;
                        default:
                        rankNum = i + 1;
                        rankIco = '';
                        rankAward = '';
                        break;
                    }
                    html += '<li><span class="rank '+rankIco+'">'+rankNum+'</span>';
                    html += '<span>'+v.phone+'</span>';
                    html += '<span>'+v.totalAmountText+'<em>'+rankAward+'</em></span></li>';
                    arr.push(html);
                })
                self.ops.select.find('.rank-info').append(arr.join(''));   
            }
        }        
        JSBK.Utils.postAjax(rankData);
    }

    Rank.prototype.getSelect = function(){
        var self = this;
        return $('<div class="rank-cont">' +
                    '<h2></h2>' +
                    '<ul class="rank-info">' +
                        '<li><span>排名</span><span>账号</span><span>投资金额</span></li>'+
                    '</ul>' +
                '</div>');

    }
    module.exports = Rank;
})(Zepto);

