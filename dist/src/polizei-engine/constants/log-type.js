"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_FAILURE_STATES = exports.LOGIN_SUCCESS_STATES = exports.FAILURE_STATES = exports.SUCCESS_STATES = exports.getTraceStateLabel = exports.TRACE_STATE_LABELS = void 0;
exports.TRACE_STATE_LABELS = {
    501: { label: 'User Info (OpenID)', group: 'auth' },
    502: { label: 'Exchange Code', group: 'auth' },
    503: { label: 'Login Magic', group: 'auth' },
    504: { label: 'Login Base', group: 'auth' },
    505: { label: 'Login Provider', group: 'auth' },
    506: { label: 'Autorización API', group: 'authorization' },
    507: { label: 'API Denegado', group: 'authorization' },
    1: { label: 'Acceso Permitido', group: 'authorization' },
    2: { label: 'Acceso Denegado', group: 'authorization' },
    20: { label: 'Instalación', group: 'system' },
};
function getTraceStateLabel(state) {
    return exports.TRACE_STATE_LABELS[state]?.label ?? `Estado ${state}`;
}
exports.getTraceStateLabel = getTraceStateLabel;
exports.SUCCESS_STATES = [1, 501, 504, 506];
exports.FAILURE_STATES = [2, 507];
exports.LOGIN_SUCCESS_STATES = [1, 504];
exports.LOGIN_FAILURE_STATES = [2, 507];
//# sourceMappingURL=log-type.js.map