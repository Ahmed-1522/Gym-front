import React, { useEffect, useState } from "react";
import axios from "axios";

const REPORTS_DASHBOARD_URL = "http://localhost:8080/api/reports/dashboard";
const REPORTS_ACCOUNTING_URL = "http://localhost:8080/api/reports/accounting";

const DASHBOARD_FIELDS = [
  "totalMembers",
  "activeMembers",
  "terminatedMembers",
  "activeSubscriptions",
  "expiredSubscriptions",
  "currentOccupancy",
  "maxCapacity",
  "todayCheckIns",
  "monthlyRevenue",
  "totalRevenue",
];

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeJsonParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStoredUserRole() {
  try {
    const roleKeys = ["role", "userRole"];

    for (const key of roleKeys) {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsedRole = safeJsonParse(value);

      if (typeof parsedRole === "string") {
        return parsedRole;
      }

      if (parsedRole?.role) {
        return parsedRole.role;
      }

      if (parsedRole?.user?.role) {
        return parsedRole.user.role;
      }

      return value;
    }

    const authValue = localStorage.getItem("auth");

    if (authValue) {
      const parsedAuth = safeJsonParse(authValue);

      if (typeof parsedAuth === "string") {
        return parsedAuth;
      }

      if (parsedAuth?.role) {
        return parsedAuth.role;
      }

      if (parsedAuth?.user?.role) {
        return parsedAuth.user.role;
      }
    }

    const keys = ["user", "currentUser", "authUser"];

    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsed = safeJsonParse(value);

      if (parsed?.role) return parsed.role;
      if (parsed?.user?.role) return parsed.user.role;
    }

    return null;
  } catch {
    return null;
  }
}

function toNumberOrNull(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeDashboardResponse(payload) {
  if (!isPlainObject(payload)) {
    throw new Error("Invalid dashboard response shape.");
  }

  return {
    totalMembers: toNumberOrNull(payload.totalMembers),
    activeMembers: toNumberOrNull(payload.activeMembers),
    terminatedMembers: toNumberOrNull(payload.terminatedMembers),
    activeSubscriptions: toNumberOrNull(payload.activeSubscriptions),
    expiredSubscriptions: toNumberOrNull(payload.expiredSubscriptions),
    currentOccupancy: toNumberOrNull(payload.currentOccupancy),
    maxCapacity: toNumberOrNull(payload.maxCapacity),
    todayCheckIns: toNumberOrNull(payload.todayCheckIns),
    monthlyRevenue: toNumberOrNull(payload.monthlyRevenue),
    totalRevenue: toNumberOrNull(payload.totalRevenue),
    currency:
      typeof payload.currency === "string" && payload.currency.trim()
        ? payload.currency.trim()
        : "EGP",
  };
}

function normalizeAccountingResponse(payload) {
  if (!isPlainObject(payload)) {
    throw new Error("Invalid accounting response shape.");
  }

  const period = isPlainObject(payload.period)
    ? {
        from:
          typeof payload.period.from === "string" ? payload.period.from : null,
        to: typeof payload.period.to === "string" ? payload.period.to : null,
      }
    : null;

  const summary = isPlainObject(payload.summary)
    ? {
        totalRevenue: toNumberOrNull(payload.summary.totalRevenue),
        totalTransactions: toNumberOrNull(payload.summary.totalTransactions),
        averageSubscriptionValue: toNumberOrNull(
          payload.summary.averageSubscriptionValue,
        ),
        currency:
          typeof payload.summary.currency === "string" &&
          payload.summary.currency.trim()
            ? payload.summary.currency.trim()
            : "EGP",
      }
    : null;

  const revenueByMonth = Array.isArray(payload.revenueByMonth)
    ? payload.revenueByMonth
        .map((row) => {
          if (!isPlainObject(row) || typeof row.month !== "string") {
            return null;
          }

          return {
            month: row.month,
            revenue: toNumberOrNull(row.revenue),
            transactions: toNumberOrNull(row.transactions),
          };
        })
        .filter(Boolean)
    : [];

  const transactions = Array.isArray(payload.transactions)
    ? payload.transactions
        .map((row) => {
          if (!isPlainObject(row)) {
            return null;
          }

          return {
            id: row.id ?? row.transactionId ?? row.referenceId ?? null,
            memberId: row.memberId ?? null,
            memberName:
              typeof row.memberName === "string" ? row.memberName : null,
            subscriptionId: row.subscriptionId ?? null,
            planName: typeof row.planName === "string" ? row.planName : null,
            amount: toNumberOrNull(row.amount),
            paymentMethod:
              typeof row.paymentMethod === "string" ? row.paymentMethod : null,
            transactionDate:
              typeof row.transactionDate === "string"
                ? row.transactionDate
                : null,
          };
        })
        .filter(Boolean)
    : [];

  return {
    period,
    summary,
    revenueByMonth,
    transactions,
  };
}

function hasAnyDefinedDashboardValue(dashboard) {
  return DASHBOARD_FIELDS.some(
    (field) => dashboard?.[field] !== null && dashboard?.[field] !== undefined,
  );
}

function formatCountValue(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(Number(value)) ? 0 : 1,
  }).format(Number(value));
}

