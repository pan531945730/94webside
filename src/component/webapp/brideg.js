;
(function($){
    var JSBK = require('../../common/layout02.js');
    //H5&&APP桥接方法
    function connectWebViewJavascriptBridge (callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function() {
                document.documentElement.removeChild(WVJBIframe)
            }, 0)
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge)
            }, false)
        }
    }

    //H5处理逻辑    
    window.commonHander = function(request,response){
        response('commonhander-h5')
    }

    //app处理逻辑
    connectWebViewJavascriptBridge(function(bridge) {

        bridge.init(function(message, responseCallback) {
            /*alert('JS got a message', message)
            var data = { 'Javascript Responds':'Wee!' }
            alert('JS responding with', data)
            responseCallback(data)*/
        })

        //H5与APP桥接公共方法
        window.commonHander = function(req,res){
            bridge.callHandler('com.hongzhe.bank94.CommonHander', req, function(response) {
                res(response);
            })
        }

        bridge.registerHandler('com.hongzhe.bank94.appCallH5', function(data, responseCallback) {
            var birdgeTitle = JSON.parse(data).title;
            if(birdgeTitle == '福利社'){
                var responseData = function(){
                    Brideg.bindToken(window.welfareHome);
                }
                responseCallback(responseData());
                return;
            }else if(birdgeTitle == '风险测评'){
                var responseData = function(){
                    Brideg.bindToken(window.riskAppraisal);
                }
                responseCallback(responseData());
                return;
            }            
        })

    })

    var Brideg = {};

    //是否登录(Token)
    Brideg.bindToken = (function(){
        var isToken = true,
            requestData = {
                'handerName' : 'com.hongzhe.bank94.getToken'
            },
            requestSignOutData = {
                'handerName' : 'com.hongzhe.bank94.signOutToken'
            };
        return function(sucFun, unusualFun) {
            commonHander(requestData,function(token) {
                if (token == 'commonhander-h5') {
                    sucFun && sucFun();
                } else {
                    //获取token后所做的逻辑
                    var tokenData = {
                        data: {
                            'ToKen': token
                        },
                        mFun: 'SetToken',
                        beforeFun: function() {},
                        sucFun: function(v) {
                            sucFun && sucFun();
                            isToken = false;
                        },
                        unusualFun: function(v) {
                            unusualFun && unusualFun();
                            //token 过期
                            commonHander(requestSignOutData,function(res){
                                if(res){
                                    
                                }
                            })
                        }
                    }
                    if (isToken) {
                        JSBK.Utils.postAjax(tokenData);
                    } else {
                        sucFun && sucFun();
                    }
                }
            });
        }
    })()

    //积分列表页
    Brideg.integral = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.requestIntegralRecord'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //积分中心页面
    Brideg.earnEntegral = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.requestIntegralCenter'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //客服
    Brideg.severceOnLine = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.requestService'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //邀请好友
    Brideg.invateFriend = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.requestInvateFriend'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //重新评测
    Brideg.reEvaluating = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.reEvaluating'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //我的
    Brideg.myCenter = (function(){
        var requestData = {
            'handerName' : 'com.hongzhe.bank94.myCenter'
        };
        return function(){
            commonHander(requestData,function(res){
                if(res){
                    console.log(res)
                }
            })
        }
    })()

    //H5到H5跳转
    Brideg.jumpUrl = function(requestData){
        commonHander(requestData,function(res){
            if (res == 'commonhander-h5') {
                location.href = requestData.url;
            } else {
                console.log(res)
            }
        })
    }
    
    //产品详解高度
    Brideg.webHigh = function(requestData){
        commonHander(requestData,function(res){
            if (res == 'commonhander-h5') {
                console.log(res);
            }
        })
    }
    
    module.exports = Brideg;
})(Zepto);