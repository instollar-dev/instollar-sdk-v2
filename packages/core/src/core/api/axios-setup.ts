import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getFromStorage, saveToStorage, StorageKeys } from '../storage';
import { isMobile } from '../storage/platform-detection';
import { toast } from '../toast';
import type {
  ApiError,
  ApiResponse,
  CustomInternalAxiosRequestConfig,
  InstollarSDKConfig,
  RefreshTokenModel,
  ServerError,
  TokenData,
  ToastOptions,
} from '../types';
import { refreshTokenEndpoint } from './api-endpoints';

let sdkConfig: InstollarSDKConfig | null = null;
let axiosInstance: AxiosInstance | null = null;
let refreshAxiosInstance: AxiosInstance | null = null;
let isRefreshing = false;
const pending: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: CustomInternalAxiosRequestConfig;
}> = [];

const removeEmpty = (obj: unknown): unknown => {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(removeEmpty).filter((x) => x != null && x !== '');
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== '')
      .map(([key, value]) => [key, typeof value === 'object' ? removeEmpty(value) : value]),
  );
};

const extractMessageFromUnknown = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractMessageFromUnknown(item);
      if (message) return message;
    }
    return null;
  }

  if (typeof value === 'object') {
    for (const nestedValue of Object.values(value as Record<string, unknown>)) {
      const message = extractMessageFromUnknown(nestedValue);
      if (message) return message;
    }
  }

  return null;
};

const getServerMessage = (error: AxiosError<ServerError>): string | null => {
  const data = error.response?.data;
  if (!data) return null;
  const errorsMessage = extractMessageFromUnknown(data.errors);
  if (errorsMessage) return errorsMessage;
  return extractMessageFromUnknown(data.message);
};

const getErrorMessage = (error: AxiosError<ServerError>): string => {
  if (error.response) {
    const statusMessages: Record<number, string> = {
      400: 'Bad request. Please try again.',
      401: 'Unauthorized. Please sign in again.',
      403: 'Access denied.',
      404: 'Not found.',
      429: 'Too many requests. Try again later.',
      500: 'Server error. Try again later.',
      502: 'Service temporarily unavailable.',
      504: 'Request timed out.',
    };
    const server = getServerMessage(error);
    const status = error.response.status;
    return server ?? statusMessages[status] ?? 'Something went wrong. Please try again.';
  }
  if (error.request) return 'No response from server. Please try again.';
  return error.message || 'Something went wrong. Please try again.';
};

const createCleanError = (error: AxiosError<ServerError>, message: string): ApiError => {
  const out = error as unknown as ApiError;
  out.message = message;
  if (isMobile()) {
    try {
      (out as Error).stack = undefined;
    } catch {
      /* no-op */
    }
  }
  return out;
};

