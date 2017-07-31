;
(function($){
    
    var Observer = require('../ui/Observer.js');
    /**
     * [ActiveValue 动态数据通过set方法在值改变的同时抛出 change事件，以供回调]
     *      提供的事件   beforeChange 如果此事件的任意回调函数返回值为false，
     *                               赋值失败，触发changeError事件，
     *                               否则赋值成功，触发afterChange 
     * @param {[type]} initVal [初始化数据，如果没有默认为null,值接受简单类型数据(不接受数组，对象)]
     */
    var ActiveValue = function(initVal){
        var self = this;
        Observer.addPublisher(self);
        self._value = initVal === undefined ? null:initVal;
        self.trigger('init');
    }
    ActiveValue.prototype.get = function(){
        return this._value;
    }
    ActiveValue.prototype.set = function(newVal){
        var self = this;
        if( newVal !== undefined && self.trigger('beforeChange',arguments) !== false ){
            self._value = newVal;
            self.trigger('afterChange',arguments);
        }else{
            self.trigger('changeError',arguments);
        }
    }

    /**
     * [Pan description]
     * @param {[type]} diver [description]
     * @param {[type]} _op   [description]
     */
    var Pan = function(diver,_op){      
        var self = this;
        Observer.addPublisher(self);
        self._op = $.extend({},{
            defaultClass:'pan-8',
            action:['pan-0','pan-1','pan-2','pan-3','pan-4','pan-5','pan-6','pan-7'],
            startBeat:[500,450,400,350,300,250,200,150,100],
            actionBeat:50,
            endBeat:[70,90,120,160,200,300,450,600,800],
            minTimer:10000
        },_op||{});
        self._dom = $(diver);
        self._key = new ActiveValue(0);
        self._st = 0; // 0未开始，1启动阶段，2滚动中，3结束阶段
        self._timeHandle;
        self._totalTime = 0;
    }
    Pan.prototype.drawAsKey = function(){
        var self = this;
        var _key = self._key.get()
        var _prevKey = _key <= 0 ? self._op.action.length-1 : _key-1 ;
        self._dom.removeClass(self._op.action[_prevKey]).addClass(self._op.action[_key]);
        _key++;
        if( _key >= self._op.action.length ){
            _key = 0;
        }
        self._key.set(_key);
    }
    Pan.prototype.start = function() {
        var self = this,
            key = 0,
            beat = self._op.startBeat;
        var go = function(){
            if( beat[key] ){
                setTimeout(function(){
                    self.drawAsKey();
                    key++;
                    go();
                },beat[key]);
            }else{
                self.going();
            }
        }

        self._st = 1;
        self._dom.removeClass(self._op.defaultClass);
        go()
    };
    Pan.prototype.going = function(){
        var self = this;
        self._st = 2;
        self._timeHandle = setInterval(function(){
            self._totalTime += self._op.actionBeat;
            self.drawAsKey();
        },self._op.actionBeat);
    }
    Pan.prototype.stop = function(key){
        var self = this,
            stopBeginKey = key,
            args = arguments;;
        if( self._st >= 3 ){
            return;
        }
        self._st = 3;
        for (var i = self._op.endBeat.length - 1; i >= 0+1; i--) {
            self._op.endBeat[i];
            stopBeginKey -= 1;
            if( stopBeginKey < 0 ){
                stopBeginKey = self._op.action.length-1;
            }
        };
        self._key.on('afterChange',function(val){
            var key = 0,
                beat = self._op.endBeat;

            var go = function(){
                if( beat[key] ){
                    setTimeout(function(){
                        self.drawAsKey();
                        key++;
                        go();
                    },beat[key]);
                }else{
                    self._st = 0;
                    self._totalTime = 0;
                    self.trigger('stop',args);
                }
            };
            if( self._totalTime >= self._op.minTimer && val == stopBeginKey ){
                clearInterval(self._timeHandle);
                go();
                self._key.off('afterChange');
            }
        });
    }
    module.exports = Pan;
})(Zepto);