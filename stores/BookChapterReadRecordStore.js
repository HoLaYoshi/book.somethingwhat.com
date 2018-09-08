import Ajax from '../utils/ajax.js';
import Config from '../constants/config.js';

/**
 * 书本章节阅读记录
 */
const BookChapterReadRecordStore = {
  /**
   * 更新阅读时长
   */
  UpdateDuration: (id, duration) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookChapterReadRecord/UpdateDuration';
      //参数
      const data = {
        id: id,
        duration: duration
      }
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 新增或更新章节阅读记录
   */
  AddOrUpdateReadingRecord: (id, Chapter_Name, Chapter_Link, Number_Of_Words) => {
    return new Promise(function(resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookChapterReadRecord/AddOrUpdateReadingRecord';
      //参数
      const data = {
        Book_Read_Record_Id: id,
        Chapter_Name: Chapter_Name,
        Chapter_Link: Chapter_Link,
        Number_Of_Words: Number_Of_Words
      }
      //发起请求
      Ajax.post(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
  /**
   * 获取指定用户的总的阅读时长（秒）
   */
  GetDuration: () => {
    return new Promise(function (resolve, reject) {
      //请求地址
      const url = Config.Proxy + '/Book/BookChapterReadRecord/GetDuration';
      //参数
      const data = {}
      //发起请求
      Ajax.get(url, data).then(res => {
        resolve(res)
      }).catch(res => reject(res))
    })
  },
};

export default BookChapterReadRecordStore;