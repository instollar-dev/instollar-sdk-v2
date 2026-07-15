export type UserType = 'INSTALLER' | 'COMPANY' | 'SUPER_ADMIN' | 'ADMIN';

export interface RegisterPayload {
  userType: UserType | null;
  firstName: string | null;
  lastName: string | null;
  name?: string | null;
  email: string | null;
  phone: string | null;
  website?: string | null;
  password: string | null;
}

export interface RegisterModel {
  firstName?: string | null;
  lastName?: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: UserType | null;
  website?: string | null;
  token: string | null;
  otp: string | null;
}

export interface VerifyOtpPayload {
  otp: string | null;
}

export interface VerifyOtpModel {
  message?: string | null;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string | null;
  password: string | null;
}

export interface LoginModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  firstName: string;
  role: string | null;
  avatarImageUrl?: string | null;
  lastLogin?: string;
  lastName: string;
  email: string;
  phone: string | null;
  userType: UserType | null;
  website?: string | null;
  level?: string | null;
  note?: string | null;
  reason?: string | null;
  interviewDate?: string | null;
  userStatus: string | null;
  firstTimeLogin: boolean;
  companyType?: string | null;
  token: string | null;
  twoFactorEnabled: boolean;
  twoFactorVerified: boolean;
}

export interface SendOtpPayload {
  email: string | null;
}

export interface SendOtpModel {
  name: string | null;
  email: string | null;
  phone: string | null;
  userType: UserType | null;
  website?: string | null;
  token: string | null;
  otp?: string | null;
}

export interface ChangePasswordPayload {
  password: string | null;
}

export interface ChangePasswordModel {
  message?: string | null;
  [key: string]: unknown;
}

export interface GuarantorFormPayload {
  [key: string]: unknown;
}

/** @deprecated Use RegisterModel */
export type RegisterResponseModel = RegisterModel;
/** @deprecated Use LoginModel */
export type LoginResponseModel = LoginModel;
/** @deprecated Use VerifyOtpModel */
export type VerifyOtpResponse = VerifyOtpModel;
/** @deprecated Use SendOtpModel */
export type SendOtpResponseModel = SendOtpModel;
/** @deprecated Use ChangePasswordModel */
export type ChangePasswordResponse = ChangePasswordModel;
