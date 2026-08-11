export type InstallerExperienceLevel = 'experienced' | 'new';

/** Backend `InstallerExperience` enum values. */
export const INSTALLER_EXPERIENCE = {
  EXPERIENCED: 'EXPERIENCED',
  IN_EXPERIENCED: 'IN_EXPERIENCED',
} as const;

export type InstallerExperience =
  (typeof INSTALLER_EXPERIENCE)[keyof typeof INSTALLER_EXPERIENCE];

function normalizeExperienceToken(value: string | null | undefined): string {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_');
}

/**
 * Normalize UI (`experienced` | `new`) or API (`EXPERIENCED` | `IN_EXPERIENCED`)
 * values for onboarding branching (documents, work experience, etc.).
 */
export function normalizeInstallerExperienceLevel(
  level: string | null | undefined,
): InstallerExperienceLevel {
  const n = normalizeExperienceToken(level);
  if (n === 'EXPERIENCED') return 'experienced';
  return 'new';
}

export function isExperiencedInstaller(level: string | null | undefined): boolean {
  return normalizeInstallerExperienceLevel(level) === 'experienced';
}

/** Map UI experience selection → API `experience` enum. */
export function installerExperienceFromUiLevel(
  level: string | null | undefined,
): InstallerExperience {
  return normalizeInstallerExperienceLevel(level) === 'experienced'
    ? INSTALLER_EXPERIENCE.EXPERIENCED
    : INSTALLER_EXPERIENCE.IN_EXPERIENCED;
}

/**
 * Resolve UI experience for forward/back onboarding flow.
 * Prefer profile `experience` (stable). Fall back only to onboarding-era
 * assessmentLevel values — never post-assessment LEVEL_* results.
 */
export function resolveInstallerUiExperienceLevel(
  experience?: string | null | undefined,
  assessmentLevel?: string | null | undefined,
): InstallerExperienceLevel | null {
  const fromExperience = normalizeExperienceToken(experience);
  if (fromExperience === 'EXPERIENCED') return 'experienced';
  if (
    fromExperience === 'IN_EXPERIENCED' ||
    fromExperience === 'INEXPERIENCED'
  ) {
    return 'new';
  }

  const fromAssessment = normalizeExperienceToken(assessmentLevel);
  if (fromAssessment === 'EXPERIENCED') return 'experienced';
  if (
    fromAssessment === 'IN_EXPERIENCED' ||
    fromAssessment === 'NEW' ||
    fromAssessment === 'INEXPERIENCED'
  ) {
    return 'new';
  }

  return null;
}
