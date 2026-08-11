import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { authPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import { normalizePhoneForApi } from '../../utils/phone';
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

function buildRegisterBody(payload: RegisterPayload): Record<string, unknown> {
  const userType = payload.userType ?? 'INSTALLER';
  const body: Record<string, unknown> = {
    userType,
    firstName: payload.firstName?.trim() ?? '',
    lastName: payload.lastName?.trim() ?? '',
    email: payload.email?.trim() ?? '',
    phone: normalizePhoneForApi(payload.phone),
    password: payload.password ?? '',
  };

  if (userType === 'COMPANY') {
    const companyName =
      payload.companyName?.trim() || payload.name?.trim() || '';
    if (companyName) {
      body.companyName = companyName;
      body.name = companyName;
    }
    if (payload.website) {
      body.website = payload.website.trim();
    }
  }

  return body;
}

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
        buildRegisterBody(payload),
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

  /** Prefer `installerApi.submitGuarantorForm` for new code. */
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
