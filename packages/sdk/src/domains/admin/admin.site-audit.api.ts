import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AdminCommercialSiteAuditModel,
  AdminResidentialSiteAuditModel,
  UpdateAdminCommercialAuditPayload,
  UpdateAdminResidentialAuditPayload,
} from './site-audit.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminSiteAuditApi = {
  getCommercialAudit: (auditId: string): Promise<ApiResponse<AdminCommercialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<AdminCommercialSiteAuditModel>>(
        apiUrl('admin', adminPaths.commercialAuditById(auditId)),
        {},
        {},
        silent,
      ),
    ),

  getCommercialAuditByJob: (
    jobRequestId: string,
  ): Promise<ApiResponse<AdminCommercialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<AdminCommercialSiteAuditModel>>(
        apiUrl('admin', adminPaths.commercialAuditByJob(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),

  getResidentialAudit: (auditId: string): Promise<ApiResponse<AdminResidentialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<AdminResidentialSiteAuditModel>>(
        apiUrl('admin', adminPaths.residentialAuditById(auditId)),
        {},
        {},
        silent,
      ),
    ),

  getResidentialAuditByJob: (
    jobRequestId: string,
  ): Promise<ApiResponse<AdminResidentialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<AdminResidentialSiteAuditModel>>(
        apiUrl('admin', adminPaths.residentialAuditByJob(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),

  updateCommercialAudit: (
    auditId: string,
    payload: UpdateAdminCommercialAuditPayload,
  ): Promise<ApiResponse<AdminCommercialSiteAuditModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminCommercialSiteAuditModel>>(
        apiUrl('admin', adminPaths.updateCommercialAudit(auditId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateResidentialAudit: (
    auditId: string,
    payload: UpdateAdminResidentialAuditPayload,
  ): Promise<ApiResponse<AdminResidentialSiteAuditModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminResidentialSiteAuditModel>>(
        apiUrl('admin', adminPaths.updateResidentialAudit(auditId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};
