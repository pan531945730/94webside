(function($) {

    // Library agnostic interface
    $.fn.rotate = function(parameters) {
        if (this.length === 0 || typeof parameters == "undefined") {
            return;
        };
        if (typeof parameters == "number") {
            parameters = {
                angle: parameters
            }
        }
        var returned = [];
        for (var i = 0, i0 = this.length; i < i0; i++) {
            var element = this.get(i);
            if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                var paramClone = $.extend(true, {}, parameters);
                var newRotObject = new Wilq32.PhotoEffect(element, paramClone)._rootObj;

                returned.push($(newRotObject));
            } else {
                element.Wilq32.PhotoEffect._handleRotation(parameters);
            }
        }
        return returned;
    }

    $.fn.getRotateAngle = function() {
        var ret = [];
        for (var i = 0, i0 = this.length; i < i0; i++) {
            var element = this.get(i);
            if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                ret[i] = element.Wilq32.PhotoEffect._angle;
            }
        }
        return ret;
    }

    $.fn.stopRotate = function() {
        for (var i = 0, i0 = this.length; i < i0; i++) {
            var element = this.get(i);
            if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                clearTimeout(element.Wilq32.PhotoEffect._timer);
            }
        }
    }

    var Wilq32 = {};
    Wilq32.PhotoEffect = (function() {
        return function(img, parameters) {
            img.Wilq32 = {
                PhotoEffect: this
            };

            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
        }

    })();

    Wilq32.PhotoEffect.prototype = {
        _setupParameters: function(parameters) {
            this._parameters = this._parameters || {};
            if (typeof this._angle !== "number") {
                this._angle = 0;
            }
            if (typeof parameters.angle === "number") {
                this._angle = parameters.angle;
            }
            this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);

            this._parameters.step = parameters.step || this._parameters.step || null;
            this._parameters.easing = parameters.easing || this._parameters.easing || function(x, t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            }
            this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
            this._parameters.callback = parameters.callback || this._parameters.callback || function() {};
        },
        _handleRotation: function(parameters) {
            this._setupParameters(parameters);
            if (this._angle == this._parameters.animateTo) {
                this._rotate(this._angle);
            } else {
                this._animateStart();
            }
        },

        _animateStart: function() {
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._animateStartTime = +new Date;
            this._animateStartAngle = this._angle;
            this._animate();
        },
        _animate: function() {
            var actualTime = +new Date;
            var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

            if (checkEnd) {
                clearTimeout(this._timer);
            } else {
                if (this._canvas || this._vimage || this._img) {
                    var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                    this._rotate((~~(angle * 10)) / 10);
                }
                if (this._parameters.step) {
                    this._parameters.step(this._angle);
                }
                var self = this;
                this._timer = setTimeout(function() {
                    self._animate.call(self);
                }, 10);
            }

            // To fix Bug that prevents using recursive function in callback I moved this function to back
            if (this._parameters.callback && checkEnd) {
                this._angle = this._parameters.animateTo;
                this._rotate(this._angle);
                this._parameters.callback.call(this._rootObj);
            }
        },

        _rotate: (function() {

            return function(angle) {
                this._angle = angle;
                this._img.style.transform = "rotate(" + (angle % 360) + "deg)";
            }
        })()
    }

})(Zepto);