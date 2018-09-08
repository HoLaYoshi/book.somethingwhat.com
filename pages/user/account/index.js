import Config from '../../../constants/config.js';
import BookUserStore from '../../../stores/BookUserStore.js';
import WXBaseStore from '../../../stores/wxbase.js';
import Ajax from '../../../utils/ajax.js';
import FormatDate from '../../../utils/date.js';
import ShareHelper from '../../../utils/share.js';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserAccountInfo: {
      MM_Currency_Sum: '--',
      MM_Currency_Used: '--',
      MM_Currency_Current: '--',
      MM_Currency_Buy: '--',
      MM_Currency_Give: '--',
      MM_Currency_Current: '--'
    },
    //是否显示模态框
    showModal: false,
    items: [
      { name: '1', value: '1元' },
      { name: '10', value: '10元', checked: 'true' },
      { name: '50', value: '50元' },
      { name: '100', value: '100元' },
    ],
    total_fee: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取用户信息（数据库中）
    BookUserStore.GetUserAccount().then(res => {
      that.setData({ UserAccountInfo: res });
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
   * 展示购买记录
   */
  onShowRecord: function (event) {
    const getBuyRecoredsUrl = Config.Proxy + '/Book/BookUserRecharge/GetRecoreds?RechargeType=2';
    const getGiveRecoredsUrl = Config.Proxy + '/Book/BookUserRecharge/GetRecoreds?RechargeType=1';
    const rechargeType = event.currentTarget.dataset.rechargetype;

    let requestUrl = ''
    let tname = ''
    if (rechargeType == 1) {
      tname = '赠送'
      requestUrl = getGiveRecoredsUrl
    }
    else if (rechargeType == 2) {
      tname = '充值'
      requestUrl = getBuyRecoredsUrl
    }
    //参数
    const data = {}
    //发起请求
    Ajax.get(requestUrl, data).then(res => {
      //resolve(res) 
      let txt = ''
      if (res.length == 0) {
        txt = '无任何记录'
      }
      else {
        if (res.length >= 10) {
          txt += '只显示前十条记录' + '\r\n'
        }
        res.map(function (row, index, array) {
          txt += '[' + row.Remark + ']' + FormatDate(row.Create_Time, 'yyyy.MM.dd') + '，' + tname + row.Recharge_Currency + '喵币' + '\r\n'
        })
      }
      wx.showModal({
        title: tname + '记录',
        content: txt,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      })
    }).catch(msg => {
      console.info(msg)
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      })
    })
  },

  //打开充值
  onOpenRecharge: function () {
    this.setData({ total_fee: 10 })
    this.setData({ showModal: true })
  },

  //取消充值
  onCancelRecharge: function () {
    this.setData({ showModal: false })
  },

  radioChange: function (e) {
    this.setData({ total_fee: e.detail.value })
  },

  /**
   * 确认充值
   */
  onConfrimRecharge: function () {
    let that = this
    const totalFee = that.data.total_fee * 100
    if (totalFee <= 0)
      return

    that.setData({ showModal: false })

    WXBaseStore.PrePay(Config.appid, '喵喵看书-喵币充值', totalFee).then(res => {
      console.info('res', res)
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          console.info('success', res)
          //重新获取用户信息（数据库中）
          BookUserStore.GetUserAccount().then(res => {
            that.setData({ UserAccountInfo: res })
            wx.showToast({
              title: '充值成功',
              icon: 'none',
              duration: 3000
            })
          })
        },
        'fail': function (res) {
          console.info('fail', res)
        },
        'complete': function (res) {
          console.info('complete', res)
        }
      })
    }).catch(res => {
      console.info('res', res)
      wx.showToast({
        title: res,
        icon: 'none',
        duration: 5000
      })
      //下面这个可以注释，即失败不用刷新用户账户余额
      //重新获取用户信息（数据库中）
      BookUserStore.GetUserAccount().then(res => {
        that.setData({ UserAccountInfo: res })
      })
      
    })
  },

})