// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const sharedDomain: EndpointDomain = {
  "id": "shared",
  "title": "Shared",
  "summary": "Upload and chat (role-aware base)",
  "endpointCount": 7,
  "service": "mixed",
  "sdkExport": "sharedApi",
  "sections": [
    {
      "title": "General",
      "endpoints": [
        {
          "method": "POST",
          "path": "BASE + /file/upload",
          "fn": "sharedApi.uploadFiles",
          "response": "ApiResponse<UploadedFileAssetModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /file/upload",
          "fn": "sharedApi.uploadFiles",
          "response": "ApiResponse<UploadedFileAssetModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "{roleBase} + /chat/inbox",
          "fn": "sharedApi.getInbox",
          "response": "PaginatedApiResponse<ChatInboxItemModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "{roleBase} + /chat/history/direct/:threadId",
          "fn": "sharedApi.getHistoryByDirect",
          "response": "PaginatedApiResponse<ChatMessageModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "{roleBase} + /chat/history/other-user/:otherUserId",
          "fn": "sharedApi.getHistoryByOtherUser",
          "response": "PaginatedApiResponse<ChatMessageModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "{roleBase} + /chat/status/:convoId?isRead=",
          "fn": "sharedApi.markChatAsRead",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "{roleBase} + /chat/status/all?isRead=",
          "fn": "sharedApi.markAllChatAsRead",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    }
  ]
} as EndpointDomain;
