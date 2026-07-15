// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const authDomain: EndpointDomain = {
  "id": "auth",
  "title": "Auth",
  "summary": "Registration, login, OTP, password, 2FA",
  "endpointCount": 12,
  "service": "BASE",
  "sdkExport": "authApi",
  "sections": [
    {
      "title": "General",
      "endpoints": [
        {
          "method": "POST",
          "path": "BASE + /user/register",
          "fn": "authApi.register",
          "response": "ApiResponse<RegisterModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/register",
          "fn": "authApi.register",
          "response": "ApiResponse<RegisterModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/confirm-otp",
          "fn": "authApi.verifyOtp",
          "response": "ApiResponse<VerifyOtpModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/login",
          "fn": "authApi.login",
          "response": "ApiResponse<LoginModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /auth/2fa/login-verify",
          "fn": "authApi.verifyTwoFactorLogin",
          "response": "ApiResponse<LoginModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/send-otp",
          "fn": "authApi.sendOtp",
          "response": "ApiResponse<SendOtpModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "BASE + /user/change-password",
          "fn": "authApi.changePassword",
          "response": "ApiResponse<ChangePasswordModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /auth/2fa/enable",
          "fn": "authApi.enableTwoFactor",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /auth/2fa/disable",
          "fn": "authApi.disableTwoFactor",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /auth/2fa/verify-setup?otp=",
          "fn": "authApi.verifyTwoFactorSetup",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "HEAD",
          "path": "BASE + /user/health",
          "fn": "authApi.pingHealth",
          "response": "boolean",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/guarantor-form",
          "fn": "authApi.submitGuarantorForm",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    }
  ]
} as EndpointDomain;
