export interface UploadedFileAssetModel {
  fileUrl: string;
  publicId: string;
  result: string;
}

export interface UploadFilesOptions {
  applyWatermark?: boolean;
}

export interface ChatInboxItemModel {
  id: string;
  lastMessage: string;
  lastMessageTime: string;
  otherParticipantId: string;
  otherParticipantName: string;
  avatarUrl?: string | null;
  unreadCount: number;
}

export interface ChatMessageModel {
  id: string;
  senderId: string;
  senderName?: string;
  recipientId?: string;
  receiverId?: string;
  content: string[];
  type: string;
  createdAt: string;
  read: boolean;
}

export interface ChatPaginationParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  sortedBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** @deprecated Use UploadedFileAssetModel */
export type UploadedFileAsset = UploadedFileAssetModel;
