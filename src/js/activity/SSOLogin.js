;
$(function() {
    require('../../common/layout.js');

    $('#btn').on('click', function(e) {
        e.preventDefault();
        bindButtonClick();
    })

    function bindButtonClick() {

        getUserSuc(function(token) {
            $('#btn').html(token);
            //初始化
            var tokenData = {
                data: {
                    "ToKen" : token
                },
                mFun: 'SetToken',
                sucFun : function(v){
                    location.href = '/Member/AccountCenter';
                },
                unusualFun : function(v){
                    location.href = '/';
                }
            }
            JSBK.Utils.postAjax(tokenData);  
        });
    }

    window.getUserSuc = function(callback) {
        callback('5933b37d6481182478c48ec08b4a5eb5@wx');
    }

    JSBK.connectWebViewJavascriptBridge(function(bridge) {

        bridge.init(function(message, responseCallback) {
            /*alert('JS got a message', message)
            var data = { 'Javascript Responds':'Wee!' }
            alert('JS responding with', data)
            responseCallback(data)*/
        })

        window.getUserSuc = function(callback) {

            bridge.callHandler('com.hongzhe.bank94.getToken', null, function(response) {
                callback(response);
            })
        };

    })
})