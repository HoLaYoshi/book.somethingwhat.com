import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 用户消费记录
 */
const BookUserMessageStore = {
  /**
   * 系统信息
   */
  GetMessages: () => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserMessage/GetMessages';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 系统信息（用户未阅读过的）
   */
  GetListByNoRead: () => {
    return new Promise(function (resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserMessage/GetListByNoRead';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 新增用户阅读系统信息记录
   */
  AddReadRecord: (ids) => {
    return new Promise(function (resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookUserMessage/AddReadRecord';
      //参数
      const data = {
        ids: ids
      }
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookUserMessageStore;