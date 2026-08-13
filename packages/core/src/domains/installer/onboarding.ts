import { resolveCurrencyFromCountryCode } from '../../utils/currency';
import { COUNTRIES } from '../../core/app/countries';
import {
  installerExperienceFromUiLevel,
  isExperiencedInstaller,
  normalizeInstallerExperienceLevel,
  resolveInstallerUiExperienceLevel,
} from './experience';
import {
  INSTALLER_BRAND_OTHERS_VALUE,
  INSTALLER_ONBOARD_STEP_ORDER,
  INSTALLER_ONBOARD_STEPS,
  INSTALLER_ONBOARDING_WELCOME_UI_STEP,
  type InstallerOnboardStep,
  type InstallerOnboardingFormInput,
  type InstallerOnboardingUpdatePayload,
} from './onboarding.types';
import type { InstallerProfileRecordModel } from './types';

export function normalizePendingInstallerOnboardingSteps(
  raw: string[] | null | undefined,
): InstallerOnboardStep[] {
  const set = new Set(raw ?? []);
  return INSTALLER_ONBOARD_STEP_ORDER.filter((slug) => set.has(slug));
}

export function getPendingInstallerOnboardingSteps(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
): InstallerOnboardStep[] {
  return normalizePendingInstallerOnboardingSteps(profile?.onboardingStep);
}

export function isInstallerOnboardStepDone(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
  step: InstallerOnboardStep,
): boolean {
  return !getPendingInstallerOnboardingSteps(profile).includes(step);
}

export function isInstallerOnboardStepPending(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
  step: InstallerOnboardStep,
): boolean {
  return getPendingInstallerOnboardingSteps(profile).includes(step);
}

export function getFirstPendingInstallerOnboardStep(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
): InstallerOnboardStep | null {
  const pending = getPendingInstallerOnboardingSteps(profile);
  return pending[0] ?? null;
}

export function getUiStepForInstallerSlug(slug: InstallerOnboardStep): number {
  const index = INSTALLER_ONBOARD_STEP_ORDER.indexOf(slug);
  return index >= 0 ? index + 1 : 1;
}

export function getInstallerSlugForUiStep(uiStep: number): InstallerOnboardStep | null {
  return INSTALLER_ONBOARD_STEP_ORDER[uiStep - 1] ?? null;
}

export function getUiStepAfterInstallerWelcome(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
): number {
  const firstPending = getFirstPendingInstallerOnboardStep(profile);
  if (!firstPending) return INSTALLER_ONBOARDING_WELCOME_UI_STEP;
  return getUiStepForInstallerSlug(firstPending);
}

export function installerOnboardingProgressPercent(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
): number {
  const pendingCount = getPendingInstallerOnboardingSteps(profile).length;
  const completed = INSTALLER_ONBOARD_STEP_ORDER.length - pendingCount;
  return Math.round((completed / INSTALLER_ONBOARD_STEP_ORDER.length) * 100);
}

/** Complete when no pending slugs remain in `onboardingStep`. */
export function isInstallerOnboardingComplete(
  profile: Pick<InstallerProfileRecordModel, 'onboardingStep'> | null | undefined,
): boolean {
  return getPendingInstallerOnboardingSteps(profile).length === 0;
}

function toIsoString(value: string, fieldName: string): string {
  if (!value) throw new Error(`${fieldName} is required`);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }
  return d.toISOString();
}

function asRequiredNumber(
  values: Array<number | '' | string | null | undefined>,
  fieldName: string,
): number {
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(n)) return n;
  }
  throw new Error(`${fieldName} is required`);
}

function assessmentLevelFromExperience(experienceLevel: string | null | undefined): string {
  return normalizeInstallerExperienceLevel(experienceLevel) === 'experienced'
    ? 'EXPERIENCED'
    : 'NEW';
}

