import React, { useEffect, useMemo, useState } from "react";

const REPORTS_DASHBOARD_MOCK = {
  totalMembers: 87,
  activeMembers: 72,
  terminatedMembers: 5,
  activeSubscriptions: 68,
  expiredSubscriptions: 19,
  currentOccupancy: 47,
  maxCapacity: 150,
  todayCheckIns: 63,
  monthlyRevenue: 17500,
  totalRevenue: 142000,
  currency: "EGP",
};

const REPORTS_ACCOUNTING_MOCK = {
  period: {
    from: "2026-01-01",
    to: "2026-05-01",
  },
  summary: {
    totalRevenue: 142000,
    totalTransactions: 310,
    averageSubscriptionValue: 212.5,
    currency: "EGP",
  },
  revenueByMonth: [
    {
      month: "2026-01",
      revenue: 28000,
      transactions: 65,
    },
    {
      month: "2026-02",
      revenue: 31500,
      transactions: 72,
    },
  ],
};

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
    const directRole =
      localStorage.getItem("role") || localStorage.getItem("userRole");

    if (directRole) {
      const parsedRole = safeJsonParse(directRole);

      if (typeof parsedRole === "string") {
        return parsedRole;
      }

      if (parsedRole?.role) {
        return parsedRole.role;
      }

      if (parsedRole?.user?.role) {
        return parsedRole.user.role;
      }

      return directRole;
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

function getReportsDashboard() {
  return REPORTS_DASHBOARD_MOCK;
}

function getReportsAccounting() {
  return REPORTS_ACCOUNTING_MOCK;
}

function formatCurrencyAmount(amount, currency) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 1,
  }).format(amount)} ${currency}`;
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, []);

  const isAdmin = String(role).toLowerCase() === "admin";

  const dashboard = useMemo(() => {
    if (!isAdmin) return null;
    return getReportsDashboard();
  }, [isAdmin]);

  const accounting = useMemo(() => {
    if (!isAdmin) return null;
    return getReportsAccounting();
  }, [isAdmin]);

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
          value: dashboard.totalMembers,
          hint: "All registered gym members",
        },
        {
          label: "Active Members",
          value: dashboard.activeMembers,
          hint: "Currently active accounts",
        },
        {
          label: "Terminated Members",
          value: dashboard.terminatedMembers,
          hint: "Closed or terminated memberships",
        },
        {
          label: "Active Subscriptions",
          value: dashboard.activeSubscriptions,
          hint: "Valid membership plans",
        },
        {
          label: "Expired Subscriptions",
          value: dashboard.expiredSubscriptions,
          hint: "Plans that need renewal",
        },
        {
          label: "Today Check-Ins",
          value: dashboard.todayCheckIns,
          hint: "Entries recorded today",
        },
        {
          label: "Current Occupancy",
          value: `${dashboard.currentOccupancy} / ${dashboard.maxCapacity}`,
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

  const occupancyPercentage = dashboard
    ? Math.min(
        100,
        Math.round((dashboard.currentOccupancy / dashboard.maxCapacity) * 100),
      )
    : 0;

  const summary = accounting?.summary;
  const periodFrom = accounting?.period?.from;
  const periodTo = accounting?.period?.to;
  const revenueByMonth = accounting?.revenueByMonth ?? [];

  const hasDashboardData = dashboardStats.length > 0;
  const hasAccountingData = Boolean(summary);
  const hasRevenueRows = revenueByMonth.length > 0;

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
                  ? `${dashboard.currentOccupancy}/${dashboard.maxCapacity}`
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
                      {dashboard.currentOccupancy}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Max Capacity
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {dashboard.maxCapacity}
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
                      summary.totalRevenue,
                      summary.currency,
                    )}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total Transactions
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {summary.totalTransactions}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Average Subscription Value
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatCurrencyAmount(
                        summary.averageSubscriptionValue,
                        summary.currency,
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
                            summary?.currency ?? "EGP",
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {row.transactions}
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
      </div>
    </div>
  );
}
