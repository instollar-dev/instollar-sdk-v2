/** Installer ESG dashboard + project ESG types. */

export type InstallerEsgDashboardPeriodModel = {
  from: string;
  to: string;
};

export type InstallerEsgEnvironmentalModel = {
  cleanEnergyDeployedKW: number;
  annualEnergyGeneratedKWh: number;
  co2AvoidedTCO2e: number;
  dieselDisplacedLitres: number;
  panelsInstalled: number;
};

export type InstallerEsgSocialModel = {
  projectsFacilitated: number;
  householdsReached: number;
  livesImpacted: number;
  statesWorkedIn: number;
  directJobsCreated: number;
  indirectJobsSupported: number;
  femaleInclusionCount: number;
  localLaborPercent: number;
};

export type InstallerEsgPerformanceModel = {
  totalProjectsCompleted: number;
  averageClientRating: number;
  onTimeRatePercent: number;
  projectsByType: Record<string, number>;
  totalEarningsNGN: number;
};

export type InstallerEsgScoreModel = {
  overall: number;
  grade: string;
  environmental: number;
  social: number;
  governance: number;
};

export type InstallerEsgDashboardModel = {
  installerId: string;
  fullName: string;
  level: string;
  gender: string;
  period: InstallerEsgDashboardPeriodModel;
  environmental: InstallerEsgEnvironmentalModel;
  social: InstallerEsgSocialModel;
  performance: InstallerEsgPerformanceModel;
  esgScore: InstallerEsgScoreModel | null;
  governanceVerification: unknown | null;
};

export type ProjectEsgEnvironmentalModel = {
  capacityInstalledKW: number;
  panelsInstalled: number;
  annualEnergyKWh: number;
  co2AvoidedTCO2e: number;
  dieselDisplacedLitres: number;
};

export type ProjectEsgSocialModel = {
  installersOnProject: number;
  livesImpacted: number;
  femaleInclusionCount: number;
  localLaborPercent: number;
  community: string;
};

export type ProjectEsgGovernanceModel = {
  gpsVerified: boolean;
  qaApproved: boolean;
  onTimeDelivery: boolean;
  firstTimeRight: boolean;
  auditLockHash: string;
};

export type ProjectEsgScoreModel = {
  overall: number;
  grade: string;
  environmental: number;
  social: number;
  governance: number;
};

export type ProjectEsgModel = {
  projectId: string;
  projectName: string;
  state: string;
  projectStatus: string;
  projectType: string;
  environmental: ProjectEsgEnvironmentalModel;
  social: ProjectEsgSocialModel;
  governance: ProjectEsgGovernanceModel;
  esgScore: ProjectEsgScoreModel | null;
};
