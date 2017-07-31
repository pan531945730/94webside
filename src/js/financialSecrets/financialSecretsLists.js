;
$(function() {
    require('../../common/layout.css');
    var JSBK = require('../../common/layout02.js');
    require('../../component/website/Load.css');
    require('../../css/financialSecrets/financialSecretsLists.css');
    var moreIscroll = require('../../ui/moreIscrollTab.js'); 

    var navInfo = $('.nav-info'),
        fslCont = $('.fsl-cont'),
        fslMod = $('.fsl-mod'),
        fslInfo = $('.fsl-info'),
        load = $('.load'),
        isAjaxInfo = {},
        pageSize = 20;
    
    //导航切换
    navInfo.on('click','span',function(){
        var that = $(this),
            navId = that.attr('data-id'),
            currMod = $('.fsl-mod[data-id="'+navId+'"]'),
            currInfo = $('.fsl-info[data-id="'+navId+'"]'),
            navLeft = navInfo[0].scrollLeft;
        that.addClass('nav-on').siblings('span').removeClass('nav-on');
        currMod.addClass('info-show').siblings('.fsl-mod').removeClass('info-show');
        JSBK.Utils.LocalStorageHelper('setItem','navId', navId);
        JSBK.Utils.LocalStorageHelper('setItem','navLeft', navLeft);
        //是否请求接口
        if(!isAjaxInfo[navId]){
            getInfo(navId,currInfo,currMod);
            isAjaxInfo[navId] = true;
        }
    })

    //初始化导航
    var navData = {
        data: {},
        mFun: 'GetInfoCategoryList',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            var navdata=v.categoryList,
                html = '',
                infoHtml = '',
                firstNavId;
            $.each(navdata,function(i,v){
                if(i == 0){
                    html += '<span class="nav-on" data-id="'+v.id+'">'+v.title+'</span>'
                    firstNavId = v.id;
                }else{
                    html += '<span data-id="'+v.id+'">'+v.title+'</span>';
                }
                infoHtml += '<div class="fsl-mod" data-id="'+v.id+'"><div class="fsl-info" data-id="'+v.id+'"></div><div class="bot">已经到底啦</div></div>';
            })
            navInfo.html(html);
            fslCont.html(infoHtml);

            //默认显示tab内容
            var navCurr = JSBK.Utils.LocalStorageHelper('getItem','navId'),
                navLeft = JSBK.Utils.LocalStorageHelper('getItem','navLeft');
            $('.nav-info span[data-id="'+navCurr+'"]').addClass('nav-on').siblings('span').removeClass('nav-on');
            if(navCurr){
                firstNavId = navCurr;
            }

            var firstMod = $('.fsl-mod[data-id="'+firstNavId+'"]'),
                firstInfo = $('.fsl-info[data-id="'+firstNavId+'"]');
            getInfo(firstNavId,firstInfo,firstMod);
            firstMod.addClass('info-show');
            navInfo[0].scrollLeft = navLeft;
            isAjaxInfo[firstNavId] = true;
        },
        unusualFun : function(v){
            load.hide();
        }
    }
    JSBK.Utils.postAjax(navData);
    //列表模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '';
            html += '<a href="'+v.jumpUrl+'">';
            html += '<div class="info-left">';
            html += '<p>'+v.title+'</p>';
            html += '<div class="info-bar">';
            html += '<span class="bar-ico">'+v.categoryTitle+'</span>';
            html += '<span class="bar-num">'+v.readCount+'</span>';
            html += '</div></div>';
            html += '<div class="info-rig"><img src="'+v.imageUrl+'" alt="financialSecrets"></div>';
            html += '</a>';
            arr.push(html);
        })
    }
    //列表内容
    function getInfo(categoryId,categoryCont,categoryMod){
        var lccpConData = {
            data: {
                CategoryID:categoryId,
                PageIndex:1,
                PageSize:pageSize
            },
            mFun: 'GetInfoList',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var arr = [];
                if(v.rowCount == 0){
                    var html = '<p class="info-none">暂无内容</p>';
                    categoryCont.html(html);
                    categoryCont.next('.bot').hide();
                    return;
                }else{
                    htmlTep(v.entities,arr);
                    categoryCont.append(arr.join(''));
                    if(v.entities.length >= pageSize){
                        
                        var bot = categoryMod.next('.bot');
                        new moreIscroll({
                            cont : categoryMod,
                            info : categoryCont,
                            load : $('.load'),
                            bot : bot,
                            getNextStatus : true,
                            page : 2,
                            pageSize : pageSize,
                            CategoryID : categoryId,
                            ajaxFun : 'GetInfoList',
                            htmlTep : htmlTep,
                            ajaxObj : 'entities'                            
                        });
                    }
                }
                
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        JSBK.Utils.postAjax(lccpConData);
    }

 });
