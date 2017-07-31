;
(function() {
    var Observer = {
        ob: {

        },
        on: function(eventNames, callback) {
            var _events = eventNames.split(' ');
            for (var i = 0; i < _events.length; i++) {
                if (!this.ob[_events[i]]) {
                    this.ob[_events[i]] = [];
                }
                this.ob[_events[i]].push(callback);
            }
        },
        off: function(eventNames) {
            var _events = eventNames.split(' ');
            for (var i = 0; i < _events.length; i++) {
                this.ob[_events[i]] = [];
            };
        },
        trigger: function(eventName, args) {
            var r;
            if (!this.ob[eventName]) {
                return r;
            }
            var _arg = args || [];
            for (var i = 0; this.ob[eventName] && i < this.ob[eventName].length; i++) {
                r = this.ob[eventName][i].apply(this, [_arg]);
                if (r === false) {
                    continue;
                }
            }
            return r
        }
    };
    Observer.addPublisher = function(o) {
        $.extend(true, o, Observer);
    };

    module.exports = Observer;
})(Zepto);