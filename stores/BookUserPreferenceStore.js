import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 用户偏好
 */
const BookUserPreferenceStore = {
  /**
   * 获取用户偏好
   */
  GetUserPreference: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserPreference/GetUserPreference';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 新增或更新用户偏好
   */
  AddOrUpdateUserPreference: (data) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserPreference/AddOrUpdateUserPreference';
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookUserPreferenceStore;