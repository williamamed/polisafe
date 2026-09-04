"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const security_trace_1 = require("../models/security.trace");
const security_user_1 = require("../models/security.user");
const security_user_scope_1 = require("../models/security.user.scope");
const security_role_1 = require("../models/security.role");
const security_user_role_1 = require("../models/security.user.role");
const security_permission_1 = require("../models/security.permission");
const security_role_permission_1 = require("../models/security.role.permission");
const security_invitation_1 = require("../models/security.invitation");
const security_scope_1 = require("../models/security.scope");
const security_session_1 = require("../models/security.session");
const scope_service_1 = require("./scope.service");
const log_type_1 = require("../constants/log-type");
const risk_rules_1 = require("../constants/risk-rules");
const GRANULARITIES = ['hour', 'day', 'week', 'month'];
const SECTIONS = ['auth', 'users', 'rbac', 'invitations', 'geo', 'risk'];
const DAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
let DashboardService = class DashboardService {
    async getDashboard(tenant, query = {}) {
        const granularity = GRANULARITIES.includes(query.granularity)
            ? query.granularity
            : 'day';
        const range = this.buildRange(query.from, query.to);
        const ids = await this.resolveScopeIds(tenant, query.scopeIds);
        const scopeLabel = await this.scopeLabel(ids);
        const meta = {
            from: range[0].toISOString(),
            to: range[1].toISOString(),
            granularity,
            scopeIds: ids,
            scopeLabel,
            generatedAt: new Date().toISOString(),
        };
        const build = (section) => {
            switch (section) {
                case 'auth':
                    return this.authSection(ids, range, granularity);
                case 'users':
                    return this.usersSection(ids, range, granularity);
                case 'rbac':
                    return this.rbacSection(ids);
                case 'invitations':
                    return this.invitationsSection(ids);
                case 'geo':
                    return this.geoSection(ids, range);
                case 'risk':
                    return this.riskSection(ids, range);
                default:
                    return Promise.resolve([]);
            }
        };
        if (query.section) {
            return { meta, [query.section]: await build(query.section) };
        }
        const result = { meta };
        for (const section of SECTIONS) {
            result[section] = await build(section);
        }
        return result;
    }
    async authSection(ids, range, granularity) {
        const where = {
            idScope: { [sequelize_2.Op.in]: ids },
            createdAt: { [sequelize_2.Op.between]: range },
        };
        const total = await this.traceModel.count({ where });
        const prevRange = this.previousRange(range);
        const prevTotal = await this.traceModel.count({
            where: {
                idScope: { [sequelize_2.Op.in]: ids },
                createdAt: { [sequelize_2.Op.between]: prevRange },
            },
        });
        const delta = prevTotal > 0
            ? Math.round(((total - prevTotal) / prevTotal) * 1000) / 10
            : null;
        const [byStateRows, evolutionRows, hourRows] = await Promise.all([
            this.traceModel.findAll({
                attributes: [
                    'state',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                ],
                where,
                group: ['state'],
                order: [[sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'DESC']],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    'state',
                    [
                        sequelize_2.Sequelize.fn('date_trunc', granularity, sequelize_2.Sequelize.col('createdAt')),
                        'name',
                    ],
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                ],
                where,
                group: [
                    'state',
                    sequelize_2.Sequelize.fn('date_trunc', granularity, sequelize_2.Sequelize.col('createdAt')),
                ],
                order: [
                    [
                        sequelize_2.Sequelize.fn('date_trunc', granularity, sequelize_2.Sequelize.col('createdAt')),
                        'ASC',
                    ],
                ],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    [this.lit('EXTRACT(dow FROM "createdAt")::int'), 'dow'],
                    [this.lit('EXTRACT(hour FROM "createdAt")::int'), 'hour'],
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                ],
                where,
                group: [
                    this.lit('EXTRACT(dow FROM "createdAt")::int'),
                    this.lit('EXTRACT(hour FROM "createdAt")::int'),
                ],
                raw: true,
            }),
        ]);
        const failWhere = { ...where, state: { [sequelize_2.Op.in]: log_type_1.FAILURE_STATES } };
        const [failByUser, failByIp] = await Promise.all([
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                    [this.lit("COUNT(DISTINCT meta->>'ip')"), 'ips'],
                ],
                where: failWhere,
                group: ['username'],
                order: [[sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'DESC']],
                limit: 10,
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    [this.lit("meta->>'ip'"), 'ip'],
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                    [this.lit('COUNT(DISTINCT username)'), 'users'],
                ],
                where: failWhere,
                group: [this.lit("meta->>'ip'")],
                order: [[sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'DESC']],
                limit: 10,
                raw: true,
            }),
        ]);
        const successCount = await this.traceModel.count({
            where: { ...where, state: { [sequelize_2.Op.in]: log_type_1.LOGIN_SUCCESS_STATES } },
        });
        const failureCount = await this.traceModel.count({
            where: { ...where, state: { [sequelize_2.Op.in]: log_type_1.LOGIN_FAILURE_STATES } },
        });
        const loginTotal = successCount + failureCount;
        const successRate = loginTotal === 0
            ? null
            : Math.round((successCount / loginTotal) * 1000) / 10;
        const byStateLabels = byStateRows.map((r) => (0, log_type_1.getTraceStateLabel)(Number(r.state)));
        const byStateSeries = byStateRows.map((r) => Number(r.total));
        const evolution = this.buildTimeSeries(evolutionRows, granularity);
        const heatmap = this.buildHeatmap(hourRows);
        return [
            this.widget('auth_total', 'Total de eventos', 'statCard', granularity, {
                value: total,
                unit: 'eventos',
                delta,
                deltaType: delta == null ? 'flat' : delta >= 0 ? 'up' : 'down',
                period: 'vs período anterior',
            }),
            this.widget('traces_by_state', 'Eventos por tipo', 'donut', granularity, {
                labels: byStateLabels,
                series: byStateSeries,
                total,
            }),
            this.widget('traces_evolution', 'Evolución temporal por tipo', 'line', granularity, evolution),
            this.widget('login_success_rate', 'Tasa de éxito de login', 'gauge', granularity, {
                value: successRate,
                min: 0,
                max: 100,
                unit: '%',
                thresholds: { good: 90, warn: 70 },
            }),
            this.widget('failures_by_user', 'Fallos por usuario', 'ranking', granularity, {
                items: failByUser.map((r, i) => ({
                    rank: i + 1,
                    key: r.username || '(sin usuario)',
                    value: Number(r.total),
                    secondary: `${r.ips} IPs distintas`,
                })),
            }),
            this.widget('failures_by_ip', 'Fallos por IP', 'ranking', granularity, {
                items: failByIp.map((r, i) => ({
                    rank: i + 1,
                    key: r.ip || '(sin IP)',
                    value: Number(r.total),
                    secondary: `${r.users} usuarios`,
                })),
            }),
            this.widget('volume_by_hour', 'Volumen por hora del día', 'heatmap', granularity, heatmap),
            this.widget('traces_composition', 'Composición de eventos', 'bar', granularity, evolution),
        ];
    }
    async usersSection(ids, range, granularity) {
        const userIds = await this.getUserIdsInScopes(ids);
        const users = await this.userModel.findAll({
            where: { id: { [sequelize_2.Op.in]: userIds } },
            raw: true,
        });
        const active = users.filter((u) => u.state === 1).length;
        const blocked = users.filter((u) => u.state === 0).length;
        const incomplete = users.filter((u) => !u.profile || !u.profile.email).length;
        const truncExpr = sequelize_2.Sequelize.fn('date_trunc', granularity, sequelize_2.Sequelize.col('createdAt'));
        const [signupRows, scopeRows, roleRows] = await Promise.all([
            this.userScopeModel.findAll({
                attributes: [
                    [truncExpr, 'name'],
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('idUser')), 'total'],
                ],
                where: {
                    idScope: { [sequelize_2.Op.in]: ids },
                    createdAt: { [sequelize_2.Op.between]: range },
                },
                group: [truncExpr],
                order: [[truncExpr, 'ASC']],
                raw: true,
            }),
            this.userScopeModel.findAll({
                attributes: [
                    'idScope',
                    [
                        sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.fn('DISTINCT', sequelize_2.Sequelize.col('idUser'))),
                        'total',
                    ],
                ],
                where: { idScope: { [sequelize_2.Op.in]: ids } },
                group: ['idScope'],
                raw: true,
            }),
            this.userRoleModel.findAll({
                attributes: [
                    'id_user',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id_role')), 'total'],
                ],
                where: { id_user: { [sequelize_2.Op.in]: userIds } },
                group: ['id_user'],
                raw: true,
            }),
        ]);
        const scopeName = await this.scopeNameMap(ids);
        const buckets = [0, 0, 0, 0];
        roleRows.forEach((r) => {
            const n = Number(r.total);
            buckets[n >= 3 ? 3 : n] += 1;
        });
        const unassigned = Math.max(0, userIds.length - roleRows.length);
        buckets[0] += unassigned;
        const inactiveRows = await this.inactiveUsers(users);
        const cutoff = new Date(Date.now() - risk_rules_1.RISK_RULES.inactiveDays * 24 * 3600 * 1000);
        const inactive = inactiveRows.filter((r) => !r.lastActivity || r.lastActivity < cutoff);
        const labels = signupRows.map((r) => this.formatBucket(r.name, granularity));
        const signups = signupRows.map((r) => Number(r.total));
        return [
            this.widget('users_total', 'Usuarios totales', 'statCard', granularity, {
                value: userIds.length,
                unit: 'usuarios',
            }),
            this.widget('users_active', 'Usuarios activos', 'statCard', granularity, {
                value: active,
                unit: 'usuarios',
            }),
            this.widget('users_blocked', 'Usuarios bloqueados', 'statCard', granularity, {
                value: blocked,
                unit: 'usuarios',
            }),
            this.widget('users_signups', 'Altas por período', 'area', granularity, {
                labels,
                series: [{ name: 'altas', data: signups }],
            }),
            this.widget('users_by_scope', 'Usuarios por scope', 'donut', granularity, {
                labels: scopeRows.map((r) => scopeName[r.idScope] ?? `Scope ${r.idScope}`),
                series: scopeRows.map((r) => Number(r.total)),
                total: userIds.length,
            }),
            this.widget('users_by_role_count', 'Usuarios por nº de roles', 'bar', granularity, {
                categories: ['0 roles', '1 rol', '2 roles', '3+'],
                series: [{ name: 'usuarios', data: buckets }],
            }),
            this.widget('users_incomplete_profile', 'Usuarios sin perfil completo', 'statCard', granularity, {
                value: incomplete,
                unit: 'usuarios',
            }),
            this.widget('users_inactive', 'Cuentas inactivas', 'table', granularity, {
                columns: ['usuario', 'fullname', 'último acceso'],
                rows: inactive
                    .slice(0, 20)
                    .map((r) => [
                    r.username,
                    r.fullname ?? '',
                    r.lastActivity ? this.formatDate(r.lastActivity) : 'sin actividad',
                ]),
            }),
        ];
    }
    async rbacSection(ids) {
        const [rolesCount, permissionsCount] = await Promise.all([
            this.roleModel.count({ where: { idScope: { [sequelize_2.Op.in]: ids } } }),
            this.permissionModel.count({
                where: { [sequelize_2.Op.or]: [{ idScope: { [sequelize_2.Op.in]: ids } }, { idScope: null }] },
            }),
        ]);
        const [rpRows, roles, permissions, covRows] = await Promise.all([
            this.rolePermissionModel.findAll({
                attributes: [
                    'id_role',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id_permission')), 'total'],
                ],
                group: ['id_role'],
                raw: true,
            }),
            this.roleModel.findAll({
                where: { idScope: { [sequelize_2.Op.in]: ids } },
                raw: true,
            }),
            this.permissionModel.findAll({
                where: { [sequelize_2.Op.or]: [{ idScope: { [sequelize_2.Op.in]: ids } }, { idScope: null }] },
                raw: true,
            }),
            this.permissionModel.findAll({
                attributes: [
                    'idScope',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                ],
                where: { idScope: { [sequelize_2.Op.in]: ids } },
                group: ['idScope'],
                raw: true,
            }),
        ]);
        const rpSet = new Set(rpRows.map((r) => r.id_role));
        const byRole = rpRows
            .filter((r) => rpSet.has(r.id_role))
            .map((r) => {
            const role = roles.find((ro) => ro.id === r.id_role);
            return {
                name: role?.name ?? `Rol ${r.id_role}`,
                total: Number(r.total),
            };
        })
            .sort((a, b) => b.total - a.total);
        const linkedPerms = new Set((await this.rolePermissionModel.findAll({
            attributes: ['id_permission'],
            raw: true,
        })).map((r) => r.id_permission));
        const orphans = permissions.filter((p) => p.idScope == null && !linkedPerms.has(p.id));
        const moduleCount = {};
        const methodCount = {};
        for (const p of permissions) {
            const folder = p.settings?.folder || 'sin módulo';
            const segment = folder.split('/')[0] || 'sin módulo';
            moduleCount[segment] = (moduleCount[segment] || 0) + 1;
            const method = p.settings?.type || 'otro';
            methodCount[method] = (methodCount[method] || 0) + 1;
        }
        const scopeName = await this.scopeNameMap(ids);
        const moduleEntries = Object.entries(moduleCount).sort((a, b) => b[1] - a[1]);
        const methodEntries = Object.entries(methodCount).sort((a, b) => b[1] - a[1]);
        return [
            this.widget('rbac_roles', 'Roles totales', 'statCard', 'day', {
                value: rolesCount,
                unit: 'roles',
            }),
            this.widget('rbac_permissions', 'Permisos totales', 'statCard', 'day', {
                value: permissionsCount,
                unit: 'permisos',
            }),
            this.widget('permissions_by_role', 'Permisos por rol', 'bar', 'day', {
                categories: byRole.map((r) => r.name),
                series: [{ name: 'permisos', data: byRole.map((r) => r.total) }],
            }),
            this.widget('permissions_orphan', 'Permisos huérfanos', 'statCard', 'day', {
                value: orphans.length,
                unit: 'permisos',
            }),
            this.widget('permissions_orphan_list', 'Detalle de permisos huérfanos', 'table', 'day', {
                columns: ['id', 'ruta'],
                rows: orphans.map((o) => [o.id, o.name ?? '']),
            }),
            this.widget('permissions_by_module', 'Permisos por módulo', 'donut', 'day', {
                labels: moduleEntries.map((e) => e[0]),
                series: moduleEntries.map((e) => e[1]),
                total: permissionsCount,
            }),
            this.widget('permissions_by_method', 'Permisos por método HTTP', 'donut', 'day', {
                labels: methodEntries.map((e) => e[0]),
                series: methodEntries.map((e) => e[1]),
                total: permissionsCount,
            }),
            this.widget('scope_coverage', 'Permisos definidos por scope', 'bar', 'day', {
                categories: covRows.map((r) => scopeName[r.idScope] ?? `Scope ${r.idScope}`),
                series: [
                    {
                        name: 'permisos definidos',
                        data: covRows.map((r) => Number(r.total)),
                    },
                ],
            }),
        ];
    }
    async invitationsSection(ids) {
        const stateRows = await this.invitationModel.findAll({
            attributes: [
                'state',
                [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
            ],
            where: { idScope: { [sequelize_2.Op.in]: ids } },
            group: ['state'],
            raw: true,
        });
        const stateLabel = (state) => {
            if (state == null)
                return 'sin estado';
            const labels = {
                0: 'pendiente',
                1: 'usada',
                2: 'caducada',
            };
            return labels[state] ?? `Estado ${state}`;
        };
        const total = stateRows.reduce((acc, r) => acc + Number(r.total), 0);
        const sent = total;
        const pending = (stateRows.find((r) => r.state === 0)?.total ?? 0) +
            (stateRows.find((r) => r.state == null)?.total ?? 0);
        const used = stateRows.find((r) => r.state === 1)?.total ?? 0;
        const cutoff = new Date(Date.now() - 7 * 24 * 3600 * 1000);
        const staleRows = await this.invitationModel.findAll({
            where: {
                idScope: { [sequelize_2.Op.in]: ids },
                state: { [sequelize_2.Op.in]: [0] },
                createdAt: { [sequelize_2.Op.lt]: cutoff },
            },
            raw: true,
        });
        const scopeName = await this.scopeNameMap(ids);
        return [
            this.widget('invitations_by_state', 'Invitaciones por estado', 'donut', 'day', {
                labels: stateRows.map((r) => stateLabel(r.state)),
                series: stateRows.map((r) => Number(r.total)),
                total,
            }),
            this.widget('invitations_funnel', 'Conversión de invitaciones', 'funnel', 'day', {
                stages: [
                    { name: 'enviadas', value: sent },
                    { name: 'pendientes', value: pending },
                    { name: 'convertidas', value: used },
                ],
            }),
            this.widget('invitations_stale', 'Invitaciones sin usar > 7 días', 'table', 'day', {
                columns: ['email', 'scope', 'fecha'],
                rows: staleRows.map((r) => [
                    r.email ?? '',
                    scopeName[r.idScope] ?? `Scope ${r.idScope}`,
                    this.formatDate(r.createdAt),
                ]),
            }),
        ];
    }
    async geoSection(ids, range) {
        const traces = await this.traceModel.findAll({
            attributes: ['id', 'username', 'state', 'createdAt', 'meta'],
            where: { idScope: { [sequelize_2.Op.in]: ids }, createdAt: { [sequelize_2.Op.between]: range } },
            raw: true,
        });
        const geo = traces.filter((t) => t.meta && t.meta.location && t.meta.location.status === 'success');
        const byCountry = {};
        for (const t of geo) {
            const loc = t.meta.location;
            const key = loc.countryCode || loc.country || 'desconocido';
            const entry = byCountry[key] ||
                (byCountry[key] = {
                    count: 0,
                    countryCode: key,
                    country: loc.country || key,
                    city: loc.city || '',
                    lat: loc.lat || 0,
                    lon: loc.lon || 0,
                    ip: t.meta.ip || '',
                });
            entry.count += 1;
            entry.ip = t.meta.ip || entry.ip;
        }
        const countryEntries = Object.entries(byCountry).sort((a, b) => b[1].count - a[1].count);
        const ipByUser = {};
        for (const t of traces) {
            if (!t.meta?.ip)
                continue;
            const user = t.username || '(sin usuario)';
            (ipByUser[user] = ipByUser[user] || new Set()).add(t.meta.ip);
        }
        const ipRows = Object.entries(ipByUser)
            .map(([username, ips]) => ({ username, total: ips.size }))
            .sort((a, b) => b.total - a.total);
        const countryByUser = {};
        for (const t of geo) {
            const country = t.meta.location.country || 'desconocido';
            const user = t.username || '(sin usuario)';
            (countryByUser[user] = countryByUser[user] || new Set()).add(country);
        }
        const multiCountry = Object.entries(countryByUser)
            .filter(([, countries]) => countries.size >= 2)
            .map(([username, countries]) => ({
            username,
            countries: countries.size,
            ips: ipByUser[username]?.size ?? 0,
        }));
        const top = countryEntries.slice(0, 10);
        return [
            this.widget('geo_by_country', 'Autenticaciones por país', 'map', 'day', {
                points: countryEntries.map(([, c]) => ({
                    countryCode: c.countryCode,
                    country: c.country,
                    city: c.city,
                    lat: c.lat,
                    lon: c.lon,
                    value: c.count,
                    ip: c.ip,
                })),
            }),
            this.widget('geo_top_countries', 'Top países', 'bar', 'day', {
                categories: top.map(([name]) => name),
                series: [{ name: 'eventos', data: top.map(([, c]) => c.count) }],
            }),
            this.widget('ip_by_user', 'IPs únicas por usuario', 'bar', 'day', {
                categories: ipRows.map((r) => r.username),
                series: [{ name: 'IPs', data: ipRows.map((r) => r.total) }],
            }),
            this.widget('users_multicountry', 'Usuarios multi-país', 'table', 'day', {
                columns: ['usuario', 'países', 'IPs'],
                rows: multiCountry.map((r) => [r.username, r.countries, r.ips]),
            }),
        ];
    }
    async riskSection(ids, range) {
        const userIds = await this.getUserIdsInScopes(ids);
        const users = await this.userModel.findAll({
            where: { id: { [sequelize_2.Op.in]: userIds } },
            raw: true,
        });
        const usernames = users.map((u) => u.username).filter(Boolean);
        const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
        const baseWhere = { idScope: { [sequelize_2.Op.in]: ids } };
        const userWhere = usernames.length
            ? { username: { [sequelize_2.Op.in]: usernames } }
            : { username: { [sequelize_2.Op.in]: [''] } };
        const [failRows, ipRows, countryRows, lastRows, failureEvents, geoTraces] = await Promise.all([
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'total'],
                ],
                where: {
                    ...userWhere,
                    state: { [sequelize_2.Op.in]: log_type_1.FAILURE_STATES },
                    createdAt: { [sequelize_2.Op.gte]: weekAgo },
                },
                group: ['username'],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [this.lit("COUNT(DISTINCT meta->>'ip')"), 'ips'],
                ],
                where: userWhere,
                group: ['username'],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [
                        this.lit("COUNT(DISTINCT meta->'location'->>'country')"),
                        'countries',
                    ],
                ],
                where: userWhere,
                group: ['username'],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [sequelize_2.Sequelize.fn('MAX', sequelize_2.Sequelize.col('createdAt')), 'last'],
                ],
                where: userWhere,
                group: ['username'],
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: ['id', 'username', 'createdAt', 'meta'],
                where: { ...baseWhere, state: { [sequelize_2.Op.in]: log_type_1.FAILURE_STATES } },
                raw: true,
            }),
            this.traceModel.findAll({
                attributes: ['id', 'username', 'state', 'createdAt', 'meta'],
                where: { ...baseWhere, createdAt: { [sequelize_2.Op.between]: range } },
                raw: true,
            }),
        ]);
        const failMap = new Map(failRows.map((r) => [r.username, Number(r.total)]));
        const ipMap = new Map(ipRows.map((r) => [r.username, Number(r.ips)]));
        const countryMap = new Map(countryRows.map((r) => [r.username, Number(r.countries)]));
        const lastMap = new Map(lastRows.map((r) => [r.username, r.last]));
        const scores = users
            .map((u) => {
            const fails = Number(failMap.get(u.username) || 0);
            const countries = Number(countryMap.get(u.username) || 0);
            const ips = Number(ipMap.get(u.username) || 0);
            const score = Math.min(risk_rules_1.RISK_RULES.scoreMax, fails * risk_rules_1.RISK_RULES.scoreWeights.failures7d +
                countries * risk_rules_1.RISK_RULES.scoreWeights.countries +
                ips * risk_rules_1.RISK_RULES.scoreWeights.ips);
            return {
                username: u.username,
                fullname: u.fullname,
                score,
                severity: (0, risk_rules_1.severityFromScore)(score),
                fails,
                countries,
                ips,
                last: lastMap.get(u.username) || null,
            };
        })
            .sort((a, b) => b.score - a.score);
        const bruteAlerts = this.bruteForceAlerts(failureEvents);
        const geoAlerts = this.geoAnomalyAlerts(geoTraces);
        const alerts = [...bruteAlerts, ...geoAlerts];
        const severityCount = {
            crítica: 0,
            alta: 0,
            media: 0,
            baja: 0,
        };
        alerts.forEach((a) => {
            severityCount[a.severity] =
                (severityCount[a.severity] || 0) + 1;
        });
        const overall = scores.length
            ? Math.round((scores.reduce((acc, s) => acc + s.score, 0) / scores.length) * 10) / 10
            : 0;
        return [
            this.widget('risk_account_score', 'Score de riesgo por cuenta', 'table', 'day', {
                columns: [
                    'usuario',
                    'severidad',
                    'score',
                    'fallos 7d',
                    'países',
                    'IPs',
                    'último acceso',
                ],
                rows: scores
                    .slice(0, 50)
                    .map((s) => [
                    s.username,
                    s.severity,
                    s.score,
                    s.fails,
                    s.countries,
                    s.ips,
                    s.last ? this.formatDate(s.last) : 'sin actividad',
                ]),
            }),
            this.widget('alert_bruteforce', 'Alertas brute-force', 'table', 'day', {
                columns: ['alerta', 'severidad', 'target', 'detalle', 'detectado'],
                rows: bruteAlerts.map((a) => [
                    a.type,
                    a.severity,
                    a.target,
                    a.detail,
                    this.formatDate(a.detectedAt),
                ]),
            }),
            this.widget('alert_geo_anomaly', 'Alertas geo-anómalas', 'table', 'day', {
                columns: ['alerta', 'severidad', 'target', 'detalle', 'detectado'],
                rows: geoAlerts.map((a) => [
                    a.type,
                    a.severity,
                    a.target,
                    a.detail,
                    this.formatDate(a.detectedAt),
                ]),
            }),
            this.widget('alerts_by_severity', 'Alertas por severidad', 'donut', 'day', {
                labels: Object.keys(severityCount),
                series: Object.values(severityCount),
                total: alerts.length,
            }),
            this.widget('overall_risk', 'Índice general de riesgo', 'gauge', 'day', {
                value: overall,
                min: 0,
                max: 100,
                unit: 'score',
                thresholds: { good: 30, warn: 60 },
            }),
        ];
    }
    bruteForceAlerts(events) {
        const alerts = [];
        const byUser = {};
        const byIp = {};
        for (const e of events) {
            if (e.username)
                (byUser[e.username] = byUser[e.username] || []).push(new Date(e.createdAt));
            if (e.meta?.ip)
                (byIp[e.meta.ip] = byIp[e.meta.ip] || []).push(new Date(e.createdAt));
        }
        const { minFailures, windowMinutes } = risk_rules_1.RISK_RULES.bruteForce;
        for (const [target, times] of Object.entries(byUser)) {
            const max = this.maxInWindow(times, windowMinutes);
            if (max >= minFailures) {
                alerts.push({
                    type: 'brute-force',
                    severity: risk_rules_1.RISK_RULES.bruteForce.severity,
                    target,
                    detail: `${max} fallos en ${windowMinutes} min`,
                    detectedAt: times[times.length - 1],
                });
            }
        }
        for (const [target, times] of Object.entries(byIp)) {
            const max = this.maxInWindow(times, windowMinutes);
            if (max >= minFailures) {
                alerts.push({
                    type: 'brute-force',
                    severity: risk_rules_1.RISK_RULES.bruteForce.severity,
                    target,
                    detail: `${max} fallos en ${windowMinutes} min`,
                    detectedAt: times[times.length - 1],
                });
            }
        }
        return alerts;
    }
    maxInWindow(times, windowMinutes) {
        if (times.length === 0)
            return 0;
        const sorted = [...times].sort((a, b) => a.getTime() - b.getTime());
        const windowMs = windowMinutes * 60 * 1000;
        let left = 0;
        let max = 0;
        for (let right = 0; right < sorted.length; right++) {
            while (sorted[right].getTime() - sorted[left].getTime() > windowMs)
                left++;
            max = Math.max(max, right - left + 1);
        }
        return max;
    }
    geoAnomalyAlerts(events) {
        const byUser = {};
        for (const e of events) {
            if (!log_type_1.SUCCESS_STATES.includes(Number(e.state)))
                continue;
            const country = e.meta?.location?.country;
            if (!country)
                continue;
            const user = e.username || '(sin usuario)';
            (byUser[user] = byUser[user] || []).push({
                country,
                at: new Date(e.createdAt),
            });
        }
        const alerts = [];
        for (const [user, entries] of Object.entries(byUser)) {
            entries.sort((a, b) => a.at.getTime() - b.at.getTime());
            const counts = {};
            entries.forEach((e) => {
                counts[e.country] = (counts[e.country] || 0) + 1;
            });
            if (Object.keys(counts).length < 2)
                continue;
            const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
            const last = entries[entries.length - 1];
            if (last.country !== mostCommon) {
                alerts.push({
                    type: 'geo-anomalía',
                    severity: risk_rules_1.RISK_RULES.geoAnomalySeverity,
                    target: user,
                    detail: `login desde ${last.country} (histórico: ${mostCommon})`,
                    detectedAt: last.at,
                });
            }
        }
        return alerts;
    }
    async inactiveUsers(users) {
        const usernames = users.map((u) => u.username).filter(Boolean);
        if (usernames.length === 0)
            return users.map((u) => ({ ...u, lastActivity: null }));
        const where = { username: { [sequelize_2.Op.in]: usernames } };
        const [traceRows, sessionRows] = await Promise.all([
            this.traceModel.findAll({
                attributes: [
                    'username',
                    [sequelize_2.Sequelize.fn('MAX', sequelize_2.Sequelize.col('createdAt')), 'last'],
                ],
                where,
                group: ['username'],
                raw: true,
            }),
            this.sessionModel.findAll({
                attributes: [
                    'username',
                    [sequelize_2.Sequelize.fn('MAX', sequelize_2.Sequelize.col('createdAt')), 'last'],
                ],
                where,
                group: ['username'],
                raw: true,
            }),
        ]);
        const lastTrace = new Map(traceRows.map((r) => [r.username, r.last]));
        const lastSession = new Map(sessionRows.map((r) => [r.username, r.last]));
        return users.map((u) => {
            const t = lastTrace.get(u.username);
            const s = lastSession.get(u.username);
            const candidates = [t, s].filter(Boolean).map((d) => new Date(d));
            return {
                ...u,
                lastActivity: candidates.length
                    ? new Date(Math.max(...candidates.map((d) => d.getTime())))
                    : null,
            };
        });
    }
    async getUserIdsInScopes(ids) {
        const rows = await this.userScopeModel.findAll({
            attributes: ['idUser'],
            where: { idScope: { [sequelize_2.Op.in]: ids } },
            raw: true,
        });
        return [...new Set(rows.map((r) => Number(r.idUser)))];
    }
    async scopeNameMap(ids) {
        const scopes = await this.scopeModel.findAll({
            where: { id: { [sequelize_2.Op.in]: ids } },
            raw: true,
        });
        return scopes.reduce((acc, s) => {
            acc[s.id] = s.name ?? `Scope ${s.id}`;
            return acc;
        }, {});
    }
    async scopeLabel(ids) {
        if (ids.length === 1) {
            const scope = await this.scopeModel.findByPk(ids[0], { raw: true });
            return scope?.name ?? `Scope ${ids[0]}`;
        }
        return `${ids.length} scopes`;
    }
    async resolveScopeIds(tenant, requested) {
        const scopes = await this.scopeService.getAllUserScopes(tenant);
        const available = scopes.filter((s) => s).map((s) => s.id);
        if (requested) {
            const ids = String(requested).split(',').map(Number);
            const filtered = ids.filter((id) => available.includes(id));
            return filtered.length ? filtered : available;
        }
        return available;
    }
    buildRange(from, to) {
        const toDate = to ? new Date(to) : new Date();
        const fromDate = from
            ? new Date(from)
            : new Date(Date.now() - 30 * 24 * 3600 * 1000);
        return [fromDate, toDate];
    }
    previousRange(range) {
        const span = range[1].getTime() - range[0].getTime();
        return [new Date(range[0].getTime() - span), new Date(range[0].getTime())];
    }
    buildTimeSeries(rows, granularity) {
        const states = [...new Set(rows.map((r) => Number(r.state)))].sort((a, b) => a - b);
        const labels = [
            ...new Set(rows.map((r) => this.formatBucket(r.name, granularity))),
        ].sort();
        const series = states.map((state) => ({
            name: (0, log_type_1.getTraceStateLabel)(state),
            data: labels.map((label) => {
                const row = rows.find((r) => Number(r.state) === state &&
                    this.formatBucket(r.name, granularity) === label);
                return row ? Number(row.total) : 0;
            }),
        }));
        return { labels, series };
    }
    buildHeatmap(rows) {
        const xLabels = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        const matrix = DAYS.map(() => Array(24).fill(0));
        for (const r of rows) {
            const dow = Number(r.dow);
            const hour = Number(r.hour);
            const rowIndex = DOW_ORDER.indexOf(dow);
            if (rowIndex >= 0 && hour >= 0 && hour < 24)
                matrix[rowIndex][hour] += Number(r.total);
        }
        return { xLabels, yLabels: DAYS, matrix };
    }
    lit(raw) {
        return sequelize_2.Sequelize.literal(raw);
    }
    formatBucket(value, granularity) {
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
            return String(value);
        if (granularity === 'hour')
            return d.toISOString().slice(0, 13);
        if (granularity === 'month')
            return d.toISOString().slice(0, 7);
        return d.toISOString().slice(0, 10);
    }
    formatDate(value) {
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
            return String(value);
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        return `${dd}/${mm}/${d.getUTCFullYear()}`;
    }
    widget(id, title, type, granularity, data) {
        return {
            id,
            title,
            type,
            granularity,
            updatedAt: new Date().toISOString(),
            data,
        };
    }
};
exports.DashboardService = DashboardService;
__decorate([
    (0, sequelize_1.InjectModel)(security_trace_1.SecurityTrace),
    __metadata("design:type", Object)
], DashboardService.prototype, "traceModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], DashboardService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Object)
], DashboardService.prototype, "userScopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_role_1.SecurityRole),
    __metadata("design:type", Object)
], DashboardService.prototype, "roleModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_role_1.SecurityUserRole),
    __metadata("design:type", Object)
], DashboardService.prototype, "userRoleModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_permission_1.SecurityPermission),
    __metadata("design:type", Object)
], DashboardService.prototype, "permissionModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_role_permission_1.SecurityRolePermission),
    __metadata("design:type", Object)
], DashboardService.prototype, "rolePermissionModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_invitation_1.SecurityInvitation),
    __metadata("design:type", Object)
], DashboardService.prototype, "invitationModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_scope_1.SecurityScope),
    __metadata("design:type", Object)
], DashboardService.prototype, "scopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_session_1.SecuritySession),
    __metadata("design:type", Object)
], DashboardService.prototype, "sessionModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], DashboardService.prototype, "scopeService", void 0);
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map