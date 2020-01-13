/**
 * 封装localStorage工具函数库
 */

const localStorage = window.localStorage;

export function getItem(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function setItem(key, value) {
  // 转换成json字符串
  value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}


