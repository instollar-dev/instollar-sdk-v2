/**
 * Parses instollar-webappV2/docs/API_ENDPOINTS.md into playground catalog modules.
 * Run: node playground/scripts/build-api-catalog.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = path.resolve(__dirname, '../../../instollar-webappV2/docs/API_ENDPOINTS.md');
const outDir = path.resolve(__dirname, '../src/api/catalog');

const SHIPPED = new Set([
  'authApi.register',
  'authApi.verifyOtp',
  'authApi.login',
  'authApi.verifyTwoFactorLogin',
  'authApi.sendOtp',
  'authApi.changePassword',
  'authApi.enableTwoFactor',
  'authApi.disableTwoFactor',
  'authApi.verifyTwoFactorSetup',
  'authApi.pingHealth',
  'authApi.submitGuarantorForm',
  'sharedApi.uploadFiles',
  'sharedApi.getInbox',
  'sharedApi.getHistoryByDirect',
  'sharedApi.getHistoryByOtherUser',
  'sharedApi.markChatAsRead',
  'sharedApi.markAllChatAsRead',
  'adminApi.getStats',
  'adminApi.getUsers',
  'adminApi.getJobRequests',
  'adminApi.getJobRequestById',
  'adminApi.searchInstallers',
  'adminApi.assignInstaller',
  'adminApi.unassignWorkflow',
  'adminApi.getInstallerProfile',
  'adminApi.getFinanceOverview',
  'adminApi.getTransactions',
  'adminApi.generateFinancialReport',
  'adminApi.getInstallerWallets',
  'adminApi.getUnpaidProjects',
  'adminApi.getUnpaidInstallers',
  'adminApi.exportUnpaidInstallers',
  'adminApi.previewBulkPayout',
  'adminApi.confirmBulkPayout',
  'adminApi.getCompaniesFinance',
  'adminApi.getCompanyTransactions',
  'adminApi.getCompanyBillingSummary',
  'adminApi.getCompaniesFinanceOverview',
  'adminApi.sendPaymentReminder',
  'adminApi.savePaymentGateway',
  'adminApi.getPaymentGateway',
  'adminApi.getMasterAccount',
  'adminApi.setTransactionPin',
  'adminApi.updateTransactionPin',
  'adminApi.getPinStatus',
  'adminApi.getFinanceAuditTrail',
  'adminApi.getInstallerProjects',
  'adminApi.getAllCompanyUsers',
  'adminApi.createUser',
  'adminApi.updateUser',
  'adminApi.deleteUser',
  'adminApi.updateInstaller',
  'adminApi.getUserJobs',
  'adminApi.getUserProfile',
  'adminApi.getEndUsers',
  'adminApi.updateCompany',
  'adminApi.getAdminProfile',
  'adminApi.updateAdminProfile',
  'adminApi.sendProfileCompletionReminder',
  'adminApi.getWorkflows',
  'adminApi.getWorkflowById',
  'adminApi.createWorkflow',
  'adminApi.updateWorkflow',
  'adminApi.getWorkflowsByCompany',
  'adminApi.duplicateWorkflow',
  'adminApi.deleteWorkflow',
  'adminApi.getStepChats',
  'adminApi.getStepChatHistory',
  'adminApi.getPermissions',
  'adminApi.getRoles',
  'adminApi.getRoleById',
  'adminApi.createRole',
  'adminApi.updateRole',
  'adminApi.deleteRole',
  'adminApi.getOnboardedAdmins',
  'adminApi.getOnboardedCompanies',
  'adminApi.assignAdminToCompany',
  'adminApi.markJobRequestAsComplete',
  'adminApi.updateInstallationDate',
  'adminApi.cancelJobRequest',
  'adminApi.rateInstaller',
  'adminApi.swapWorkflow',
  'adminApi.verifyOnProfile',
  'adminApi.getDashboardMetrics',
  'adminApi.getAnalyticsOverview',
  'adminApi.getPayoutDistribution',
  'adminApi.getDemographics',
  'adminApi.getRegistrations',
  'adminApi.getLocationStats',
  'adminApi.getCompanyJobStats',
  'adminApi.getInstallerJobRateTrend',
  'adminApi.generateReport',
  'adminApi.getQADashboardData',
  'adminApi.getQAProjects',
  'adminApi.getQAProject',
  'adminApi.getNotifications',
  'adminApi.markNotificationRead',
  'adminApi.markAllNotificationsRead',
  'adminApi.getMeshGrids',
  'adminApi.getMeshGridById',
  'adminApi.assignWorkflows',
  'adminApi.assignInstallers',
  'adminApi.getMeshGridReports',
  'adminApi.getMeshGridReportWorkflow',
  'adminApi.updateMeshGridReport',
  'adminApi.getMiniGrids',
  'adminApi.getMiniGridById',
  'adminApi.getMiniGridCompanyInstallers',
  'adminApi.assignInstallersToCompany',
  'adminApi.unassignInstallersFromCompany',
  'adminApi.getCommercialAudit',
  'adminApi.getCommercialAuditByJob',
  'adminApi.getResidentialAudit',
  'adminApi.getResidentialAuditByJob',
  'adminApi.updateCommercialAudit',
  'adminApi.updateResidentialAudit',
  'adminApi.createInvoice',
  'adminApi.sendInvoice',
  'adminApi.getAllInvoices',
  'adminApi.updateInvoice',
  'adminApi.getInvoiceById',
  'adminApi.getInvoiceByJobRequestId',
  'adminApi.getInvoiceSettings',
  'adminApi.updateInvoiceSettings',
  'adminApi.deleteInvoice',
  'companyApi.getCompanyProfile',
  'companyApi.updateCompanyUser',
  'companyApi.getJobRequests',
  'companyApi.getJobRequestDetails',
  'companyApi.getDashboardOverview',
  'companyApi.getFinance',
  'companyApi.getNotifications',
  'companyApi.getCompanyFinanceTransactions',
  'companyApi.getCompanyFinanceBillingSummary',
  'companyApi.getCompanyProjectFinanceInvoices',
  'companyApi.getCompanyFinanceBanks',
  'companyApi.resolveCompanyFinanceAccountName',
  'companyApi.linkCompanyFinanceBankAccount',
  'companyApi.getCompanyInvoiceById',
  'companyApi.payCompanyInvoice',
  'companyApi.initializeCompanyInvoicePayment',
  'companyApi.previewCompanyFinancePayment',
  'companyApi.confirmCompanyFinancePayment',
  'companyApi.getWorkflows',
  'companyApi.getWorkflowDetails',
  'companyApi.createWorkflow',
  'companyApi.updateWorkflow',
  'companyApi.completeOrCancelJobRequest',
  'companyApi.createJobRequest',
  'companyApi.getCompanyTeamMembers',
  'companyApi.getCompanyTeamMemberDetails',
  'companyApi.createCompanyTeamMember',
  'companyApi.updateCompanyTeamMember',
  'companyApi.deleteCompanyTeamMember',
  'companyApi.getCompanyPermissions',
  'companyApi.getCompanyRoles',
  'companyApi.createCompanyRole',
  'companyApi.updateCompanyRole',
  'companyApi.deleteCompanyRole',
  'companyApi.getCompanyInstallers',
  'companyApi.getRecentActivities',
  'companyApi.markNotificationRead',
  'companyApi.updateProfile',
  'companyApi.getDashboard',
  'companyApi.getMiniGridJobRequests',
  'companyApi.getMiniGridJobRequestDetails',
  'companyApi.createMiniGridJobRequest',
  'companyApi.deleteMiniGridJobRequest',
  'companyApi.getClusterJobRequests',
  'companyApi.createClusterProject',
  'companyApi.getProjects',
  'companyApi.getProjectDetails',
  'companyApi.getLocationReport',
  'companyApi.getProjectReportDetail',
  'companyApi.getProjectWorkflowReports',
  'companyApi.approveOrRejectProjectBoq',
  'companyApi.completeOrCancelProject',
  'companyApi.submitInstallerRating',
  'installerApi.getInstallerProfile',
  'installerApi.toggleInstallerAvailability',
  'installerApi.getJobRequests',
  'installerApi.getJobRequestDetails',
  'installerApi.getDashboardOverview',
  'installerApi.getAllAssessments',
  'installerApi.getFinanceWallet',
  'installerApi.getInstallerWalletStats',
  'installerApi.getInstallerHmoContributionHistory',
  'installerApi.createWalletPin',
  'installerApi.createInstallerWallet',
  'installerApi.verifyInstallerWalletId',
  'installerApi.getFinanceBanks',
  'installerApi.addInstallerBankAccount',
  'installerApi.resolveWalletAccountName',
  'installerApi.getWalletBankAccounts',
  'installerApi.deleteInstallerBankAccount',
  'installerApi.initiateWalletWithdrawal',
  'installerApi.confirmWalletWithdrawal',
  'installerApi.getInstallerPensionDetails',
  'installerApi.getInstallerPensionContributionHistory',
  'installerApi.contactInstallerPensionProvider',
  'installerApi.linkInstallerPension',
  'installerApi.enrollInstallerPension',
  'installerApi.getInstallerHmoDetails',
  'installerApi.linkInstallerHmo',
  'installerApi.enrollInstallerHmo',
  'installerApi.contactInstallerHmoProvider',
  'installerApi.getInstallerFinanceTransactions',
  'installerApi.getInstallerProjectWorkflows',
  'installerApi.getInstallerWorkflowSingle',
  'installerApi.submitWorkflowContentStep',
  'installerApi.acceptWorkflowPrecautions',
  'installerApi.getStepChats',
  'installerApi.getStepChatHistory',
  'installerApi.decideOnJobRequest',
  'installerApi.updateBoq',
  'installerApi.updateBoqItems',
  'installerApi.startAssessment',
  'installerApi.submitAssessment',
  'installerApi.getCommercialSiteAuditByJob',
  'installerApi.submitCommercialSiteAudit',
  'installerApi.updateCommercialSiteAudit',
  'installerApi.getResidentialSiteAuditByJob',
  'installerApi.submitResidentialSiteAudit',
  'installerApi.updateResidentialSiteAudit',
  'installerApi.getRecentActivities',
  'installerApi.markNotificationRead',
  'installerApi.getInstallerMiniGridJobRequests',
  'installerApi.getInstallerMiniGridJobRequestDetails',
  'companyApi.getStoreOverviewAndOrders',
  'companyApi.getStoreOrders',
  'companyApi.getProducts',
  'companyApi.getProductById',
  'companyApi.createMeshGrid',
  'companyApi.updateMeshGrid',
  'companyApi.getMeshGrids',
  'companyApi.getMeshGridById',
  'companyApi.deleteMeshGrid',
  'companyApi.getReportLocations',
  'companyApi.getLocationCommunities',
  'companyApi.getCommunityDailyReports',
  'companyApi.getTechnicalDetails',
  'companyApi.getReportContents',
  'installerApi.updateInstallerProfile',
  'installerApi.getInstallerMyRating',
  'installerApi.updateSettings',
  'installerApi.getInstallerLanguages',
  'installerApi.getInstallerProducts',
  'installerApi.getInstallerBadges',
  'installerApi.getStoreFrontOverview',
  'installerApi.getStoreFrontInterests',
  'installerApi.getStoreFrontProducts',
  'installerApi.getMeshGrids',
  'installerApi.getMeshGridById',
  'installerApi.createMeshGridReport',
  'installerApi.getMeshGridPersonalSummary',
  'installerApi.getMeshGridProjectActivity',
  'installerApi.commissionMeshGridReport',
  'installerApi.generateOfflineSlots',
  'installerApi.syncOfflineReport',
  'installerApi.getActiveToolboxTemplates',
  'installerApi.submitToolboxBrief',
  'installerApi.getMyToolboxSubmissions',
  'adminApi.seedPricing',
  'adminApi.getPricingItems',
  'adminApi.createPricingItem',
  'adminApi.updatePricingItem',
  'adminApi.calculateQuote',
  'adminApi.createBadge',
  'adminApi.getAllBadges',
  'adminApi.getInstallerBadges',
  'adminApi.updateBadge',
  'adminApi.toggleBadgeStatus',
  'adminApi.assignBadgeToInstaller',
  'adminApi.removeBadgeFromInstaller',
  'adminApi.autoAssignBadgeByCompany',
  'adminApi.deleteBadge',
  'adminApi.getQuestions',
  'adminApi.getQuestionById',
  'adminApi.createQuestions',
  'adminApi.updateQuestion',
  'adminApi.deleteQuestion',
  'adminApi.createLanguage',
  'adminApi.getLanguages',
  'adminApi.getLanguageById',
  'adminApi.updateLanguage',
  'adminApi.deleteLanguage',
  'adminApi.createProductMetadata',
  'adminApi.getAllProductMetadata',
  'adminApi.getProductMetadataByType',
  'adminApi.toggleProductMetadata',
  'adminApi.deleteProductMetadata',
  'adminApi.createAdPackage',
  'adminApi.getAdPackages',
  'adminApi.getAdPackage',
  'adminApi.updateAdPackage',
  'adminApi.toggleAdPackageStatus',
  'adminApi.deleteAdPackage',
  'adminApi.getAllConfigurations',
  'adminApi.editConfiguration',
  'adminApi.getAuditLogs',
  'adminApi.createToolboxTemplate',
  'adminApi.updateToolboxTemplate',
  'adminApi.getToolboxTemplates',
  'adminApi.assignToolboxTemplateToJob',
  'adminApi.getToolboxJobSubmissions',
  'adminApi.getToolboxSubmission',
  'adminApi.deleteToolboxTemplate',
]);

const DOMAIN_MAP = {
  Auth: 'auth',
  'Shared / Upload / Chat': 'shared',
  Admin: 'admin',
  Company: 'company',
  Installer: 'installer',
};

function cleanPath(p) {
  return p.replace(/`/g, '').trim();
}

function cleanFn(f) {
  return f.replace(/`/g, '').replace(/^\*/, '').trim();
}

