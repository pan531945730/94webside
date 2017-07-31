;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/activity/guaguale.css');
    var scratch = require('../../ui/scratch.js');    
    
    var Page = function(op){
      var self = this;
      self._op = $.extend({},{

      },op);

      self._init();
    }

    Page.prototype._init = function() {
      var self = this;
      self._masker = self._initMask();
      self._initScratch();
      self._bindEvent();

    };

    Page.prototype._initScratch = function(){
      var self = this;
      $('#scratch').scratch({
        img:self._op.gglbackground,
        width:224,
        height:110,
        checkRange:[0,0,224,110]
      });
      var isGetting = false;
      $('#scratch').scratch('on','finish',function(){
          if(isGetting){ return }
          isGetting = true;
          self._op.guaguale({
              userid:11
          },function(r){
              if(r.status == 1){
                  self._masker.showResult(r);
                  self.updataUserData(r.user);
              }else{
                  self._masker.showError(r);
                  self.updataUserData(r.user);
              }
              isGetting = false;
          });
      });
    }

    Page.prototype._initMask = function(){
      var self = this,
          masker = {};

      masker._box = $('.scratch-mask');
      masker._text = $('.scratch-text');
      masker._errbox = $('.scratch-error');
      masker._nochance = $('.scratch-nochance');
      masker._gold = $('.scratch-gold');
      masker.init = function(){
          this._text.show();
          this._box.show();
      }
      masker.showResult = function(data){
        this.hide();
        var dom = this._gold;
        dom.find('strong').html('+'+data.getgold);
        dom.show();
        this._box.show();
      }
      masker.showError = function(data){
        this.hide();
        var dom = this._errbox;
        dom.find('p').html(data.msg);
        dom.show();
        this._box.show();
      }
      masker.showNoChance = function(){
        this.hide();
        this._nochance.show();
        this._box.show();
      }
      masker.hide = function(){
        this._text.hide();
        this._errbox.hide();
        this._nochance.hide();
        this._gold.hide();
        this._box.hide();
      }

      masker.init();
      return masker
    }

    Page.prototype._bindEvent = function(){
      var self = this;
      
      $('.scratch-text').on('touchstart',function(){
          self._masker.hide();
      });
      $('.scratch-mask .button').on('click',function(e){
        e.preventDefault();
        self._masker.hide();
        self.resetScratch();
      });
    };



    new Page({
        guaguale:function(da,callback){
          $.post('/mkt/1505ggl/app/appgua',da,function(r){
            callback(r);
            // callback({
            //    status:1,
            //    msg:'错误提示错误提示错误提示错误提示错误',
            //    getgold:500,
            //    user:{
            //        id:1,
            //        phone:'13812345678',
            //        gold:'1500',
            //        hasChance:true
            //    } 
            // });            
          },'json');
        }
    })
});
