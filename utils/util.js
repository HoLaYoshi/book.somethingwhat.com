/**
 * 工具类
 */
const Util = {
  //补零
  addPreZero: (num, len) => {
    return ('000000000000000000' + num).slice(-1 * len);
  },
  //isFunction(x)
  isFunction: val => val && typeof val === 'function',
  //将分钟转为 x小时xx分
  convertTime_H_M: val => {
    return Math.floor(val / 60) + '小时' + Util.addPreZero(Math.floor(val % 60), 2) + '分';
  }
};

export default Util;