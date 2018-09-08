import key from '../../../constants/key.js';
import BookSearchStore from '../../../stores/BookSearchStore.js';
import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.openid,
    searchWord: null,
    isLoading: false,
    //书本分类
    bookCategoryList: null,
    rule: null,
    //书本列表
    bookList: null,
    //最后一页
    isLastPn: false,
    //是否显示填写反馈信息表单
    showFeedback: false
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
    console.info('options', options)
    that.setData({
      searchWord: decodeURIComponent(options.s)
    })
    //获取所有搜索来源分类
    this.GetBookSearchList();
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
   * 搜索
   */
  formSubmit: function(e) {
    let that = this
    let _txt = e.detail.value.s_name.trim();
    if (_txt != '') {
      that.setData({
        searchWord: _txt,
        bookList: null
      })
      that.GetBookList(1);
    }
  },
  confirmEvent: function(e) {
    let that = this
    let _txt = e.detail.value.trim();
    if (_txt != '') {
      that.setData({
        searchWord: _txt,
        bookList: null
      })
      that.GetBookList(1);
    }
  },

  /**
   * 获取所有搜索来源分类
   */
  GetBookSearchList() {
    let that = this
    BookSearchStore.GetBookCategoryList().then(function(res) {
      //console.info('res', res)
      that.setData({
        bookCategoryList: res
      })
      res.forEach((row, index, mapObj) => {
        if (row.Active) {
          that.setData({
            rule: row.Value
          })
        }
      })
      //搜索小说
      that.GetBookList(1);
    })
  },

  /**
   * 搜索小说
   */
  GetBookList(pn) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    })
    let that = this
    BookSearchStore.GetBookList(that.data.searchWord, pn, that.data.rule).then(function(res) {
      //console.info('搜索小说结果', res)
      //更新列表数据
      if (!!res) {
        let _books = that.data.bookList || []
        _books.push(...res)
        that.setData({
          bookList: _books
        })
      }
      //更新状态
      that.setData({
        isLoading: false
      });
      wx.hideToast();
      //判断是否已是最后一页
      if (!res || res.length != 10) {
        that.setData({
          isLastPn: true
        })
      }
      //没有搜索到书本
      if (pn == 1 && res.length == 0) {
        that.setData({
          showFeedback: true
        })
      }
      /*
      //显示成功拉取数据
      if (pn > 1 && !!res) {
        wx.showToast({
          title: '成功拉取数据' + res.length + '条',
          icon: 'success',
          duration: 2000
        })
      }
      */
    })
  },

  /**
   * 按搜索来源搜索
   */
  SearchByRule: function(e) {
    let that = this
    const {
      rule
    } = e.target.dataset
    if (that.data.rule == rule) return;
    that.setData({
      rule: rule,
      bookList: null
    });
    that.GetBookList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.info('onReachBottom')
    let that = this
    if (that.data.isLoading) return;
    if (that.data.isLastPn) return;
    that.setData({
      isLoading: true
    });
    const _pn = that.data.bookList.length / 10 + 1;
    that.GetBookList(_pn);
  },

  /**
   * 跳转到小说介绍页
   */
  onRedirectToIntro(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    })
    let that = this
    const idx = encodeURIComponent(e.currentTarget.dataset.idx)
    const bookObj = that.data.bookList[idx];
    bookObj.Rule = that.data.rule;
    //console.info('bookObj', bookObj, userInfo);
    //新增书本阅读记录
    BookReadRecordStore.Add(bookObj).then(function(res) {
      wx.navigateTo({
        url: '../intro/index?id=' + res.Id
      })
    })
  },

})