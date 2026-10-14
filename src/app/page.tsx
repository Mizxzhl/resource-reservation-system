
"use client";

import { useEffect, useState } from "react";

type DashboardStats = {
  totalResources: number;
  activeResources: number;
  totalReservations: number;
  activeReservations: number;
  cancelledReservations: number;
};

const statCards = [
  {
    title: "Total Resources",
    key: "totalResources",
    description: "All registered resources",
    icon: "▦",
  },
  {
    title: "Active Resources",
    key: "activeResources",
    description: "Resources ready to use",
    icon: "✓",
  },
  {
    title: "Active Reservations",
    key: "activeReservations",
    description: "Current active bookings",
    icon: "▣",
  },
  {
    title: "Cancelled Reservations",
    key: "cancelledReservations",
    description: "Bookings cancelled",
    icon: "↗",
  },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error("Unable to load dashboard statistics");
        }

        const data: DashboardStats = await response.json();
        setStats(data);
      } catch {
        setError("Could not load statistics. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Resource Reservation
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Management Dashboard
            </h1>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            Admin Overview
          </span>
        </div>
      </aside>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <p className="mt-2 text-sm text-slate-500">
            Monitor resources and reservation activity in one place.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article
              key={card.key}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-700">
                  {card.icon}
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight">
                {loading ? "—" : (stats?.[card.key] ?? 0)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Reservation Summary</h3>
          <p className="mt-2 text-sm text-slate-500">
            Total reservations recorded in the system.
          </p>

          <p className="mt-4 text-3xl font-bold">
            {loading ? "—" : (stats?.totalReservations ?? 0)}
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  stats && stats.totalReservations > 0
                    ? (stats.activeReservations / stats.totalReservations) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Active reservations compared with all reservations
          </p>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          Resource Reservation Management System
        </p>
      </section>
    </main>
  );
}
