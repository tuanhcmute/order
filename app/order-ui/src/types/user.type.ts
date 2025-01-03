import { Role } from '@/constants/role'

export interface IUserInfo {
  slug: string
  image?: string
  phonenumber: string
  firstName: string
  lastName: string
  dob: string
  email: string
  address: string
  branch: {
    slug: string
    name: string
    address: string
  }
  role: {
    name: Role
    slug: string
    createdAt: string
    description: string
  }
}

export interface IUserQuery {
  branch?: string
  phonenumber?: string
  page: number | 1
  pageSize: number | 10
  order: 'ASC' | 'DESC'
  hasPaging?: boolean
}

export interface IUpdateProfileRequest {
  firstName: string
  lastName: string
  dob: string
  address: string
  branch: string
}

export interface IUpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface IUpdateUserRoleRequest {
  slug: string
  role: string
}
