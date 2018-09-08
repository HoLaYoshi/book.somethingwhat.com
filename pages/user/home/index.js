import WXBaseStore from '../../../stores/wxbase.js';
import BookUserStore from '../../../stores/BookUserStore.js';
import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';
import BookChapterReadRecordStore from '../../../stores/BookChapterReadRecordStore.js';
import Util from '../../../utils/util.js';
import ShareHelper from '../../../utils/share.js';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      userid: '--',
      mmbi: '--',
      readMin: '--'
    },
    //阅读记录
    readRecordSummary: {
      bookCount: '--',
      chapterCount: '--'
    },
    //小说收藏数
    bookCollectionCount: '--'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取微信基本信息
    let r = WXBaseStore.getUserInfoCache()
    //获取用户信息（数据库中）
    BookUserStore.GetBookUserInfo().then(res => {
      r.userid = res.User_Id;   //账户id
      r.mmbi = res.Currency; //喵币
      //r.readMin = Util.convertTime_H_M(res.Read_Minute);//阅读时长
      that.setData({ userInfo: r });
      //获取用户阅读时长
      BookChapterReadRecordStore.GetDuration().then(val => {
        r.readMin = Util.convertTime_H_M(parseInt(val / 60));
        that.setData({ userInfo: r });
      })
    }).catch(res => {
      console.info('catch', res)
    })
    //获取用户阅读记录
    BookReadRecordStore.GetBookReadingRecordSummary().then(res => {
      const readRecordSummary = {
        bookCount: res.BookCount,
        chapterCount: res.ChapterCount
      }
      that.setData({ readRecordSummary: readRecordSummary });
    })
    //获取用户书包
    BookReadRecordStore.GetBookUserCollectionSummary().then(res => {
      that.setData({ bookCollectionCount: res.Count });
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
   * 跳转到个人账户页面
   */
  onRedirectToAccount: function () {
    let that = this
    wx.navigateTo({
      url: '../account/index'
    })
  },

  /**
   * 跳转到最近阅读页面
   */
  onRedirectToLastReading: function () {
    let that = this
    wx.navigateTo({
      url: '../lastreading/index'
    })
  },

  /**
   * 跳转到收藏页面
   */
  onRedirectToCollection: function () {
    let that = this
    if (that.data.bookCollectionCount == 0) {
      wx.showToast({
        title: '您还没有任何收藏~~',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      wx.navigateTo({
        url: '../collection/index'
      })
    }
  },

  /**
   * 跳转到用户系统信息页面
   */
  onRedirectToMessage: function () {
    let that = this
    wx.navigateTo({
      url: '../message/index'
    })
  },

})