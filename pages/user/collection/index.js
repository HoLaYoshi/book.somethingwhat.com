// pages/user/collection/index.js
import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';
import FormatDate from '../../../utils/date.js';
import ShareHelper from '../../../utils/share.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取用户收藏的小说
    BookReadRecordStore.GetCollectedList().then(res => {
      //console.info('res', res)
      res && res.map(function (row, index, array) {
        if (row.Author.length > 3)
          row.Author = row.Author.substring(0, 3) + '..'
        if (row.Book_Name.length > 6)
          row.Book_Name = row.Book_Name.substring(0, 6) + '..'
        row.Create_Time = FormatDate(row.Create_Time, 'yyyy.MM.dd')
      })
      that.setData({ booklist: res });
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
  },

  /**
   * 跳转到小说介绍页面
   */
  onRedirectToBookIntro: function (e) {
    let that = this
    let id = encodeURIComponent(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../book/intro/index?id=' + id
    })
  }
})