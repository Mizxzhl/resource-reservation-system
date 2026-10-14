
"use client";

import { useCallback, useEffect, useState } from "react";

type Resource = {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
};

type Reservation = {
  id: number;
  resourceId: number;
  reservedBy: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "CANCELLED";
  resource?: Resource;
};

type BookingForm = {
  resourceId: string;
  reservedBy: string;
  purpose: string;
  startTime: string;
  endTime: string;
};

const emptyForm: BookingForm = {
  resourceId: "",
  reservedBy: "",
  purpose: "",
  startTime: "",
  endTime: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function ReservationsPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [resourceResponse, reservationResponse] = await Promise.all([
        fetch("/api/resources?isActive=true"),
        fetch("/api/reservations"),
      ]);

      const resourceData = await resourceResponse.json();
      const reservationData = await reservationResponse.json();

      if (!resourceResponse.ok || !reservationResponse.ok) {
        throw new Error("Unable to load resources or reservations.");
      }

      setResources(resourceData);
      setReservations(reservationData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load reservation data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function updateField<K extends keyof BookingForm>(
    key: K,
    value: BookingForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setAvailability("");
    setMessage("");
    setError("");
  }

  function getTimeRange() {
    if (!form.startTime || !form.endTime) {
      throw new Error("Please select both start and end times.");
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      start >= end
    ) {
      throw new Error("End time must be later than start time.");
    }

    return { start, end };
  }

  async function checkAvailability() {
    setError("");
    setMessage("");
    setAvailability("");

    if (!form.resourceId) {
      setError("Please select a resource.");
      return;
    }

    try {
      const { start, end } = getTimeRange();
      setChecking(true);

      const params = new URLSearchParams({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      const response = await fetch(
        `/api/resources/${form.resourceId}/availability?${params}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Availability check failed.");
      }

      setAvailability(
        data.available
          ? "This resource is available for the selected time."
          : "This resource is already reserved for that time."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Availability check failed."
      );
    } finally {
      setChecking(false);
    }
  }

  async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!form.resourceId) {
        throw new Error("Please select a resource.");
      }

      const { start, end } = getTimeRange();

      // The server performs the final overlap check when creating a booking.
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: Number(form.resourceId),
          reservedBy: form.reservedBy.trim(),
          purpose: form.purpose.trim(),
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create reservation.");
      }

      setMessage("Reservation created successfully.");
      setForm(emptyForm);
      setAvailability("");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create reservation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelReservation(reservation: Reservation) {
    if (!window.confirm("Cancel this reservation?")) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/reservations/${reservation.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel reservation.");
      }

      setMessage("Reservation cancelled successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to cancel reservation."
      );
    }
  }

  const activeReservations = reservations.filter(
    (reservation) => reservation.status === "ACTIVE"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Resource Reservation
            </p>
            <h1 className="mt-2 text-3xl font-bold">Reservations</h1>
            <p className="mt-2 text-sm text-slate-500">
              Book resources and manage existing reservations.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/resources"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-100"
            >
              Resources
            </a>
            <a
              href="/"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Dashboard
            </a>
          </div>
        </header>

        {message && (
          <p role="status" className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Create a Reservation</h2>

          <form onSubmit={handleBooking} className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Resource *
              <select
                required
                value={form.resourceId}
                onChange={(event) => updateField("resourceId", event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              >
                <option value="">Select a resource</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} — {resource.location}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Reserved By *
              <input
                required
                maxLength={100}
                value={form.reservedBy}
                onChange={(event) => updateField("reservedBy", event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Purpose *
              <textarea
                required
                maxLength={500}
                rows={2}
                value={form.purpose}
                onChange={(event) => updateField("purpose", event.target.value)}
                placeholder="Reason for this reservation"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>

            <label className="text-sm font-medium">
              Start Time *
              <input
                required
                type="datetime-local"
                value={form.startTime}
                onChange={(event) => updateField("startTime", event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>

            <label className="text-sm font-medium">
              End Time *
              <input
                required
                type="datetime-local"
                value={form.endTime}
                onChange={(event) => updateField("endTime", event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button
                type="button"
                disabled={checking}
                onClick={() => void checkAvailability()}
                className="rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
              >
                {checking ? "Checking..." : "Check Availability"}
              </button>

              <button
                type="submit"
                disabled={saving || resources.length === 0}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Booking..." : "Create Reservation"}
              </button>
            </div>

            {availability && (
              <p
                role="status"
                className={`sm:col-span-2 rounded-lg p-3 text-sm ${
                  availability.includes("available for")
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {availability}
              </p>
            )}

            {resources.length === 0 && !loading && (
              <p className="sm:col-span-2 text-sm text-amber-700">
                No active resources are available. Add or activate a resource first.
              </p>
            )}
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Reservation List</h2>
            <span className="text-sm text-slate-500">
              {activeReservations.length} active
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading reservations...
            </p>
          ) : reservations.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No reservations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Resource</th>
                    <th className="px-3 py-3 font-medium">Reserved By</th>
                    <th className="px-3 py-3 font-medium">Time</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-semibold">
                          {reservation.resource?.name ??
                            `Resource #${reservation.resourceId}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {reservation.purpose}
                        </p>
                      </td>
                      <td className="px-3 py-4">{reservation.reservedBy}</td>
                      <td className="px-3 py-4">
                        <p>{formatDate(reservation.startTime)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Until {formatDate(reservation.endTime)}
                        </p>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            reservation.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        {reservation.status === "ACTIVE" && (
                          <button
                            onClick={() => void cancelReservation(reservation)}
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
