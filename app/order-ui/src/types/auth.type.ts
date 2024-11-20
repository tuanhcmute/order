export interface ILoginRequest {
  phonenumber: string
  password: string
}

export interface ILoginResponse {
  message: string
  result: {
    accessToken: string
    expireTime: string
    refreshToken: string
    expireTimeRefreshToken: string
  }
  method: string
  status: number
  timestamp: string
}

export interface IRegisterRequest {
  phonenumber: string
  password: string
  firstName: string
  lastName: string
}

export interface IRefreshTokenResponse {
  expireTime: string
  expireTimeRefreshToken: string
  token: string
  refreshToken: string
}
