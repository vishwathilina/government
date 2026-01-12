"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";

interface Bill {
  billId: number;
  meterId: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  billDate: string;
  dueDate: string;
  totalImportUnit: number;
  totalExportUnit: number;
  energyChargeAmount: number;
  fixedChargeAmount: number;
  subsidyAmount: number;
  solarExportCredit: number;
  meter?: {
    meterId: number;
    meterSerialNo: string;
    utilityType?: {
      utilityTypeId: number;
      code: string;
      name: string;
    };
  };
  billTaxes?: Array<{
    billTaxId: number;
    ratePercentApplied: number;
    taxableBaseAmount: number;
  }>;
}

interface UtilityType {
  utilityTypeId: number;
  code: string;
  name: string;
}

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionId, setConnectionId] = useState("");
  const [utilityTypeId, setUtilityTypeId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [utilityTypes, setUtilityTypes] = useState<UtilityType[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateMeterId, setGenerateMeterId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");

  useEffect(() => {
    const fetchUtilityTypes = async () => {
      try {
        const response = await api.get("/lookup/utility-types");
        const data = response.data?.data || response.data || [];
        setUtilityTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch utility types:", err);
      }
    };
    fetchUtilityTypes();
  }, []);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit };
      if (searchTerm) params.search = searchTerm;
      if (connectionId) params.connectionId = connectionId;
      if (utilityTypeId) params.utilityTypeId = utilityTypeId;
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get("/bills", { params });
      const data = response.data?.data || response.data;
      if (data) {
        setBills(data.bills || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / limit));
      }
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    searchTerm,
    connectionId,
    utilityTypeId,
    status,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const calculateTotal = (bill: Bill): number => {
    const subtotal = bill.energyChargeAmount + bill.fixedChargeAmount;
    const afterCredits = subtotal - bill.subsidyAmount - bill.solarExportCredit;
    const taxAmount =
      bill.billTaxes?.reduce(
        (sum, tax) =>
          sum + (tax.taxableBaseAmount * tax.ratePercentApplied) / 100,
        0
      ) || 0;
    return Math.max(0, afterCredits + taxAmount);
  };

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getBillStatus = (bill: Bill): { label: string; color: string } => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const t = calculateTotal(bill);
    if (t === 0) return { label: "Voided", color: "bg-gray-100 text-gray-800" };
    if (dueDate < today)
      return { label: "Overdue", color: "bg-red-100 text-red-800" };
    return { label: "Pending", color: "bg-yellow-100 text-yellow-800" };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBills();
  };
  const clearFilters = () => {
    setSearchTerm("");
    setConnectionId("");
    setUtilityTypeId("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleAutoGenerate = async () => {
    if (!generateMeterId) return;
    setGenerating(true);
    try {
      await api.post("/bills/meter/" + generateMeterId + "/auto-generate");
      setShowGenerateModal(false);
      setGenerateMeterId("");
      fetchBills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate bill");
    } finally {
      setGenerating(false);
    }
  };

  const handleVoidBill = async (billId: number) => {
    if (!confirm("Are you sure you want to void this bill?")) return;
    try {
      await api.post("/bills/" + billId + "/void", {
        reason: "Voided by admin",
      });
      fetchBills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to void bill");
    }
  };

  const handleGenerateAllBills = async () => {
    if (!bulkStartDate || !bulkEndDate) {
      alert("Please select billing period start and end dates");
      return;
    }
    setGeneratingAll(true);
    try {
      const response = await api.post("/bills/bulk", {
        billingPeriodStart: bulkStartDate,
        billingPeriodEnd: bulkEndDate,
      });
      const data = response.data?.data || response.data;
      alert(
        `Bills generated: ${data?.success?.length || 0} successful, ${
          data?.failed?.length || 0
        } failed`
      );
      setShowBulkModal(false);
      setBulkStartDate("");
      setBulkEndDate("");
      fetchBills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate bills");
    } finally {
      setGeneratingAll(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills Management</h1>
          <p className="text-gray-600 mt-1">
            Manage utility bills, generate new bills, and track payments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Bills</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {
              bills.filter((b) => {
                const d = new Date(b.billDate);
                const n = new Date();
                return (
                  d.getMonth() === n.getMonth() &&
                  d.getFullYear() === n.getFullYear()
                );
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {bills.filter((b) => getBillStatus(b).label === "Overdue").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              bills.reduce((sum, b) => sum + calculateTotal(b), 0)
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search by bill ID, meter serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Connection ID"
              value={connectionId}
              onChange={(e) => setConnectionId(e.target.value)}
              className="w-48 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Filters
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Utility Type
                </label>
                <select
                  value={utilityTypeId}
                  onChange={(e) => setUtilityTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Types</option>
                  {utilityTypes.map((ut) => (
                    <option key={ut.utilityTypeId} value={ut.utilityTypeId}>
                      {ut.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No bills found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bill ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Meter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Utility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills.map((bill) => {
                  const st = getBillStatus(bill);
                  return (
                    <tr key={bill.billId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{bill.billId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.meter?.meterSerialNo || "Meter #" + bill.meterId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.meter?.utilityType?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(bill.billingPeriodStart)} -{" "}
                        {formatDate(bill.billingPeriodEnd)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.totalImportUnit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(calculateTotal(bill))}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(bill.dueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            "px-2 py-1 text-xs font-medium rounded-full " +
                            st.color
                          }
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            router.push("/dashboard/bills/" + bill.billId)
                          }
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          View
                        </button>
                        {st.label !== "Voided" && (
                          <button
                            onClick={() => handleVoidBill(bill.billId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Void
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Auto Generate Bill</h2>
            <p className="text-gray-600 mb-4">
              Enter meter ID to generate a bill from latest readings.
            </p>
            <input
              type="number"
              value={generateMeterId}
              onChange={(e) => setGenerateMeterId(e.target.value)}
              placeholder="Meter ID"
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAutoGenerate}
                disabled={!generateMeterId || generating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Generate All Bills</h2>
            <p className="text-gray-600 mb-4">
              Generate bills for all meters with readings in the specified
              billing period.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Period Start
              </label>
              <input
                type="date"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Period End
              </label>
              <input
                type="date"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkStartDate("");
                  setBulkEndDate("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAllBills}
                disabled={!bulkStartDate || !bulkEndDate || generatingAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                {generatingAll ? "Generating..." : "Generate Bills"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
