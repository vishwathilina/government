
import { useEffect, useState } from "react";
import axios from "axios";

interface Bill {
  id: number;
  amount: number;
  dueDate: string;
  status: string;
  period: string;
}

export default function CustomerBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBills() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/v1/customer-portal/bills");
        setBills(res.data?.items || []);
      } catch (err: any) {
        setError("Failed to load bills");
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Bill History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bills.length === 0 ? (
        <div className="text-gray-600">No bills found.</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Period</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-t">
                <td className="p-2">{bill.period}</td>
                <td className="p-2">${bill.amount.toFixed(2)}</td>
                <td className="p-2">{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "-"}</td>
                <td className="p-2">{bill.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
