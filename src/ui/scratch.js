;
(function($) {
  var Observer = require('../ui/Observer.js');
  var Scratch = function(dom, op) {
    var self = this;
    Observer.addPublisher(self);
    self._op = $.extend({}, {
      width: 400,
      height: 200,
      checkRange: [0, 0, 400, 200],
      radius: 15,
      passing: 0.6,
      checkInterval: 500,
      img: 'url()',
      defaultImg: ''
    }, op || {});

    self.canvas = dom;
    self.canvas.attr({
      width: self._op.width,
      height: self._op.height
    });

    self.ctx = self.canvas[0].getContext('2d');
    self._checkTimer;
    self._mouseDown = false;
    self._init();
  };

  Scratch.prototype._init = function() {
    var self = this;
    self.reset();
    var draw = function(e) {
      e.preventDefault();
      if (self._mouseDown) {
        if (e.changedTouches) {
          e = e.changedTouches[0];
        }
        var offsetX = self.canvas[0].offsetLeft + self.canvas[0].parentNode.offsetLeft,
          offsetY = self.canvas[0].offsetTop + self.canvas[0].parentNode.offsetTop;
        var x = e.pageX - offsetX + self._op.radius * 2,
          y = e.pageY - offsetY;

        self.ctx.beginPath()
        self.ctx.arc(x, y, self._op.radius, 0, Math.PI * 2);
        self.ctx.fill();
        self.trigger('draw', [e, self]);
        self.checkStatus();
      }
    }

    function eventDown(e) {
      e.preventDefault();
      self._mouseDown = true;
    }

    function eventUp(e) {
      e.preventDefault();
      self._mouseDown = false;
    }
    self.canvas.on('touchstart', eventDown);
    self.canvas.on('touchend', eventUp);
    self.canvas.on('touchmove', draw);
    self.canvas.on('mousedown', eventDown);
    self.canvas.on('mouseup', eventUp);
    self.canvas.on('mousemove', draw);
  };

  Scratch.prototype.reset = function() {
    var self = this;
    self.canvas.css({
      background: self._op.img,
      'background-size': '100%'
    });
    self.ctx.globalCompositeOperation = 'copy';
    if (self._op.defaultImg) {
      self.ctx.drawImage(self._op.defaultImg, 0, 0)
    } else {
      self.ctx.fillStyle = '#d4d3d1';
      self.ctx.fillRect(0, 0, self._op.width, self._op.height);
    }
    self.ctx.globalCompositeOperation = 'destination-out';
    self._mouseDown = false;
  }
  var tt = 0;
  Scratch.prototype.checkStatus = function() {
    var self = this;
    clearTimeout(self._checkTimer);
    self._checkTimer = setTimeout(function() {
      var range = self._op.checkRange,
        data = self.ctx.getImageData(range[0], range[1], range[2], range[3]);
      var blank = 0,
        passline = (range[2] - range[0]) * (range[3] - range[1]) * 4 * self._op.passing,
        isPass = false;

      for (var i = data.data.length - 1; i >= 0; i--) {
        if (data.data[i] == 0) {
          blank++
        }
        if (blank >= passline) {
          isPass = true
          break;
        }
      }
      if (isPass) {
        self.clear();
        self.trigger('finish');
      }

    }, self._op.checkInterval);
  }

  Scratch.prototype.clear = function() {
    var self = this;
    self.ctx.clearRect(0, 0, self._op.width, self._op.height);
    self._mouseDown = false;
  }

  var _scratch_cache = [];

  $.fn.scratch = function(action, op) {
    var _this = $(this),
      _key = _this.attr('scratch-id'),
      _op = !op ? action : op;

    var _scratch = _key ? _scratch_cache[_key] : (function() {
      var newOne = new Scratch(_this, _op),
        id = _scratch_cache.length;
      _scratch_cache[id] = newOne;
      _this.attr('scratch-id', id);
      return newOne
    })();

    if (action && typeof action == 'string') {
      var _shift = Array.prototype.shift,
        _args = arguments;
      var _action = _shift.apply(_args);
      _scratch[_action].apply(_scratch, _args);
    }

    return _scratch;
  }
})(Zepto);