import Key from '../../../constants/key.js';
import WXBaseStore from '../../../stores/wxbase.js';
import BookUserStore from '../../../stores/BookUserStore.js';
import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';
import BookUserMessageStore from '../../../stores/BookUserMessageStore.js';
import FormatDate from '../../../utils/date.js';
import ShareHelper from '../../../utils/share.js';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    animation: '', //启动页的蒙层的动画效果
    booklist: null, //最近阅读
    booklistLoadSuccess: false, //判断“最近阅读”请求是否已完成
    showPreLayer: false, //启动页的蒙层
    newMsgList: [] //新信息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let value = wx.getStorageSync(Key.storageKey.userinfo)
    if (!value) {
      that.setData({
        showPreLayer: true
      })
    } else {
      app.globalData.openid = value.openid;
      //that.init()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.onshowMsg();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    let openid = wx.getStorageSync(Key.storageKey.openid)
    if (openid) {
      //检查openid是否为空（因为有时出现有openid获取到为undefined的情况）
      if (!openid) {
        wx.clearStorageSync()
        wx.showToast({
          title: 'openid获取失败，请退出微信后再进入重试',
          icon: 'none',
          duration: 60000
        })
        // 执行缓存清理
        wx.clearStorageSync()
        return;
      }
      that.init()
    }
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
   * 初始化设置
   */
  init: function() {
    if (this.data.showPreLayer) return;

    let that = this
    const r = WXBaseStore.getUserInfoCache()
    that.setData({
      userInfo: r
    });
    //获取用户最近阅读
    BookReadRecordStore.GetRecentReading(1, 10).then(res => {
      console.info('获取用户最近阅读', res)
      res && res.List && res.List.map(function(row, index, array) {
        if (row.Book_Name.length > 8)
          row.Book_Name = row.Book_Name.substring(0, 8) + '..'

        let linkName = row.Chapter_Name || row.Author

        if (linkName.length > 15)
          linkName = linkName.substring(0, 15) + '..'

        row.LinkName = linkName

        row.Create_Time = FormatDate(row.Update_Time || row.Create_Time, 'yyyy.MM.dd')
      })
      that.setData({
        booklist: res.List,
        booklistLoadSuccess: true
      });
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    let that = this
    let userInfo = e.detail.userInfo
    console.info('获取用户信息', e, userInfo)
    //拒绝授权的情况
    if (!userInfo) {
      return
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
    WXBaseStore.getOpenid().then(data => {
        if (!data.openid) {
          wx.showToast({
            title: 'openid获取失败，请退出微信后再进入重试',
            icon: 'none',
            duration: 60000
          })
          return;
        }

        userInfo.openid = data.openid
        //关闭蒙层
        that.setData({
          showPreLayer: false
        })
        //本地缓存用户信息
        wx.setStorageSync(Key.storageKey.userinfo, userInfo)
        wx.setStorageSync(Key.storageKey.openid, data.openid)
        wx.setStorageSync(Key.storageKey.token, data.token)
        //创建用户（数据库）
        BookUserStore.GetBookUserInfo().then(res => {
          //console.info('已创建成功', Page)
          that.setData({
            animation: 'animation:mymove 1s linear 1;animation-fill-mode:forwards'
          })
          that.init()
          that.onshowMsg()
        })
      })
      .catch(msg => {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 5000
        })
      })
  },

  /**
   * 跳转到用户信息页面
   */
  onRedirectToUserPage: function() {
    wx.navigateTo({
      url: '../../user/home/index'
    })
  },

  /**
   * 跳转到文章页面
   */
  onRedirectToBookChapter: function(e) {
    let id = encodeURIComponent(e.currentTarget.dataset.id)
    let chaptername = encodeURIComponent(e.currentTarget.dataset.chaptername)
    let chapterlink = encodeURIComponent(e.currentTarget.dataset.chapterlink)
    wx.navigateTo({
      url: '../chapter/index?id=' + id + '&link=' + chapterlink
    })
  },

  /**
   * 搜索
   */
  formSubmit: function(e) {
    let _txt = e.detail.value.s_name.trim();
    this.redirectFunc(encodeURIComponent(_txt));
  },
  confirmEvent: function(e) {
    let _txt = e.detail.value.trim();
    this.redirectFunc(encodeURIComponent(_txt));
  },
  //跳转到搜索页
  redirectFunc: function(name) {
    if (name == '') {
      wx.showToast({
        title: '请输入书名或作者名称',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../search/index?s=' + name
      })
    }
  },

  /**
   * 跳转到书城页面
   */
  onRedirectToCityPage: function() {
    wx.showToast({
      title: '功能未开放，敬请期待~',
      icon: 'none',
      duration: 2000
    })
    return
    wx.navigateTo({
      url: '../city/index'
    })
  },

  /**
   * 获取新信息
   */
  onshowMsg: function() {
    if (this.data.showPreLayer) return;

    let that = this
    BookUserMessageStore.GetListByNoRead().then(res => {
      console.info('获取未阅读的信息', res)
      that.setData({
        newMsgList: res || []
      });
    })
  },

  /**
   * 阅读新消息
   */
  onReadMsg: function() {
    let that = this
    let msgArr = new Array();
    let ids = new Array();
    that.data.newMsgList.map(function(row, index, array) {
      msgArr.push(row.Content)
      ids.push(row.Id)
    })
    wx.showModal({
      title: '新信息',
      content: msgArr.join('\r\n'),
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          BookUserMessageStore.AddReadRecord(ids.join(','));
          that.setData({
            newMsgList: []
          })
        }
      }
    })
  },

})