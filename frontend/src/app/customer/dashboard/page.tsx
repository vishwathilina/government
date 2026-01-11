'use client';

import { useEffect, useState } from 'react';
import { useCustomerAuth } from '@/contexts/CustomerContext';
import { withCustomerAuth } from '@/components/withCustomerAuth';
import { getCustomerAuthHeader } from '@/lib/auth/customerAuth';
import {
    CreditCard,
    FileText,
    Clock,
    Download,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    Home,
} from 'lucide-react';
import Link from 'next/link';

interface UnpaidBill {
    billId: number;
    billNumber: string;
    dueDate: string;
    amount: number;
    status: 'UNPAID' | 'OVERDUE';
    isOverdue: boolean;
}

interface RecentPayment {
    paymentId: number;
    paymentDate: string;
    amount: number;
    method: string;
    receiptNumber: string;
}

interface AccountSummary {
    totalOutstanding: number;
    unpaidBillCount: number;
    nextDueDate: string | null;
}

function CustomerDashboardPage() {
    const { customer } = useCustomerAuth();
    const [accountSummary, setAccountSummary] = useState<AccountSummary>({
        totalOutstanding: 0,
        unpaidBillCount: 0,
        nextDueDate: null,
    });
    const [unpaidBills, setUnpaidBills] = useState<UnpaidBill[]>([]);
    const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connections, setConnections] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
            
            // Fetch dashboard data from the new customer portal endpoint
            const dashboardResponse = await fetch(`${API_BASE}/customer-portal/dashboard`, {
                headers: getCustomerAuthHeader(),
            });

            if (dashboardResponse.ok) {
                const dashboardData = await dashboardResponse.json();
                setAccountSummary({
                    totalOutstanding: dashboardData.accountSummary?.totalOutstanding || 0,
                    unpaidBillCount: dashboardData.accountSummary?.unpaidBillCount || 0,
                    nextDueDate: dashboardData.accountSummary?.nextDueDate || null,
                });
                setUnpaidBills(dashboardData.unpaidBills?.map((bill: any) => ({
                    billId: bill.billId,
                    billNumber: bill.billNumber,
                    dueDate: bill.dueDate,
                    amount: bill.outstandingAmount,
                    status: bill.isOverdue ? 'OVERDUE' : 'UNPAID',
                    isOverdue: bill.isOverdue,
                })) || []);
                setRecentPayments(dashboardData.recentPayments || []);
                setConnections(dashboardData.connections || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {customer?.firstName} {customer?.lastName}
                    </h1>
                    <p className="text-blue-100 mb-6">Customer ID: {customer?.customerId}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Total Outstanding</p>
                            <p className="text-3xl font-bold">{formatCurrency(accountSummary.totalOutstanding)}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Unpaid Bills</p>
                            <p className="text-3xl font-bold">{accountSummary.unpaidBillCount}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Next Due Date</p>
                            <p className="text-xl font-bold">
                                {accountSummary.nextDueDate
                                    ? formatDate(accountSummary.nextDueDate)
                                    : 'No bills due'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {unpaidBills.some(bill => bill.isOverdue) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800">Overdue Bills</h3>
                                <p className="text-sm text-red-700">
                                    You have {unpaidBills.filter(b => b.isOverdue).length} overdue bill(s).
                                    Please pay as soon as possible to avoid service interruption.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

               
                {/* Assigned Connections */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Home className="w-6 h-6 text-blue-600" />
                            Assigned Connections
                        </h2>
                    </div>
                    {connections.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No connections assigned</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Utility Type</th>
                                        <th className="px-4 py-2 text-left">Meter Serial No</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {connections.map((conn: any) => (
                                        <tr key={conn.connectionId} className="border-b">
                                            <td className="px-4 py-2">{conn.utilityType}</td>
                                            <td className="px-4 py-2">{conn.meterSerialNo}</td>
                                            <td className="px-4 py-2">{conn.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Account Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Home className="w-6 h-6 text-blue-600" />
                            Account Information
                        </h2>
                        <Link
                            href="/customer/account"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Manage Account
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Email</p>
                            <p className="font-medium text-gray-900">{customer?.email}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Phone</p>
                            <p className="font-medium text-gray-900">{customer?.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                            <p className="text-sm text-gray-600 mb-1">Address</p>
                            <p className="font-medium text-gray-900">{customer?.address || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withCustomerAuth(CustomerDashboardPage);
