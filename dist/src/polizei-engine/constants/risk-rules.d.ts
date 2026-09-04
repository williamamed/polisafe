export interface RiskRules {
    bruteForce: {
        minFailures: number;
        windowMinutes: number;
        severity: string;
    };
    scoreWeights: {
        failures7d: number;
        countries: number;
        ips: number;
    };
    scoreMax: number;
    geoAnomalySeverity: string;
    inactiveDays: number;
}
export declare const RISK_RULES: RiskRules;
export type Severity = 'crítica' | 'alta' | 'media' | 'baja';
export declare function severityFromScore(score: number): Severity;
