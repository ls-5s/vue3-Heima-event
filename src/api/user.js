import request from '@/utils/request.js'
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword
  })
}
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', {
    username,
    password
  })
}
// 获取用户的基本信息
export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}
export const userUpdateInfoService = (data) => {
  return request.put('/my/userinfo', data)
}
export const userUpdatePasswordService = (data) => {
  return request.patch('/my/updatepwd', data)
}
// // 更新用户密码
// export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
//   request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
export const userUpdateAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', { avatar })
}
