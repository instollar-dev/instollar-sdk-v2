// Auto-generated from API_ENDPOINTS.md — do not edit by hand
import type { EndpointDomain } from './types';

export const companyDomain: EndpointDomain = {
  "id": "company",
  "title": "Company",
  "summary": "Profile, jobs, workflows, finance, mesh grid",
  "endpointCount": 68,
  "service": "COMPANY",
  "sdkExport": "companyApi",
  "sections": [
    {
      "title": "Profile & Onboarding",
      "endpoints": [
        {
          "method": "GET",
          "path": "COMPANY + /company/profile",
          "fn": "companyApi.getCompanyProfile",
          "response": "ApiResponse<CompanyProfileModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/update-user",
          "fn": "companyApi.updateCompanyUser",
          "response": "ApiResponse<CompanyProfileModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/update",
          "fn": "adminApi.updateCompany",
          "response": "ApiResponse<CompanyProfileModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "BASE + /company/update",
          "fn": "companyApi.updateProfile",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /company/dashboard",
          "fn": "companyApi.getDashboard",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Dashboard & Notifications",
      "endpoints": [
        {
          "method": "GET",
          "path": "COMPANY + /dashboard/overview",
          "fn": "companyApi.getDashboardOverview",
          "response": "ApiResponse<DashboardOverviewDataModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/notifications",
          "fn": "companyApi.getRecentActivities",
          "response": "ApiResponse<CompanyNotificationItemModel[]> or PaginatedApiResponse<AdminNotificationModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /company/notifications/:id/read",
          "fn": "companyApi.markNotificationRead",
          "response": "ApiResponse<AdminNotificationModel>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Job Requests",
      "endpoints": [
        {
          "method": "GET",
          "path": "COMPANY + /job-request/get-all",
          "fn": "companyApi.getJobRequests",
          "response": "ApiResponse<JobRequestItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /job-request/get-single/:requestId",
          "fn": "companyApi.getJobRequestDetails",
          "response": "ApiResponse<CompanyJobRequestSingleApiModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /job-request/complete-cancel/:id/:status",
          "fn": "companyApi.completeOrCancelJobRequest",
          "response": "ApiResponse<{ message? }>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /job-request/create",
          "fn": "companyApi.createJobRequest",
          "response": "ApiResponse<{ requestId, message }>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /job-requests/cluster",
          "fn": "companyApi.getClusterJobRequests",
          "response": "ApiResponse<ClusterJobRequestItemModel[]>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /job-requests/cluster",
          "fn": "companyApi.createClusterProject",
          "response": "ApiResponse<ApiResponse<CreateMeshClusterModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /mini-grid/get-all",
          "fn": "companyApi.getMiniGridJobRequests",
          "response": "ApiResponse<MiniGridJobRequestApiItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /mini-grid/single/:jobId",
          "fn": "companyApi.getMiniGridJobRequestDetails",
          "response": "ApiResponse<MiniGridJobRequestApiItemModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /mini-grid/create",
          "fn": "companyApi.createMiniGridJobRequest",
          "response": "ApiResponse<ApiResponse<CreateMiniGridJobRequestModel>>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "COMPANY + /mini-grid/delete/:id",
          "fn": "companyApi.deleteMiniGridJobRequest",
          "response": "ApiResponse<{ message? }>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Projects",
      "endpoints": [
        {
          "method": "GET",
          "path": "COMPANY + /job-request/get-all",
          "fn": "companyApi.getProjects",
          "response": "ApiResponse<ProjectListApiRowModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /job-request/get-single/:projectId",
          "fn": "companyApi.getProjectDetails",
          "response": "ApiResponse<ProjectDetailApiPayloadModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /projects/cluster/:projectId/location-report",
          "fn": "companyApi.getLocationReport",
          "response": "ApiResponse<ApiResponse<LocationReportModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /project-report/:projectId",
          "fn": "companyApi.getProjectReportDetail",
          "response": "ApiResponse<ApiResponse<ProjectReportDetailModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /workflows/reports/:projectId",
          "fn": "companyApi.getProjectWorkflowReports",
          "response": "ApiResponse<ProjectWorkflowReportRowModel[]>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /job-request/approve/:requestId",
          "fn": "companyApi.approveOrRejectProjectBoq",
          "response": "ApiResponse<{ message? }>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /job-request/complete-cancel/:requestId/:decision",
          "fn": "companyApi.completeOrCancelProject",
          "response": "ApiResponse<{ message? }>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /ratings/installer",
          "fn": "companyApi.submitInstallerRating",
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
          "path": "COMPANY + /workflows/get-all",
          "fn": "companyApi.getWorkflows",
          "response": "ApiResponse<WorkflowItemModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /workflows/single/:workflowId",
          "fn": "companyApi.getWorkflowDetails",
          "response": "ApiResponse<WorkflowDetailApiModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /workflows/create",
          "fn": "companyApi.createWorkflow",
          "response": "ApiResponse<ApiResponse<CreateWorkflowModel>>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /workflows/update/:workflowId",
          "fn": "companyApi.updateWorkflow",
          "response": "ApiResponse<ApiResponse<CreateWorkflowModel>>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Team Members, Roles, Permissions",
      "endpoints": [
        {
          "method": "GET",
          "path": "BASE + /user/get-all",
          "fn": "companyApi.getCompanyTeamMembers",
          "response": "ApiResponse<CompanyTeamMemberModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "ADMIN + /crm/get-user/:userId",
          "fn": "companyApi.getCompanyTeamMemberDetails",
          "response": "ApiResponse<CompanyTeamMemberDetailModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "BASE + /user/create",
          "fn": "companyApi.createCompanyTeamMember",
          "response": "ApiResponse<CompanyTeamMemberModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "BASE + /user/update/:id",
          "fn": "companyApi.updateCompanyTeamMember",
          "response": "ApiResponse<CompanyTeamMemberModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "BASE + /user/delete/:id",
          "fn": "companyApi.deleteCompanyTeamMember",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /role/get-all-permissions",
          "fn": "companyApi.getCompanyPermissions",
          "response": "ApiResponse<CompanyPermissionModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /role/get-all",
          "fn": "companyApi.getCompanyRoles",
          "response": "ApiResponse<PaginatedList<CompanyRoleModel>>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /role/create",
          "fn": "companyApi.createCompanyRole",
          "response": "ApiResponse<CompanyRoleModel>",
          "shipped": true
        },
        {
          "method": "PUT",
          "path": "COMPANY + /role/update/:id",
          "fn": "companyApi.updateCompanyRole",
          "response": "ApiResponse<CompanyRoleModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "COMPANY + /role/delete/:id",
          "fn": "companyApi.deleteCompanyRole",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /mini-grid/get-all-installers",
          "fn": "companyApi.getCompanyInstallers",
          "response": "ApiResponse<CompanyInstallerModel[]>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Finance (Company)",
      "endpoints": [
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/overview",
          "fn": "companyApi.getFinance",
          "response": "ApiResponse<CompanyFinanceOverviewModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /notifications",
          "fn": "companyApi.getNotifications",
          "response": "ApiResponse<FinanceAlertModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/transactions",
          "fn": "companyApi.getCompanyFinanceTransactions",
          "response": "PaginatedApiResponse<CompanyFinanceTransactionModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/billing-summary",
          "fn": "companyApi.getCompanyFinanceBillingSummary",
          "response": "ApiResponse<CompanyFinanceBillingSummaryModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/projects/:projectId/invoices",
          "fn": "companyApi.getCompanyProjectFinanceInvoices",
          "response": "ApiResponse<CompanyProjectFinanceInvoiceListModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/banks",
          "fn": "companyApi.getCompanyFinanceBanks",
          "response": "ApiResponse<FinanceBankModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/finance/resolve-account",
          "fn": "companyApi.resolveCompanyFinanceAccountName",
          "response": "ApiResponse<ResolvedWalletAccountDataModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/finance/bank-account",
          "fn": "companyApi.linkCompanyFinanceBankAccount",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /company/invoices/id/:id",
          "fn": "companyApi.getCompanyInvoiceById",
          "response": "ApiResponse<InvoiceModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/invoices/:id/pay",
          "fn": "companyApi.payCompanyInvoice",
          "response": "ApiResponse<unknown>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/finance/invoices/initialize-payment",
          "fn": "companyApi.initializeCompanyInvoicePayment",
          "response": "ApiResponse<CompanyInitializeInvoicePaymentDataModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/finance/:companyId/payment/preview",
          "fn": "companyApi.previewCompanyFinancePayment",
          "response": "ApiResponse<CompanyFinancePaymentPreviewDataModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /company/finance/:companyId/payment/confirm",
          "fn": "companyApi.confirmCompanyFinancePayment",
          "response": "ApiResponse<unknown>",
          "shipped": true
        }
      ]
    },
    {
      "title": "Store Front & Mesh Grid (Company)",
      "endpoints": [
        {
          "method": "GET",
          "path": "BASE + /store-front/overview",
          "fn": "companyApi.getStoreOverviewAndOrders",
          "response": "ApiResponse<StoreOverviewModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /store-front/orders",
          "fn": "companyApi.getStoreOrders",
          "response": "ApiResponse<ApiResponse<StoreOrderListModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /store-front/products",
          "fn": "companyApi.getProducts",
          "response": "ApiResponse<ApiResponse<StoreProductListModel>>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "BASE + /store-front/products/:id",
          "fn": "companyApi.getProductById",
          "response": "ApiResponse<StoreProductModel>",
          "shipped": true
        },
        {
          "method": "POST",
          "path": "COMPANY + /mesh-grid/create",
          "fn": "companyApi.createMeshGrid",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "PATCH",
          "path": "COMPANY + /mesh-grid/update/:id",
          "fn": "companyApi.updateMeshGrid",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /mesh-grid/get-all",
          "fn": "companyApi.getMeshGrids",
          "response": "ApiResponse<MeshGridProjectModel[]>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /mesh-grid/get-single/:id",
          "fn": "companyApi.getMeshGridById",
          "response": "ApiResponse<MeshGridProjectModel>",
          "shipped": true
        },
        {
          "method": "DELETE",
          "path": "COMPANY + /mesh-grid/delete/:id",
          "fn": "companyApi.deleteMeshGrid",
          "response": "ApiResponse<null>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /reports/:jobId/locations",
          "fn": "companyApi.getReportLocations",
          "response": "PaginatedApiResponse<MeshGridReportLocationModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /reports/locations/:locationId/communities",
          "fn": "companyApi.getLocationCommunities",
          "response": "PaginatedApiResponse<MeshGridReportCommunityModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /reports/communities/:communityId/daily-reports",
          "fn": "companyApi.getCommunityDailyReports",
          "response": "PaginatedApiResponse<MeshGridDailyReportModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /reports/technical-details/:reportId",
          "fn": "companyApi.getTechnicalDetails",
          "response": "ApiResponse<MeshGridTechnicalDetailModel>",
          "shipped": true
        },
        {
          "method": "GET",
          "path": "COMPANY + /reports/contents/:jobId/:reportId",
          "fn": "companyApi.getReportContents",
          "response": "PaginatedApiResponse<MeshGridReportContentModel>",
          "shipped": true
        }
      ]
    }
  ]
} as EndpointDomain;
