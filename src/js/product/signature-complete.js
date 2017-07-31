/*
 *邮件发送pdf文件
 *author:wangying
 *data:2016-11-14
 */
;
$(function() {

	//引入相关文件
	require('../../common/layout.css');
	require('../../common/layout.js');
	require('../../css/product/signature-complete.css');
	var Confirm = require('../../ui/Confirm.js');
	var Blink = require('../../ui/Blink.js');

	//tradingId=2106478;
	var dom = {
			tipsError: $('#tipsError'),
			saveLocation: $('#saveLocation'),
			numProtocol: $('#numProtocol'),
			nameProtocol: $('#nameProtocol'),
			sendEmail: $('#sendEmail'),
			emailProtocol: $('#emailProtocol')
		},
		emailRegExp = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
		TradingId = JSBK.Utils.GetQueryString('tradingId'),
		msg,
		timerPfd, //pdf计时器
		pfdNum = 0;

	/*
	 *生成pfd文件
	 *每1s去请求pfd文件，返回isCreated=false，
	 *说明生成文件失败，当请求超过10后，弹出二次请求框
	 */
	var GeneratePdf = {
		data: {
			tradingId: TradingId
		},
		mFun: 'GetContractPdf',
		beforeSend: $('#load').show(),
		sucFun: function(v) {
			if (v.isCreated) {
				$('#load').hide();
				pfdNum = 0;
				clearInterval(timerPfd);
				dom.nameProtocol.html(v.contractName);
				dom.sendEmail.addClass('active');
				dom.saveLocation.attr('href', v.pdfDownloadUrl).addClass('active');
				dom.numProtocol.html(v.id);
			} else if (pfdNum >= 10) {
				pfdNum = 0;
				clearInterval(timerPfd);
				getPdfError.open();
			}
		},
		unusualFun: function(v) {
			clearInterval(timerPfd);
			getPdfError.open();
		}
	};

	if (TradingId) {
		timerPfd = setInterval(function() {
			pfdNum = pfdNum + 1;
			JSBK.Utils.postAjax(GeneratePdf);
		}, 1000);
	}
	//弹出框
	var getPdfError = new Confirm({
		titleHtml: '购买协议',
		confirmBtnHtml: '确定',
		infoHtml: function() {
			return $('<p>购买协议获取失败，请重新获取！</p>');
		},
		cancleCallback: function() {
			getPdfError.dialog.close();
			$('#load').hide();
		},
		confirmCallback: function() {
			getPdfError.dialog.close();
			timerPfd = setInterval(function() {
				pfdNum = pfdNum + 1;
				JSBK.Utils.postAjax(GeneratePdf);
			}, 1000);
		}
	});

	/*
	 *邮箱格式
	 */
	function isEmail(val) {
		if (!val) {
			msg = '请输入邮箱！';
			dom.tipsError.show().html(msg);
			return false;
		} else if (!emailRegExp.test(val)) {
			msg = '请输入正确的邮箱！！';
			dom.tipsError.show().html(msg);
			return false;
		} else {
			dom.tipsError.hide();
			return true;
		}
	}

	var timerSend;
	var sendSuc = new Blink({
		'blinkHtml': '发送成功'
	});

	/*邮箱发送pdf文件*/
	dom.sendEmail.click(function() {
		var emailProtocol = dom.emailProtocol.val();
		if (isEmail(emailProtocol)) {
			var SendContractMailData = {
				data: {
					Email: emailProtocol,
					TradingId: TradingId
				},
				mFun: 'SendContractMail',
				beforeSend: $('#load').show(),
				sucFun: function(v) {
					var t = 30;
					$('#load').hide();
					//window.location.href = '/Member/AccountCenter';
					
					sendSuc.open();
					timerSend = setInterval(function() {
						t -= 1;
						dom.sendEmail.html(t + 'S').addClass('no');
						if (t == 0) {
							clearInterval(timerSend);
							dom.sendEmail.html('发送').removeClass('no');
						}
					}, 1000);
				},
				unusualFun: function(v) {
					dialogError(v.ES);
				}
			};
			JSBK.Utils.postAjax(SendContractMailData);
		}
	});

	/*
	 *错误弹出框
	 */
	function dialogError(content) {
		var errorAlert = new Alert({
			titleHtml: content,
			clickBtnCallback: function() {
				errorAlert.dialog.close();
			}
		});
		errorAlert.open();
	}
});