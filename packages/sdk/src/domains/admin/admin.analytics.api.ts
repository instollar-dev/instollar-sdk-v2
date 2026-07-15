import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths, basePaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AnalyticsOverviewModel,
  CompanyJobStatsModel,
  DashboardMetricsModel,
  DemographicsModel,
  GenerateReportModel,
  GenerateReportPayload,
  InstallerJobRateTrendModel,
  LocationStatsModel,
  PayoutDistributionModel,
  ProjectDetailModel,
  ProjectItemModel,
  QADashboardDataModel,
  RegistrationsModel,
} from './analytics.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminAnalyticsApi = {
  getDashboardMetrics: (): Promise<ApiResponse<DashboardMetricsModel>> =>
    unwrap(
      api.get<ApiResponse<DashboardMetricsModel>>(
        apiUrl('admin', adminPaths.dashboardMetrics),
        {},
        {},
        silent,
      ),
    ),

  getAnalyticsOverview: (): Promise<ApiResponse<AnalyticsOverviewModel>> =>
    unwrap(
      api.get<ApiResponse<AnalyticsOverviewModel>>(
        apiUrl('admin', adminPaths.dashboardOverview),
        {},
        {},
        silent,
      ),
    ),

  getPayoutDistribution: (): Promise<ApiResponse<PayoutDistributionModel>> =>
    unwrap(
      api.get<ApiResponse<PayoutDistributionModel>>(
        apiUrl('admin', adminPaths.dashboardPayoutDistribution),
        {},
        {},
        silent,
      ),
    ),

  getDemographics: (): Promise<ApiResponse<DemographicsModel>> =>
    unwrap(
      api.get<ApiResponse<DemographicsModel>>(
        apiUrl('admin', adminPaths.dashboardDemographics),
        {},
        {},
        silent,
      ),
    ),

  getRegistrations: (): Promise<ApiResponse<RegistrationsModel>> =>
    unwrap(
      api.get<ApiResponse<RegistrationsModel>>(
        apiUrl('admin', adminPaths.dashboardRegistrations),
        {},
        {},
        silent,
      ),
    ),

  getLocationStats: (): Promise<ApiResponse<LocationStatsModel>> =>
    unwrap(
      api.get<ApiResponse<LocationStatsModel>>(
        apiUrl('admin', adminPaths.dashboardLocations),
        {},
        {},
        silent,
      ),
    ),

  getCompanyJobStats: (): Promise<ApiResponse<CompanyJobStatsModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyJobStatsModel>>(
        apiUrl('admin', adminPaths.dashboardCompanyJobs),
        {},
        {},
        silent,
      ),
    ),

  getInstallerJobRateTrend: (): Promise<ApiResponse<InstallerJobRateTrendModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerJobRateTrendModel>>(
        apiUrl('admin', adminPaths.dashboardInstallerJobRate),
        {},
        {},
        silent,
      ),
    ),

  generateReport: (payload: GenerateReportPayload): Promise<ApiResponse<GenerateReportModel>> =>
    unwrap(
      api.post<ApiResponse<GenerateReportModel>>(
        apiUrl('admin', adminPaths.dashboardGenerateReport),
        payload,
        {},
        silent,
      ),
    ),

  getQADashboardData: (): Promise<ApiResponse<QADashboardDataModel>> =>
    unwrap(
      api.get<ApiResponse<QADashboardDataModel>>(
        apiUrl('base', basePaths.qaDashboard),
        {},
        {},
        silent,
      ),
    ),

  getQAProjects: (): Promise<ApiResponse<ProjectItemModel[]>> =>
    unwrap(
      api.get<ApiResponse<ProjectItemModel[]>>(
        apiUrl('base', basePaths.qaProjects),
        {},
        {},
        silent,
      ),
    ),

  getQAProject: (id: string): Promise<ApiResponse<ProjectDetailModel>> =>
    unwrap(
      api.get<ApiResponse<ProjectDetailModel>>(
        apiUrl('base', basePaths.qaProjectSingle(id)),
        {},
        {},
        silent,
      ),
    ),
};
