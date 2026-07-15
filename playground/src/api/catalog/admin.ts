// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const adminDomain: EndpointDomain = {
  "id": "admin",
  "title": "Admin",
  "summary": "Stats, users, jobs, finance, workflows, and more",
  "endpointCount": 153,
  "service": "ADMIN",
  "sdkExport": "adminApi",
  "sections": [
    {
      "title": "Stats & Analytics",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /admin/stats",
          "fn": "adminApi.getStats",
          "response": "ApiResponse<AdminStatsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/metrics",
          "fn": "adminApi.getDashboardMetrics",
          "response": "ApiResponse<DashboardMetricsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/overview",
          "fn": "adminApi.getAnalyticsOverview",
          "response": "ApiResponse<AnalyticsOverviewModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/payout-distribution",
          "fn": "adminApi.getPayoutDistribution",
          "response": "ApiResponse<PayoutDistributionModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/demographics",
          "fn": "adminApi.getDemographics",
          "response": "ApiResponse<DemographicsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/registrations",
          "fn": "adminApi.getRegistrations",
          "response": "ApiResponse<RegistrationsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/locations",
          "fn": "adminApi.getLocationStats",
          "response": "ApiResponse<LocationStatsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/company-jobs",
          "fn": "adminApi.getCompanyJobStats",
          "response": "ApiResponse<CompanyJobStatsModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /dashboard/installer-job-rate",
          "fn": "adminApi.getInstallerJobRateTrend",
          "response": "ApiResponse<InstallerJobRateTrendModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /dashboard/generate-report",
          "fn": "adminApi.generateReport",
          "response": "ApiResponse<GenerateReportModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /admin/qa/dashboard",
          "fn": "adminApi.getQADashboardData",
          "response": "ApiResponse<QADashboardDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /admin/qa/projects",
          "fn": "adminApi.getQAProjects",
          "response": "ApiResponse<ProjectItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /admin/qa/projects/:id",
          "fn": "adminApi.getQAProject",
          "response": "ApiResponse<ProjectDetailModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Users & CRM",
      "endpoints": [
        {
          "method": "GET",
          "path": "BASE + /user/get-all",
          "fn": "adminApi.getUsers",
          "response": "ApiResponse<PaginatedResponse<UserModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /user/get-all-company-users",
          "fn": "adminApi.getAllCompanyUsers",
          "response": "ApiResponse<PaginatedResponse<UserModel>>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/create",
          "fn": "adminApi.createUser",
          "response": "ApiResponse<UserModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "BASE + /user/update/:id",
          "fn": "adminApi.updateUser",
          "response": "ApiResponse<UserModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "BASE + /user/delete/:id",
          "fn": "adminApi.deleteUser",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /crm/update-installer/:id",
          "fn": "adminApi.updateInstaller",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /crm/user-jobs/:id/:userType",
          "fn": "adminApi.getUserJobs",
          "response": "PaginatedApiResponse<InstallerJobModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /crm/get-user/:id",
          "fn": "adminApi.getUserProfile",
          "response": "ApiResponse<User \\",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /crm/end-users",
          "fn": "adminApi.getEndUsers",
          "response": "ApiResponse<EndUserModel[]>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /crm/update-company/:id",
          "fn": "adminApi.updateCompany",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/profile",
          "fn": "adminApi.getAdminProfile",
          "response": "ApiResponse<AdminUserModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/update-profile",
          "fn": "adminApi.updateAdminProfile",
          "response": "ApiResponse<AdminUserModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /crm/complete-profile-reminder/:userId/:userType",
          "fn": "adminApi.sendProfileCompletionReminder",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Roles & Permissions",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /admin/get-all-permissions",
          "fn": "adminApi.getPermissions",
          "response": "ApiResponse<PaginatedResponse<PermissionModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /role/get-all",
          "fn": "adminApi.getRoles",
          "response": "ApiResponse<PaginatedResponse<RoleModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /role/single/:id",
          "fn": "adminApi.getRoleById",
          "response": "ApiResponse<RoleModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /role/create",
          "fn": "adminApi.createRole",
          "response": "ApiResponse<RoleModel>",
          "shipped": true
        },
        {
          "method": "PUT",
          "path": "ADMIN + /role/update/:id",
          "fn": "adminApi.updateRole",
          "response": "ApiResponse<RoleModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /role/delete/:id",
          "fn": "adminApi.deleteRole",
          "response": "ApiResponse<null>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Onboarding",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /admin/get-onboarded-admins",
          "fn": "adminApi.getOnboardedAdmins",
          "response": "PaginatedApiResponse<AdminUserModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/get-onboarded-companies",
          "fn": "adminApi.getOnboardedCompanies",
          "response": "PaginatedApiResponse<CompanyModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/assign-admin-to-company",
          "fn": "adminApi.assignAdminToCompany",
          "response": "ApiResponse<CompanyModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Job Requests",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /admin/job-requests/get-all",
          "fn": "adminApi.getJobRequests",
          "response": "PaginatedApiResponse<JobRequestModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/job-requests/single/:id",
          "fn": "adminApi.getJobRequestById",
          "response": "ApiResponse<JobRequestModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/job-requests/mark-complete/:id",
          "fn": "adminApi.markJobRequestAsComplete",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/job-requests/update-installation-date/:id",
          "fn": "adminApi.updateInstallationDate",
          "response": "ApiResponse<JobRequestModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/job-requests/cancel/:id",
          "fn": "adminApi.cancelJobRequest",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/job-requests/:jobRequestId/rate?raterType=",
          "fn": "adminApi.rateInstaller",
          "response": "ApiResponse<void>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /assign-installer/:jobRequestId/workflows/swap",
          "fn": "adminApi.swapWorkflow",
          "response": "ApiResponse<JobRequestModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Installer Assignment",
      "endpoints": [
        {
          "method": "POST",
          "path": "ADMIN + /assign-installer/search",
          "fn": "adminApi.searchInstallers",
          "response": "ApiResponse<InstallerSearchResultModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /assign-installer/assign/:jobRequestId",
          "fn": "adminApi.assignInstaller",
          "response": "ApiResponse<AssignInstallerResultModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /assign-installer/workflow/:jobRequestId",
          "fn": "adminApi.unassignWorkflow",
          "response": "ApiResponse<AssignInstallerResultModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /assign-installer/installer-profile/:installerId",
          "fn": "adminApi.getInstallerProfile",
          "response": "ApiResponse<InstallerProfileModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /installer/profile",
          "fn": "adminApi.verifyOnProfile",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Workflows",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /workflows/get-all",
          "fn": "adminApi.getWorkflows",
          "response": "ApiResponse<WorkflowModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /workflows/single/:id",
          "fn": "adminApi.getWorkflowById",
          "response": "ApiResponse<WorkflowModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /workflows/create",
          "fn": "adminApi.createWorkflow",
          "response": "ApiResponse<WorkflowModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /workflows/update/:id",
          "fn": "adminApi.updateWorkflow",
          "response": "ApiResponse<WorkflowModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /workflows/company/:companyId",
          "fn": "adminApi.getWorkflowsByCompany",
          "response": "ApiResponse<WorkflowModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /workflows/duplicate/:id",
          "fn": "adminApi.duplicateWorkflow",
          "response": "ApiResponse<WorkflowModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /workflows/delete/:id",
          "fn": "adminApi.deleteWorkflow",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /workflows/step-chats/:stepId",
          "fn": "adminApi.getStepChats",
          "response": "ApiResponse<WorkflowStepChatModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /chat/history/step",
          "fn": "adminApi.getStepChatHistory",
          "response": "PaginatedApiResponse<WorkflowStepChatModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Mesh Grid (Admin)",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /mesh-grid/get-all",
          "fn": "adminApi.getMeshGrids",
          "response": "PaginatedApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /mesh-grid/single/:id",
          "fn": "adminApi.getMeshGridById",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /mesh-grid/assign-workflows/:id",
          "fn": "adminApi.assignWorkflows",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /mesh-grid/assign/:id",
          "fn": "adminApi.assignInstallers",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /mesh-grid/reports/:jobId",
          "fn": "adminApi.getMeshGridReports",
          "response": "PaginatedApiResponse<AdminMeshGridReportModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /mesh-grid/report-workflows/:jobId/:workflowId",
          "fn": "adminApi.getMeshGridReportWorkflow",
          "response": "ApiResponse<AdminMeshGridWorkflowModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /mesh-grid/update-report/:reportId",
          "fn": "adminApi.updateMeshGridReport",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Mini Grid (Admin)",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /mini-grid/get-all",
          "fn": "adminApi.getMiniGrids",
          "response": "PaginatedApiResponse<JobRequestModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /mini-grid/single/:id",
          "fn": "adminApi.getMiniGridById",
          "response": "ApiResponse<JobRequestModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /mini-grid/get-all-installers/:companyId",
          "fn": "adminApi.getMiniGridCompanyInstallers",
          "response": "PaginatedApiResponse<unknownModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /mini-grid/assign-installer-to-company",
          "fn": "adminApi.assignInstallersToCompany",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /mini-grid/unassign-installer-to-company",
          "fn": "adminApi.unassignInstallersFromCompany",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Site Audit (Admin)",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /site-audit/commercial-audit/:auditId",
          "fn": "adminApi.getCommercialAudit",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /site-audit/commercial-job/:jobRequestId",
          "fn": "adminApi.getCommercialAuditByJob",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /site-audit/residential-audit/:auditId",
          "fn": "adminApi.getResidentialAudit",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /site-audit/residential-job/:jobRequestId",
          "fn": "adminApi.getResidentialAuditByJob",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /site-audit/update-commercial/:auditId",
          "fn": "adminApi.updateCommercialAudit",
          "response": "ApiResponse<CommercialSiteAuditModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /site-audit/update-residential/:auditId",
          "fn": "adminApi.updateResidentialAudit",
          "response": "ApiResponse<ResidentialSiteAuditModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Finance (Admin)",
      "endpoints": [
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/overview",
          "fn": "adminApi.getFinanceOverview",
          "response": "ApiResponse<AdminFinanceOverviewModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/transactions",
          "fn": "adminApi.getTransactions",
          "response": "PaginatedApiResponse<TransactionModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/reports/generate",
          "fn": "adminApi.generateFinancialReport",
          "response": "ApiResponse<ApiResponse<GenerateReportModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/installer-wallets",
          "fn": "adminApi.getInstallerWallets",
          "response": "PaginatedApiResponse<InstallerWalletModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/installer/:installerId/view_unpaid_projects",
          "fn": "adminApi.getUnpaidProjects",
          "response": "PaginatedApiResponse<UnpaidProjectModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/unpaid-installers",
          "fn": "adminApi.getUnpaidInstallers",
          "response": "PaginatedApiResponse<UnpaidInstallerModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/installers/unpaid/export",
          "fn": "adminApi.exportUnpaidInstallers",
          "response": "Blob",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/installers/payout/preview",
          "fn": "adminApi.previewBulkPayout",
          "response": "ApiResponse<ApiResponse<PayoutPreviewModel>>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/installers/payout/confirm",
          "fn": "adminApi.confirmBulkPayout",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/companies",
          "fn": "adminApi.getCompaniesFinance",
          "response": "PaginatedApiResponse<CompanyFinanceModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/companies/:companyId/transactions",
          "fn": "adminApi.getCompanyTransactions",
          "response": "PaginatedApiResponse<TransactionModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/companies/:companyId/billing_summary",
          "fn": "adminApi.getCompanyBillingSummary",
          "response": "ApiResponse<CompanyBillingSummaryModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/companies/overview",
          "fn": "adminApi.getCompaniesFinanceOverview",
          "response": "ApiResponse<CompaniesAdminFinanceOverviewModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/companies/payment-reminder",
          "fn": "adminApi.sendPaymentReminder",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/config/payment-gateway",
          "fn": "adminApi.savePaymentGateway",
          "response": "ApiResponse<PaymentGatewayConfigModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/config/payment-gateway",
          "fn": "adminApi.getPaymentGateway",
          "response": "ApiResponse<PaymentGatewayConfigModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/config/master-account",
          "fn": "adminApi.getMasterAccount",
          "response": "ApiResponse<MasterAccountDataModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/finance/config/pin/set",
          "fn": "adminApi.setTransactionPin",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "PUT",
          "path": "ADMIN + /admin/finance/config/pin/update",
          "fn": "adminApi.updateTransactionPin",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/config/pin/status",
          "fn": "adminApi.getPinStatus",
          "response": "ApiResponse<PinStatusModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/audit-trail",
          "fn": "adminApi.getFinanceAuditTrail",
          "response": "ApiResponse<ApiResponse<FinanceAuditTrailModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/finance/installers/:installerId/projects",
          "fn": "adminApi.getInstallerProjects",
          "response": "PaginatedApiResponse<InstallerProjectModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Invoices (Admin)",
      "endpoints": [
        {
          "method": "POST",
          "path": "ADMIN + /invoices/:jobRequestId/create",
          "fn": "adminApi.createInvoice",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /invoices/:invoiceId/send",
          "fn": "adminApi.sendInvoice",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /invoices/get-all",
          "fn": "adminApi.getAllInvoices",
          "response": "PaginatedApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /invoices/:invoiceId/update",
          "fn": "adminApi.updateInvoice",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /invoices/id/:invoiceId",
          "fn": "adminApi.getInvoiceById",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /invoices/job-request/:jobRequestId",
          "fn": "adminApi.getInvoiceByJobRequestId",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/invoice-settings",
          "fn": "adminApi.getInvoiceSettings",
          "response": "ApiResponse<InvoiceSettingsModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/invoice-settings",
          "fn": "adminApi.updateInvoiceSettings",
          "response": "ApiResponse<InvoiceSettingsModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /invoices/:invoiceId/delete",
          "fn": "adminApi.deleteInvoice",
          "response": "ApiResponse<null>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Pricing, Badges, Questions, Metadata",
      "endpoints": [
        {
          "method": "POST",
          "path": "ADMIN + /pricing-calculator/seed",
          "fn": "adminApi.seedPricing",
          "response": "ApiResponse<PricingItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /pricing-calculator/items",
          "fn": "adminApi.getPricingItems",
          "response": "PaginatedApiResponse<PricingItemModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /pricing-calculator/items",
          "fn": "adminApi.createPricingItem",
          "response": "ApiResponse<PricingItemModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /pricing-calculator/items/:id",
          "fn": "adminApi.updatePricingItem",
          "response": "ApiResponse<PricingItemModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /pricing-calculator/calculate",
          "fn": "adminApi.calculateQuote",
          "response": "ApiResponse<ApiResponse<CalculateQuoteModel>>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /badges/create",
          "fn": "adminApi.createBadge",
          "response": "ApiResponse<BadgeModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /badges/get-all",
          "fn": "adminApi.getAllBadges",
          "response": "PaginatedApiResponse<BadgeModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/badges/:installerId",
          "fn": "adminApi.getInstallerBadges",
          "response": "ApiResponse<InstallerBadgeListModel>",
          "shipped": true
        },
        {
          "method": "PUT",
          "path": "ADMIN + /badges/:id",
          "fn": "adminApi.updateBadge",
          "response": "ApiResponse<BadgeModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /badges/:id/status",
          "fn": "adminApi.toggleBadgeStatus",
          "response": "ApiResponse<BadgeModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/badges/assign",
          "fn": "adminApi.assignBadgeToInstaller",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /admin/badges/unassign/:installerId/:badgeId",
          "fn": "adminApi.removeBadgeFromInstaller",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /admin/badges/auto-assign/company/:companyId",
          "fn": "adminApi.autoAssignBadgeByCompany",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /badges/:id",
          "fn": "adminApi.deleteBadge",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /question-bank/get-all",
          "fn": "adminApi.getQuestions",
          "response": "ApiResponse<QuestionModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /question-bank/single/:id",
          "fn": "adminApi.getQuestionById",
          "response": "ApiResponse<QuestionModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /question-bank/create",
          "fn": "adminApi.createQuestions",
          "response": "ApiResponse<QuestionModel[]>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /question-bank/update/:id",
          "fn": "adminApi.updateQuestion",
          "response": "ApiResponse<QuestionModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /question-bank/delete/:id",
          "fn": "adminApi.deleteQuestion",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /language/create",
          "fn": "adminApi.createLanguage",
          "response": "ApiResponse<LanguageModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /language/get-all",
          "fn": "adminApi.getLanguages",
          "response": "PaginatedApiResponse<LanguageModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /language/get/:id",
          "fn": "adminApi.getLanguageById",
          "response": "ApiResponse<LanguageModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /language/update/:id",
          "fn": "adminApi.updateLanguage",
          "response": "ApiResponse<LanguageModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /language/delete/:id",
          "fn": "adminApi.deleteLanguage",
          "response": "ApiResponse<void>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /metadata",
          "fn": "adminApi.createProductMetadata",
          "response": "ApiResponse<ProductMetadataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /metadata",
          "fn": "adminApi.getAllProductMetadata",
          "response": "ApiResponse<ApiResponse<ProductMetadataListModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /metadata/:type",
          "fn": "adminApi.getProductMetadataByType",
          "response": "ApiResponse<ApiResponse<ProductMetadataModel>>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /metadata/:id/toggle",
          "fn": "adminApi.toggleProductMetadata",
          "response": "ApiResponse<ProductMetadataModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /metadata/:id",
          "fn": "adminApi.deleteProductMetadata",
          "response": "ApiResponse<void>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Ad Packages, Configuration, Audit, Toolbox, Notifications",
      "endpoints": [
        {
          "method": "POST",
          "path": "ADMIN + /admin/ad-packages/create",
          "fn": "adminApi.createAdPackage",
          "response": "ApiResponse<AdPackageModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/ad-packages",
          "fn": "adminApi.getAdPackages",
          "response": "ApiResponse<ApiResponse<AdPackageListModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/ad-packages/:id",
          "fn": "adminApi.getAdPackage",
          "response": "ApiResponse<AdPackageModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/ad-packages/:id",
          "fn": "adminApi.updateAdPackage",
          "response": "ApiResponse<AdPackageModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/ad-packages/:id/toggle-status",
          "fn": "adminApi.toggleAdPackageStatus",
          "response": "ApiResponse<void>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /admin/ad-packages/:id",
          "fn": "adminApi.deleteAdPackage",
          "response": "ApiResponse<void>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/get-all-configurations",
          "fn": "adminApi.getAllConfigurations",
          "response": "ApiResponse<ConfigurationListModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/edit-config/:configId",
          "fn": "adminApi.editConfiguration",
          "response": "ApiResponse<ConfigurationModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /audit-logs/get-all",
          "fn": "adminApi.getAuditLogs",
          "response": "ApiResponse<AuditLogModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /toolbox/templates",
          "fn": "adminApi.createToolboxTemplate",
          "response": "ApiResponse<ToolboxTemplateModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /toolbox/templates/:templateId",
          "fn": "adminApi.updateToolboxTemplate",
          "response": "ApiResponse<ToolboxTemplateModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /toolbox/templates",
          "fn": "adminApi.getToolboxTemplates",
          "response": "PaginatedApiResponse<ToolboxTemplateModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "ADMIN + /toolbox/jobs/:jobId/assign/:templateId",
          "fn": "adminApi.assignToolboxTemplateToJob",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /toolbox/jobs/:jobId/submissions",
          "fn": "adminApi.getToolboxJobSubmissions",
          "response": "PaginatedApiResponse<ToolboxSubmissionModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /toolbox/submissions/:submissionId",
          "fn": "adminApi.getToolboxSubmission",
          "response": "ApiResponse<ToolboxSubmissionModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "ADMIN + /toolbox/templates/:templateId",
          "fn": "adminApi.deleteToolboxTemplate",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/notifications",
          "fn": "adminApi.getNotifications",
          "response": "PaginatedApiResponse<AdminNotificationModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "ADMIN + /admin/notifications/:id/read",
          "fn": "adminApi.markNotificationRead",
          "response": "ApiResponse<AdminNotificationModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /admin/notifications *(bulk)*",
          "fn": "adminApi.markAllNotificationsRead",
          "response": "PaginatedApiResponse<AdminNotificationModel>",
          "shipped": true
        }
      ]
    }
  ]
} as EndpointDomain;
