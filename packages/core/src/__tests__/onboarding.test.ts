import { describe, expect, it } from 'vitest';
import {
  buildCompanyDetailsStepPayload,
  buildUploadDocumentsStepPayload,
  getFirstPendingOnboardStep,
  isCompanyOnboardingComplete,
  normalizePendingOnboardingSteps,
  onboardingProgressPercent,
} from '../domains/company/onboarding';
import {
  COMPANY_ONBOARD_STEP_ORDER,
  COMPANY_ONBOARD_STEPS,
  type CompanyOnboardingFormInput,
} from '../domains/company/onboarding.types';
import {
  buildAssessmentStepPayload,
  buildExperienceLevelStepPayload,
  buildGuarantorFormStepPayload,
  buildPersonalDetailsStepPayload,
  isInstallerOnboardingComplete,
  normalizePendingInstallerOnboardingSteps,
} from '../domains/installer/onboarding';
import {
  INSTALLER_ONBOARD_STEP_ORDER,
  INSTALLER_ONBOARD_STEPS,
} from '../domains/installer/onboarding.types';
import {
  INSTALLER_EXPERIENCE,
  installerExperienceFromUiLevel,
  isExperiencedInstaller,
  normalizeInstallerExperienceLevel,
} from '../domains/installer/experience';
import { resolveCurrencyFromCountryCode } from '../utils/currency';

describe('company onboarding helpers', () => {
  it('normalizes pending steps and drops unknown slugs', () => {
    expect(
      normalizePendingOnboardingSteps([
        'UPLOAD_DOCUMENTS',
        'UNKNOWN',
        'COMPANY_DETAILS',
      ]),
    ).toEqual([...COMPANY_ONBOARD_STEP_ORDER]);
  });

  it('treats empty onboardingStep as complete', () => {
    expect(isCompanyOnboardingComplete({ onboardingStep: [] })).toBe(true);
    expect(isCompanyOnboardingComplete({ onboardingStep: undefined })).toBe(true);
    expect(
      isCompanyOnboardingComplete({
        onboardingStep: [COMPANY_ONBOARD_STEPS.COMPANY_DETAILS],
      }),
    ).toBe(false);
  });

  it('returns first pending step and progress', () => {
    expect(
      getFirstPendingOnboardStep({
        onboardingStep: [COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS],
      }),
    ).toBe(COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS);
    expect(
      onboardingProgressPercent({
        onboardingStep: [COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS],
      }),
    ).toBe(50);
  });

  it('builds step payloads with stepDone', () => {
    const form: CompanyOnboardingFormInput = {
      companyType: ['SOLAR'],
      country: 'Nigeria',
      countryCode: 'NG',
      state: 'Lagos',
      lga: 'Ikeja',
      companyAddress: '12 Test St',
      contactPersonName: 'Ada',
      contactPersonEmail: 'ada@example.com',
      contactPersonPhone: '+2348012345678',
      businessRegistrationNumber: 'RC123',
      documents: ['https://cdn.example/doc.pdf'],
      nercLicenseNumber: '',
      latitude: 6.5,
      longitude: 3.3,
    };

    expect(buildCompanyDetailsStepPayload(form)).toMatchObject({
      stepDone: COMPANY_ONBOARD_STEPS.COMPANY_DETAILS,
      currency: 'NGN',
      contactPersonNumber: form.contactPersonPhone,
      headOfficeAddress: form.companyAddress,
    });
    expect(buildUploadDocumentsStepPayload(form)).toEqual({
      stepDone: COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS,
      companyType: ['SOLAR'],
      licenceNumber: '',
      registrationNumber: 'RC123',
      documents: ['https://cdn.example/doc.pdf'],
    });
  });
});

describe('installer onboarding helpers', () => {
  it('normalizes pending steps in canonical order', () => {
    expect(
      normalizePendingInstallerOnboardingSteps([
        'GUARANTOR_FORM',
        'PERSONAL_DETAILS',
        'NOPE',
      ]),
    ).toEqual([
      INSTALLER_ONBOARD_STEPS.PERSONAL_DETAILS,
      INSTALLER_ONBOARD_STEPS.GUARANTOR_FORM,
    ]);
    expect(INSTALLER_ONBOARD_STEP_ORDER).toHaveLength(6);
  });

  it('treats empty onboardingStep as complete', () => {
    expect(isInstallerOnboardingComplete({ onboardingStep: [] })).toBe(true);
    expect(
      isInstallerOnboardingComplete({
        onboardingStep: [INSTALLER_ONBOARD_STEPS.ASSESSMENT],
      }),
    ).toBe(false);
  });

  it('maps experience levels and builds payloads', () => {
    expect(normalizeInstallerExperienceLevel('EXPERIENCED')).toBe('experienced');
    expect(isExperiencedInstaller('new')).toBe(false);
    expect(installerExperienceFromUiLevel('experienced')).toBe(
      INSTALLER_EXPERIENCE.EXPERIENCED,
    );
    expect(installerExperienceFromUiLevel('new')).toBe(
      INSTALLER_EXPERIENCE.IN_EXPERIENCED,
    );

    expect(buildExperienceLevelStepPayload('experienced')).toEqual({
      stepDone: INSTALLER_ONBOARD_STEPS.EXPERIENCE_LEVEL,
      assessmentLevel: 'EXPERIENCED',
      experience: 'EXPERIENCED',
    });
    expect(buildAssessmentStepPayload()).toEqual({
      stepDone: INSTALLER_ONBOARD_STEPS.ASSESSMENT,
    });
    expect(buildGuarantorFormStepPayload()).toEqual({
      stepDone: INSTALLER_ONBOARD_STEPS.GUARANTOR_FORM,
    });

    const personal = buildPersonalDetailsStepPayload({
      gender: 'FEMALE',
      dob: '1990-01-15',
      country: 'Nigeria',
      countryCode: 'NG',
      state: 'Lagos',
      lga: 'Ikeja',
      address: '12 Test',
      idType: 'NIN',
      idNumber: '123',
      language: 'en',
      cvUrl: [],
      eduCertUrl: [],
      trainCertUrl: [],
      prevProjectUrl: [],
      latitude: null,
      longitude: null,
    });
    expect(personal.stepDone).toBe(INSTALLER_ONBOARD_STEPS.PERSONAL_DETAILS);
    expect(personal.currency).toBe('NGN');
    expect(personal.dob).toContain('1990-01-15');
  });
});

describe('resolveCurrencyFromCountryCode', () => {
  it('resolves known countries and falls back to NGN', () => {
    expect(resolveCurrencyFromCountryCode('NG')).toBe('NGN');
    expect(resolveCurrencyFromCountryCode('KE')).toBe('KES');
    expect(resolveCurrencyFromCountryCode('')).toBe('NGN');
  });
});
