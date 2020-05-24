const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consume: 0,
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取分销商兑换信息
    this.getDealerWithdraw();
  },

  /**
   * 获取分销商兑换信息
   */
  getDealerWithdraw: function () {
    let _this = this;
    App._get('user.dealer.exchange/index', {}, function (result) {
      let data = result.data;
      _this.setData(data);
    });
  },

  /**
   * 提交申请 
   */
  formSubmit: function (e) {
    let _this = this,
      balance = e.detail.value.balance,
      consume = _this.data.consume,
      setting = _this.data.setting;

    // 记录formId
    App.saveFormId(e.detail.formId);

    // 验证可兑换积分
    if (_this.data.user.points <= 0) {
      App.showError('当前没有积分');
      return false;
    }
    // 验证兑换余额
    if (!balance) {
      App.showError('请输入要兑换的余额');
      return false;
    }
    if (e.detail.value.balance < 0.01) {
      App.showError('余额最低可兑换0.01');
      return false;
    }
    if (balance < setting.exchange_ratio) {
      App.showError('兑换的最低余额为' + setting.exchange_ratio);
      return false;
    }
    if (_this.data.user.points < consume) {
      App.showError('积分不足');
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    // 数据提交
    App._post_form('user.dealer.exchange/submit', {
      data: JSON.stringify({ balance: balance })
    }, function (result) {
      // 提交成功
      App.showError(result.msg, function () {
        wx.switchTab({
          url: '../../user/index',
        });
      });
    }, null, function () {
      // 解除按钮禁用
      _this.setData({
        disabled: false
      });
    });
  },

  // 计算积分消耗
  setPoints: function (e) {
    var balance = Math.floor(e.detail.value * 100) / 100;
    var points = this.data.user.points;
    var exchange_ratio = this.data.setting.exchange_ratio;

    if (balance) {
      // 向上取整
      var consume = Math.ceil(balance / exchange_ratio);
      this.setData({
        consume: consume
      })
    } else {
      this.setData({
        consume: 0
      })
    }
  }
})