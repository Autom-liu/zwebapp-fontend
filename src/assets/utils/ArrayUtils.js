
/**
 * 初始化一个长度的数组
 * @param {*} value v
 * @param {*} length len
 */
function fill(value, length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(value);
  }
  return arr;
}

function set(arr, index, value) {
  if (index >= 0 && index < arr.length) {
    arr[index] = value;
  }
}

export default {
  fill,
  set,
};
