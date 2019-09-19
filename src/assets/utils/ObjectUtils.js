/**
 * 判断是否为纯对象
 * @param {*} obj {}
 */
function isObject(obj) {
  const objClass = toString.call(obj);
  return objClass === '[object Object]';
}

export default {
  isObject,
};