function normalizeResponse(raw) {
  let s = raw.trim().replace(/\s*\*\([^)]*\)\*/g, '').replace(/`/g, '').trim();
  if (!s || s === '—' || s === '-') return 'ApiResponse<unknown>';
  s = s.replace(/GeneralResponseModel/g, 'ApiResponse');
  s = s.replace(/RegisterResponseModel/g, 'RegisterModel');
  s = s.replace(/LoginResponseModel/g, 'LoginModel');
  s = s.replace(/VerifyOtpResponse/g, 'VerifyOtpModel');
  s = s.replace(/SendOtpResponseModel/g, 'SendOtpModel');
  s = s.replace(/ChangePasswordResponse/g, 'ChangePasswordModel');
  s = s.replace(/FinanceOverviewApiPayload/g, 'CompanyFinanceOverviewModel');
  s = s.replace(/FinanceOverviewData/g, 'AdminFinanceOverviewModel');
  s = s.replace(/ToggleInstallerAvailabilityResponse/g, 'ToggleInstallerAvailabilityModel');
  s = s.replace(/InstallerProfileApiData/g, 'InstallerProfileRecordModel');
  s = s.replace(/UploadedFileAsset(?!\w)/g, 'UploadedFileAssetModel');
  s = s.replace(/InstallerFinanceWallet(?!\w)/g, 'InstallerFinanceWalletModel');
  s = s.replace(/DashboardMetricsResponse/g, 'ApiResponse<DashboardMetricsModel>');
  s = s.replace(/AnalyticsOverviewResponse/g, 'ApiResponse<AnalyticsOverviewModel>');
  s = s.replace(/PayoutDistributionResponse/g, 'ApiResponse<PayoutDistributionModel>');
  s = s.replace(/DemographicsResponse/g, 'ApiResponse<DemographicsModel>');
  s = s.replace(/RegistrationsResponse/g, 'ApiResponse<RegistrationsModel>');
  s = s.replace(/LocationStatsResponse/g, 'ApiResponse<LocationStatsModel>');
  s = s.replace(/CompanyJobStatsResponse/g, 'ApiResponse<CompanyJobStatsModel>');
  s = s.replace(/InstallerJobRateTrendResponse/g, 'ApiResponse<InstallerJobRateTrendModel>');
  s = s.replace(/GenerateReportResponse/g, 'ApiResponse<GenerateReportModel>');
  s = s.replace(/TransactionListResponse/g, 'PaginatedApiResponse<TransactionModel>');
  s = s.replace(/InstallerWalletListResponse/g, 'PaginatedApiResponse<InstallerWalletModel>');
  s = s.replace(/UnpaidProjectListResponse/g, 'PaginatedApiResponse<UnpaidProjectModel>');
  s = s.replace(/UnpaidInstallerListResponse/g, 'PaginatedApiResponse<UnpaidInstallerModel>');
  s = s.replace(/CompanyFinanceListResponse/g, 'PaginatedApiResponse<CompanyFinanceModel>');
  s = s.replace(/CompanyBillingSummaryResponse/g, 'ApiResponse<CompanyBillingSummaryModel>');
  s = s.replace(/InstallerProjectListResponse/g, 'PaginatedApiResponse<InstallerProjectModel>');
  s = s.replace(/BadgeListResponse/g, 'PaginatedApiResponse<BadgeModel>');
  s = s.replace(/InstallerBadgesResponse/g, 'ApiResponse<InstallerBadgeListModel>');
  s = s.replace(/GetAllConfigurationsResponse/g, 'ApiResponse<ConfigurationListModel>');
  s = s.replace(/EditConfigurationResponse/g, 'ApiResponse<ConfigurationModel>');
  s = s.replace(/CompanyFinanceTransactionsApiResponse/g, 'PaginatedApiResponse<CompanyFinanceTransactionModel>');
  s = s.replace(/CompanyFinanceBillingSummaryRawApiResponse/g, 'ApiResponse<CompanyFinanceBillingSummaryModel>');
  s = s.replace(/CompanyProjectFinanceInvoicesApiResponse/g, 'ApiResponse<CompanyProjectFinanceInvoiceListModel>');
  s = s.replace(/InstallerFinanceTransactionsApiResponse/g, 'PaginatedApiResponse<InstallerFinanceTransactionModel>');
  s = s.replace(/CommercialSiteAuditGetByJobEnvelope/g, 'ApiResponse<CommercialSiteAuditModel>');
  s = s.replace(/CommercialSiteAuditApiEnvelope/g, 'ApiResponse<CommercialSiteAuditModel>');
  s = s.replace(/ResidentialSiteAuditGetByJobEnvelope/g, 'ApiResponse<ResidentialSiteAuditModel>');
  s = s.replace(/ResidentialSiteAuditApiEnvelope/g, 'ApiResponse<ResidentialSiteAuditModel>');
  s = s.replace(/SubmitAssessmentResponseData/g, 'SubmitAssessmentModel');
  s = s.replace(/CreateMeshClusterResponse/g, 'ApiResponse<CreateMeshClusterModel>');
  s = s.replace(/CreateMiniGridJobRequestResponse/g, 'ApiResponse<CreateMiniGridJobRequestModel>');
  s = s.replace(/CreateWorkflowResponse/g, 'ApiResponse<CreateWorkflowModel>');
  s = s.replace(/StoreOrdersResponse/g, 'ApiResponse<StoreOrderListModel>');
  s = s.replace(/StoreProductsResponse/g, 'ApiResponse<StoreProductListModel>');
  s = s.replace(/LocationReportResponse/g, 'ApiResponse<LocationReportModel>');
  s = s.replace(/ProjectReportDetailResponse/g, 'ApiResponse<ProjectReportDetailModel>');
  s = s.replace(/FinanceAuditTrailResponse/g, 'ApiResponse<FinanceAuditTrailModel>');
  s = s.replace(/AdPackageResponse/g, 'ApiResponse<AdPackageListModel>');
  s = s.replace(/GetAllMetadataResponse/g, 'ApiResponse<ProductMetadataListModel>');
  s = s.replace(/GetProductMetadataResponse/g, 'ApiResponse<ProductMetadataModel>');
  s = s.replace(/CreateInstallerWalletResponse/g, 'ApiResponse<CreateInstallerWalletModel>');
  s = s.replace(/PayoutPreviewResponse/g, 'ApiResponse<PayoutPreviewModel>');
  s = s.replace(/CalculateQuoteResponse/g, 'ApiResponse<CalculateQuoteModel>');
  s = s.replace(/CompaniesFinanceOverviewData/g, 'CompaniesFinanceOverviewModel');

  if (s === 'boolean' || s === 'Blob') return s;

  s = normalizeInnerGenerics(s);
  return s;
}

function normalizeInnerGenerics(s) {
  s = s.replace(/ApiResponse<([^>]+)>/g, (_, inner) => {
    if (['unknown', 'null', 'void', 'string', 'any'].includes(inner.trim())) return `ApiResponse<${inner.trim() === 'any' ? 'unknown' : inner.trim()}>`;
    if (inner.endsWith('Model') || inner.endsWith('Model[]') || inner.includes('Model |') || inner.includes('{')) {
      return `ApiResponse<${inner}>`;
    }
    return `ApiResponse<${toModel(inner)}>`;
  });

  s = s.replace(/PaginatedApiResponse<([^>]+)>/g, (_, inner) => {
    const normalized = inner.endsWith('Model') || inner.endsWith('Model[]') ? inner : toModel(inner);
    return `PaginatedApiResponse<${normalized}>`;
  });

  if (!s.startsWith('ApiResponse') && !s.startsWith('PaginatedApiResponse') && s !== 'boolean' && s !== 'Blob') {
    return `ApiResponse<${toModel(s)}>`;
  }

  return s;
}

function toModel(name) {
  const cleaned = name.replace(/\[\]$/, '').trim();
  if (cleaned.endsWith('Model')) return name;
  if (cleaned === 'any') return 'unknown';
  const base = cleaned.replace(/^(AdminStats|User|JobRequest|Workflow|Invoice|Badge|Question|Language|Company|InstallerJob|EndUser|Permission|Role|MeshGridProject|AdminUser|AdminNotification|ToolboxTemplate|ToolboxSubmission|AuditLog|AdPackage|ProductMetadata|PricingItem|ChatInboxItem|ChatMessage|WorkflowStepChat|InstallerSearchResult|AssignInstallerResult|InstallerProfile|CommercialSiteAudit|ResidentialSiteAudit|AssessmentModel|ProjectItem|ProjectDetail|QADashboardData|FinanceBank|ResolvedWalletAccountData|PaymentGatewayConfig|MasterAccountData|PinStatus|CompanyTeamMember|CompanyTeamMemberDetail|CompanyPermission|CompanyRole|CompanyInstaller|CompanyNotificationItem|InstallerNotificationItem|InstallerMyRating|InstallerSettings|InstallerLanguage|InstallerProductsMetadata|InstallerProfileBadge|InstallerWorkflowApiRow|InstallerWorkflowSingle|MiniGridJobRequestApiItem|JobRequestApiData|InstallerProjectData|WorkflowActivity|MeshGridPersonalSummary|InterestData|StoreFrontOverviewStats|StoreOverview|StoreProduct|WorkflowItem|WorkflowDetailApi|ProjectListApiRow|ProjectDetailApiPayload|ProjectWorkflowReportRow|ClusterJobRequestItem|CompanyJobRequestSingleApi|DashboardOverviewData|InstallerWalletStatsData|WalletBankAccount|PensionContributionHistoryData|InstallerPensionPlan|InstallerHmoDetails|CompanyInitializeInvoicePaymentData|CompanyFinancePaymentPreviewData|FinanceAlert|SubmitAssessmentModel)$/,
    '$1Model');
  if (base !== cleaned) return name.replace(cleaned, base);
  return `${cleaned}Model${name.endsWith('[]') ? '[]' : ''}`;
}

function sdkFn(domain, rawFn) {
  const fn = cleanFn(rawFn);
  if (!fn || fn === '—' || fn === '-' || fn.startsWith('(') || fn.includes('inline')) return '—';
  const name = fn.split('/')[0].trim();
  const map = {
    register: 'authApi.register',
    verifyOtp: 'authApi.verifyOtp',
    login: 'authApi.login',
    verifyTwoFactorLogin: 'authApi.verifyTwoFactorLogin',
    sendOtp: 'authApi.sendOtp',
    changePassword: 'authApi.changePassword',
    enableTwoFactor: 'authApi.enableTwoFactor',
    disableTwoFactor: 'authApi.disableTwoFactor',
    verifyTwoFactorSetup: 'authApi.verifyTwoFactorSetup',
    pingHealth: 'authApi.pingHealth',
    uploadFiles: 'sharedApi.uploadFiles',
    getInbox: 'sharedApi.getInbox',
    getHistoryByDirect: 'sharedApi.getHistoryByDirect',
    getHistoryByOtherUser: 'sharedApi.getHistoryByOtherUser',
    markAsRead:
      domain === 'shared'
        ? 'sharedApi.markChatAsRead'
        : domain === 'company'
          ? 'companyApi.markNotificationRead'
          : domain === 'installer'
            ? 'installerApi.markNotificationRead'
            : domain === 'admin'
              ? 'adminApi.markNotificationRead'
              : '—',
    markAllAsRead:
      domain === 'shared'
        ? 'sharedApi.markAllChatAsRead'
        : domain === 'admin'
          ? 'adminApi.markAllNotificationsRead'
          : '—',
    getStats: 'adminApi.getStats',
    getAdminStats: 'adminApi.getStats',
    getUsers: 'adminApi.getUsers',
    getAllCompanyUsers: 'adminApi.getAllCompanyUsers',
    createUser: 'adminApi.createUser',
    updateUser: 'adminApi.updateUser',
    deleteUser: 'adminApi.deleteUser',
    updateInstaller: 'adminApi.updateInstaller',
    getUserJobs: 'adminApi.getUserJobs',
    getUserProfile: domain === 'admin' ? 'adminApi.getUserProfile' : '—',
    getEndUsers: 'adminApi.getEndUsers',
    updateCompany: 'adminApi.updateCompany',
    getAdminProfile: 'adminApi.getAdminProfile',
    updateAdminProfile: 'adminApi.updateAdminProfile',
    sendProfileCompletionReminder: 'adminApi.sendProfileCompletionReminder',
    getPermissions: 'adminApi.getPermissions',
    getRoles: 'adminApi.getRoles',
    getRoleById: 'adminApi.getRoleById',
    createRole: 'adminApi.createRole',
    updateRole: 'adminApi.updateRole',
    deleteRole: 'adminApi.deleteRole',
    getOnboardedAdmins: 'adminApi.getOnboardedAdmins',
    getOnboardedCompanies: 'adminApi.getOnboardedCompanies',
    assignAdminToCompany: 'adminApi.assignAdminToCompany',
    getJobRequests: domain === 'admin' ? 'adminApi.getJobRequests' : domain === 'company' ? 'companyApi.getJobRequests' : domain === 'installer' ? 'installerApi.getJobRequests' : '—',
    getJobRequestById: 'adminApi.getJobRequestById',
    markJobRequestAsComplete: 'adminApi.markJobRequestAsComplete',
    updateInstallationDate: 'adminApi.updateInstallationDate',
    cancelJobRequest: 'adminApi.cancelJobRequest',
    rateInstaller: 'adminApi.rateInstaller',
    swapWorkflow: 'adminApi.swapWorkflow',
    verifyOnProfile: 'adminApi.verifyOnProfile',
    getDashboardMetrics: 'adminApi.getDashboardMetrics',
    getAnalyticsOverview: 'adminApi.getAnalyticsOverview',
    getPayoutDistribution: 'adminApi.getPayoutDistribution',
    getDemographics: 'adminApi.getDemographics',
    getRegistrations: 'adminApi.getRegistrations',
    getLocationStats: 'adminApi.getLocationStats',
    getCompanyJobStats: 'adminApi.getCompanyJobStats',
    getInstallerJobRateTrend: 'adminApi.getInstallerJobRateTrend',
    generateReport: 'adminApi.generateReport',
    getQADashboardData: 'adminApi.getQADashboardData',
    getQAProjects: 'adminApi.getQAProjects',
    getQAProject: 'adminApi.getQAProject',
    getMeshGrids:
      domain === 'admin'
        ? 'adminApi.getMeshGrids'
        : domain === 'company'
          ? 'companyApi.getMeshGrids'
          : domain === 'installer'
            ? 'installerApi.getMeshGrids'
            : '—',
    getMeshGridById:
      domain === 'admin'
        ? 'adminApi.getMeshGridById'
        : domain === 'company'
          ? 'companyApi.getMeshGridById'
          : domain === 'installer'
            ? 'installerApi.getMeshGridById'
            : '—',
    assignWorkflows: 'adminApi.assignWorkflows',
    assignInstallers: 'adminApi.assignInstallers',
    getMeshGridReports: 'adminApi.getMeshGridReports',
    getMeshGridReportWorkflow: 'adminApi.getMeshGridReportWorkflow',
    updateMeshGridReport: 'adminApi.updateMeshGridReport',
    getMiniGrids: 'adminApi.getMiniGrids',
    getMiniGridById: 'adminApi.getMiniGridById',
    getMiniGridCompanyInstallers: 'adminApi.getMiniGridCompanyInstallers',
    assignInstallersToCompany: 'adminApi.assignInstallersToCompany',
    unassignInstallersFromCompany: 'adminApi.unassignInstallersFromCompany',
    getCommercialAudit: 'adminApi.getCommercialAudit',
    getCommercialAuditByJob: 'adminApi.getCommercialAuditByJob',
    getResidentialAudit: 'adminApi.getResidentialAudit',
    getResidentialAuditByJob: 'adminApi.getResidentialAuditByJob',
    updateCommercialAudit: 'adminApi.updateCommercialAudit',
    updateResidentialAudit: 'adminApi.updateResidentialAudit',
    createInvoice: 'adminApi.createInvoice',
    sendInvoice: 'adminApi.sendInvoice',
    getAllInvoices: 'adminApi.getAllInvoices',
    updateInvoice: 'adminApi.updateInvoice',
    getInvoiceById: domain === 'admin' ? 'adminApi.getInvoiceById' : '—',
    getInvoiceByJobRequestId: 'adminApi.getInvoiceByJobRequestId',
    getInvoiceSettings: 'adminApi.getInvoiceSettings',
    updateInvoiceSettings: 'adminApi.updateInvoiceSettings',
    deleteInvoice: 'adminApi.deleteInvoice',
    searchInstallers: 'adminApi.searchInstallers',
    assignInstaller: 'adminApi.assignInstaller',
    unassignWorkflow: 'adminApi.unassignWorkflow',
    getInstallerProfile:
      domain === 'admin' ? 'adminApi.getInstallerProfile' : domain === 'installer' ? 'installerApi.getInstallerProfile' : '—',
    getCompanyProfile: 'companyApi.getCompanyProfile',
    updateCompanyUser: 'companyApi.updateCompanyUser',
    getJobRequestDetails:
      domain === 'company' ? 'companyApi.getJobRequestDetails' : domain === 'installer' ? 'installerApi.getJobRequestDetails' : '—',
    completeOrCancelJobRequest: 'companyApi.completeOrCancelJobRequest',
    createJobRequest: 'companyApi.createJobRequest',
    getCompanyTeamMembers: 'companyApi.getCompanyTeamMembers',
    getCompanyTeamMemberDetails: 'companyApi.getCompanyTeamMemberDetails',
    createCompanyTeamMember: 'companyApi.createCompanyTeamMember',
    updateCompanyTeamMember: 'companyApi.updateCompanyTeamMember',
    deleteCompanyTeamMember: 'companyApi.deleteCompanyTeamMember',
    getCompanyPermissions: 'companyApi.getCompanyPermissions',
    getCompanyRoles: 'companyApi.getCompanyRoles',
    createCompanyRole: 'companyApi.createCompanyRole',
    updateCompanyRole: 'companyApi.updateCompanyRole',
    deleteCompanyRole: 'companyApi.deleteCompanyRole',
    getCompanyInstallers: 'companyApi.getCompanyInstallers',
    updateProfile: 'companyApi.updateProfile',
    getDashboard: 'companyApi.getDashboard',
    getMiniGridJobRequests: 'companyApi.getMiniGridJobRequests',
    getMiniGridJobRequestDetails: 'companyApi.getMiniGridJobRequestDetails',
    createMiniGridJobRequest: 'companyApi.createMiniGridJobRequest',
    deleteMiniGridJobRequest: 'companyApi.deleteMiniGridJobRequest',
    getClusterJobRequests: 'companyApi.getClusterJobRequests',
    createClusterProject: 'companyApi.createClusterProject',
    getProjects:
      domain === 'company'
        ? 'companyApi.getProjects'
        : domain === 'installer'
          ? 'installerApi.getJobRequests'
          : '—',
    getProjectDetails:
      domain === 'company'
        ? 'companyApi.getProjectDetails'
        : domain === 'installer'
          ? 'installerApi.getJobRequestDetails'
          : '—',
    getLocationReport: 'companyApi.getLocationReport',
    getProjectReportDetail: 'companyApi.getProjectReportDetail',
    getProjectWorkflowReports: 'companyApi.getProjectWorkflowReports',
    approveOrRejectProjectBoq: 'companyApi.approveOrRejectProjectBoq',
    completeOrCancelProject: 'companyApi.completeOrCancelProject',
    submitInstallerRating: 'companyApi.submitInstallerRating',
    getRecentActivities:
      domain === 'company'
        ? 'companyApi.getRecentActivities'
        : domain === 'installer'
          ? 'installerApi.getRecentActivities'
          : domain === 'admin'
            ? 'adminApi.getNotifications'
            : '—',
    getDashboardOverview:
      domain === 'company' || domain === 'installer' ? `${domain}Api.getDashboardOverview` : '—',
    toggleInstallerAvailability: 'installerApi.toggleInstallerAvailability',
    getAllAssessments: 'installerApi.getAllAssessments',
    startAssessment: 'installerApi.startAssessment',
    submitAssessment: 'installerApi.submitAssessment',
    decideOnJobRequest: 'installerApi.decideOnJobRequest',
    updateBoq: 'installerApi.updateBoq',
    updateBoqItems: 'installerApi.updateBoqItems',
    getCommercialSiteAuditByJob: 'installerApi.getCommercialSiteAuditByJob',
    submitCommercialSiteAudit: 'installerApi.submitCommercialSiteAudit',
    updateCommercialSiteAudit: 'installerApi.updateCommercialSiteAudit',
    getResidentialSiteAuditByJob: 'installerApi.getResidentialSiteAuditByJob',
    submitResidentialSiteAudit: 'installerApi.submitResidentialSiteAudit',
    updateResidentialSiteAudit: 'installerApi.updateResidentialSiteAudit',
    getInstallerMiniGridJobRequests: 'installerApi.getInstallerMiniGridJobRequests',
    getInstallerMiniGridJobRequestDetails: 'installerApi.getInstallerMiniGridJobRequestDetails',
    getFinanceWallet: 'installerApi.getFinanceWallet',
    getInstallerWalletStats: 'installerApi.getInstallerWalletStats',
    getInstallerHmoContributionHistory: 'installerApi.getInstallerHmoContributionHistory',
    createWalletPin: 'installerApi.createWalletPin',
    createInstallerWallet: 'installerApi.createInstallerWallet',
    verifyInstallerWalletId: 'installerApi.verifyInstallerWalletId',
    getFinanceBanks: domain === 'installer' ? 'installerApi.getFinanceBanks' : '—',
    addInstallerBankAccount: 'installerApi.addInstallerBankAccount',
    resolveWalletAccountName: domain === 'installer' ? 'installerApi.resolveWalletAccountName' : '—',
    getWalletBankAccounts: 'installerApi.getWalletBankAccounts',
    deleteInstallerBankAccount: 'installerApi.deleteInstallerBankAccount',
    initiateWalletWithdrawal: 'installerApi.initiateWalletWithdrawal',
    confirmWalletWithdrawal: 'installerApi.confirmWalletWithdrawal',
    getInstallerPensionDetails: 'installerApi.getInstallerPensionDetails',
    getInstallerPensionContributionHistory: 'installerApi.getInstallerPensionContributionHistory',
    contactInstallerPensionProvider: 'installerApi.contactInstallerPensionProvider',
    linkInstallerPension: 'installerApi.linkInstallerPension',
    enrollInstallerPension: 'installerApi.enrollInstallerPension',
    getInstallerHmoDetails: 'installerApi.getInstallerHmoDetails',
    linkInstallerHmo: 'installerApi.linkInstallerHmo',
    enrollInstallerHmo: 'installerApi.enrollInstallerHmo',
    contactInstallerHmoProvider: 'installerApi.contactInstallerHmoProvider',
    getInstallerFinanceTransactions: 'installerApi.getInstallerFinanceTransactions',
    getInstallerProjectWorkflows: 'installerApi.getInstallerProjectWorkflows',
    getInstallerWorkflowSingle: 'installerApi.getInstallerWorkflowSingle',
    submitWorkflowContentStep: 'installerApi.submitWorkflowContentStep',
    acceptWorkflowPrecautions: 'installerApi.acceptWorkflowPrecautions',
    getStepChats:
      domain === 'installer'
        ? 'installerApi.getStepChats'
        : domain === 'admin'
          ? 'adminApi.getStepChats'
          : '—',
    getStepChatHistory:
      domain === 'installer'
        ? 'installerApi.getStepChatHistory'
        : domain === 'admin'
          ? 'adminApi.getStepChatHistory'
          : '—',
    getFinanceOverview: 'adminApi.getFinanceOverview',
    getTransactions: 'adminApi.getTransactions',
    generateFinancialReport: 'adminApi.generateFinancialReport',
    getInstallerWallets: 'adminApi.getInstallerWallets',
    getUnpaidProjects: 'adminApi.getUnpaidProjects',
    getUnpaidInstallers: 'adminApi.getUnpaidInstallers',
    exportUnpaidInstallers: 'adminApi.exportUnpaidInstallers',
    previewBulkPayout: 'adminApi.previewBulkPayout',
    confirmBulkPayout: 'adminApi.confirmBulkPayout',
    getCompaniesFinance: 'adminApi.getCompaniesFinance',
    getCompanyTransactions: 'adminApi.getCompanyTransactions',
    getCompanyBillingSummary: 'adminApi.getCompanyBillingSummary',
    getCompaniesFinanceOverview: 'adminApi.getCompaniesFinanceOverview',
    sendPaymentReminder: 'adminApi.sendPaymentReminder',
    savePaymentGateway: 'adminApi.savePaymentGateway',
    getPaymentGateway: 'adminApi.getPaymentGateway',
    getMasterAccount: 'adminApi.getMasterAccount',
    setTransactionPin: 'adminApi.setTransactionPin',
    updateTransactionPin: 'adminApi.updateTransactionPin',
    getPinStatus: 'adminApi.getPinStatus',
    getFinanceAuditTrail: 'adminApi.getFinanceAuditTrail',
    getInstallerProjects: 'adminApi.getInstallerProjects',
    getFinance: domain === 'company' ? 'companyApi.getFinance' : '—',
    getNotifications:
      domain === 'company'
        ? 'companyApi.getNotifications'
        : domain === 'admin'
          ? 'adminApi.getNotifications'
          : '—',
    getCompanyFinanceTransactions: 'companyApi.getCompanyFinanceTransactions',
    getCompanyFinanceBillingSummary: 'companyApi.getCompanyFinanceBillingSummary',
    getCompanyProjectFinanceInvoices: 'companyApi.getCompanyProjectFinanceInvoices',
    getCompanyFinanceBanks: 'companyApi.getCompanyFinanceBanks',
    resolveCompanyFinanceAccountName: 'companyApi.resolveCompanyFinanceAccountName',
    linkCompanyFinanceBankAccount: 'companyApi.linkCompanyFinanceBankAccount',
    getCompanyInvoiceById: 'companyApi.getCompanyInvoiceById',
    payCompanyInvoice: 'companyApi.payCompanyInvoice',
    initializeCompanyInvoicePayment: 'companyApi.initializeCompanyInvoicePayment',
    previewCompanyFinancePayment: 'companyApi.previewCompanyFinancePayment',
    confirmCompanyFinancePayment: 'companyApi.confirmCompanyFinancePayment',
    getWorkflows:
      domain === 'admin'
        ? 'adminApi.getWorkflows'
        : domain === 'company'
          ? 'companyApi.getWorkflows'
          : '—',
    getWorkflowById: domain === 'admin' ? 'adminApi.getWorkflowById' : '—',
    getWorkflowDetails: 'companyApi.getWorkflowDetails',
    createWorkflow:
      domain === 'admin'
        ? 'adminApi.createWorkflow'
        : domain === 'company'
          ? 'companyApi.createWorkflow'
          : '—',
    updateWorkflow:
      domain === 'admin'
        ? 'adminApi.updateWorkflow'
        : domain === 'company'
          ? 'companyApi.updateWorkflow'
          : '—',
    getWorkflowsByCompany: 'adminApi.getWorkflowsByCompany',
    duplicateWorkflow: 'adminApi.duplicateWorkflow',
    deleteWorkflow: 'adminApi.deleteWorkflow',
    getStoreOverviewAndOrders: 'companyApi.getStoreOverviewAndOrders',
    getStoreOrders: 'companyApi.getStoreOrders',
    getProducts: 'companyApi.getProducts',
    getProductById: 'companyApi.getProductById',
    createMeshGrid: domain === 'company' ? 'companyApi.createMeshGrid' : '—',
    updateMeshGrid: domain === 'company' ? 'companyApi.updateMeshGrid' : '—',
    deleteMeshGrid: 'companyApi.deleteMeshGrid',
    getReportLocations: 'companyApi.getReportLocations',
    getLocationCommunities: 'companyApi.getLocationCommunities',
    getCommunityDailyReports: 'companyApi.getCommunityDailyReports',
    getTechnicalDetails: 'companyApi.getTechnicalDetails',
    getReportContents: 'companyApi.getReportContents',
    updateInstallerProfile: 'installerApi.updateInstallerProfile',
    getInstallerMyRating: 'installerApi.getInstallerMyRating',
    updateSettings: 'installerApi.updateSettings',
    getInstallerLanguages: 'installerApi.getInstallerLanguages',
    getInstallerProducts: 'installerApi.getInstallerProducts',
    getInstallerBadges:
      domain === 'admin'
        ? 'adminApi.getInstallerBadges'
        : domain === 'installer'
          ? 'installerApi.getInstallerBadges'
          : '—',
    getStoreFrontOverview: 'installerApi.getStoreFrontOverview',
    getStoreFrontInterests: 'installerApi.getStoreFrontInterests',
    getStoreFrontProducts: 'installerApi.getStoreFrontProducts',
    createMeshGridReport: 'installerApi.createMeshGridReport',
    getMeshGridPersonalSummary: 'installerApi.getMeshGridPersonalSummary',
    getMeshGridProjectActivity: 'installerApi.getMeshGridProjectActivity',
    commissionMeshGridReport: 'installerApi.commissionMeshGridReport',
    generateOfflineSlots: 'installerApi.generateOfflineSlots',
    syncOfflineReport: 'installerApi.syncOfflineReport',
    getActiveToolboxTemplates: 'installerApi.getActiveToolboxTemplates',
    submitToolboxBrief: 'installerApi.submitToolboxBrief',
    getMyToolboxSubmissions: 'installerApi.getMyToolboxSubmissions',
    seedPricing: 'adminApi.seedPricing',
    getPricingItems: 'adminApi.getPricingItems',
    createPricingItem: 'adminApi.createPricingItem',
    updatePricingItem: 'adminApi.updatePricingItem',
    calculateQuote: 'adminApi.calculateQuote',
    createBadge: 'adminApi.createBadge',
    getAllBadges: 'adminApi.getAllBadges',
    updateBadge: 'adminApi.updateBadge',
    toggleBadgeStatus: 'adminApi.toggleBadgeStatus',
    assignBadgeToInstaller: 'adminApi.assignBadgeToInstaller',
    removeBadgeFromInstaller: 'adminApi.removeBadgeFromInstaller',
    autoAssignBadgeByCompany: 'adminApi.autoAssignBadgeByCompany',
    deleteBadge: 'adminApi.deleteBadge',
    getQuestions: 'adminApi.getQuestions',
    getQuestionById: 'adminApi.getQuestionById',
    createQuestions: 'adminApi.createQuestions',
    updateQuestion: 'adminApi.updateQuestion',
    deleteQuestion: 'adminApi.deleteQuestion',
    createLanguage: 'adminApi.createLanguage',
    getLanguages: 'adminApi.getLanguages',
    getLanguageById: 'adminApi.getLanguageById',
    updateLanguage: 'adminApi.updateLanguage',
    deleteLanguage: 'adminApi.deleteLanguage',
    createProductMetadata: 'adminApi.createProductMetadata',
    getAllProductMetadata: 'adminApi.getAllProductMetadata',
    getProductMetadataByType: 'adminApi.getProductMetadataByType',
    toggleProductMetadata: 'adminApi.toggleProductMetadata',
    deleteProductMetadata: 'adminApi.deleteProductMetadata',
    createAdPackage: 'adminApi.createAdPackage',
    getAdPackages: 'adminApi.getAdPackages',
    getAdPackage: 'adminApi.getAdPackage',
    updateAdPackage: 'adminApi.updateAdPackage',
    toggleAdPackageStatus: 'adminApi.toggleAdPackageStatus',
    deleteAdPackage: 'adminApi.deleteAdPackage',
    getAllConfigurations: 'adminApi.getAllConfigurations',
    editConfiguration: 'adminApi.editConfiguration',
    getAuditLogs: 'adminApi.getAuditLogs',
    createToolboxTemplate: 'adminApi.createToolboxTemplate',
    updateToolboxTemplate: 'adminApi.updateToolboxTemplate',
    getToolboxTemplates: 'adminApi.getToolboxTemplates',
    assignToolboxTemplateToJob: 'adminApi.assignToolboxTemplateToJob',
    getToolboxJobSubmissions: 'adminApi.getToolboxJobSubmissions',
    getToolboxSubmission: 'adminApi.getToolboxSubmission',
    deleteToolboxTemplate: 'adminApi.deleteToolboxTemplate',
    'authEndpoints.register': 'authApi.register',
    'commonEndpoints.uploadFile': 'sharedApi.uploadFiles',
  };
  return map[name] ?? '—';
}

function parseMarkdown(md) {
  const domains = {};
  let currentDomain = null;
  let currentSection = 'General';

  for (const line of md.split('\n')) {
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      if (h2[1] === 'Summary') {
        currentDomain = null;
        continue;
      }
      if (DOMAIN_MAP[h2[1]]) {
        currentDomain = DOMAIN_MAP[h2[1]];
        currentSection = 'General';
        domains[currentDomain] = { id: currentDomain, sections: [] };
      }
      continue;
    }
    const h3 = line.match(/^### (.+)/);
    if (h3 && currentDomain) {
      currentSection = h3[1];
      continue;
    }
    if (!line.startsWith('|') || line.includes('Method | Path') || line.match(/^\|[-| ]+\|$/)) continue;
    const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cols.length < 3) continue;

    const method = cols[0];
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].includes(method)) continue;

    const pathCol = cleanPath(cols[1]);
    const fnCol = cleanFn(cols[2]);
    const responseCol = cols.length >= 6 ? cols[5] : cols[3];

    let sdk = sdkFn(currentDomain, fnCol);
    if (pathCol.includes('guarantor-form')) sdk = 'authApi.submitGuarantorForm';
    if (pathCol.includes('BASE') && pathCol.includes('/company/update')) sdk = 'companyApi.updateProfile';
    if (pathCol.includes('BASE') && pathCol.includes('/company/dashboard')) sdk = 'companyApi.getDashboard';
    if (pathCol.includes('store-front/orders') && currentDomain === 'company') sdk = 'companyApi.getStoreOrders';
    const fn = sdk === '—' ? fnCol : sdk;
    const row = {
      method,
      path: pathCol,
      fn,
      response: normalizeResponse(responseCol),
      ...(SHIPPED.has(sdk) ? { shipped: true } : {}),
    };

    let section = domains[currentDomain].sections.find((s) => s.title === currentSection);
    if (!section) {
      section = { title: currentSection, endpoints: [] };
      domains[currentDomain].sections.push(section);
    }
    section.endpoints.push(row);
  }

  return domains;
}

function emitCatalog(domains) {
  fs.mkdirSync(outDir, { recursive: true });

  const meta = {
    auth: { title: 'Auth', summary: 'Registration, login, OTP, password, 2FA', service: 'BASE', sdkExport: 'authApi' },
    shared: { title: 'Shared', summary: 'Upload and chat (role-aware base)', service: 'mixed', sdkExport: 'sharedApi' },
    admin: { title: 'Admin', summary: 'Stats, users, jobs, finance, workflows, and more', service: 'ADMIN', sdkExport: 'adminApi' },
    company: { title: 'Company', summary: 'Profile, jobs, workflows, finance, mesh grid', service: 'COMPANY', sdkExport: 'companyApi' },
    installer: { title: 'Installer', summary: 'Profile, jobs, workflows, finance, assessment', service: 'INSTALLER', sdkExport: 'installerApi' },
  };

  const domainExports = [];

  for (const [id, data] of Object.entries(domains)) {
    const m = meta[id];
    const count = data.sections.reduce((n, s) => n + s.endpoints.length, 0);
    const file = `${id}.ts`;
    domainExports.push(id);

    const content = `// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const ${id}Domain: EndpointDomain = ${JSON.stringify(
      {
        id,
        title: m.title,
        summary: m.summary,
        endpointCount: count,
        service: m.service,
        sdkExport: m.sdkExport,
        sections: data.sections,
      },
      null,
      2,
    )} as EndpointDomain;
