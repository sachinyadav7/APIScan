// ============ Auth ============
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    name: string;
}

// ============ Organization ============
export interface Organization {
    id: string;
    name: string;
    slug: string;
    tier: 'FREE' | 'PRO' | 'ENTERPRISE';
    monthlyQuota: number;
    usedQuota: number;
    createdAt: string;
    members: MemberInfo[];
}

export interface MemberInfo {
    userId: string;
    email: string;
    name: string;
    role: 'OWNER' | 'ADMIN' | 'TESTER';
    invitedAt: string;
}

// ============ Project ============
export interface Project {
    id: string;
    orgId: string;
    name: string;
    description: string | null;
    baseUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// ============ Scan ============
export type ScanStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScanRequest {
    targetUrl: string;
    method: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    projectId?: string;
}

export interface VulnInfo {
    id: string;
    type: string;
    severity: Severity;
    description: string;
    evidence: string | null;
    remediation: string | null;
}

export interface ScanResponse {
    id: string;
    orgId: string;
    projectId: string | null;
    targetUrl: string;
    method: string;
    status: ScanStatus;
    durationMs: number | null;
    createdAt: string;
    vulnerabilities: VulnInfo[];
}

export interface ScanStatusResponse {
    scanId: string;
    status: ScanStatus;
    durationMs: number | null;
}

// ============ Billing ============
export interface UsageResponse {
    orgId: string;
    tier: string;
    monthlyQuota: number;
    usedQuota: number;
    remainingQuota: number;
    usagePercentage: number;
}

export interface Plan {
    tier: string;
    price: number;
    priceId?: string;
    scans: number | string;
    members: number | string;
    projects: number | string;
}

// ============ API Wrapper ============
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    timestamp: string;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