function formatCurrencyAmount(amount, currency) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(Number(amount)) ? 0 : 1,
  }).format(Number(amount))} ${currency}`;
}

function formatDateLabel(dateString) {
  if (!dateString) return "-";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function formatMonthLabel(monthValue) {
  if (!monthValue) return "-";

  const parsedDate = new Date(`${monthValue}-01`);

  if (Number.isNaN(parsedDate.getTime())) {
    return monthValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(parsedDate);
}

function formatTransactionMethod(paymentMethod) {
  if (!paymentMethod) return "-";

  return paymentMethod
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-8 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export default function Reports() {
  const [isLoading, setIsLoading] = useState(true);
  const [role] = useState(() => getStoredUserRole());
  const [dashboard, setDashboard] = useState(null);
  const [accounting, setAccounting] = useState(null);
  const [dashboardError, setDashboardError] = useState(null);
  const [accountingError, setAccountingError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadReports() {
      setIsLoading(true);
      setDashboardError(null);
      setAccountingError(null);

      try {
        const [dashboardResult, accountingResult] = await Promise.allSettled([
          axios.get(REPORTS_DASHBOARD_URL, { signal: controller.signal }),
          axios.get(REPORTS_ACCOUNTING_URL, { signal: controller.signal }),
        ]);

        if (!isActive) {
          return;
        }

        if (dashboardResult.status === "fulfilled") {
          try {
            setDashboard(
              normalizeDashboardResponse(dashboardResult.value.data),
            );
          } catch {
            setDashboard(null);
            setDashboardError(
              "Dashboard report data is unavailable right now.",
            );
          }
        } else if (!axios.isCancel(dashboardResult.reason)) {
          setDashboard(null);
          setDashboardError("Dashboard report data could not be loaded.");
        }

        if (accountingResult.status === "fulfilled") {
          try {
            setAccounting(
              normalizeAccountingResponse(accountingResult.value.data),
            );
          } catch {
            setAccounting(null);
            setAccountingError(
              "Accounting report data is unavailable right now.",
            );
          }
        } else if (!axios.isCancel(accountingResult.reason)) {
          setAccounting(null);
          setAccountingError("Accounting report data could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const isAdmin = String(role).toLowerCase() === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300">
            !
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Unauthorized - Admin access only
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This page is available only to users with an admin role.
          </p>
        </div>
      </div>
    );
  }

  const dashboardStats = dashboard
    ? [
        {
          label: "Total Members",
          value: formatCountValue(dashboard.totalMembers),
          hint: "All registered gym members",
        },
        {
          label: "Active Members",
          value: formatCountValue(dashboard.activeMembers),
          hint: "Currently active accounts",
        },
        {
          label: "Terminated Members",
          value: formatCountValue(dashboard.terminatedMembers),
          hint: "Closed or terminated memberships",
        },
        {
          label: "Active Subscriptions",
          value: formatCountValue(dashboard.activeSubscriptions),
          hint: "Valid membership plans",
        },
        {
          label: "Expired Subscriptions",
          value: formatCountValue(dashboard.expiredSubscriptions),
          hint: "Plans that need renewal",
        },
        {
          label: "Today Check-Ins",
          value: formatCountValue(dashboard.todayCheckIns),
          hint: "Entries recorded today",
        },
        {
          label: "Current Occupancy",
          value:
            dashboard.currentOccupancy !== null &&
            dashboard.currentOccupancy !== undefined &&
            dashboard.maxCapacity !== null &&
            dashboard.maxCapacity !== undefined
              ? `${formatCountValue(dashboard.currentOccupancy)} / ${formatCountValue(dashboard.maxCapacity)}`
              : "-",
          hint: "Live occupancy snapshot",
        },
        {
          label: "Monthly Revenue",
          value: formatCurrencyAmount(
            dashboard.monthlyRevenue,
            dashboard.currency,
          ),
          hint: "Revenue collected this month",
        },
        {
          label: "Total Revenue",
          value: formatCurrencyAmount(
            dashboard.totalRevenue,
            dashboard.currency,
          ),
          hint: "All-time recorded revenue",
        },
      ]
    : [];

  const occupancyPercentage =
    dashboard &&
    dashboard.currentOccupancy !== null &&
    dashboard.currentOccupancy !== undefined &&
    dashboard.maxCapacity !== null &&
    dashboard.maxCapacity !== undefined &&
    dashboard.maxCapacity > 0
      ? Math.min(
          100,
          Math.round(
            (dashboard.currentOccupancy / dashboard.maxCapacity) * 100,
          ),
        )
      : 0;

  const summary = accounting?.summary;
  const periodFrom = accounting?.period?.from;
  const periodTo = accounting?.period?.to;
  const revenueByMonth = accounting?.revenueByMonth ?? [];
  const transactions = accounting?.transactions ?? [];

  const hasDashboardData = Boolean(
    dashboard && hasAnyDefinedDashboardValue(dashboard),
  );
  const hasAccountingData = Boolean(
    summary ||
    accounting?.period ||
    revenueByMonth.length > 0 ||
    transactions.length > 0,
  );
  const hasRevenueRows = revenueByMonth.length > 0;
  const hasTransactionRows = transactions.length > 0;
  const reportErrors = [dashboardError, accountingError].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-8 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="relative px-6 py-7 sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.08),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_30%)]" />
            <div className="relative flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Admin Reports
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Reports Dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Member activity, occupancy, subscription status, and accounting
                performance at a glance.
              </p>
            </div>
          </div>
        </section>

        {reportErrors.length > 0 ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100">
            <p className="text-sm font-semibold">
              Some report data failed to load.
            </p>
            <div className="mt-2 space-y-1 text-sm leading-6 text-rose-800 dark:text-rose-200">
              {reportErrors.map((error) => (
                <p key={error}>• {error}</p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Summary Cards
            </h2>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Live snapshot
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : hasDashboardData ? (
              dashboardStats.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  hint={item.hint}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                No summary data available.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Occupancy Progress
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Current occupancy versus max capacity.
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {dashboard
                  ? dashboard.currentOccupancy !== null &&
                    dashboard.currentOccupancy !== undefined &&
                    dashboard.maxCapacity !== null &&
                    dashboard.maxCapacity !== undefined
                    ? `${formatCountValue(dashboard.currentOccupancy)}/${formatCountValue(dashboard.maxCapacity)}`
                    : "-"
                  : "-"}
              </span>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : dashboard ? (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Occupancy</span>
                  <span>{occupancyPercentage}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Occupied
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatCountValue(dashboard.currentOccupancy)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Max Capacity
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatCountValue(dashboard.maxCapacity)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Utilization
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {occupancyPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                No occupancy data available.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Accounting Summary
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Revenue and transaction overview for the selected reporting
              period.
            </p>

            {isLoading ? (
              <div className="mt-6 space-y-4">
                <div className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : hasAccountingData ? (
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatCurrencyAmount(
                      summary?.totalRevenue,
                      summary?.currency ?? dashboard?.currency ?? "EGP",
                    )}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total Transactions
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatCountValue(summary?.totalTransactions)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Average Subscription Value
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatCurrencyAmount(
                        summary?.averageSubscriptionValue,
                        summary?.currency ?? dashboard?.currency ?? "EGP",
                      )}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Reporting Period
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-50">
                    {formatDateLabel(periodFrom)} to {formatDateLabel(periodTo)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                No accounting data available.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Revenue by Month
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Revenue and transaction count broken down by month.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-3">
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ) : hasRevenueRows ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Revenue
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                    {revenueByMonth.map((row) => (
                      <tr
                        key={row.month}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                          {formatMonthLabel(row.month)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatCurrencyAmount(
                            row.revenue,
                            summary?.currency ?? dashboard?.currency ?? "EGP",
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatCountValue(row.transactions)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
              No monthly revenue records available.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Recent accounting transactions returned by the API.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-3">
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ) : hasTransactionRows ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                    {transactions.map((transaction, index) => (
                      <tr
                        key={
                          transaction.id ??
                          `${transaction.memberId ?? "member"}-${transaction.transactionDate ?? index}-${index}`
                        }
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatDateLabel(transaction.transactionDate)}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                          {transaction.memberName ?? "-"}
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Member ID: {transaction.memberId ?? "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {transaction.planName ?? "-"}
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Subscription ID: {transaction.subscriptionId ?? "-"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatCurrencyAmount(
                            transaction.amount,
                            summary?.currency ?? dashboard?.currency ?? "EGP",
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {formatTransactionMethod(transaction.paymentMethod)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
              No transaction records available.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
