import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export type AuthUserType = 'COMPANY' | 'INSTALLER' | 'ADMIN' | 'SUPER_ADMIN';

export interface TokenData {
  token?: string;
  refreshToken?: string;
  /** Persisted after OTP confirm / login / 2FA (uppercased). Often absent right after register. */
  userType?: AuthUserType | string;
}

export interface RefreshTokenModel {
  token: string;
  refreshToken: string;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationMeta {
  page?: number | null;
  limit?: number | null;
  total?: number | null;
  totalPages?: number | null;
  hasNext?: boolean | null;
  hasPrev?: boolean | null;
  nextPage?: number | null;
  prevPage?: number | null;
  sortOrder?: SortOrder | null;
}

export interface ApiResponse<T> {
  status?: string;
  success?: boolean | null;
  message?: string | null;
  data?: T | null;
  timestamp?: string;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]> | null;
}

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  pagination: PaginationMeta;
};

/** @deprecated Use ApiResponse<T> */
export type GeneralResponseModel<T = unknown> = ApiResponse<T>;

export type ApiService = 'base' | 'admin' | 'company' | 'installer';

export interface InstollarBaseUrls {
  admin?: string;
  company?: string;
  installer?: string;
}

export interface InstollarSDKConfig {
  baseUrl: string;
  baseUrls?: InstollarBaseUrls;
  timeout?: number;
  refreshTokenTimeout?: number;
  onError?: (error: ApiError) => void;
  onAuthError?: () => void;
  onTokenRefreshed?: (tokenData: TokenData) => void;
  defaultHeaders?: Record<string, string>;
  /** Google Places API (New) key for `AddressAutocomplete` when `apiKey` prop is omitted */
  googlePlacesApiKey?: string;
}

export interface ServerError {
  errors?: string | string[] | Record<string, unknown> | unknown[];
  message?: string | null;
  error?: string | null;
}

export interface ApiError {
  message: string;
  metadata?: {
    showErrorToast?: boolean | Partial<ToastOptions>;
  };
  response?: {
    status: number;
    data: ServerError;
  };
  request?: unknown;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default' | 'message';

export interface ToastOptions {
  message?: string;
  title?: string;
  description?: string;
  type?: ToastType;
  autoClose?: number;
  closeOnClick?: boolean;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
}

export interface ApiRequestMetadata {
  showErrorToast?: boolean | Partial<ToastOptions>;
  showSuccessToast?: boolean | string | Partial<ToastOptions>;
  skipRefreshToken?: boolean;
  requestId?: string;
  context?: unknown;
  [key: string]: unknown;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: ApiRequestMetadata;
}

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: ApiRequestMetadata;
}

export type Platform = 'web' | 'mobile';
