// pages/user/message/index.js
import BookUserMessageStore from '../../../stores/BookUserMessageStore.js';
import FormatDate from '../../../utils/date.js';
import ShareHelper from '../../../utils/share.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: '',
    messages: null,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取系统信息记录
    BookUserMessageStore.GetMessages().then(res => {
      //console.info('获取系统信息记录', res)
      res && res.map(function (row, index, array) {
        row.Create_Time = FormatDate(row.Create_Time, 'yyyy.MM.dd')
      })
      that.setData({ messages: res });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return ShareHelper.DefaultSetting(res)
  }

})