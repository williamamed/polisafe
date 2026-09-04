"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.severityFromScore = exports.RISK_RULES = void 0;
exports.RISK_RULES = {
    bruteForce: {
        minFailures: 5,
        windowMinutes: 10,
        severity: 'alta',
    },
    scoreWeights: {
        failures7d: 3,
        countries: 2,
        ips: 1,
    },
    scoreMax: 100,
    geoAnomalySeverity: 'media',
    inactiveDays: 30,
};
function severityFromScore(score) {
    if (score > 80)
        return 'crítica';
    if (score > 60)
        return 'alta';
    if (score > 30)
        return 'media';
    return 'baja';
}
exports.severityFromScore = severityFromScore;
//# sourceMappingURL=risk-rules.js.map