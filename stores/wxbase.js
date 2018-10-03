// stores/user.js
import Config from '../constants/config.js';
import Key from '../constants/key.js';
import Ajax from '../utils/ajax.js';

const userInfoStorageKey = 'mmbook_storage_userinfo'
const app = getApp()

const WXBaseStore = {
  /**
   * 获取openid
   */
  getOpenid: () => {
    //console.info('getOpenid', app.globalData.appid)
    //step1: 获取code相关信息：调用wx.login
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          console.info('wx.login response', res)

          if (app.globalData.appid == Config.appid) {
            //线上环境应该用这个方法：通过后台接口获取
            //step2: 获取openid相关信息：调用wx.request
            wx.request({
              url: Config.Proxy + '/Book/Wechat/Jscode2session',
              data: {
                appKey: 1, //对应数据库表Wechat_App_Config中的Mark_Key配置值
                js_code: res.code
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                console.info('wx.request response', res)
                if (res.data.errcode) {
                  reject('获取openid失败: ' + res.data.errmsg);
                }

                console.info('res.data', res.data)

                resolve(res.data)
              },
              fail: function(msg) {
                console.info('wx.request fail', msg)
                wx.showToast({
                  title: '获取openid失败' + '，fail:' + JSON.stringify(msg),
                  icon: 'none',
                  duration: 5000
                })
                reject('获取openid失败：' + JSON.stringify(msg))
              }
            })
          } else {
            //实际的线上环境应该用上面的方法，以保证Secret不被外泄。
            //因为这是开源版本的源码所以这里用下面的方法，以便正常获取openid
            //step2: 获取openid相关信息：调用wx.request
            wx.request({
              //url: 'https://api.weixin.qq.com/sns/jscode2session',
              url: Config.Proxy + '/Book/Wechat/Jscode2session_Test',
              data: {
                appid: app.globalData.appid,
                secret: '************************', //这里配置你的小程序secret
                js_code: res.code,
                grant_type: 'authorization_code',
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                console.info('wx.request response', res)
                if (res.data.errcode) {
                  reject('获取openid失败: ' + res.data.errmsg);
                  if (res.data.errcode == 40125) {
                    wx.showModal({
                      title: '提示',
                      content: '请先配置你的小程序secret。全局搜索代码【secret】你就能找到位置了',
                    })
                  }
                }
                resolve(res.data)
              },
              fail: function(msg) {
                console.info('wx.request fail', msg)
                wx.showToast({
                  title: '获取openid失败' + '，fail:' + JSON.stringify(msg),
                  icon: 'none',
                  duration: 5000
                })
                reject('获取openid失败：' + JSON.stringify(msg))
              }
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '获取临时登录凭证失败',
            icon: 'none',
            duration: 5000
          })
          reject('获取临时登录凭证失败')
        }
      })
    })
  },
  /**
   * 获取微信用户基本信息（从本地缓存中）
   */
  getUserInfoCache: () => {
    //console.info('获取微信用户基本信息（从本地缓存中）', Key.storageKey.userinfo)
    let value = wx.getStorageSync(Key.storageKey.userinfo)
    if (value) {
      return value
    } else {
      wx.showToast({
        title: '获取微信用户基本信息失败',
        icon: 'none',
        duration: 5000
      })
    }
  },
  /**
   * 微信预支付
   */
  PrePay: (title, total_fee) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/WechatPay/Prepay';
      //参数
      const data = {
        appid: app.globalData.appid,
        title: title,
        total_fee: total_fee
      }
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default WXBaseStore;