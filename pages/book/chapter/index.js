import BookSearchStore from '../../../stores/BookSearchStore.js';
import BookReadRecordStore from '../../../stores/BookReadRecordStore.js';
import BookChapterReadRecordStore from '../../../stores/BookChapterReadRecordStore.js';
import BookUserPreferenceStore from '../../../stores/BookUserPreferenceStore.js';
import BookUserConsumeStore from '../../../stores/BookUserConsumeStore.js';
import key from '../../../constants/key.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //openid: app.globalData.openid,
    bookInfo: null, //当前章节的书本章节信息
    bookInfoByNext: null, //下一章的书本章节信息
    id: null, //当前书本id
    chapterid: null, //当前章节id
    link: null, //当前章节link
    frompage: '', //从哪个页面跳转过来的
    isLoadSuccess: false,
    scrollTop: 0, //设置竖向滚动条位置
    scrollTopByScrolling: 0, //滚动条滚动结束后的 滚动条位置
    windowHeight: 0,
    lastScrollTime: null, //最近一次滚动页面的时间
    showSetting: false, //是否显示个人设置
    showModal: false, //是否显示模态框
    alreadyCollected: null, //是否已收藏
    //背景色选项
    iconBgColor: [
      '#000', '#666', '#EAEAEF', '#fff', '#FAF9DE', '#FFF2E2', '#FDE6E0', '#E3EDCD', '#DCE2F1', '#E9EBFE'
    ],
    //字体色选项
    iconFontColor: [
      '#000', '#666', '#EAEAEF', '#fff', '#FAF9DE', '#FFF2E2', '#FDE6E0', '#E3EDCD', '#DCE2F1', '#E9EBFE'
    ],
    dayOrNight: 'daytime', //日夜模式切换
    curScreenBrightness: -1, //屏幕亮度
    curKeepScreenOn: false, //是否屏幕常亮
    curBackgroundColor: 'none', //当前背景色
    curFontSize: 20, //当前文字大小
    curFontColor: 'none', //当前字体色
    curFontFamily: 'none', //当前字体
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
    let _link = decodeURIComponent(options.link);

    // options.id = '5294623382438491932'
    // _link = 'http://spider.somethingwhat.com//Book/LiteratureForeign/GetContent?id=5087211918420273606'
    // console.info('options.id', options.id, _link, options.frompage)

    that.setData({
      id: options.id,
      link: _link,
      frompage: options.frompage || ''
    })
    //获取小说内容
    this.GetBookContent(_link);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    });
    //偏好设置初始化
    that.onInitSetting();
    //创建一个计时器，用来做“上传阅读时长”的相关业务
    that.createTaskByReadDuration();
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
  onShareAppMessage: function() {
    return ShareHelper.DefaultSetting(res)
  },

  /**
   * 获取小说内容
   */
  GetBookContent: function(link) {
    let that = this
    let p1 = new Promise(function(resolve, reject) {
      if (that.data.bookInfoByNext != null && that.data.bookInfoByNext.ChapterLink == link) {
        console.info('（已加载）获取小说内容', that.data.bookInfoByNext)
        resolve(that.data.bookInfoByNext)
      } else {
        BookSearchStore.GetBookContent(that.data.id, link).then(function(res) {
          console.info('远程地址请求获取小说内容', res)
          resolve(res)
        })
      }
    });
    p1.then(res => {
      that.setData({
        bookInfo: res,
        scrollTop: 0,
        isLoadSuccess: true
      })
      // //返回顶部
      // setTimeout(function() {
      //   that.setData({
      //     scrollTop: 0
      //   })
      // }, 800)
      //设置标题
      wx.setNavigationBarTitle({
        title: res.ChapterName
      })
      wx.hideToast();
      //新增或更新章节阅读记录 和 扣费 操作
      that.onAddReadingRecord()
      //加载下一章
      that.GetBookContentByNextChapter();
    });
  },
  /**
   * 获取小说内容(下一章)
   */
  setTimeoutSign: undefined,
  GetBookContentByNextChapter: function() {
    let that = this
    if (that.setTimeoutSign) {
      clearTimeout(that.setTimeoutSign)
      //console.info('清除了setTimeoutSign', that.setTimeoutSign)
    }
    that.setTimeoutSign = setTimeout(function() {
      if (that.data.bookInfo.NextChapterLink && that.data.bookInfo.ChapterLink != that.data.bookInfo.NextChapterLink) {
        //console.info('开始自动加载下一章', that.data.bookInfo.ChapterLink, that.data.bookInfo.NextChapterLink)
        BookSearchStore.GetBookContent(that.data.id, that.data.bookInfo.NextChapterLink).then(res => {
          // that.bookInfoByNext = {
          //   curChaprerLink: that.data.bookInfo.NextChapterLink,
          //   //nextChapterLink: that.data.bookInfo.NextChapterLink,
          //   nextBookInfo: res
          // }
          that.setData({
            bookInfoByNext: res
          })
          //console.info('成功加载下一章', res)
        })
      }
    }, 1000 * 5)
  },
  /**
   * 新增或更新章节阅读记录 和 扣费 操作
   */
  onAddReadingRecord: function() {
    let that = this
    let _bookInfo = that.data.bookInfo
    //新增或更新章节阅读记录
    BookChapterReadRecordStore.AddOrUpdateReadingRecord(that.data.id, _bookInfo.ChapterName, _bookInfo.ChapterLink, _bookInfo.Number_Of_Words)
      .then(res => {
        //console.info('新增或更新章节阅读记录', res)
        that.setData({
          chapterid: res.Id
        })
        if (res.Flag == 'add') {
          //扣费
          if (_bookInfo.Number_Of_Words > 100) {
            const Remark = '【' + _bookInfo.BookName + '】' + _bookInfo.ChapterName
            //console.info('扣费', that.data.chapterid, Remark)
            BookUserConsumeStore.AddByReading(that.data.chapterid, Remark).then(res => {
              console.info('扣费成功', res)
            })
          }
        }
      })
  },
  /**
   * 上一章
   */
  bindPrevTap(e) {
    let that = this
    let prevChapterLink = e.currentTarget.dataset.link;
    if (!prevChapterLink || prevChapterLink == this.data.bookInfo.ChapterLink) {
      wx.showToast({
        title: '前面没有啦~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    })
    this.GetBookContent(prevChapterLink);
  },
  /**
   * 下一章
   */
  bindNextTap(e) {
    let that = this
    let nextChapterLink = e.currentTarget.dataset.link;
    if (!nextChapterLink || nextChapterLink == that.data.bookInfo.ChapterLink) {
      wx.showToast({
        title: '后面没有啦~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    })
    that.GetBookContent(nextChapterLink);
  },
  /**
   * 目录
   */
  bindChapterTap(e) {
    let that = this
    if (this.data.frompage == 'intro') {
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.redirectTo({
        url: '../intro/index?id=' + that.data.id
      })
    }
  },
  /**
   * 翻页
   */
  bindScrollTap: function(e) {
    //console.info('bindScrollTap', e);
    let that = this
    let clientY = e.touches[0].clientY;
    if (clientY < this.data.windowHeight / 3) {
      //上
      this.setData({
        scrollTop: this.data.scrollTopByScrolling - this.data.windowHeight,
      })
    } else if (clientY > this.data.windowHeight / 3 && clientY < this.data.windowHeight / 3 * 2) {
      //中
      this.setData({
        showSetting: !this.data.showSetting
      })
      that.setData({
        AlreadyCollected: that.data.bookInfo.AlreadyCollected == true
      })
    } else {
      //下
      this.setData({
        scrollTop: this.data.scrollTopByScrolling + this.data.windowHeight
      })
    }
  },
  /**
   * scroll滚动时触发
   */
  scrollHandler: function(e) {
    //console.info('scroll滚动时触发', e)
    this.setData({
      lastScrollTime: new Date(),
      //scrollTop: e.detail.scrollTop
      scrollTopByScrolling: e.detail.scrollTop
    })
  },
  /**
   * 添加到收藏
   */
  onCollectionCheckboxChange: function(e) {
    let that = this
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      duration: 30000
    })
    //this.setData({ showSetting: false })
    //设置选中或取消
    const curCollectionState = !this.data.alreadyCollected
    that.setData({
      alreadyCollected: curCollectionState
    })
    //收藏
    BookReadRecordStore.UpdateCollectedState(that.data.id, curCollectionState).then(res => {
      wx.showToast({
        title: curCollectionState ? '已收藏，可到个人中心查看收藏列表' : '取消收藏成功',
        icon: 'none',
        duration: 3000
      })
    })
  },
  /**
   * 打开字体&背景设置
   */
  onshowFontSetting: function() {
    this.setData({
      showModal: true,
      showSetting: false
    })
  },

  //////////////////////////////////// 偏好设置 start ////////////////////////////////////
  /**
   * 日夜模式切换
   */
  switchDayNightChange: function(e) {
    const val = e.detail.value ? 'nighttime' : 'daytime'
    if (val == 'daytime') {
      this.setData({
        curBackgroundColor: '#fff',
        curFontColor: '#000',
        dayOrNight: val
      })
    } else {
      this.setData({
        curBackgroundColor: '#000',
        curFontColor: '#fff',
        dayOrNight: val
      })
    }
  },
  /**
   * 屏幕常亮
   */
  switchKeepScreenOnChange: function(e) {
    const val = e.detail.value
    this.setData({
      curKeepScreenOn: val
    })
    wx.setKeepScreenOn({
      keepScreenOn: val
    })
  },
  /**
   * 字体大小
   */
  sliderFontSizechange: function(e) {
    const val = e.detail.value
    this.setData({
      curFontSize: val
    })
  },
  sliderFontSizechanging: function(e) {
    const val = e.detail.value
    this.setData({
      curFontSize: val
    })
  },
  /**
   * 背景色
   */
  onbackgroundChange: function(e) {
    const val = e.currentTarget.dataset.color
    this.setData({
      curBackgroundColor: val
    })
    this.onChangeNavigationBar()
  },
  /**
   * 字体色
   */
  onFontColorChange: function(e) {
    const val = e.currentTarget.dataset.color
    this.setData({
      curFontColor: val
    })
  },
  /**
   * 字体
   */
  onFontFamilyChange: function(e) {
    const val = e.currentTarget.dataset.fontfamily
    this.setData({
      curFontFamily: val
    })
  },
  /**
   * 调整屏幕亮度
   */
  onScreenBrightnessChange: function(e) {
    const val = e.detail.value
    this.setData({
      curScreenBrightness: val
    })
    wx.setScreenBrightness({
      value: val / 10
    })
  },
  sliderScreenBrightnessChanging: function(e) {
    const val = e.detail.value
    this.setData({
      curScreenBrightness: val
    })
    wx.setScreenBrightness({
      value: val / 10
    })
  },
  /**
   * 动态设置导航栏样式
   */
  onChangeNavigationBar: function() {
    const bgColor = this.data.curBackgroundColor
    const isBlack = (bgColor == '#000') ? false : true
    wx.setNavigationBarColor({
      frontColor: isBlack ? '#000000' : '#ffffff', //微信仅支持 #ffffff 和 #000000
      backgroundColor: bgColor
    })
  },
  /**
   * 初始化偏好设置
   */
  onInitSetting: function() {
    let that = this
    try {
      //let res = {}
      return new Promise(function(resolve, reject) {
        let r = wx.getStorageSync(key.storageKey.userpreference)
        if (r) {
          //console.info('缓存中取偏好设置', r)
          resolve(r)
        } else {
          BookUserPreferenceStore.GetUserPreference().then(res => {
            //console.info('初始化偏好设置', res)
            resolve(res)
            //本地存储
            wx.setStorage({
              key: key.storageKey.userpreference,
              data: res
            })
          })
        }
      }).then(res => {
        //console.info('初始化偏好设置', res)
        if (res) {
          const {
            FontSize,
            FontColor,
            FontFamily,
            BackgroundColor,
            ScreenBrightness,
            KeepScreenOn
          } = res
          that.setData({
            curFontSize: FontSize,
            curFontColor: FontColor,
            curFontFamily: FontFamily,
            curBackgroundColor: BackgroundColor
          })
          that.onInitSetting2(ScreenBrightness, KeepScreenOn)
        } else {
          that.onInitSetting2(-1, false)
        }
        that.onChangeNavigationBar()
      })
    } catch (e) {
      wx.showToast({
        title: '初始化偏好设置失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //初始化屏幕亮度和屏幕常亮
  onInitSetting2: function(ScreenBrightness, KeepScreenOn) {
    let that = this
    //console.info('初始化屏幕亮度和屏幕常亮', ScreenBrightness, KeepScreenOn)
    /*
    //获取设置屏幕亮度的值
    if (ScreenBrightness >= 0) {
      wx.setScreenBrightness({
        value: ScreenBrightness / 10,
        success: function () {
          that.setData({ curScreenBrightness: ScreenBrightness })
        }
      })
    }
    else {
      wx.getScreenBrightness({
        success: function (res) {
          that.setData({ curScreenBrightness: parseInt(res.value * 10) })
        }
      })
    }
    */
    //设置屏幕常亮
    let isKeep = KeepScreenOn == true
    //if (KeepScreenOn != null) {
    wx.setKeepScreenOn({
      keepScreenOn: isKeep,
      success: function() {
        that.setData({
          curKeepScreenOn: isKeep
        })
      }
    })
    //}
  },
  /**
   * 取消偏好设置
   */
  onCancelSetting: function() {
    let that = this
    that.setData({
      showModal: false
    })
    that.onInitSetting()
    //that.onInitSetting2(-1, false)
  },
  /**
   * 确定保存设置
   */
  onSaveSetting: function() {
    let that = this
    wx.showToast({
      title: '正在保存...',
      icon: 'loading',
      duration: 30000
    })
    //console.info('that.data.userInfo', that.data.userInfo)
    const data = {
      FontSize: that.data.curFontSize,
      BackgroundColor: that.data.curBackgroundColor,
      FontColor: that.data.curFontColor,
      FontFamily: that.data.curFontFamily,
      ScreenBrightness: that.data.curScreenBrightness,
      KeepScreenOn: that.data.curKeepScreenOn,
    }
    //保存用户偏好
    BookUserPreferenceStore.AddOrUpdateUserPreference(data).then(res => {
      that.setData({
        showModal: false
      })
      wx.showToast({
        title: '设置成功',
        icon: 'none',
        duration: 2000
      })
      //本地存储
      wx.setStorage({
        key: key.storageKey.userpreference,
        data: data
      })
    }).catch(msg => {
      wx.hideToast()
    })
  },
  //////////////////////////////////// 偏好设置 end ////////////////////////////////////

  //////////////////////////////////// 上传阅读时长 start ////////////////////////////////////
  //相关业务：用户每分钟将上传阅读时长，上传前判断用户是否有滚动页面，如有则上传，无就不上传
  uploadTimeInterval: 60, //上传阅读时长的时间间隔
  //新建一个计时器
  createTaskByReadDuration: function() {
    let that = this
    setInterval(function() {
      //上次滚动时间和当前时间的间隔<=60秒，就上传阅读时长
      let curTime = new Date()
      //console.info('计时器', curTime, that.data.lastScrollTime)
      if ((curTime - that.data.lastScrollTime) / 1000 <= that.uploadTimeInterval) {
        that.uploadReadTimes()
      }
    }, 1000 * that.uploadTimeInterval)
  },
  //上传阅读时长
  uploadReadTimes: function() {
    //console.info('上传阅读时长', this.data.chapterid, this.uploadTimeInterval)
    if (this.data.chapterid)
      BookChapterReadRecordStore.UpdateDuration(this.data.chapterid, this.uploadTimeInterval);
  },
  //////////////////////////////////// 上传阅读时长 end ////////////////////////////////////



})