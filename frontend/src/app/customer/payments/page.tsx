
import { useEffect, useState } from "react";
import axios from "axios";

interface Payment {
  id: number;
  amount: number;
  paidAt: string;
  method: string;
  billId: number;
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/v1/customer-portal/payments");
        setPayments(res.data?.items || []);
      } catch (err: any) {
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-gray-600">No payments found.</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Bill ID</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Paid At</th>
              <th className="p-2 text-left">Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="p-2">{payment.billId}</td>
                <td className="p-2">${payment.amount.toFixed(2)}</td>
                <td className="p-2">{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</td>
                <td className="p-2">{payment.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
