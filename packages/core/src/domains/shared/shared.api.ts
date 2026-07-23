import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { sharedPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, ApiService, PaginatedApiResponse } from '../../core/types';
import type {
  ChatInboxItemModel,
  ChatMessageModel,
  ChatPaginationParams,
  UploadedFileAssetModel,
  UploadFilesOptions,
} from './types';

const chatSilent = { showSuccessToast: false, showErrorToast: false } as const;

export const sharedApi = {
  uploadFiles: (
    formData: FormData,
    options?: UploadFilesOptions,
  ): Promise<ApiResponse<UploadedFileAssetModel[]>> =>
    unwrap(
      api.post<ApiResponse<UploadedFileAssetModel[]>>(
        apiUrl('base', sharedPaths.uploadFile),
        formData,
        { params: { applyWatermark: options?.applyWatermark ?? true } },
      ),
    ),

  getInbox: (
    service: ApiService,
    params?: ChatPaginationParams,
  ): Promise<PaginatedApiResponse<ChatInboxItemModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<ChatInboxItemModel>>(
        apiUrl(service, sharedPaths.chatInbox),
        params,
        {},
        chatSilent,
      ),
    ),

  getHistoryByDirect: (
    service: ApiService,
    threadId: string,
    params?: ChatPaginationParams,
  ): Promise<PaginatedApiResponse<ChatMessageModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<ChatMessageModel>>(
        apiUrl(service, sharedPaths.chatHistoryDirect(threadId)),
        params,
        {},
        chatSilent,
      ),
    ),

  getHistoryByOtherUser: (
    service: ApiService,
    otherUserId: string,
    params?: ChatPaginationParams,
  ): Promise<PaginatedApiResponse<ChatMessageModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<ChatMessageModel>>(
        apiUrl(service, sharedPaths.chatHistoryOtherUser(otherUserId)),
        params,
        {},
        chatSilent,
      ),
    ),

  markChatAsRead: (
    service: ApiService,
    convoId: string,
    isRead = true,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl(service, sharedPaths.chatMarkRead(convoId, isRead)),
        {},
        {},
        chatSilent,
      ),
    ),

  markAllChatAsRead: (
    service: ApiService,
    isRead = true,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl(service, sharedPaths.chatMarkAllRead(isRead)),
        {},
        {},
        chatSilent,
      ),
    ),
};

export const commonEndpoints = {
  uploadFile: sharedApi.uploadFiles,
};
