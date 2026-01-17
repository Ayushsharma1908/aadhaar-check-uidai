import {
  DistrictData,
  RiskLevel,
  AgeGroupMetric,
  UpdateGapMetric,
  Recommendation,
} from '../types';

/* ============================
   MOCK AGGREGATED DATA (DEMO)
   ============================ */

export const DISTRICT_DATASET: DistrictData[] = [
  {
    id: '1',
    name: 'Pune',
    state: 'Maharashtra',
    freshnessScore: 88,
    recordsNeedingUpdatePct: 12,
    authFailureRate: 2.1,
    migrationIndex: 8.5,
    riskLevel: RiskLevel.LOW,
    lastUpdated: '2023-10-01',
  },
  {
    id: '2',
    name: 'Thane',
    state: 'Maharashtra',
    freshnessScore: 72,
    recordsNeedingUpdatePct: 28,
    authFailureRate: 5.4,
    migrationIndex: 9.2,
    riskLevel: RiskLevel.MEDIUM,
    lastUpdated: '2023-09-15',
  },
  {
    id: '3',
    name: 'Raichur',
    state: 'Karnataka',
    freshnessScore: 45,
    recordsNeedingUpdatePct: 55,
    authFailureRate: 12.1,
    migrationIndex: 4.2,
    riskLevel: RiskLevel.CRITICAL,
    lastUpdated: '2023-07-11',
  },
];

export const AGE_RISK_DATA: AgeGroupMetric[] = [
  { ageGroup: '0-5', updateDelayDays: 450, authFailureProb: 0.15 },
  { ageGroup: '18-35', updateDelayDays: 120, authFailureProb: 0.05 },
  { ageGroup: '60+', updateDelayDays: 800, authFailureProb: 0.25 },
];

export const UPDATE_GAP_DATA: UpdateGapMetric[] = [
  { type: 'Address', urbanGap: 15, ruralGap: 35 },
  { type: 'Mobile', urbanGap: 8, ruralGap: 42 },
  { type: 'Biometric', urbanGap: 25, ruralGap: 55 },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    title: 'Target High-Migration Zones',
    description: 'Deploy mobile update vans in high migration districts.',
    priority: 'High',
    actionType: 'Infrastructure',
  },
  {
    id: 'r2',
    title: 'Senior Citizen Doorstep Services',
    description: 'High biometric failure among 60+ age group.',
    priority: 'Medium',
    actionType: 'Service',
  },
];

/* ============================
   SAFE FALLBACK UTILITIES
   ============================ */

const fallbackDistricts = (state?: string): DistrictData[] => {
  if (!state || state === 'All States') {
    return DISTRICT_DATASET;
  }

  const filtered = DISTRICT_DATASET.filter(
    (d) => d.state.toLowerCase() === state.toLowerCase()
  );

  // 🔴 KEY FIX: prevent empty datasets → charts breaking
  return filtered.length > 0 ? filtered : DISTRICT_DATASET;
};

/* ============================
   PUBLIC DATA SERVICES
   ============================ */

export const getDistricts = async (state?: string): Promise<DistrictData[]> => {
  return Promise.resolve(fallbackDistricts(state));
};

export const getAggregatedStats = async () => {
  const data = DISTRICT_DATASET;

  const total = data.length;

  const freshnessScore =
    Math.round(data.reduce((s, d) => s + d.freshnessScore, 0) / total);

  const updatesRequiredPct =
    Math.round(data.reduce((s, d) => s + d.recordsNeedingUpdatePct, 0) / total);

  const authFailureRate =
    Number(
      (
        data.reduce((s, d) => s + d.authFailureRate, 0) / total
      ).toFixed(2)
    );

  const highRiskDistricts = data.filter(
    (d) => d.riskLevel === RiskLevel.HIGH || d.riskLevel === RiskLevel.CRITICAL
  ).length;

  return Promise.resolve({
    freshnessScore,            // ← card 1
    updatesRequiredPct,        // ← card 2
    highRiskDistricts,         // ← card 3
    authFailureRate,           // ← card 4
    trend: 2.4,                // ← mock trend % (vs last month)
  });
};


export const getUpdateGapAnalysis = async (): Promise<UpdateGapMetric[]> => {
  return Promise.resolve(UPDATE_GAP_DATA);
};

export const getMigrationImpactData = async (): Promise<DistrictData[]> => {
  return Promise.resolve(DISTRICT_DATASET);
};

export const getAgeRiskMetrics = async (): Promise<AgeGroupMetric[]> => {
  return Promise.resolve(AGE_RISK_DATA);
};

export const getAIRecommendations = async (): Promise<Recommendation[]> => {
  return Promise.resolve(RECOMMENDATIONS);
};

export const getAllStates = async (): Promise<string[]> => {
  return Promise.resolve([
    'All States',
    'Maharashtra',
    'Karnataka',
    'Haryana',
    'Rajasthan',
    'Jharkhand',
    'Uttarakhand',
  ]);
};

export const getCitizenStatus = async (token: string) => {
  // Demo-safe mock citizen status
  return Promise.resolve({
    aadhaarMasked: 'XXXX-XXXX-1234',
    lastUpdated: '2023-09-18',
    freshnessScore: 76,
    riskFlags: [],
    message: 'Your Aadhaar data is currently valid.',
  });
};

