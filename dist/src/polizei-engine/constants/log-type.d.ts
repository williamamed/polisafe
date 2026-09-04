export type TraceGroup = 'auth' | 'authorization' | 'system';
export interface TraceStateMeta {
    label: string;
    group: TraceGroup;
}
export declare const TRACE_STATE_LABELS: Record<number, TraceStateMeta>;
export declare function getTraceStateLabel(state: number): string;
export declare const SUCCESS_STATES: number[];
export declare const FAILURE_STATES: number[];
export declare const LOGIN_SUCCESS_STATES: number[];
export declare const LOGIN_FAILURE_STATES: number[];
