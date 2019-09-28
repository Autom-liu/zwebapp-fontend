/**
 * 判断是否为纯对象
 * @param {*} obj {}
 */
function isObject(obj) {
  const objClass = toString.call(obj);
  return objClass === '[object Object]';
}

function filterNull(obj) {
  const ret = Object.assign(obj);
  const keys = Object.keys(ret);
  keys.forEach((k) => {
    if (ret[k] === undefined || ret[k] === null) {
      delete ret[k];
    }
  });
  return ret;
}

export default {
  isObject,
  filterNull,
};
