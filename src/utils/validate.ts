/**
 * 表单验证工具函数
 */

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return reg.test(email)
}

/**
 * 验证手机号
 */
export function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证密码强度（至少包含数字和字母，长度6-20位）
 */
export function validatePassword(password: string): boolean {
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
  return reg.test(password)
}

/**
 * 验证用户名（字母、数字、下划线，4-16位）
 */
export function validateUsername(username: string): boolean {
  const reg = /^[a-zA-Z0-9_]{4,16}$/
  return reg.test(username)
}

/**
 * 验证 URL
 */
export function validateURL(url: string): boolean {
  const reg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return reg.test(url)
}

/**
 * 验证身份证号
 */
export function validateIdCard(idCard: string): boolean {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}
