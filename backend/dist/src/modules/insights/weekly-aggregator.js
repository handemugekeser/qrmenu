"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfIsoWeek = startOfIsoWeek;
exports.buildWeeklySnapshots = buildWeeklySnapshots;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
function startOfIsoWeek(d) {
    const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const day = date.getUTCDay();
    const diff = (day === 0 ? -6 : 1) - day;
    return new Date(date.getTime() + diff * MS_PER_DAY);
}
function buildWeeklySnapshots(daily) {
    if (daily.length === 0)
        return [];
    const buckets = new Map();
    for (const row of daily) {
        const key = startOfIsoWeek(row.date).toISOString();
        const arr = buckets.get(key);
        if (arr)
            arr.push(row);
        else
            buckets.set(key, [row]);
    }
    const result = [];
    for (const [key, rows] of buckets) {
        const itemMap = new Map();
        const categoryMap = new Map();
        const languageDist = {};
        const hourlyDist = new Array(24).fill(0);
        let totalScans = 0;
        let uniqueSessions = 0;
        let sessionMsSum = 0;
        let sessionMsCount = 0;
        for (const row of rows) {
            totalScans += row.totalScans;
            uniqueSessions += row.uniqueSessions;
            if (row.avgSessionMs > 0) {
                sessionMsSum += row.avgSessionMs * row.uniqueSessions;
                sessionMsCount += row.uniqueSessions;
            }
            const topItems = row.topItems || [];
            for (const it of topItems) {
                const cur = itemMap.get(it.itemId);
                if (cur)
                    cur.views += it.views;
                else
                    itemMap.set(it.itemId, { ...it });
            }
            const topCategories = row.topCategories || [];
            for (const c of topCategories) {
                const cur = categoryMap.get(c.categoryId);
                if (cur)
                    cur.views += c.views;
                else
                    categoryMap.set(c.categoryId, { ...c });
            }
            const langs = row.languageDist || {};
            for (const [lang, n] of Object.entries(langs)) {
                languageDist[lang] = (languageDist[lang] || 0) + n;
            }
            const hours = row.hourlyDist || [];
            for (let i = 0; i < Math.min(hours.length, 24); i++) {
                hourlyDist[i] += hours[i] || 0;
            }
        }
        const topItems = [...itemMap.values()].sort((a, b) => b.views - a.views).slice(0, 10);
        const topCategories = [...categoryMap.values()]
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
        result.push({
            businessId: rows[0].businessId,
            weekStart: new Date(key),
            totalScans,
            uniqueSessions,
            topItems,
            topCategories,
            languageDist,
            hourlyDist,
            avgSessionMs: sessionMsCount > 0 ? Math.round(sessionMsSum / sessionMsCount) : 0,
        });
    }
    return result.sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
}
//# sourceMappingURL=weekly-aggregator.js.map