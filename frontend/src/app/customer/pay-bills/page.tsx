
import { useEffect, useState } from "react";
import axios from "axios";

interface Bill {
  id: number;
  amount: number;
  dueDate: string;
  status: string;
  period: string;
}

export default function PayBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUnpaidBills() {
      setLoading(true);
      setError("");
      try {
        // Assumes API route is proxied or available at this path
        const res = await axios.get("/api/v1/customer-portal/bills/unpaid");
        setBills(res.data || []);
      } catch (err: any) {
        setError("Failed to load unpaid bills");
      } finally {
        setLoading(false);
      }
    }
    fetchUnpaidBills();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Pay Bills</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bills.length === 0 ? (
        <div className="text-gray-600">No unpaid bills 🎉</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-t">
                <td className="p-2">{bill.period}</td>
                <td className="p-2">${bill.amount.toFixed(2)}</td>
                <td className="p-2">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "-"}</td>
                <td className="p-2">{bill.status}</td>
                <td className="p-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" disabled>
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
