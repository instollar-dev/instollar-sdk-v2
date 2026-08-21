/**
 * Installer job requests double as projects: the same entity is a "job request"
 * while `status` is PENDING/DECLINED and a "project" once `projectStatus` moves
 * to ON_GOING and beyond.
 */

/** `requestType` values a job request can carry. */
export const JOB_REQUEST_TYPES = [
  'energy_audit',
  'installation',
  'maintenance',
  'after_sale_service',
] as const;

export type InstallerJobRequestType = (typeof JOB_REQUEST_TYPES)[number];

/** Decision body for `accept-reject-job` — the API expects REJECT, not DECLINE. */
export type InstallerJobDecision = 'ACCEPT' | 'REJECT';

/** `status` filter for the job request inbox. */
export type InstallerJobRequestStatusFilter = 'PENDING' | 'DECLINED';

/** `status` filter for the projects list. Cancelled is spelled with one L. */
export type InstallerProjectStatusFilter = 'ON_GOING' | 'COMPLETED' | 'CANCELED';

export type InstallerJobListStatusFilter =
  | InstallerJobRequestStatusFilter
  | InstallerProjectStatusFilter;

export interface InstallerJobRequestListParams extends Record<string, unknown> {
  status?: InstallerJobListStatusFilter;
  page?: number;
  limit?: number;
  /** Repeatable — serialized as `requestType=a&requestType=b`. */
  requestType?: InstallerJobRequestType[] | InstallerJobRequestType;
  search?: string;
  sortedBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DecideOnJobRequestPayload extends Record<string, unknown> {
  decision: InstallerJobDecision;
}

export interface InstallerBoqItemModel {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  [key: string]: unknown;
}

export interface UpdateBoqPayload extends Record<string, unknown> {
  items: InstallerBoqItemModel[];
}

export interface UpdateBoqItemsPayload extends Record<string, unknown> {
  items: InstallerBoqItemModel[];
}
