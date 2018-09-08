import BookSearchStore from '../../../stores/BookSearchStore.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: null,
    id: null,
    curSort: 'asc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    })
    //options.id = '5174390956699951757';
    console.info('options', options)
    that.setData({
      id: options.id
    })
    //获取小说目录信息
    this.GetBookChapter();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onShareAppMessage: function() {
    return ShareHelper.DefaultSetting(res)
  },

  /**
   * 小说目录信息
   */
  GetBookChapter: function() {
    let that = this
    BookSearchStore.GetBookChapter(that.data.id).then(function(res) {
      that.setData({
        bookInfo: res
      })
      setTimeout(function() {
        wx.hideToast();
      }, 1000 * 1);
    })
  },

  /**
   * 跳转到小说章节内容页
   */
  onRedirectToChapter(e) {
    let that = this
    const _link = e.currentTarget.dataset.chapterlink
    wx.navigateTo({
      url: '../chapter/index?id=' + that.data.id + '&link=' + encodeURIComponent(_link) + '&frompage=intro'
    })
  },

  /**
   * 章节正序/倒序
   */
  changeChaptersSort: function(e) {
    let that = this
    const _sort = e.currentTarget.dataset.sort
    if (that.data.curSort != _sort) {
      that.data.bookInfo.Chapterlist.reverse();
      that.setData({
        bookInfo: that.data.bookInfo,
        curSort: _sort
      });
    }
  }

})