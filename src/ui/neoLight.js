;
(function($){
    var Neon = function(diver,_op){
        var self = this;
        self._op = $.extend({},{
            elem: '.light',
            action : 'on', //亮灯的class
            lightNum : 4, //灯亮的个数
            allNum : 18, //灯的总数
            actionBeat : 1000, //默认亮灯闪的速度
            endBeat : 600, //点击时亮灯闪的速度
            index : 'data-light' //每个灯的索引值
        },_op||{});
        self._dom = $(diver);
        self.arr = [];
        self.arrActive = [];
        self._timeHandle;
        
    }
    Neon.prototype.drawAsKey = function(){
        var self = this,
            arrVisit = [];

        self._dom.find('.'+self._op.action).each(function(index){
                self.arrActive[index] = parseInt($(this).attr(self._op.index));
            })

        for(var i = 0; i < self._op.lightNum; i++){
            self._dom.find(self._op.elem).eq(self.arrActive[i]-1).removeClass(self._op.action);
            
            if(self.arrActive[i] >= self._op.allNum - self._op.lightNum/2 + 1){ //当前值>=总数-每组个数+1
                self.arrActive[i] = self.arrActive[i] - self._op.allNum;
            }
            self._dom.find(self._op.elem).eq(self.arrActive[i]+(self._op.lightNum/2)-1).addClass(self._op.action);
        }
    }

    

    Neon.prototype.start = function(){
        var self = this;
        self._timeHandle = setInterval(function() {
            self.drawAsKey();
        }, self._op.actionBeat);

    }
    
    Neon.prototype.end = function(){
        var self = this;
        self._timeHandle = setInterval(function() {
            self.drawAsKey();
        }, self._op.endBeat);
    }

    //window.Neon = Neon;
    module.exports = Neon;
})(Zepto)