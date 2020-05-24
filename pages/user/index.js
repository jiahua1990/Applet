const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    orderCount: {}, // 订单数量
    couponCount: {}, // 优惠券数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取当前用户信息
    this.getUserDetail();
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, function(result) {
      _this.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    // 记录formid
    App.saveFormId(e.detail.formId);
    let urls = {
      all: '/pages/order/index?type=all',
      payment: '/pages/order/index?type=payment',
      received: '/pages/order/index?type=received',
      refund: '/pages/order/refund/index',
    };
    // 转跳指定的页面
    wx.navigateTo({
      url: urls[e.currentTarget.dataset.type]
    })
  },

  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

  /**
   * 跳转我的钱包页面
   */
  onTargetWallet(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: './wallet/index'
    })
  },

  /**
   * 跳转积分明细页
   */
  onTargetPoints(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../points/log/index'
    });
  },

  onTargetDealer(e) {
    if(this.data.dealer.is_open == 1){
      // 记录formId
      App.saveFormId(e.detail.formId);
      wx.navigateTo({
        url: '../dealer/index/index'
      });
    }else{
      App.showError("分销功能已关闭");
    }
  },
})