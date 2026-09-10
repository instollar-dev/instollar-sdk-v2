/** Installer SOS alert types and create payload. */

/** Known SOS issue categories (include OTHER for free-text). */
export const INSTALLER_SOS_ISSUE_TYPES = [
  'FIRE',
  'MEDICAL',
  'SECURITY',
  'ACCIDENT',
  'ELECTRICAL',
  'OTHER',
] as const;

export type InstallerSosIssueType = (typeof INSTALLER_SOS_ISSUE_TYPES)[number];

export type CreateInstallerSosPayload = {
  issueType: string;
  issue: string;
  /** Device GPS at the time of the alert (optional if permission / fix unavailable). */
  latitude?: number | null;
  longitude?: number | null;
};