`;
    fs.writeFileSync(path.join(outDir, file), content);
  }

  const index = `// Auto-generated from API_ENDPOINTS.md
export type { EndpointRow, EndpointSection, EndpointDomain } from './types';
${domainExports.map((id) => `export { ${id}Domain } from './${id}';`).join('\n')}

import { authDomain } from './auth';
import { sharedDomain } from './shared';
import { adminDomain } from './admin';
import { companyDomain } from './company';
import { installerDomain } from './installer';

export const apiEndpointDomains = [
  authDomain,
  sharedDomain,
  adminDomain,
  companyDomain,
  installerDomain,
];

export const apiBaseUrls = [
  { alias: 'BASE', env: 'VITE_API_BASE_URL', usage: 'Auth, user CRUD, upload, legacy paths' },
  { alias: 'ADMIN', env: 'VITE_API_ADMIN_BASE_URL', usage: 'Admin portal service' },
  { alias: 'COMPANY', env: 'VITE_API_COMPANY_BASE_URL', usage: 'Company portal service' },
  { alias: 'INSTALLER', env: 'VITE_API_INSTOLLER_BASE_URL', usage: 'Installer portal service' },
] as const;
`;

  fs.writeFileSync(path.join(outDir, 'types.ts'), `export type EndpointRow = {
  method: string;
  path: string;
  fn: string;
  response: string;
  shipped?: boolean;
};

export type EndpointSection = {
  title: string;
  endpoints: EndpointRow[];
};

export type EndpointDomain = {
  id: string;
  title: string;
  summary: string;
  endpointCount: number;
  service: 'BASE' | 'ADMIN' | 'COMPANY' | 'INSTALLER' | 'mixed';
  sdkExport: string;
  sections: EndpointSection[];
};
`);

  fs.writeFileSync(path.join(outDir, 'index.ts'), index);
  console.log('Wrote catalog:', domainExports.map((id) => `${id} (${domains[id].sections.reduce((n, s) => n + s.endpoints.length, 0)})`).join(', '));
}

const md = fs.readFileSync(mdPath, 'utf8');
const domains = parseMarkdown(md);
emitCatalog(domains);
