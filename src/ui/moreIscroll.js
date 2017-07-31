;
(function($){
    var moreIscroll = function(op){
        var self = this;
        var defaults = {
            cont : '.mb-cont',
            info : '.mb-info',
            load : '.load',
            bot : '.bot',
            getNextStatus : true,
            page : 2,
            pageSize: 15,
            ajaxFun : 'GetBill',
            htmlTep :  null,
            ajaxObj : null           
        };
        self.ops = $.extend(defaults, op);
        self.cont = $(self.ops.cont);
        self.info = $(self.ops.info);
        self.load = $(self.ops.load);
        self.bot = $(self.ops.bot);
        self.init();
    }
    moreIscroll.prototype.init = function(){
        var self = this;
        function checkGetNextPage() {
            var winHeight = $(window).height(),
                listHeight = self.cont.height(),
                listTop = self.cont.offset().top,
                scrollTop = $(window).scrollTop();
            if (winHeight + scrollTop >= listTop + listHeight && self.ops.getNextStatus === true) {
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
            self.ops.getNextStatus = false;
            var mbLoadData = {
                data: {
                    'PageIndex': self.ops.page,
                    'PageSize' : self.ops.pageSize
                },
                mFun: self.ops.ajaxFun,
                beforeFun : function(){
                    self.load.show();
                },
                sucFun : function(v){
                    var arr = [] ;
                    if (v instanceof Array && !self.ops.ajaxObj){
                        v = v;
                    }else{
                        v = v[self.ops.ajaxObj];
                    }
                    var length = v.length;
                    
                    self.load.hide();
                    self.ops.htmlTep(v,arr);

                    self.info.append(arr.join(''));   
                    
                    if(length >= self.ops.pageSize){
                        self.ops.getNextStatus = true;
                    }else{
                        self.bot.show();
                    }
                    self.ops.page = self.ops.page + 1;
                },
                unusualFun : function(v){
                    self.bot.show();
                }
            }
            JSBK.Utils.postAjax(mbLoadData);                        
        }
    }    
    module.exports = moreIscroll;
})(Zepto)