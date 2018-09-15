import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';
import WXBaseStore from '../stores/wxbase.js';

const app = getApp()
/**
 * 用户信息
 */
const BookUserStore = {
  /**
   * 获取指定openid的数据库用户信息（不存在则创建）
   */
  GetBookUserInfo: () => {
    //console.info('获取指定openid的数据库用户信息（不存在则创建）', app)
    return new Promise(function(resolve, reject) {
      const wxuser = WXBaseStore.getUserInfoCache()
      //请求地址
      const url = Config.Proxy + '/Book/BookUser/GetUserInfo';
      //参数
      const data = {
        Appid: app.globalData.appid,
        Openid: wxuser.openid,
        NickName: wxuser.nickName,
        AvatarUrl: wxuser.avatarUrl,
        Gender: wxuser.gender,
        Country: wxuser.country,
        Province: wxuser.province,
        City: wxuser.city,
        Language: wxuser.language
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取用户账户信息
   */
  GetUserAccount: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUser/GetUserAccount';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookUserStore;