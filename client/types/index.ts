export enum RiskLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical'
}

export interface DistrictData {
    id: string;
    name: string;
    state: string;
    freshnessScore: number; // 0-100
    recordsNeedingUpdatePct: number;
    authFailureRate: number;
    migrationIndex: number; // 0-10, higher means high migration
    riskLevel: RiskLevel;
    lastUpdated: string;
}

export interface AgeGroupMetric {
    ageGroup: '0-5' | '18-35' | '60+';
    updateDelayDays: number; // Average days since last update
    authFailureProb: number; // 0-1 probability
}

export interface UpdateGapMetric {
    type: 'Address' | 'Mobile' | 'Biometric';
    urbanGap: number;
    ruralGap: number;
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    actionType: 'Campaign' | 'Service' | 'Infrastructure';
}

export interface UserSession {
    isAuthenticated: boolean;
    mobile: string;
    last4Aadhaar: string;
    demoStatus: {
        address: 'Fresh' | 'Stale';
        mobile: 'Linked' | 'Unlinked';
        biometric: 'Good' | 'Aging';
    };
}
