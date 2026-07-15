import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiRequestMetadata, CustomAxiosRequestConfig } from '../types';
import { getAxiosInstance } from './axios-setup';

const flattenParams = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
  if (obj instanceof FormData) return obj;
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    const paramKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof File) &&
      !(value instanceof Blob) &&
      !(value instanceof FormData)
    ) {
      Object.assign(acc, flattenParams(value as Record<string, unknown>, paramKey));
    } else {
      acc[paramKey] = value;
    }
    return acc;
  }, {});
};

const formDataOptions = (options: AxiosRequestConfig, isForm: boolean): AxiosRequestConfig => {
  if (!isForm) return options;
  return {
    ...options,
    headers: { ...options.headers, 'Content-Type': undefined },
  };
};

const apiRequest = <T>(
  endpoint: string,
  options: Omit<AxiosRequestConfig, 'url'> = {},
  metadata?: ApiRequestMetadata,
): Promise<AxiosResponse<T>> => {
  const instance = getAxiosInstance();
  const isFormData = options.data instanceof FormData;
  if (!isFormData && options.params) {
    options.params = flattenParams(options.params as Record<string, unknown>);
  }
  const configWithForm = isFormData ? formDataOptions(options, true) : options;
  const requestConfig: CustomAxiosRequestConfig = {
    url: endpoint,
    ...configWithForm,
    metadata: { ...(options as CustomAxiosRequestConfig).metadata, ...metadata },
  };
  return instance.request<T>(requestConfig);
};

const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, unknown>,
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> =>
    apiRequest<T>(endpoint, { ...options, method: 'GET', params }, metadata),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> => {
    const isForm = data instanceof FormData;
    const opts = isForm ? formDataOptions(options, true) : options;
    return apiRequest<T>(endpoint, { ...opts, method: 'POST', data }, metadata);
  },

  put: <T>(
    endpoint: string,
    data?: unknown,
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> => {
    const isForm = data instanceof FormData;
    const opts = isForm ? formDataOptions(options, true) : options;
    return apiRequest<T>(endpoint, { ...opts, method: 'PUT', data }, metadata);
  },

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> => {
    const isForm = data instanceof FormData;
    const opts = isForm ? formDataOptions(options, true) : options;
    return apiRequest<T>(endpoint, { ...opts, method: 'PATCH', data }, metadata);
  },

  delete: <T>(
    endpoint: string,
    params?: Record<string, unknown>,
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'params'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE', params }, metadata),

  formData: <T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST',
    options: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> = {},
    metadata?: ApiRequestMetadata,
  ): Promise<AxiosResponse<T>> =>
    apiRequest<T>(
      endpoint,
      formDataOptions({ ...options, method, data: formData }, true),
      metadata,
    ),

  request: apiRequest,
};

export default api;
