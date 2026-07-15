import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  CompanyMeshGridProjectModel,
  CreateCompanyMeshGridPayload,
  MeshGridDailyReportModel,
  MeshGridReportCommunityModel,
  MeshGridReportContentModel,
  MeshGridReportLocationModel,
  MeshGridTechnicalDetailModel,
  UpdateCompanyMeshGridPayload,
} from './store-mesh.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyMeshGridApi = {
  createMeshGrid: (
    payload: CreateCompanyMeshGridPayload,
  ): Promise<ApiResponse<CompanyMeshGridProjectModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyMeshGridProjectModel>>(
        apiUrl('company', companyPaths.meshGridCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateMeshGrid: (
    id: string,
    payload: UpdateCompanyMeshGridPayload,
  ): Promise<ApiResponse<CompanyMeshGridProjectModel>> =>
    unwrap(
      api.patch<ApiResponse<CompanyMeshGridProjectModel>>(
        apiUrl('company', companyPaths.meshGridUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getMeshGrids: (): Promise<ApiResponse<CompanyMeshGridProjectModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyMeshGridProjectModel[]>>(
        apiUrl('company', companyPaths.meshGridGetAll),
        {},
        {},
        silent,
      ),
    ),

  getMeshGridById: (id: string): Promise<ApiResponse<CompanyMeshGridProjectModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyMeshGridProjectModel>>(
        apiUrl('company', companyPaths.meshGridSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  deleteMeshGrid: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('company', companyPaths.meshGridDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getReportLocations: (
    jobId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<MeshGridReportLocationModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<MeshGridReportLocationModel>>(
        apiUrl('company', companyPaths.reportLocations(jobId)),
        params,
        {},
        silent,
      ),
    ),

  getLocationCommunities: (
    locationId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<MeshGridReportCommunityModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<MeshGridReportCommunityModel>>(
        apiUrl('company', companyPaths.reportLocationCommunities(locationId)),
        params,
        {},
        silent,
      ),
    ),

  getCommunityDailyReports: (
    communityId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<MeshGridDailyReportModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<MeshGridDailyReportModel>>(
        apiUrl('company', companyPaths.reportCommunityDailyReports(communityId)),
        params,
        {},
        silent,
      ),
    ),

  getTechnicalDetails: (
    reportId: string,
  ): Promise<ApiResponse<MeshGridTechnicalDetailModel>> =>
    unwrap(
      api.get<ApiResponse<MeshGridTechnicalDetailModel>>(
        apiUrl('company', companyPaths.reportTechnicalDetails(reportId)),
        {},
        {},
        silent,
      ),
    ),

  getReportContents: (
    jobId: string,
    reportId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<MeshGridReportContentModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<MeshGridReportContentModel>>(
        apiUrl('company', companyPaths.reportContents(jobId, reportId)),
        params,
        {},
        silent,
      ),
    ),
};
