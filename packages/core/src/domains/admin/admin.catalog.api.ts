import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  AdPackageListModel,
  AdPackageModel,
  AuditLogModel,
  BadgeModel,
  CalculateQuoteModel,
  ConfigurationModel,
  InstallerBadgeListModel,
  LanguageModel,
  PricingItemModel,
  ProductMetadataListModel,
  ProductMetadataModel,
  QuestionModel,
  AdminToolboxSubmissionModel,
  AdminToolboxTemplateModel,
} from './catalog.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminCatalogApi = {
  seedPricing: (): Promise<ApiResponse<PricingItemModel[]>> =>
    unwrap(
      api.post<ApiResponse<PricingItemModel[]>>(
        apiUrl('admin', adminPaths.pricingSeed),
        {},
        {},
        silent,
      ),
    ),

  getPricingItems: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<PricingItemModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<PricingItemModel>>(
        apiUrl('admin', adminPaths.pricingItems),
        params,
        {},
        silent,
      ),
    ),

  createPricingItem: (payload: Record<string, unknown>): Promise<ApiResponse<PricingItemModel>> =>
    unwrap(
      api.post<ApiResponse<PricingItemModel>>(
        apiUrl('admin', adminPaths.pricingItems),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updatePricingItem: (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<PricingItemModel>> =>
    unwrap(
      api.patch<ApiResponse<PricingItemModel>>(
        apiUrl('admin', adminPaths.pricingItemUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  calculateQuote: (payload: Record<string, unknown>): Promise<ApiResponse<CalculateQuoteModel>> =>
    unwrap(
      api.post<ApiResponse<CalculateQuoteModel>>(
        apiUrl('admin', adminPaths.pricingCalculate),
        payload,
        {},
        silent,
      ),
    ),

  createBadge: (payload: Record<string, unknown>): Promise<ApiResponse<BadgeModel>> =>
    unwrap(
      api.post<ApiResponse<BadgeModel>>(
        apiUrl('admin', adminPaths.badgeCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getAllBadges: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<BadgeModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<BadgeModel>>(
        apiUrl('admin', adminPaths.badgesGetAll),
        params,
        {},
        silent,
      ),
    ),

  getInstallerBadges: (installerId: string): Promise<ApiResponse<InstallerBadgeListModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerBadgeListModel>>(
        apiUrl('admin', adminPaths.installerBadges(installerId)),
        {},
        {},
        silent,
      ),
    ),

  updateBadge: (id: string, payload: Record<string, unknown>): Promise<ApiResponse<BadgeModel>> =>
    unwrap(
      api.put<ApiResponse<BadgeModel>>(
        apiUrl('admin', adminPaths.badgeUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  toggleBadgeStatus: (id: string): Promise<ApiResponse<BadgeModel>> =>
    unwrap(
      api.patch<ApiResponse<BadgeModel>>(
        apiUrl('admin', adminPaths.badgeToggleStatus(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  assignBadgeToInstaller: (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.badgeAssign),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  removeBadgeFromInstaller: (
    installerId: string,
    badgeId: string,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.delete<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.badgeUnassign(installerId, badgeId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  autoAssignBadgeByCompany: (companyId: string): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.badgeAutoAssignByCompany(companyId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteBadge: (id: string): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.delete<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.badgeDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getQuestions: (): Promise<ApiResponse<QuestionModel[]>> =>
    unwrap(
      api.get<ApiResponse<QuestionModel[]>>(
        apiUrl('admin', adminPaths.questionsGetAll),
        {},
        {},
        silent,
      ),
    ),

  getQuestionById: (id: string): Promise<ApiResponse<QuestionModel>> =>
    unwrap(
      api.get<ApiResponse<QuestionModel>>(
        apiUrl('admin', adminPaths.questionSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  createQuestions: (payload: Record<string, unknown>): Promise<ApiResponse<QuestionModel[]>> =>
    unwrap(
      api.post<ApiResponse<QuestionModel[]>>(
        apiUrl('admin', adminPaths.questionsCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateQuestion: (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<QuestionModel>> =>
    unwrap(
      api.patch<ApiResponse<QuestionModel>>(
        apiUrl('admin', adminPaths.questionUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteQuestion: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('admin', adminPaths.questionDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  createLanguage: (payload: Record<string, unknown>): Promise<ApiResponse<LanguageModel>> =>
    unwrap(
      api.post<ApiResponse<LanguageModel>>(
        apiUrl('admin', adminPaths.languageCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getLanguages: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<LanguageModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<LanguageModel>>(
        apiUrl('admin', adminPaths.languagesGetAll),
        params,
        {},
        silent,
      ),
    ),

  getLanguageById: (id: string): Promise<ApiResponse<LanguageModel>> =>
    unwrap(
      api.get<ApiResponse<LanguageModel>>(
        apiUrl('admin', adminPaths.languageSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  updateLanguage: (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<LanguageModel>> =>
    unwrap(
      api.patch<ApiResponse<LanguageModel>>(
        apiUrl('admin', adminPaths.languageUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteLanguage: (id: string): Promise<ApiResponse<void>> =>
    unwrap(
      api.delete<ApiResponse<void>>(
        apiUrl('admin', adminPaths.languageDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  createProductMetadata: (
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<ProductMetadataModel>> =>
    unwrap(
      api.post<ApiResponse<ProductMetadataModel>>(
        apiUrl('admin', adminPaths.metadataCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getAllProductMetadata: (): Promise<ApiResponse<ProductMetadataListModel>> =>
    unwrap(
      api.get<ApiResponse<ProductMetadataListModel>>(
        apiUrl('admin', adminPaths.metadataGetAll),
        {},
        {},
        silent,
      ),
    ),

  getProductMetadataByType: (type: string): Promise<ApiResponse<ProductMetadataModel>> =>
    unwrap(
      api.get<ApiResponse<ProductMetadataModel>>(
        apiUrl('admin', adminPaths.metadataByType(type)),
        {},
        {},
        silent,
      ),
    ),

  toggleProductMetadata: (id: string): Promise<ApiResponse<ProductMetadataModel>> =>
    unwrap(
      api.patch<ApiResponse<ProductMetadataModel>>(
        apiUrl('admin', adminPaths.metadataToggle(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteProductMetadata: (id: string): Promise<ApiResponse<void>> =>
    unwrap(
      api.delete<ApiResponse<void>>(
        apiUrl('admin', adminPaths.metadataDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  createAdPackage: (payload: Record<string, unknown>): Promise<ApiResponse<AdPackageModel>> =>
    unwrap(
      api.post<ApiResponse<AdPackageModel>>(
        apiUrl('admin', adminPaths.adPackageCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getAdPackages: (): Promise<ApiResponse<AdPackageListModel>> =>
    unwrap(
      api.get<ApiResponse<AdPackageListModel>>(
        apiUrl('admin', adminPaths.adPackagesGetAll),
        {},
        {},
        silent,
      ),
    ),

  getAdPackage: (id: string): Promise<ApiResponse<AdPackageModel>> =>
    unwrap(
      api.get<ApiResponse<AdPackageModel>>(
        apiUrl('admin', adminPaths.adPackageSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  updateAdPackage: (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<AdPackageModel>> =>
    unwrap(
      api.patch<ApiResponse<AdPackageModel>>(
        apiUrl('admin', adminPaths.adPackageSingle(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  toggleAdPackageStatus: (id: string): Promise<ApiResponse<void>> =>
    unwrap(
      api.patch<ApiResponse<void>>(
        apiUrl('admin', adminPaths.adPackageToggleStatus(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteAdPackage: (id: string): Promise<ApiResponse<void>> =>
    unwrap(
      api.delete<ApiResponse<void>>(
        apiUrl('admin', adminPaths.adPackageSingle(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getAllConfigurations: (): Promise<ApiResponse<ConfigurationModel[]>> =>
    unwrap(
      api.get<ApiResponse<ConfigurationModel[]>>(
        apiUrl('admin', adminPaths.configurationsGetAll),
        {},
        {},
        silent,
      ),
    ),

  editConfiguration: (
    configId: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<ConfigurationModel>> =>
    unwrap(
      api.patch<ApiResponse<ConfigurationModel>>(
        apiUrl('admin', adminPaths.configurationEdit(configId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getAuditLogs: (): Promise<ApiResponse<AuditLogModel[]>> =>
    unwrap(
      api.get<ApiResponse<AuditLogModel[]>>(
        apiUrl('admin', adminPaths.auditLogsGetAll),
        {},
        {},
        silent,
      ),
    ),

  createToolboxTemplate: (
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<AdminToolboxTemplateModel>> =>
    unwrap(
      api.post<ApiResponse<AdminToolboxTemplateModel>>(
        apiUrl('admin', adminPaths.toolboxTemplateCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateToolboxTemplate: (
    templateId: string,
    payload: Record<string, unknown>,
  ): Promise<ApiResponse<AdminToolboxTemplateModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminToolboxTemplateModel>>(
        apiUrl('admin', adminPaths.toolboxTemplateUpdate(templateId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getToolboxTemplates: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<AdminToolboxTemplateModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<AdminToolboxTemplateModel>>(
        apiUrl('admin', adminPaths.toolboxTemplatesGetAll),
        params,
        {},
        silent,
      ),
    ),

  assignToolboxTemplateToJob: (
    jobId: string,
    templateId: string,
  ): Promise<ApiResponse<null>> =>
    unwrap(
      api.post<ApiResponse<null>>(
        apiUrl('admin', adminPaths.toolboxAssignTemplate(jobId, templateId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getToolboxJobSubmissions: (
    jobId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<AdminToolboxSubmissionModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<AdminToolboxSubmissionModel>>(
        apiUrl('admin', adminPaths.toolboxJobSubmissions(jobId)),
        params,
        {},
        silent,
      ),
    ),

  getToolboxSubmission: (
    submissionId: string,
  ): Promise<ApiResponse<AdminToolboxSubmissionModel>> =>
    unwrap(
      api.get<ApiResponse<AdminToolboxSubmissionModel>>(
        apiUrl('admin', adminPaths.toolboxSubmission(submissionId)),
        {},
        {},
        silent,
      ),
    ),

  deleteToolboxTemplate: (templateId: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('admin', adminPaths.toolboxTemplateDelete(templateId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),
};
