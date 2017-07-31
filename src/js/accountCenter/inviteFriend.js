;
$(function() {
    require('../../common/layout.css');
    require('../../css/accountCenter/inviteFriend.css'); 
    
    var inviteDialog = $('.g-d-dialog');
    $('.if-btn').on('click',function(){
        inviteDialog.show();
    })

    inviteDialog.on('click',function(){
        $(this).hide();
    })

});