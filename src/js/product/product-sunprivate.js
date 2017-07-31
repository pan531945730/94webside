/*
 *阳光私募预约
 *author:wangying
 *data:2016-11-14
 */
;
$(function() {

	//引入相关文件
	require('../../common/layout.css');
	require('../../common/layout.js');
	require('../../css/product/product-sunprivate.css');
	var Confirm = require('../../ui/Confirm.js');
	var Alert = require('../../ui/Alert.js');
	var Blink = require('../../ui/Blink.js');
	var dom = {
			psunTop: $('#psunTop'),
			moneyNum: $('#moneyNum'),
			deadLine: $('#deadLine'),
			offeringSize: $('#offeringSize'),
			sunDes: $('#sunDes'),
			yqnhsyl: $('#yqnhsyl'),
			sunpState: $('#sunpState'),
			btnAppointment: $('#btnAppointment'),
			dialogSunPrivate: $('#dialogSunPrivate'),
			tipsError: $('#tipsError')
		},
		ProductID = '2301', //阳光私募的交易id
		MemberId = '0',
		investorRegister; //合格投资者登记弹出框
	/*
	 *阳光私募进入执行
	 */
	function productStatus(val) {
		if (val == '1') {
			return '正在预约';
		} else {
			dom.sunpState.addClass('gray');
			return '预约结束';
		}
	}
	var GetSunPrivate = {
		mFun: 'GetPrivatePlacement',
		beforeSend: $('#load').show(),
		sucFun: function(v) {
			$('#load').hide();
			dom.yqnhsyl.html(v.interestRate);
			dom.sunpState.html(productStatus(v.productStatus));
			//infor
			dom.moneyNum.html(v.minAmount);
			dom.deadLine.html(v.productTime);
			dom.offeringSize.html(v.totalAmount);
			dom.sunDes.attr('href', v.descriptionUrl);
			//btn
			dom.btnAppointment.addClass('active');
			//弹出框
			investorRegister = new Confirm({
				titleHtml: v.contractTitle,
				confirmBtnHtml: "确定",
				infoHtml: function() {
					return $('<p class="txt">' + v.contract + '</p><div class="tips gray sun-agree" id="sunAgree"><i class="pt-arr"></i>本人承诺符合上述特定合格投资者条件</div><div class="tips-error" id="tipsError"></div>');
				},
				confirmCallback: function() {
					if ($('#sunAgree').find('i').hasClass('pt-arr')) {
						$('#tipsError').hide();
						investorRegister.dialog.close();
						JSBK.Utils.postAjax(GetMemberInfo);
					} else {
						var msg = '请同意上述条件';
						$('#tipsError').html(msg).show();
					}
				}
			});
		},
		unusualFun: function(v) {
			dialogError(v.ES, JSBK.Utils.postAjax(GetSunPrivate));
		}
	};
	JSBK.Utils.postAjax(GetSunPrivate);

	/*
	 *弹出框操作 
	 */
	//合格投资者登记
	dom.btnAppointment.on('click', function() {
		investorRegister.open();
	});
	$('body').on('click', '#sunAgree', function() {
		$(this).find('i').toggleClass('pt-arr');
	});

	//弹出框 预约用户信息
	var MemberId;
	var preregName;
	var preregTele;
	var GetMemberInfo = {
		mFun: 'GetMemberInfo',
		beforeSend: $('#load').show(),
		sucFun: function(v) {
			MemberId = v.memberId;
			preregName = v.realName;
			preregTele = v.phone;
			$('#load').hide();
			//生成预约登记弹出框
			var dialogPrereg = new Confirm({
				className: 'g-d-dialog dialog-prereg',
				titleHtml: '预约登记<span class="close" id="dialogClose">X</span>',
				confirmBtnHtml: "确定",
				infoHtml: function() {
					return $('<ul>\
                    <li><span>预约项目</span><p>阳光私募预约</p></li>\
                    <li><span>预约人</span><p id="preregName">' + preregName + '</p></li>\
                    <li><span>联系电话</span><p id="preregTele">' + preregTele + '</p></li>\
                    <li><span>预约金额</span><p><input type="number" placeholder="请输入您要预约的金额" value="" id="preregMoney"></p></li>\
                    <li><span>预约备注</span><p><textarea name="textarea" rows="3" id="textarea" placeholder="请输入您要备注的信息" id="preregRemark"></textarea></p></li>\
                </ul>');
				},
				confirmCallback: function() {
					if ($('body').find($('input')).val() >= '1000000') {
						//弹出框 提交登记预约
						var GetPreregistration = {
							data: {
								MemberId: MemberId,
								ProductID: ProductID,
								Amount: $('input').val(),
								Remark: $('textarea').val()
							},
							mFun: 'FundReserve',
							beforeSend: $('#load').show(),
							sucFun: function(v) {
								$('#load').hide();
								dialogPrereg.dialog.close();
								var appSuc = new Blink({
									'blinkHtml': '预约成功'
								});
								appSuc.open();
							},
							unusualFun: function(v) {
								dialogError(v.ES, JSBK.Utils.postAjax(GetPreregistration));
							}
						};
						JSBK.Utils.postAjax(GetPreregistration);
					} else {
						var appFail = new Blink({
							'blinkHtml': '预约失败，预约金额100万元起投'
						});
						appFail.open();
					}
				}
			});
			dialogPrereg.open();
			//弹出框 关闭按钮
			$('body').on('click', '#dialogClose', function() {
				dialogPrereg.dialog.close();
			});
		},
		unusualFun: function(v) {
			dialogError(v.ES, JSBK.Utils.postAjax(GetMemberInfo));
		}
	};

	/*
	 *错误弹出框
	 */
	function dialogError(content, errFn) {
		var errorAlert = new Alert({
			titleHtml: content,
			clickBtnCallback: function() {
				errFn;
				errorAlert.dialog.close();
			}
		});
		errorAlert.open();
	}
});