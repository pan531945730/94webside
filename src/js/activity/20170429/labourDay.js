;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170429/labourDay.css');
    var Blink = require('../../../ui/Blink.js');

    var load = $('.load'),
        besides = $('.besides'),
        dlgFirMast = $('#dlg_first_mask'),
        dlgBigMask = $('#dlg_big_mask'),
        dlgOneMask = $('#dlg_one_mask'),
        onePrizeMod = $('.oneprize-mod'),
        prizeHead = $('.prize-head'),
        bigprizeMod = $('.bigprize-mod'),
        onePrizeCss = ['oneprize-mod xjhb','oneprize-mod hb','oneprize-mod jdk','oneprize-mod x9'];

    //活动未开始
    var unbeginBlink = new Blink({
      blinkHtml: '活动尚未开始哦~'
    })

    //活动已结束
    var endBlink = new Blink({
      blinkHtml: '该活动已结束啦~'
    })

    //无抽奖机会
    var nochanceBlink = new Blink({
      blinkHtml: '暂无抽奖机会，快去购买产品吧~'
    })

    //不满10次
    var discontentBlink = new Blink({
      blinkHtml: '您当前抽奖机会不满10次哦'
    })

    //查看规则
    $('.rule').on('click',function(){
     $('#dlg_rule_mask').show();
    })

    $('.four-rule').on('click',function(){
      $('#dlg_rankrule_mask').show();
    })
    //查看奖品
    $('.prize').on('click',function(){
     $('#dlg_prize_mask').show();
    })
    $('#dlg_rule_mask ,#dlg_prize_mask ,#dlg_rankrule_mask').on('click',function(event){
     if (event.target === this) {
         event.stopPropagation();
         $(this).hide();
     }
    })

    $('#fir-dlg-btn').on('click',function(){
      dlgFirMast.hide();
    })

    $('#bigprize-dlg-btn').on('click',function(){
      dlgBigMask.hide();
    })

    $('#oneprize-dlg-btn').on('click',function(){
      dlgOneMask.hide();
    })
    //展开收起
    $('.firprize').on('click',function(){
      $('.firprize-toggle').toggleClass('toggle');
    })

    //立即领取
    $('.ac-fir').on('click','.fir-draw',function(){
      var that = $(this);
      //是否已领取第一个红包
      var isDraw = {
          data: {
              'AID': 20170501,
              'SourceType' : 1
          },
          mFun: 'ActivityMain',
          beforeFun : function(){
              load.show();
          },
          sucFun : function(v){
              load.hide();
              var isGet = v.XData_1;
              if(isGet == 0){
                //未领取
                var firstDraw = {
                    data: {
                        'AID': 20170501,
                        'DrawTimes' : 1,
                        'Type' : 1
                    },
                    mFun: 'LotteryDraw',
                    beforeFun : function(){
                    },
                    sucFun : function(v){
                        var sta = v.Status;
                        if(sta == 0){
                          //中奖
                          dlgFirMast.show();
                        }else if(sta == 2 || sta == 6){
                          //无可用抽奖机会||本轮活动已参与
                          nochanceBlink.open();
                        }else if(sta == 3){
                          //活动未开始
                          unbeginBlink.open();
                        }else if(sta == 4 || sta == 5){
                          //活动已结束||本轮活动已结束
                          endBlink.open();
                        }else{
                          //异常
                          nochanceBlink.open();
                        }
                        
                    }
                }
                JSBK.Utils.postAjax(firstDraw);

              }else{
                //已领取
                that.addClass('fir-draw_active').removeClass('fir-draw');
              }
              
          }
      }

      JSBK.bindToken(function(){
          //已登录
          JSBK.Utils.postAjax(isDraw);
      });
    })
    
    //查看我的礼包
    $('.ac-fir').on('click','.fir-draw_active',function(){
      dlgFirMast.show();
    })

    //剩余次数
    var openNumData = {
        data: {
            'AID': 20170501,
            'Type': 1
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
        },
        sucFun : function(v){
            besides.find('span').html(v);
            besides.show();
        },
        unusualFun : function(v){
            besides.hide();
        }
    }

    //挖1次
    $('.ac-third').on('click','.draw-one',function(){
      var drawOne = {
          data: {
              'AID': 20170501,
              'DrawTimes' : 1,
              'Type' : 2
          },
          mFun: 'LotteryDraw',
          beforeFun : function(){
            load.show();
          },
          sucFun : function(v){
              load.hide();
              var sta = v.Status,
                  result = v.PrizeList[0];
              JSBK.Utils.postAjax(openNumData);
              if(sta == 0){
                //中奖
                var type = result.PrizeType,
                    title = result.PrizeTitle,
                    value = result.PrizeValue;
                
                if( type == 4){ //现金红包
                    onePrizeMod.attr('class',onePrizeCss[0]);
                    prizeHead.html('<span>'+value+'</span>元现金奖励');
                    dlgOneMask.show();
                    return;
                }else if( type == 2){ //红包券
                    onePrizeMod.attr('class',onePrizeCss[1]);
                    prizeHead.html('<span>'+value+'</span>元红包券');
                    dlgOneMask.show();
                    return;
                }else{ //实物奖品
                  if (title.indexOf('京东购物券') > -1){
                      onePrizeMod.attr('class',onePrizeCss[2]);
                      prizeHead.html('<span>'+value+'</span>元京东购物券');
                      dlgOneMask.show();
                      return;
                  }else if (title.indexOf('周边小礼品') > -1){
                      onePrizeMod.attr('class',onePrizeCss[3]);
                      prizeHead.html('94周边小礼品');
                      dlgOneMask.show();
                      return;
                  }
                }
              }else if(sta == 2 || sta == 6){
                //无可用抽奖机会||本轮活动已参与
                nochanceBlink.open();
              }else if(sta == 3){
                //活动未开始
                unbeginBlink.open();
              }else if(sta == 4 || sta == 5){
                //活动已结束||本轮活动已结束
                endBlink.open();
              }else{
                //异常
                nochanceBlink.open();
              }
              
          }
      }
      JSBK.bindToken(function(){
          //已登录
          JSBK.Utils.postAjax(drawOne);
      });
    })
    
    //连挖10次
    $('.ac-third').on('click','.draw-all',function(){
     
      var drawAll = {
          data: {
              'AID': 20170501,
              'DrawTimes' : 1,
              'Type' : 3
          },
          mFun: 'LotteryDraw',
          beforeFun : function(){
            load.show();
          },
          sucFun : function(v){
            load.hide();
              var sta = v.Status,
                  result = v.PrizeList;
              JSBK.Utils.postAjax(openNumData);
              if(sta == 0){
                //中奖
                if(!result || result.length == 0){
                    return;
                } 
                var arr = []; 
                $.each(result,function(i,v){
                    var html = '',
                        pzCss = '';
                    if(v.PrizeType == 4){
                        pzCss = 'xj'+v.PrizeValue;
                    }else if(v.PrizeType == 2){
                        pzCss = 'hb'+v.PrizeValue;
                    }else if(v.PrizeType == 1){
                        if (v.PrizeTitle.indexOf('京东购物券') > -1){
                            pzCss = 'jdk2';
                        }else if (v.PrizeTitle.indexOf('周边小礼品') > -1){
                            pzCss = 'x92';
                        }else if(v.PrizeTitle.indexOf('吹风机') > -1){
                            pzCss = 'cfj';
                        }else if(v.PrizeTitle.indexOf('蓝牙耳机') > -1){
                            pzCss = 'lyej';
                        }else if(v.PrizeTitle.indexOf('打蛋器') > -1){
                            pzCss = 'ddq';
                        }else if(v.PrizeTitle.indexOf('充电器') > -1){
                            pzCss = 'cdq';
                        }else if(v.PrizeTitle.indexOf('蓝牙音箱') > -1){
                            pzCss = 'lyyx';
                        }else if(v.PrizeTitle.indexOf('护颈枕') > -1){
                            pzCss = 'hjz';
                        }else if(v.PrizeTitle.indexOf('京东微联智能蓝牙脂肪秤电子称') > -1){
                            pzCss = 'dzc';
                        }
                    }
                    pzCss += ' prize'+i;
                    html += '<span class="'+pzCss+'"></span>';
                    arr.push(html);
                })
                bigprizeMod.html(arr.join(''));
                dlgBigMask.show();
              }else if(sta == 2 || sta == 6){
                //无可用抽奖机会||本轮活动已参与
                nochanceBlink.open();
              }else if(sta == 3){
                //活动未开始
                unbeginBlink.open();
              }else if(sta == 4 || sta == 5){
                //活动已结束||本轮活动已结束
                endBlink.open();
              }else if(sta == 7){
                //不满10次
                discontentBlink.open();
              }
              
          }
      }

      JSBK.bindToken(function(){
          //已登录
          JSBK.Utils.postAjax(drawAll);
      });      
    })
    
    //排行榜
    var rankingList = {
      data: {
        'AID': '20170501',
        'PI': 0,
        'PS': 100
      },
      mFun: 'ActivityBuyProductTopList',
      beforeFun: function() {},
      sucFun: function(v) {
        var list = v.list,
            model = v.model,
            rankingHtml='',
            rankingMyHtml='';
        //排行数据
        if(list.length > 0){
          $.each(list,function(i,v){
              var rank = v.Ranks,
                  rankNum,
                  rankCss;
              if(rank <= 3){
                  rankNum = '';
                  rankCss = 'rank0'+rank;
              }else{
                  rankNum = rank;
                  rankCss = '';
              }
              rankingHtml += '<li><span class="rank '+rankCss+'">'+rankNum+'</span>';
              rankingHtml += '<span>'+v.Phone+'</span>';
              rankingHtml += '<span>'+v.YongShiNum+'</span>';
              rankingHtml += '<span>x <em>'+v.ActivityRate+'%</em></span></li>';
          })
        }else{
          rankingHtml = '<li class="noneinfo">暂无数据</li>';
        }
        $('#rank_info').html(rankingHtml);

        //我的排行
        if(model.Ranks > 0){
            rankingMyHtml += '<span>'+model.Ranks+'</span>';
            rankingMyHtml += '<span>'+model.Phone+'</span>';
            rankingMyHtml += '<span>'+model.YongShiNum+'</span>';
            rankingMyHtml += '<span>x <em>'+model.ActivityRate+'%</em></span>';
        }else{
            rankingMyHtml = '<p class="noneinfo">暂无数据</p>';
        }
        $('#my_rank').html(rankingMyHtml);
      },
      unusualFun: function(v) {}
    };

    JSBK.Utils.postAjax(rankingList);

    //微信分享
    JSBK.shareWinxin({
        'title': '怕五一花钱太快钱包回到解放前？即日起至5月4日，来94购买指定9盈宝活动产品，即可参与“挖金矿 悬赏勇士“最高800%奖励收益！更有iphone7plus、实用家电、大量现金、京东券等您来挖~',
        'desc': '怕五一花钱太快钱包回到解放前？即日起至5月4日，来94购买指定9盈宝活动产品，即可参与“挖金矿 悬赏勇士“最高800%奖励收益！更有iphone7plus、实用家电、大量现金、京东券等您来挖~',
        'link': 'http://np.94bank.com/Activity/LabourDay20170501',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170429/labourDay/share.jpg'
    })
});