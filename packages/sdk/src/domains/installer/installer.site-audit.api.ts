import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CommercialSiteAuditModel,
  ResidentialSiteAuditModel,
  SubmitCommercialSiteAuditPayload,
  SubmitResidentialSiteAuditPayload,
  UpdateCommercialSiteAuditPayload,
  UpdateResidentialSiteAuditPayload,
} from './site-audit.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerSiteAuditApi = {
  getCommercialSiteAuditByJob: (
    jobRequestId: string,
  ): Promise<ApiResponse<CommercialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<CommercialSiteAuditModel>>(
        apiUrl('installer', installerPaths.commercialSiteAuditByJob(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),

  submitCommercialSiteAudit: (
    payload: SubmitCommercialSiteAuditPayload,
  ): Promise<ApiResponse<CommercialSiteAuditModel>> =>
    unwrap(
      api.post<ApiResponse<CommercialSiteAuditModel>>(
        apiUrl('installer', installerPaths.commercialSiteAuditSubmit),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateCommercialSiteAudit: (
    auditId: string,
    payload: UpdateCommercialSiteAuditPayload,
  ): Promise<ApiResponse<CommercialSiteAuditModel>> =>
    unwrap(
      api.post<ApiResponse<CommercialSiteAuditModel>>(
        apiUrl('installer', installerPaths.commercialSiteAuditUpdate(auditId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getResidentialSiteAuditByJob: (
    jobRequestId: string,
  ): Promise<ApiResponse<ResidentialSiteAuditModel>> =>
    unwrap(
      api.get<ApiResponse<ResidentialSiteAuditModel>>(
        apiUrl('installer', installerPaths.residentialSiteAuditByJob(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),

  submitResidentialSiteAudit: (
    payload: SubmitResidentialSiteAuditPayload,
  ): Promise<ApiResponse<ResidentialSiteAuditModel>> =>
    unwrap(
      api.post<ApiResponse<ResidentialSiteAuditModel>>(
        apiUrl('installer', installerPaths.residentialSiteAuditSubmit),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateResidentialSiteAudit: (
    auditId: string,
    payload: UpdateResidentialSiteAuditPayload,
  ): Promise<ApiResponse<ResidentialSiteAuditModel>> =>
    unwrap(
      api.post<ApiResponse<ResidentialSiteAuditModel>>(
        apiUrl('installer', installerPaths.residentialSiteAuditUpdate(auditId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};
