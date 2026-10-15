"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/app/components/AdminGuard";
import LogoutButton from "@/app/components/LogoutButton";

type Resource = {
  id: number;
  name: string;
  description: string | null;
  location: string;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  location: "",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadResources() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (location.trim()) params.set("location", location.trim());
      if (status !== "all") params.set("isActive", status);

      const response = await fetch(`/api/resources?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load resources");
      }

      setResources(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load resources"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadResources();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, location, status]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        editingId === null
          ? "/api/resources"
          : `/api/resources/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            location: form.location.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save resource");
      }

      setMessage(editingId === null ? "Resource added successfully." : "Resource updated successfully.");
      resetForm();
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save resource");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(resource: Resource) {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      description: resource.description ?? "",
      location: resource.location,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deactivateResource(resource: Resource) {
    if (!window.confirm(`Deactivate "${resource.name}"?`)) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to deactivate resource");
      }

      setMessage("Resource deactivated successfully.");
      await loadResources();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to deactivate resource"
      );
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Resource Reservation
              </p>
              <h1 className="mt-2 text-3xl font-bold">Resource Management</h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage resources and control their availability.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-100"
              >
                ← Dashboard
              </a>
              <LogoutButton />
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
            <h2 className="mb-5 text-lg font-semibold">
              {editingId === null ? "Add a Resource" : "Edit Resource"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Resource name *
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Meeting Room A"
                />
              </label>

              <label className="text-sm font-medium">
                Location *
                <input
                  required
                  maxLength={100}
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="First Floor"
                />
              </label>

              <label className="text-sm font-medium sm:col-span-2">
                Description
                <textarea
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  placeholder="Optional resource details"
                />
              </label>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId === null ? "Add Resource" : "Save Changes"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Resources</h2>
              <span className="text-sm text-slate-500">
                {resources.length} result(s)
              </span>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search resource name..."
                aria-label="Search resource name"
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Filter by location..."
                aria-label="Filter by location"
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Filter by resource status"
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="true">Active only</option>
                <option value="false">Inactive only</option>
              </select>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading resources...
              </p>
            ) : resources.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No resources found. Try changing your filters.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-3 font-medium">Resource</th>
                      <th className="px-3 py-3 font-medium">Location</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource) => (
                      <tr key={resource.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-4">
                          <p className="font-semibold">{resource.name}</p>
                          <p className="mt-1 max-w-xs text-xs text-slate-500">
                            {resource.description || "No description"}
                          </p>
                        </td>
                        <td className="px-3 py-4">{resource.location}</td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            resource.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {resource.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => startEditing(resource)}
                              className="font-medium text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            {resource.isActive && (
                              <button
                                onClick={() => void deactivateResource(resource)}
                                className="font-medium text-red-600 hover:text-red-800"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
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
    </AdminGuard>
  );
}
