;
$(function() {
    require('../../common/layout.css');
    require('../../css/product/calculator.css'); 
    
    var multislterMask = $('.multislter-mask'),
        multislterCont = $('.multislter-cont'),
        price = $('#price'),
        proName = $('.pro-name'),
        proDay = $('.pro-day'),
        interestYear = $('.cal-interest'),
        interestEarn = $('.cal-earn'),
        earnSty = $('#earn_sty'),
        productInfo = $('#product_info'),
        body = $('body'),
        index = 2;

    function bit(n){
        return n.toFixed(3).toString().replace(/(\.\d{2})\d+$/,"$1");
    }

    //产品类别
    var product = [
        {
            name : '新手宝',
            earnSty : '预期收益',
            day : '15',
            interestRate: '<em>12</em>%',
            interstEarn : function(val){
                return bit(val*0.12*15/365)
            }

        },
        {
            name : '9盈宝90天',
            earnSty : '预期收益',
            day : '90',
            interestRate: '<em>8</em>%',
            interstEarn : function(val){
                return bit(val*0.08*90/365)
            }
        },
        {
            name : '9盈宝365天',
            earnSty : '预期收益',
            day : '365',
            interestRate: '<em>10</em>%',
            interstEarn : function(val){
                return bit(val*0.10)
            }
        },
        {
            name : '9盈宝720天',
            earnSty : '预期收益',
            day : '720',
            interestRate: '<em>11</em>%',
            interstEarn : function(val){
                return bit(val*0.11*720/365)
            }
        },
        {
            name : '优选计划',
            earnSty : '预期收益',
            day : '90',
            interestRate: '<em>7</em>%~<em>12</em>%',
            interstEarn : function(val){
                return bit(val*0.07*90/365)+'~'+bit(val*0.12*90/365)
            }
        },
        {
            name : '银行宝',
            earnSty : '万份收益',
            day : '1',
            interestRate: '<em>6</em>%',
            interstEarn : function(val){
                return bit(val*0.06*1/365)
            }
        },
        {
            name : '基金宝',
            earnSty : '万份收益',
            day : '1',
            interestRate: '<em>6</em>%~<em>9</em>%',
            interstEarn : function(val){
                return bit(val*0.06*1/365)+'~'+bit(val*0.09*1/365)
            }
        }
    ];

    function productFn(i){
        proName.html(product[i].name);
        proDay.html(product[i].day);
        interestYear.html(product[i].interestRate);
        interestEarn.html(product[i].interstEarn(price.val()));
        earnSty.html(product[i].earnSty)
    }

    //初始化
    function init(){
        price.val(10000).focus();
        productFn(2);
        var html = '';
        $.each(product,function(i,v){
            if(v.name=='9盈宝365天'){
                 html += '<li data-index="'+i+'" class="selected">'+v.name+'</li>';
            }else{
                html += '<li data-index="'+i+'">'+v.name+'</li>';
            }
        })
        productInfo.html(html);
    }
    init();

    //隐藏选择产品
    function maskHid(){
        multislterCont.removeClass('multislter-show');
        setTimeout(function(){
           multislterMask.addClass('none');
        },300)
        body.removeClass('bodyhid');
    }

    //显示选择产品
    function maskShow(){
        multislterMask.removeClass('none');
        setTimeout(function(){
            multislterCont.addClass('multislter-show');
        },0)
        body.addClass('bodyhid');
    }

    //重置
    $('.cal-reset').on('click',function(){
        price.val(10000).focus();
        productFn(2);
    })

    //持有金额
    price.on('input',function(){
        var val = price.val();
        if(val.length > 8){
            val=val.slice(0,8)
        }
        $(this).val(val);
        interestEarn.html(product[index].interstEarn(val));
    })
    
    //选择产品
    productInfo.on('click','li',function(){
        $(this).addClass('selected').siblings('li').removeClass('selected');
        index = $(this).attr('data-index');
    })

    //选择持有产品
    proName.on('click',function(){
        maskShow();
    })

    //确定
    $('.confirm-btn').on('click',function(){
        productFn(index);
        maskHid();
    })

    //取消
    $('.cancle-btn').on('click',function(){
        maskHid();
    })

});