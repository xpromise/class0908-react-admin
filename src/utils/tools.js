/**
 * 用来校验表单的用户名和密码
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validator = (rule, value, callback) => {
  /*
    rule.field 获取表单key
    value 获取表单value
  */
  // console.log(rule, value);

  const name = rule.field === 'username' ? '用户名' : '密码';

  const reg = /^\w+$/;

  if (!value) {
    // 输入值为空 --> 代表校验通过
    callback();
  } else if (value.length < 4) {
    callback(`${name}必须大于4位`);
  } else if (value.length > 15) {
    callback(`${name}必须小于15位`);
  } else if (!reg.test(value)) {
    callback(`${name}只能包含英文、数字、下划线`);
  }
  /*
    callback() 调用不传参，代表表单校验成功
    callback(message) 调用传参，代表表单校验失败，会提示message错误
  */
  // 必须要调用，否则会出问题
  callback();
};
