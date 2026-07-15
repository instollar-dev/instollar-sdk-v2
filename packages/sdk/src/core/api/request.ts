import type { AxiosResponse } from 'axios';

/** Unwrap axios response — returns the API envelope in `response.data`. */
export async function unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  const response = await promise;
  return response.data;
}
