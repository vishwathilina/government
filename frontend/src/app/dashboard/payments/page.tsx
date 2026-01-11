"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface Bill {
  billId: string;
  meterId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  billStatus: string;
  meter: {
    meterId: string;
    meterSerialNo: string;
    utilityType: {
      name: string;
    };
  };
}

interface PaymentModalData {
  billId: string;
  billAmount: number;
  meterSerialNo: string;
}

export default function PaymentsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionIdFilter, setConnectionIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<PaymentModalData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalBills: 0,
    unpaidBills: 0,
    totalAmount: 0,
    unpaidAmount: 0,
  });

  useEffect(() => {
    fetchBills();
  }, [page, searchTerm, connectionIdFilter, statusFilter]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (connectionIdFilter) params.append("connectionId", connectionIdFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await apiClient.get(`/bills?${params.toString()}`);
      // Map backend fields to frontend Bill type
      const billsData = (response.data.data?.bills || []).map((bill: any) => {
        // Calculate totalAmount: energyChargeAmount + fixedChargeAmount + sum(taxableBaseAmount) - subsidyAmount - solarExportCredit
        const energyCharge = bill.energyChargeAmount ?? 0;
        const fixedCharge = bill.fixedChargeAmount ?? 0;
        const subsidy = bill.subsidyAmount ?? 0;
        const solarCredit = bill.solarExportCredit ?? 0;
        // Sum taxableBaseAmount from billTaxes
        const taxes = Array.isArray(bill.billTaxes)
          ? bill.billTaxes.reduce((sum: number, tax: any) => sum + (tax.taxableBaseAmount ?? 0), 0)
          : 0;
        const totalAmount = energyCharge + fixedCharge + taxes - subsidy - solarCredit;
        // For demo, assume paidAmount is 0 if not present
        const paidAmount = bill.paidAmount ?? 0;
        const balanceAmount = totalAmount - paidAmount;
        return {
          ...bill,
          totalAmount,
          balanceAmount,
        };
      });
      setBills(billsData);
      setTotalPages(response.data.data?.totalPages || 1);

      // Calculate stats
      const unpaid = billsData.filter((b: Bill) => b.billStatus === "UNPAID");
      setStats({
        totalBills: billsData.length,
        unpaidBills: unpaid.length,
        totalAmount: billsData.reduce((sum: number, b: Bill) => sum + (b.totalAmount ?? 0), 0),
        unpaidAmount: unpaid.reduce((sum: number, b: Bill) => sum + (b.balanceAmount ?? 0), 0),
      });
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    if (!selectedBill) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError("Payment amount must be greater than zero.");
      return;
    }
    try {
      setPaymentProcessing(true);
      await apiClient.post("/payments", {
        billId: parseInt(selectedBill.billId),
        paymentAmount: amount,
        paymentMethod,
        paymentChannel: "OFFICE",
      });

      alert("Payment recorded successfully!");
      setShowPaymentModal(false);
      setSelectedBill(null);
      setPaymentAmount("");
      fetchBills(); // Refresh the list
    } catch (error: any) {
      setPaymentError(error.response?.data?.message || "Payment failed");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const openPaymentModal = (bill: Bill) => {
    const safeBalance = bill.balanceAmount ?? 0;
    setSelectedBill({
      billId: bill.billId,
      billAmount: safeBalance,
      meterSerialNo: bill.meter?.meterSerialNo || "-",
    });
    setPaymentAmount(safeBalance.toString());
    setShowPaymentModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Paid
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Unpaid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            Partial
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Pay bills and manage payments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
            </div>
            <DocumentTextIcon className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-red-600">{stats.unpaidBills}</p>
            </div>
            <XCircleIcon className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                LKR {stats.totalAmount.toLocaleString()}
              </p>
            </div>
            <CurrencyDollarIcon className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Amount</p>
              <p className="text-2xl font-bold text-red-600">
                LKR {stats.unpaidAmount.toLocaleString()}
              </p>
            </div>
            <CurrencyDollarIcon className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection ID
            </label>
            <input
              type="text"
              placeholder="Filter by connection ID"
              value={connectionIdFilter}
              onChange={(e) => {
                setConnectionIdFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Status</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setConnectionIdFilter("");
                setStatusFilter("");
                setPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No bills found
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.billId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{bill.billId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.meter?.meterSerialNo || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.meter?.utilityType?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.billingPeriodStart ? new Date(bill.billingPeriodStart).toLocaleDateString() : "-"} -{" "}
                      {bill.billingPeriodEnd ? new Date(bill.billingPeriodEnd).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      LKR {(bill.totalAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      LKR {(bill.balanceAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(bill.billStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.billStatus !== "PAID" && (
                        <button
                          onClick={() => openPaymentModal(bill)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentError && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">
                  {paymentError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meter Serial No
                </label>
                <input
                  type="text"
                  value={selectedBill.meterSerialNo}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Amount
                </label>
                <input
                  type="text"
                  value={`LKR ${selectedBill.billAmount.toLocaleString()}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBill(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {paymentProcessing ? "Processing..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
