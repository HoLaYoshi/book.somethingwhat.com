import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';
import FormatDate from '../../../utils/date.js';
import ShareHelper from '../../../utils/share.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    showLoadMoreBtn: false,
    curPn: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    //获取用户最近阅读
    that.onLoadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return ShareHelper.DefaultSetting(res)
  },

  /**
   * 加载数据
   */
  onLoadData: function() {
    let that = this
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 30000
    })
    BookReadRecordStore.GetRecentReading(that.data.curPn, 20).then(res => {
        //console.info('res', res)
        res && res.List && res.List.map(function(row, index, array) {
          if (row.Book_Name.length > 6)
            row.Book_Name = row.Book_Name.substring(0, 6) + '..'

          let linkName = row.Chapter_Name || row.Author

          if (linkName.length > 9)
            linkName = linkName.substring(0, 9) + '..'

          row.LinkName = linkName

          row.Create_Time = FormatDate(row.Update_Time || row.Create_Time, 'yyyy.MM.dd')
        })
        //console.info('aaaa', that.data.booklist.concat(...res.List).length, res.Count)
        that.setData({
          booklist: that.data.booklist.concat(...res.List), //[that.data.booklist, ...res.List]
          showLoadMoreBtn: that.data.booklist.concat(...res.List).length < res.Count
        });
        wx.hideToast()
      })
      .catch(res => {
        wx.hideToast()
      })
  },

  /**
   * 加载更多
   */
  onLoadMore: function() {
    let that = this
    that.setData({
      curPn: that.data.curPn + 1
    })
    that.onLoadData()
  },

  /**
   * 跳转到小说介绍页面
   */
  onRedirectToBookIntro: function(e) {
    let that = this
    let id = encodeURIComponent(e.currentTarget.dataset.id)
    let chapterlink = encodeURIComponent(e.currentTarget.dataset.chapterlink)

    // //跳转到书本介绍页
    // wx.navigateTo({
    //   url: '../../book/intro/index?id=' + id
    // })

    //跳转到书本章节阅读页
    wx.navigateTo({
      url: '../../book/chapter/index?id=' + id + '&link=' + chapterlink + '&frompage=lastreading'
    })

  }
})