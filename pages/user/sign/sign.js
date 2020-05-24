const App = getApp();

var date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, dayInMonth = date.getDate(), dayInWeek = date.getDay(), selected = [year, month, dayInMonth], week = [{
  value: "日",
  class: "weekend"
}, {
  value: "一",
  class: ""
}, {
  value: "二",
  class: ""
}, {
  value: "三",
  class: ""
}, {
  value: "四",
  class: ""
}, {
  value: "五",
  class: ""
}, {
  value: "六",
  class: "weekend"
}], isLeapYear = function (t) {
  return t % 400 == 0 || t % 4 == 0 && t % 100 != 0;
}, isToday = function (t, e, a) {
  return t == year && e == month && a == dayInMonth;
}, isWeekend = function (t, e) {
  return (t + e) % 7 == 0 || (t + e - 1) % 7 == 0;
}, calEmptyGrid = function (t, e) {
  return new Date(t + "/" + e + "/02 00:00:00").getUTCDay();
}, calDaysInMonth = function (t, e) {
  var a = isLeapYear(t);
  return 2 == month && a ? 29 : 2 != month || a ? [4, 6, 9, 11].includes(e) ? 30 : 31 : 28;
}, calWeekDay = function (t, e, a) {
  return new Date(t + "/" + e + "/" + a + " 00:00:00").getUTCDay();
}, getThisMonthDays = function (t, e) {
  return new Date(t, e, 0).getDate();
}, calDays = function (t, e) {
  for (var a = getThisMonthDays(t, e), s = calEmptyGrid(t, e), n = [], o = 1; o <= a; o++) {
    var l = isToday(t, e, o), i = selected[0] == t && selected[1] == e && selected[2] == o, r = l ? "today" : "", d = i ? "selected" : "", c = {
      value: o,
      date: [t, e, o],
      class: "date-bg " + (isWeekend(s, o) ? "weekend" : "") + " " + r + " " + d + " " + (l && i ? "today-selected" : "")
    };
    n.push(c);
  }
  return n.slice(0, calDaysInMonth(t, e));
};

Page({
  data: {
    userInfo: {}, // 用户信息
    currYear: year,
    currMonth: month,
    week: week,//星期日~六数组
    emptyGrids: calEmptyGrid(year, month),
    days: calDays(year, month),//当前年月日
    selected: selected,//选中日期
    disabled: !1,//是否可以签到
    logintext: "点击签到",
    lxts: 0//连续天数
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取当前信息
    this.getDetail();
  },

  /**
   * 获取当前信息
   */
  getDetail: function () {
    let _this = this;
    var date = this.data.currYear + "-" + this.data.currMonth;//当前选择月份
    var now = (this.data.selected).toString();//当日日期
    App._get('user.sign_in/history', { date: date }, function (result) {
      var userInfo = result.data.userInfo;
      var setting = result.data.setting;

      // 今日是否签到
      if (userInfo.last_sign_time == now) {
        var disabled = !0;
        var logintext = '今日已签到';
      } else {
        var disabled = !1;
        var logintext = '点击签到';
      }

      // 标记已签到日期
      var history = result.data.history;//已签到日期
      var days = _this.data.days;
      for (var i = 0; i < days.length; i++)
        if (_this.in_array(days[i].date.toString(), history)) days[i].isqd = 1;

      _this.setData({
        userInfo: userInfo,
        lxts: userInfo.sign_day,
        qdset: setting,
        jl: setting.bonus_sign_point,
        disabled: disabled,
        logintext: logintext,
        days: days,
      });
    });
  },

  in_array: function (t, e) {
    for (var a = 0; a < e.length; a++) {
      if (e[a] == t) return !0;
    }
    return !1;
  },

  // 签到
  qd: function () {
    var _this = this;
    var now = this.data.selected;

    App._get(
      'user.sign_in/sign',
      { sign_date: now.toString() },
      function (result) {
        // 成功
        var points = result.data.get_points;
        wx.showModal({
          title: '提示',
          content: '签到成功，+' + points + "积分",
        });
        _this.getDetail();
      },
      function (result) {
        // 失败
        if (result.data.msg == "今日已签到") _this.getDetail();
      }
    );
  },

  // 切换月份
  changeMonth: function (t) {
    var e = t.target.id, a = this.data.currYear, s = this.data.currMonth;
    s = "prev" == e ? s - 1 : s + 1,
      "prev" == e && s < 1 && (a -= 1, s = 12),
      "next" == e && 12 < s && (a += 1, s = 1),
      this.setData({
        currYear: a,
        currMonth: s,
        emptyGrids: calEmptyGrid(a, s),
        days: calDays(a, s)
      });
    this.getDetail();
  },
});