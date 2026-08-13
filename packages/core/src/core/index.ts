export { initInstollarSDK } from './init';
export type { InitInstollarSDKOptions } from './init';

export { api, initAxios, getAxiosInstance, getSDKConfig, apiUrl, unwrap } from './api';
export * from './api/api-endpoints';

export {
  StorageKeys,
  initStorage,
  initStorageAuto,
  getStorage,
  isStorageInitialized,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  clearStorage,
  createWebStorage,
  createExpoSecureStorage,
  detectPlatform,
  isWeb,
  isMobile,
} from './storage';
export type { IStorage } from './storage';

export { toast, setToastHandler, clearToastHandler } from './toast';
export type { ToastHandler } from './toast';

export {
  confirm,
  setConfirmHandler,
  clearConfirmHandler,
} from './confirm';
export type {
  ConfirmHandler,
  ConfirmIconPreset,
  ConfirmOptions,
  ConfirmVariant,
} from './confirm';

export {
  authApi,
  authEndpoints,
  saveAuthSession,
  getAuthSession,
  clearAuthSession,
  sharedApi,
  commonEndpoints,
  adminApi,
  adminEndpoints,
  companyApi,
  companyEndpoints,
  installerApi,
  installerEndpoints,
  COMPANY_ONBOARD_STEPS,
  COMPANY_ONBOARD_STEP_ORDER,
  COMPANY_ONBOARDING_WELCOME_UI_STEP,
  normalizePendingOnboardingSteps,
  getPendingOnboardingSteps,
  isCompanyOnboardStepDone,
  isCompanyOnboardStepPending,
  getFirstPendingOnboardStep,
  getUiStepForSlug,
  getSlugForUiStep,
  getUiStepAfterWelcome,
  onboardingProgressPercent,
  isCompanyOnboardingComplete,
  profileToOnboardingFormData,
  buildCompanyDetailsStepPayload,
  buildUploadDocumentsStepPayload,
  INSTALLER_ONBOARD_STEPS,
  INSTALLER_ONBOARD_STEP_ORDER,
  INSTALLER_ONBOARDING_WELCOME_UI_STEP,
  INSTALLER_ASSESSMENT_PASS_PERCENT,
  INSTALLER_BRAND_OTHERS_VALUE,
  INSTALLER_EXPERIENCE,
  normalizeInstallerExperienceLevel,
  isExperiencedInstaller,
  installerExperienceFromUiLevel,
  resolveInstallerUiExperienceLevel,
  normalizePendingInstallerOnboardingSteps,
  getPendingInstallerOnboardingSteps,
  isInstallerOnboardStepDone,
  isInstallerOnboardStepPending,
  getFirstPendingInstallerOnboardStep,
  getUiStepForInstallerSlug,
  getInstallerSlugForUiStep,
  getUiStepAfterInstallerWelcome,
  installerOnboardingProgressPercent,
  isInstallerOnboardingComplete,
  experienceLevelFromAssessmentLevel,
  normalizeDocumentUrlList,
  profileToInstallerOnboardingFormData,
  buildPersonalDetailsStepPayload,
  buildExperienceLevelStepPayload,
  buildDocumentsStepPayload,
  resolveInstallerBrandUsedForApi,
  buildInstallerProfessionalDetailsUpdatePayload,
  buildWorkExperienceStepPayload,
  buildAssessmentStepPayload,
  buildGuarantorFormStepPayload,
} from '../domains';

export type {
  TokenData,
  AuthUserType,
  RefreshTokenModel,
  GeneralResponseModel,
  SortOrder,
  PaginationMeta,
  ApiResponse,
  PaginatedApiResponse,
  ApiService,
  InstollarBaseUrls,
  ServerError,
  ApiError,
  ApiRequestMetadata,
  CustomAxiosRequestConfig,
  CustomInternalAxiosRequestConfig,
  InstollarSDKConfig,
  Platform,
  ToastType,
  ToastOptions,
} from './types';

export type * from '../domains/auth/types';
export type * from '../domains/shared/types';
export type * from '../domains/admin/types';
export type * from '../domains/admin/finance.types';
export type * from '../domains/admin/crm.types';
export type * from '../domains/admin/roles.types';
export type * from '../domains/admin/onboarding.types';
export type * from '../domains/admin/job-requests.types';
export type * from '../domains/admin/workflow.types';
export type * from '../domains/admin/analytics.types';
export type * from '../domains/admin/mesh-grid.types';
export type * from '../domains/admin/site-audit.types';
export type * from '../domains/admin/invoice.types';
export type * from '../domains/admin/notifications.types';
export type * from '../domains/admin/catalog.types';
export type * from '../domains/company/types';
export type * from '../domains/company/store-mesh.types';
export type * from '../domains/company/finance.types';
export type * from '../domains/company/job-requests.types';
export type * from '../domains/company/mini-grid.types';
export type * from '../domains/company/team.types';
export type * from '../domains/company/notifications.types';
export type * from '../domains/company/profile.types';
export type * from '../domains/company/projects.types';
export type * from '../domains/company/workflow.types';
export type * from '../domains/company/onboarding.types';
export type * from '../domains/installer/types';
export type * from '../domains/installer/finance.types';
export type * from '../domains/installer/job-requests.types';
export type * from '../domains/installer/assessment.types';
export type * from '../domains/installer/site-audit.types';
export type * from '../domains/installer/notifications.types';
export type * from '../domains/installer/profile.types';
export type * from '../domains/installer/storefront.types';
export type * from '../domains/installer/workflow.types';
export type * from '../domains/installer/onboarding.types';
export type * from '../domains/installer/experience';
