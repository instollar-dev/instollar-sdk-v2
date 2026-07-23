import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { authPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  ChangePasswordModel,
  ChangePasswordPayload,
  GuarantorFormPayload,
  LoginModel,
  LoginPayload,
  RegisterModel,
  RegisterPayload,
  SendOtpModel,
  SendOtpPayload,
  VerifyOtpModel,
  VerifyOtpPayload,
} from './types';

const silent = { showErrorToast: false } as const;

export const authApi = {
  login: (payload: LoginPayload): Promise<ApiResponse<LoginModel>> =>
    unwrap(
      api.post<ApiResponse<LoginModel>>(
        apiUrl('base', authPaths.login),
        {
          email: payload.email?.trim() ?? '',
          password: payload.password ?? '',
        },
        {},
        silent,
      ),
    ),

  register: (payload: RegisterPayload): Promise<ApiResponse<RegisterModel>> =>
    unwrap(
      api.post<ApiResponse<RegisterModel>>(
        apiUrl('base', authPaths.register),
        payload,
        {},
        silent,
      ),
    ),

  verifyOtp: (payload: VerifyOtpPayload): Promise<ApiResponse<VerifyOtpModel>> =>
    unwrap(
      api.post<ApiResponse<VerifyOtpModel>>(
        apiUrl('base', authPaths.confirmOtp),
        { otp: payload.otp ?? '' },
        {},
        silent,
      ),
    ),

  sendOtp: (payload: SendOtpPayload): Promise<ApiResponse<SendOtpModel>> =>
    unwrap(
      api.post<ApiResponse<SendOtpModel>>(
        apiUrl('base', authPaths.sendOtp),
        payload,
        {},
        silent,
      ),
    ),

  changePassword: (payload: ChangePasswordPayload): Promise<ApiResponse<ChangePasswordModel>> =>
    unwrap(
      api.patch<ApiResponse<ChangePasswordModel>>(
        apiUrl('base', authPaths.changePassword),
        payload,
        {},
        silent,
      ),
    ),

  verifyTwoFactorLogin: (
    otp: string,
    accessToken: string,
  ): Promise<ApiResponse<LoginModel>> =>
    unwrap(
      api.post<ApiResponse<LoginModel>>(
        apiUrl('base', authPaths.twoFaLoginVerify),
        { otp },
        { headers: { Authorization: `Bearer ${accessToken}` } },
        silent,
      ),
    ),

  enableTwoFactor: (): Promise<ApiResponse<unknown>> =>
    unwrap(api.post<ApiResponse<unknown>>(apiUrl('base', authPaths.twoFaEnable), {}, {})),

  disableTwoFactor: (): Promise<ApiResponse<unknown>> =>
    unwrap(api.post<ApiResponse<unknown>>(apiUrl('base', authPaths.twoFaDisable), {}, {})),

  verifyTwoFactorSetup: (otp: string): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(apiUrl('base', authPaths.twoFaVerifySetup(otp)), {}, {}, silent),
    ),

  pingHealth: async (): Promise<boolean> => {
    try {
      await api.request(apiUrl('base', authPaths.health), { method: 'HEAD' }, silent);
      return true;
    } catch {
      return false;
    }
  },

  submitGuarantorForm: (payload: GuarantorFormPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', authPaths.guarantorForm),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

/** @deprecated Use authApi */
export const authEndpoints = authApi;