/** Coerce API/profile document fields into URL arrays (never spread strings). */
export function normalizeDocumentUrlList(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

/** Prefer `experience`; fall back to onboarding-era assessmentLevel only (not LEVEL_*). */
export function experienceLevelFromAssessmentLevel(
  assessmentLevel: string | null | undefined,
  experience?: string | null | undefined,
): string | null {
  return resolveInstallerUiExperienceLevel(experience, assessmentLevel);
}

export function profileToInstallerOnboardingFormData(
  profile: InstallerProfileRecordModel | null | undefined,
): Partial<InstallerOnboardingFormInput> {
  if (!profile) return {};
  const countryName = profile.country ?? '';
  const countryCode =
    COUNTRIES.find((c) => c.name === countryName || c.countryCode === countryName)
      ?.countryCode ?? '';

  const lat =
    profile.latitude != null && String(profile.latitude).trim() !== ''
      ? Number(profile.latitude)
      : null;
  const lng =
    profile.longitude != null && String(profile.longitude).trim() !== ''
      ? Number(profile.longitude)
      : null;

  const brandUsed = [...(profile.brandUsed ?? [])];
  const skills = Array.isArray(profile.skills)
    ? profile.skills.filter((item): item is string => typeof item === 'string')
    : [];

  return {
    gender: profile.gender ?? '',
    dob: profile.dob ? String(profile.dob).slice(0, 10) : '',
    country: countryName,
    countryCode,
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
    state: profile.state ?? '',
    lga: profile.lga ?? '',
    address: profile.address ?? '',
    idType: profile.meansOfId ?? '',
    idNumber: profile.idNumber ?? '',
    language: (profile.language ?? '').trim(),
    eduQualUrl: profile.eduQualUrl ?? '',
    education: profile.eduQualUrl ?? '',
    minCapKva: profile.minCapKva ?? '',
    maxCapKva: profile.maxCapKva ?? '',
    yoe: profile.yoe != null ? String(profile.yoe) : '',
    brandUsed,
    brands: brandUsed,
    projectType: [...(profile.projectType ?? [])],
    projectTypes: (profile.projectType ?? []).filter((type) => type !== 'SOLAR'),
    cvUrl: normalizeDocumentUrlList(profile.cvUrl),
    eduCertUrl: normalizeDocumentUrlList(profile.eduCertUrl),
    trainCertUrl: normalizeDocumentUrlList(profile.trainCertUrl),
    prevProjectUrl: normalizeDocumentUrlList(profile.prevProjectUrl),
    minCapacity: profile.minCapKva != null ? String(profile.minCapKva) : '',
    maxCapacity: profile.maxCapKva != null ? String(profile.maxCapKva) : '',
    experienceYears: profile.yoe != null ? String(profile.yoe) : '',
    brandOther: '',
    occupation: typeof profile.occupation === 'string' ? profile.occupation : '',
    otherOccupation:
      typeof profile.otherOccupation === 'string' ? profile.otherOccupation : '',
    skills,
    motivation: typeof profile.motivation === 'string' ? profile.motivation : '',
  };
}

export function buildPersonalDetailsStepPayload(
  formData: InstallerOnboardingFormInput,
): InstallerOnboardingUpdatePayload {
  return {
    stepDone: INSTALLER_ONBOARD_STEPS.PERSONAL_DETAILS,
    gender: formData.gender,
    dob: toIsoString(formData.dob, 'Date of birth'),
    country: formData.country,
    countryCode: formData.countryCode,
    currency: resolveCurrencyFromCountryCode(formData.countryCode),
    state: formData.state,
    lga: formData.lga,
    address: formData.address,
    meansOfId: formData.idType,
    idNumber: formData.idNumber,
    language: formData.language,
    latitude: formData.latitude,
    longitude: formData.longitude,
  };
}

export function buildExperienceLevelStepPayload(
  experienceLevel: string | null,
): InstallerOnboardingUpdatePayload {
  return {
    stepDone: INSTALLER_ONBOARD_STEPS.EXPERIENCE_LEVEL,
    assessmentLevel: assessmentLevelFromExperience(experienceLevel),
    experience: installerExperienceFromUiLevel(experienceLevel),
  };
}

export function buildDocumentsStepPayload(
  formData: InstallerOnboardingFormInput,
  experienceLevel: string | null,
): InstallerOnboardingUpdatePayload {
  const payload: InstallerOnboardingUpdatePayload = {
    stepDone: INSTALLER_ONBOARD_STEPS.DOCUMENTS,
    experience: installerExperienceFromUiLevel(experienceLevel),
    cvUrl: formData.cvUrl,
    eduCertUrl: formData.eduCertUrl,
    trainCertUrl: formData.trainCertUrl,
    prevProjectUrl: formData.prevProjectUrl,
  };
  if (isExperiencedInstaller(experienceLevel)) {
    payload.eduQualUrl = formData.eduQualUrl || formData.education;
  }
  return payload;
}

export function resolveInstallerBrandUsedForApi(
  brands: string[],
  brandOther: string,
): string[] {
  const selected = brands.length > 0 ? brands : [];
  if (!selected.includes(INSTALLER_BRAND_OTHERS_VALUE)) {
    return selected;
  }

  const resolved = selected.filter((b) => b !== INSTALLER_BRAND_OTHERS_VALUE);
  const other = brandOther.trim();
  if (other) {
    resolved.push(other);
  }
  return resolved;
}

function resolveInstallerProjectTypesForApi(
  formData: Partial<InstallerOnboardingFormInput>,
): string[] {
  const types =
    (formData.projectTypes?.length ?? 0) > 0
      ? (formData.projectTypes ?? [])
      : (formData.projectType ?? []);
  return types.filter((type) => type !== 'SOLAR');
}

export function buildInstallerProfessionalDetailsUpdatePayload(
  formData: Partial<InstallerOnboardingFormInput>,
): Pick<
  InstallerOnboardingUpdatePayload,
  'minCapKva' | 'maxCapKva' | 'yoe' | 'brandUsed' | 'projectType' | 'eduQualUrl'
> {
  const brands =
    (formData.brandUsed?.length ?? 0) > 0
      ? (formData.brandUsed ?? [])
      : (formData.brands ?? []);

  return {
    minCapKva: asRequiredNumber(
      [formData.minCapacity, formData.minCapKva],
      'Minimum capacity',
    ),
    maxCapKva: asRequiredNumber(
      [formData.maxCapacity, formData.maxCapKva],
      'Maximum capacity',
    ),
    yoe: asRequiredNumber(
      [formData.experienceYears, formData.yoe],
      'Years of experience',
    ),
    brandUsed: resolveInstallerBrandUsedForApi(brands, formData.brandOther ?? ''),
    projectType: resolveInstallerProjectTypesForApi(formData),
    eduQualUrl: formData.eduQualUrl || formData.education || '',
  };
}

export function buildWorkExperienceStepPayload(
  formData: InstallerOnboardingFormInput,
  experienceLevel: string | null,
): InstallerOnboardingUpdatePayload {
  if (isExperiencedInstaller(experienceLevel)) {
    return {
      stepDone: INSTALLER_ONBOARD_STEPS.WORK_EXPERIENCE,
      experience: installerExperienceFromUiLevel(experienceLevel),
      ...buildInstallerProfessionalDetailsUpdatePayload(formData),
    };
  }

  return {
    stepDone: INSTALLER_ONBOARD_STEPS.WORK_EXPERIENCE,
    experience: installerExperienceFromUiLevel(experienceLevel),
    minCapKva: 0,
    maxCapKva: 0,
    yoe: asRequiredNumber([formData.experienceYears], 'Years of experience'),
    brandUsed: [],
    projectType: [],
    eduQualUrl: formData.eduQualUrl || formData.education,
    occupation: formData.occupation || undefined,
    otherOccupation: formData.otherOccupation || undefined,
    skills: formData.skills?.length ? formData.skills : undefined,
    motivation: formData.motivation || undefined,
  };
}

export function buildAssessmentStepPayload(): InstallerOnboardingUpdatePayload {
  return {
    stepDone: INSTALLER_ONBOARD_STEPS.ASSESSMENT,
  };
}

export function buildGuarantorFormStepPayload(): InstallerOnboardingUpdatePayload {
  return {
    stepDone: INSTALLER_ONBOARD_STEPS.GUARANTOR_FORM,
  };
}
