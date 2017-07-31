;
$(function(){
    require('../website/footBar.css');
    
    var Confirm = require('../../ui/Confirm.js');
    var contactDia = new Confirm({
        titleHtml : '客服电话',
        confirmBtnHtml : '呼叫',
        infoHtml : function(){
            return $('<p>400-969-0390</p><p>服务时间：09:00-19:00</p>');
        },
        confirmCallback : function(){
            window.location.href = 'tel:4009690390';
        }
    });
    
    $('#contact_us').on('click',function(){
        contactDia.open();
    })


})