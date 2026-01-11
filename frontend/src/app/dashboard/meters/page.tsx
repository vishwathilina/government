"use client";
import { useEffect, useState } from "react";


interface Meter {
  id: string | number;
  meterNumber: string;
  status: string;
  utilityTypeId: number;
  utilityTypeName?: string;
  installationDate: string;
  isSmartMeter: boolean;
}


const API_URL = "http://localhost:3000/api/v1/meters";

export default function MetersPage() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMeter, setEditMeter] = useState<Meter | null>(null);
  const [form, setForm] = useState({
    meterNumber: "",
    status: "ACTIVE",
    utilityTypeId: 1,
    installationDate: new Date().toISOString().slice(0, 10),
    isSmartMeter: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchMeters = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meters");
        return res.json();
      })
      .then((json) => setMeters(json.data || json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  const openAddModal = () => {
    setEditMeter(null);
    setForm({
      meterNumber: "",
      status: "ACTIVE",
      utilityTypeId: 1,
      installationDate: new Date().toISOString().slice(0, 10),
      isSmartMeter: false,
    });
    setShowModal(true);
  };

  const openEditModal = (meter: Meter) => {
    setEditMeter(meter);
    setForm({
      meterNumber: meter.meterNumber,
      status: meter.status,
      utilityTypeId: meter.utilityTypeId,
      installationDate: meter.installationDate?.slice(0, 10),
      isSmartMeter: !!meter.isSmartMeter,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMeter(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMeter) {
        await fetch(`${API_URL}/${editMeter.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      fetchMeters();
      closeModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this meter?")) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchMeters();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meter Management</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={openAddModal}
        disabled={saving}
      >
        Add Meter
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Meter Number</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Utility Type</th>
                <th className="border px-4 py-2">Installation Date</th>
                <th className="border px-4 py-2">Smart Meter</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meters.length === 0 ? (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan={7}>
                    No meters found.
                  </td>
                </tr>
              ) : (
                meters.map((meter) => (
                  <tr key={meter.id}>
                    <td className="border px-4 py-2">{meter.id}</td>
                    <td className="border px-4 py-2">{meter.meterNumber}</td>
                    <td className="border px-4 py-2">{meter.status}</td>
                    <td className="border px-4 py-2">{meter.utilityTypeName || meter.utilityTypeId}</td>
                    <td className="border px-4 py-2">{meter.installationDate}</td>
                    <td className="border px-4 py-2">{meter.isSmartMeter ? "Yes" : "No"}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => openEditModal(meter)}
                        disabled={saving}
                      >Edit</button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDelete(meter.id)}
                        disabled={saving}
                      >Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Modal for Add/Edit Meter */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMeter ? "Edit Meter" : "Add Meter"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Meter Number</label>
                <input
                  type="text"
                  name="meterNumber"
                  value={form.meterNumber}
                  onChange={handleFormChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="FAULTY">FAULTY</option>
                  <option value="DISCONNECTED">DISCONNECTED</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Utility Type ID</label>
                <input
                  type="number"
                  name="utilityTypeId"
                  value={form.utilityTypeId}
                  onChange={handleFormChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                  min={1}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Installation Date</label>
                <input
                  type="date"
                  name="installationDate"
                  value={form.installationDate}
                  onChange={handleFormChange}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isSmartMeter"
                  checked={form.isSmartMeter}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                <label>Smart Meter</label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                  onClick={closeModal}
                  disabled={saving}
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={saving}
                >{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