const triggerRefresh = async (): Promise<string | null | undefined> => {
  const config = getSDKConfig();
  const tokenData = await getFromStorage<TokenData>(StorageKeys.TOKEN_DATA);
  if (!tokenData?.refreshToken) throw new Error('Please sign in again.');
  const res = await refreshAxiosInstance!.post<ApiResponse<RefreshTokenModel>>(
    refreshTokenEndpoint,
    { refreshToken: tokenData.refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.token}`,
      },
    },
  );
  const newData: TokenData = {
    token: res.data.data?.token,
    refreshToken: res.data.data?.refreshToken,
  };
  await saveToStorage(StorageKeys.TOKEN_DATA, newData);
  config.onTokenRefreshed?.(newData);
  return newData.token;
};

const flushPending = (newToken: string | null | undefined): void => {
  const instance = getAxiosInstance();
  pending.forEach(({ resolve, reject, config }) => {
    config.headers.Authorization = `Bearer ${newToken}`;
    instance.request(config).then(resolve).catch(reject);
  });
  pending.length = 0;
};

export const initAxios = (config: InstollarSDKConfig): void => {
  sdkConfig = config;
  axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout ?? 30000,
    headers: config.defaultHeaders,
  });
  refreshAxiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.refreshTokenTimeout ?? 20000,
  });

  axiosInstance.interceptors.request.use(
    async (cfg: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const requestConfig = cfg as CustomInternalAxiosRequestConfig;
      const tokenData = await getFromStorage<TokenData>(StorageKeys.TOKEN_DATA);
      if (tokenData?.token) requestConfig.headers.Authorization = `Bearer ${tokenData.token}`;
      if (!requestConfig.metadata) requestConfig.metadata = {};
      if (requestConfig.metadata.showErrorToast === undefined) {
        requestConfig.metadata.showErrorToast = true;
      }
      if (requestConfig.data && !(requestConfig.data instanceof FormData)) {
        requestConfig.data = removeEmpty(requestConfig.data) as typeof requestConfig.data;
      }
      if (requestConfig.params) {
        requestConfig.params = removeEmpty(requestConfig.params) as typeof requestConfig.params;
      }
      return requestConfig;
    },
    (err) => Promise.reject(err),
  );

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      const requestConfig = res.config as CustomInternalAxiosRequestConfig;
      const metadata = requestConfig.metadata;
      if (metadata?.showSuccessToast) {
        const isObj = typeof metadata.showSuccessToast === 'object';
        const method = requestConfig.method?.toUpperCase();

        let defaultTitle = 'Success';
        if (method === 'POST') defaultTitle = 'Action Successful';
        if (method === 'PUT' || method === 'PATCH') defaultTitle = 'Update Successful';
        if (method === 'DELETE') defaultTitle = 'Deletion Successful';

        const toastOpts = isObj ? (metadata.showSuccessToast as Partial<ToastOptions>) : {};
        const title = toastOpts.title || defaultTitle;
        const description =
          toastOpts.description || toastOpts.message || (res.data as { message?: string })?.message;

        toast.success(description ?? title, { ...toastOpts, title });
      }
      return res;
    },
    async (error: AxiosError<ServerError>) => {
      const config = getSDKConfig();
      const original = error.config as CustomInternalAxiosRequestConfig | undefined;
      const metadata = original?.metadata;
      const url = (error.request?.responseURL ?? original?.url ?? '') as string;
      const skipRefresh =
        [refreshTokenEndpoint].some((route) => url.includes(route)) ||
        metadata?.skipRefreshToken ||
        !original;

      if (error.response?.status === 401 && !skipRefresh) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await triggerRefresh();
            isRefreshing = false;
            flushPending(newToken);
            original!.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance!.request(original!);
          } catch (refreshErr) {
            isRefreshing = false;
            pending.forEach(({ reject }) => reject(refreshErr));
            pending.length = 0;
            config.onAuthError?.();
            return Promise.reject(refreshErr);
          }
        }
        return new Promise((resolve, reject) => {
          pending.push({ resolve, reject, config: original! });
        });
      }

      if (error.response?.status === 401) config.onAuthError?.();

      const message = getErrorMessage(error);
      const cleanError = createCleanError(error, message);

      if (metadata?.showErrorToast !== false) {
        const isObj = typeof metadata?.showErrorToast === 'object';
        const toastOpts = isObj ? (metadata.showErrorToast as Partial<ToastOptions>) : {};
        const errorData = error.response?.data;
        const title = toastOpts.title || errorData?.error || 'Error';
        const description = toastOpts.description || toastOpts.message || cleanError.message;

        toast.error(description, { ...toastOpts, title });
        config.onError?.(cleanError);
      }

      return Promise.reject(cleanError);
    },
  );
};

export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    throw new Error('[instollar-sdk] API not initialized. Call initAxios(config) first.');
  }
  return axiosInstance;
};

export const getSDKConfig = (): InstollarSDKConfig => {
  if (!sdkConfig) {
    throw new Error('[instollar-sdk] SDK not initialized. Call initAxios(config) first.');
  }
  return sdkConfig;
};

export type { CustomAxiosRequestConfig, CustomInternalAxiosRequestConfig } from '../types';
