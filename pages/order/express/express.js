const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},

    express: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var extra_id = (options.extra_id > 0) ? options.extra_id : 0;
    // 获取物流动态
    this.getExpressDynamic(options.order_id, extra_id);
  },

  /**
   * 获取物流动态
   */
  getExpressDynamic: function (order_id, extra_id = 0) {
    let _this = this;
    App._get('user.order/express', {
      order_id,
      extra_id,
    }, function(result) {
      _this.setData(result.data);
    },
    function() {
      wx.navigateBack();
    });
  },

})