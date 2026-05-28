import request from "@/utils/request";

export function loginByEmail(email, password) {
  return request({
    url: "/api/auth/login/email",
    method: "POST",
    data: {
      email,
      password,
    },
  });
}

export function loginByPhone(phone, password) {
  return request({
    url: "/api/auth/login/phone",
    method: "POST",
    data: {
      phone,
      password,
    },
  });
}

export function loginByEmailCode(email, code) {
  return request({
    url: "/api/auth/login/email/code",
    method: "POST",
    data: {
      email,
      code,
    },
  });
}

export function sendVerifyCode(email) {
  return request({
    url: "/api/auth/login/email/code/send",
    method: "POST",
    data: {
      email,
    },
  });
}

export function getUserInfo(userId) {
  return request({
    url: "/api/user",
    method: "GET",
    params: {
      userId,
    },
  });
}

//修改用户信息
export function updateUserInfo(userInfo) {
  return request({
    url: "/api/user",
    method: "PUT",
    data: userInfo,
  });
}

//注册接口
export function register(data) {
  return request({
    url: "/api/auth/register",
    method: "POST",
    data: data,
  });
}
