// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const installerDomain: EndpointDomain = {
  "id": "installer",
  "title": "Installer",
  "summary": "Profile, jobs, workflows, finance, assessment",
  "endpointCount": 70,
  "service": "INSTALLER",
  "sdkExport": "installerApi",
  "sections": [
    {
      "title": "Profile, Settings, Languages, Products, Badges",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /installer/profile",
          "fn": "installerApi.getInstallerProfile",
          "response": "ApiResponse<InstallerProfileRecordModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/update",
          "fn": "installerApi.updateInstallerProfile",
          "response": "ApiResponse<InstallerProfileRecordModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/my-rating",
          "fn": "installerApi.getInstallerMyRating",
          "response": "ApiResponse<InstallerMyRatingModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /installer/toggle-availability",
          "fn": "installerApi.toggleInstallerAvailability",
          "response": "ApiResponse<ToggleInstallerAvailabilityModel>",
          "shipped": true
        },
        {
          "method": "PUT",
          "path": "BASE + /installer/settings",
          "fn": "installerApi.updateSettings",
          "response": "ApiResponse<InstallerSettingsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/languages",
          "fn": "installerApi.getInstallerLanguages",
          "response": "ApiResponse<InstallerLanguageModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/products",
          "fn": "installerApi.getInstallerProducts",
          "response": "ApiResponse<InstallerProductsMetadataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/badges",
          "fn": "installerApi.getInstallerBadges",
          "response": "ApiResponse<InstallerProfileBadgeModel[]>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Dashboard & Notifications",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /dashboard/overview",
          "fn": "installerApi.getDashboardOverview",
          "response": "ApiResponse<DashboardOverviewDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/notifications",
          "fn": "installerApi.getRecentActivities",
          "response": "ApiResponse<InstallerNotificationItemModel[]> or PaginatedApiResponse<AdminNotificationModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /installer/notifications/:id/read",
          "fn": "installerApi.markNotificationRead",
          "response": "ApiResponse<AdminNotificationModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Job Requests & Projects",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /job-request/get-all",
          "fn": "installerApi.getJobRequests",
          "response": "ApiResponse<JobRequestApiDataModel[]> / InstallerProjectData[]",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /job-request/view/:id",
          "fn": "installerApi.getJobRequestDetails",
          "response": "ApiResponse<JobRequestApiDataModel> / InstallerProjectData",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /job-request/accept-reject-job/:id",
          "fn": "installerApi.decideOnJobRequest",
          "response": "ApiResponse<JobRequestApiDataModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /job-request/update-boq/:id",
          "fn": "installerApi.updateBoq",
          "response": "ApiResponse<JobRequestApiDataModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /job-request/update-item/:jobId",
          "fn": "installerApi.updateBoqItems",
          "response": "ApiResponse<JobRequestApiDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /mini-grid/get-all",
          "fn": "installerApi.getInstallerMiniGridJobRequests",
          "response": "ApiResponse<MiniGridJobRequestApiItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /mini-grid/single/:jobId",
          "fn": "installerApi.getInstallerMiniGridJobRequestDetails",
          "response": "ApiResponse<MiniGridJobRequestApiItemModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Workflows & Site Audit",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /workflow/get-all/:projectId",
          "fn": "installerApi.getInstallerProjectWorkflows",
          "response": "ApiResponse<InstallerWorkflowApiRowModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /workflow/single/:projectId/:workflowId",
          "fn": "installerApi.getInstallerWorkflowSingle",
          "response": "ApiResponse<InstallerWorkflowSingleModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /workflow-content/submit/:jobId",
          "fn": "installerApi.submitWorkflowContentStep",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /job-request/accept-precautions/:requestId",
          "fn": "installerApi.acceptWorkflowPrecautions",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /workflow/step-chats/:stepId",
          "fn": "installerApi.getStepChats",
          "response": "ApiResponse<WorkflowStepChatModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /chat/history/step",
          "fn": "installerApi.getStepChatHistory",
          "response": "PaginatedApiResponse<WorkflowStepChatModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /site-audit/get-by-job/:jobRequestId",
          "fn": "installerApi.getCommercialSiteAuditByJob",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /site-audit/submit",
          "fn": "installerApi.submitCommercialSiteAudit",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /site-audit/update/:auditId",
          "fn": "installerApi.updateCommercialSiteAudit",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /residential-site-audit/get-by-job/:jobRequestId",
          "fn": "installerApi.getResidentialSiteAuditByJob",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /residential-site-audit/submit",
          "fn": "installerApi.submitResidentialSiteAudit",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /residential-site-audit/update/:auditId",
          "fn": "installerApi.updateResidentialSiteAudit",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Assessment",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /assessment/get-all",
          "fn": "installerApi.getAllAssessments",
          "response": "ApiResponse<AssessmentModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /assessment/start",
          "fn": "installerApi.startAssessment",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /assessment/submit",
          "fn": "installerApi.submitAssessment",
          "response": "ApiResponse<SubmitAssessmentModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Finance (Installer)",
      "endpoints": [
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/wallet",
          "fn": "installerApi.getFinanceWallet",
          "response": "ApiResponse<InstallerFinanceWalletModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/wallet/stats",
          "fn": "installerApi.getInstallerWalletStats",
          "response": "ApiResponse<InstallerWalletStatsDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/hmo/contributions",
          "fn": "installerApi.getInstallerHmoContributionHistory",
          "response": "ApiResponse<paginated HMO contributionsModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/wallet/create-pin",
          "fn": "installerApi.createWalletPin",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/wallet/create",
          "fn": "installerApi.createInstallerWallet",
          "response": "ApiResponse<ApiResponse<CreateInstallerWalletModel>>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/wallet/verify-id",
          "fn": "installerApi.verifyInstallerWalletId",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/banks",
          "fn": "installerApi.getFinanceBanks",
          "response": "ApiResponse<FinanceBankModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/wallet/link-bank",
          "fn": "installerApi.addInstallerBankAccount",
          "response": "ApiResponse<WalletBankAccountModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/wallet/resolve-account",
          "fn": "installerApi.resolveWalletAccountName",
          "response": "ApiResponse<ResolvedWalletAccountDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/wallet/bank-accounts",
          "fn": "installerApi.getWalletBankAccounts",
          "response": "ApiResponse<WalletBankAccountModel[]>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "INSTALLER + /installer/finance/wallet/bank-account/:bankAccountId",
          "fn": "installerApi.deleteInstallerBankAccount",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/initiate/withdrawal",
          "fn": "installerApi.initiateWalletWithdrawal",
          "response": "ApiResponse<string>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/confirm/withdrawal",
          "fn": "installerApi.confirmWalletWithdrawal",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/pension",
          "fn": "installerApi.getInstallerPensionDetails",
          "response": "ApiResponse<InstallerPensionPlanModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/pension/contributions",
          "fn": "installerApi.getInstallerPensionContributionHistory",
          "response": "ApiResponse<PensionContributionHistoryDataModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/pension/contact-provider",
          "fn": "installerApi.contactInstallerPensionProvider",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/pension/link",
          "fn": "installerApi.linkInstallerPension",
          "response": "ApiResponse<InstallerPensionPlanModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/pension/enroll",
          "fn": "installerApi.enrollInstallerPension",
          "response": "ApiResponse<InstallerPensionPlanModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/hmo",
          "fn": "installerApi.getInstallerHmoDetails",
          "response": "ApiResponse<InstallerHmoDetailsModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/hmo/link",
          "fn": "installerApi.linkInstallerHmo",
          "response": "ApiResponse<InstallerHmoDetailsModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/hmo/enroll",
          "fn": "installerApi.enrollInstallerHmo",
          "response": "ApiResponse<InstallerHmoDetailsModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /installer/finance/hmo/contact-provider",
          "fn": "installerApi.contactInstallerHmoProvider",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /installer/finance/wallet/transactions",
          "fn": "installerApi.getInstallerFinanceTransactions",
          "response": "PaginatedApiResponse<InstallerFinanceTransactionModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Storefront, Mesh Grid, Toolbox (Installer)",
      "endpoints": [
        {
          "method": "GET",
          "path": "BASE + /installer/storefront/overview",
          "fn": "installerApi.getStoreFrontOverview",
          "response": "ApiResponse<StoreFrontOverviewStatsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /installer/storefront/interests",
          "fn": "installerApi.getStoreFrontInterests",
          "response": "ApiResponse<InterestDataModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /installer/storefront/products",
          "fn": "installerApi.getStoreFrontProducts",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /mesh-grid/get-all",
          "fn": "installerApi.getMeshGrids",
          "response": "PaginatedApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /mesh-grid/single/:id",
          "fn": "installerApi.getMeshGridById",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /reports/create",
          "fn": "installerApi.createMeshGridReport",
          "response": "ApiResponse<WorkflowActivityModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /reports/personal-summary/:jobId",
          "fn": "installerApi.getMeshGridPersonalSummary",
          "response": "ApiResponse<MeshGridPersonalSummaryModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /reports/project-activity/:jobId",
          "fn": "installerApi.getMeshGridProjectActivity",
          "response": "PaginatedApiResponse<WorkflowActivityModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /reports/commission/:reportId",
          "fn": "installerApi.commissionMeshGridReport",
          "response": "ApiResponse<WorkflowActivityModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /reports/offline/generate-slots",
          "fn": "installerApi.generateOfflineSlots",
          "response": "ApiResponse<stringModel[]>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "INSTALLER + /reports/offline/sync",
          "fn": "installerApi.syncOfflineReport",
          "response": "ApiResponse<WorkflowActivityModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /toolbox/jobs/:jobId/active-templates",
          "fn": "installerApi.getActiveToolboxTemplates",
          "response": "ApiResponse<ToolboxTemplateModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "INSTALLER + /toolbox/jobs/:jobId/submit",
          "fn": "installerApi.submitToolboxBrief",
          "response": "ApiResponse<ToolboxSubmissionModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "INSTALLER + /toolbox/jobs/:jobId/my-submissions",
          "fn": "installerApi.getMyToolboxSubmissions",
          "response": "PaginatedApiResponse<ToolboxSubmissionModel>",
          "shipped": true
        }
      ]
    }
  ]
} as EndpointDomain;
