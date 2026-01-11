'use client';

import { useEffect, useState } from 'react';
import { useCustomerAuth } from '@/contexts/CustomerContext';
import { withCustomerAuth } from '@/components/withCustomerAuth';
import { getCustomerAuthHeader } from '@/lib/auth/customerAuth';
import {
    CreditCard,
    FileText,
    Clock,
    AlertCircle,
    Home,
    Zap,
    Search,
    CheckCircle,
    XCircle,
    DollarSign,
} from 'lucide-react';

interface Bill {
    billId: number;
    billNumber: string;
    meterSerialNo: string;
    utilityType: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    billDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIAL';
    isOverdue: boolean;
}

interface RecentPayment {
    paymentId: number;
    paymentDate: string;
    amount: number;
    method: string;
    receiptNumber: string;
    billNumber: string;
}

interface Connection {
    connectionId: number;
    utilityType: string;
    status: string;
    meterSerialNo: string;
    unpaidBills: number;
    totalOutstanding: number;
}

interface AccountSummary {
    totalOutstanding: number;
    unpaidBillCount: number;
    nextDueDate: string | null;
    totalBills: number;
    paidBills: number;
}

interface PaymentModalData {
    billId: number;
    billAmount: number;
    meterSerialNo: string;
    billNumber: string;
}

function CustomerDashboardPage() {
    const { customer } = useCustomerAuth();
    const [accountSummary, setAccountSummary] = useState<AccountSummary>({
        totalOutstanding: 0,
        unpaidBillCount: 0,
        nextDueDate: null,
        totalBills: 0,
        paidBills: 0,
    });
    const [allBills, setAllBills] = useState<Bill[]>([]);
    const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connections, setConnections] = useState<Connection[]>([]);
    
    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState<PaymentModalData | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    
    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [connectionFilter, setConnectionFilter] = useState<string>('');
    
    // Guest payment state (for renters/others)
    const [guestConnectionSearch, setGuestConnectionSearch] = useState('');
    const [guestSearchResults, setGuestSearchResults] = useState<any[]>([]);
    const [guestSearching, setGuestSearching] = useState(false);
    const [guestSearchError, setGuestSearchError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, connectionFilter, allBills]);

    const applyFilters = () => {
        let filtered = [...allBills];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(bill =>
                bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.meterSerialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.utilityType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(bill => bill.status === statusFilter);
        }

        // Apply connection filter
        if (connectionFilter) {
            filtered = filtered.filter(bill => bill.meterSerialNo === connectionFilter);
        }

        setFilteredBills(filtered);
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
            
            console.log('Fetching dashboard data...');
            console.log('Customer:', customer);
            console.log('Auth headers:', getCustomerAuthHeader());
            
            // Fetch connections for the customer from customer-portal endpoint
            const connectionsResponse = await fetch(`${API_BASE}/customer-portal/connections`, {
                headers: getCustomerAuthHeader(),
            });
            
            console.log('Connections response status:', connectionsResponse.status);
            console.log('Connections response status:', connectionsResponse.status);

            if (connectionsResponse.ok) {
                const connectionsArray = await connectionsResponse.json();
                console.log('Connections data:', connectionsArray);
                
                // Check if response has data property (wrapped) or is array directly
                const connectionsData = connectionsArray.data || connectionsArray;
                
                // Fetch bills for each connection to get outstanding amounts
                const connectionsWithBills = await Promise.all(
                    connectionsData.map(async (conn: any) => {
                        try {
                            const billsResponse = await fetch(
                                `${API_BASE}/customer-portal/bills?limit=100`,
                                {
                                    headers: getCustomerAuthHeader(),
                                }
                            );
                            
                            if (billsResponse.ok) {
                                const billsData = await billsResponse.json();
                                console.log('Bills response for connection:', conn.connectionId, billsData);
                                
                                // Handle wrapped response: {success, data: {bills: []}}
                                const allUnpaidBills = billsData.data?.bills || billsData.bills || [];
                                console.log('All unpaid bills:', allUnpaidBills);
                                
                                // Filter bills for this specific connection by meter
                                const connectionBills = allUnpaidBills.filter(
                                    (bill: any) => bill.meterSerialNo === conn.meter?.meterSerialNo && bill.outstandingAmount > 0
                                );
                                console.log('Bills for meter', conn.meter?.meterSerialNo, ':', connectionBills);
                                
                                const totalOutstanding = connectionBills.reduce(
                                    (sum: number, bill: any) => sum + (bill.outstandingAmount || 0),
                                    0
                                );
                                
                                return {
                                    connectionId: conn.connectionId,
                                    utilityType: conn.utilityType?.name || 'Unknown',
                                    status: conn.status,
                                    meterSerialNo: conn.meter?.meterSerialNo || 'Not assigned',
                                    unpaidBills: connectionBills.length,
                                    totalOutstanding,
                                };
                            }
                        } catch (error) {
                            console.error(`Failed to fetch bills for connection ${conn.connectionId}:`, error);
                        }
                        
                        return {
                            connectionId: conn.connectionId,
                            utilityType: conn.utilityType?.name || 'Unknown',
                            status: conn.status,
                            meterSerialNo: conn.meter?.meterSerialNo || 'Not assigned',
                            unpaidBills: 0,
                            totalOutstanding: 0,
                        };
                    })
                );
                
                setConnections(connectionsWithBills);
            }
            
            // Fetch all bills from customer-portal endpoint
            const billsResponse = await fetch(`${API_BASE}/customer-portal/bills?limit=100`, {
                headers: getCustomerAuthHeader(),
            });
            
            if (billsResponse.ok) {
                const billsData = await billsResponse.json();
                console.log('All bills response:', billsData);
                
                // Handle wrapped response: {success, data: {bills: []}}
                const billsList = billsData.data?.bills || billsData.bills || [];
                console.log('Bills list:', billsList);
                
                const allBillsList = billsList.map((bill: any) => ({
                    billId: bill.billId,
                    billNumber: bill.billNumber,
                    meterSerialNo: bill.meterSerialNo,
                    utilityType: bill.utilityType,
                    billingPeriodStart: bill.billingPeriodStart,
                    billingPeriodEnd: bill.billingPeriodEnd,
                    billDate: bill.billDate,
                    dueDate: bill.dueDate,
                    totalAmount: bill.totalAmount,
                    paidAmount: bill.paidAmount,
                    balanceAmount: bill.outstandingAmount,
                    status: bill.status,
                    isOverdue: bill.isOverdue,
                }));
                
                setAllBills(allBillsList);
                setFilteredBills(allBillsList);
                
                // Calculate summary
                const totalOutstanding = allBillsList.reduce(
                    (sum: number, bill: Bill) => sum + bill.balanceAmount,
                    0
                );
                const unpaidBillCount = allBillsList.filter((b: Bill) => b.balanceAmount > 0).length;
                const paidBills = allBillsList.filter((b: Bill) => b.status === 'PAID').length;
                const nextDueBill = allBillsList
                    .filter((b: Bill) => b.balanceAmount > 0)
                    .sort((a: Bill, b: Bill) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
                
                setAccountSummary({
                    totalOutstanding,
                    unpaidBillCount,
                    nextDueDate: nextDueBill?.dueDate || null,
                    totalBills: allBillsList.length,
                    paidBills,
                });
            }
            
            // Fetch recent payments
            const paymentsResponse = await fetch(`${API_BASE}/customer-portal/payments?limit=5`, {
                headers: getCustomerAuthHeader(),
            });
            
            if (paymentsResponse.ok) {
                const paymentsData = await paymentsResponse.json();
                setRecentPayments(paymentsData.payments || []);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayBill = (bill: Bill) => {
        setSelectedBill({
            billId: bill.billId,
            billAmount: bill.balanceAmount,
            meterSerialNo: bill.meterSerialNo,
            billNumber: bill.billNumber,
        });
        setPaymentAmount(bill.balanceAmount.toString());
        setShowPaymentModal(true);
        setPaymentError(null);
    };

    const processPayment = async () => {
        if (!selectedBill) return;

        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            setPaymentError('Please enter a valid amount');
            return;
        }

        if (amount > selectedBill.billAmount) {
            setPaymentError('Payment amount cannot exceed bill amount');
            return;
        }

        setPaymentProcessing(true);
        setPaymentError(null);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
            const response = await fetch(`${API_BASE}/customer-portal/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getCustomerAuthHeader(),
                },
                body: JSON.stringify({
                    billId: selectedBill.billId,
                    paymentAmount: amount,
                    paymentMethod,
                    paymentDate: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Payment failed');
            }

            // Success
            setShowPaymentModal(false);
            setSelectedBill(null);
            setPaymentAmount('');
            alert('Payment processed successfully!');
            fetchDashboardData(); // Refresh the data
        } catch (error: any) {
            setPaymentError(error.message || 'Failed to process payment');
        } finally {
            setPaymentProcessing(false);
        }
    };

    // Guest payment search function
    const searchGuestConnection = async () => {
        if (!guestConnectionSearch.trim()) {
            setGuestSearchError('Please enter a connection number');
            return;
        }

        setGuestSearching(true);
        setGuestSearchError(null);
        setGuestSearchResults([]);

        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
            
            // Search for bills by connection/meter number (public endpoint - no auth needed)
            const response = await fetch(
                `${API_BASE}/bills/search?query=${encodeURIComponent(guestConnectionSearch)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Connection not found or no bills available');
            }

            const data = await response.json();
            console.log('Guest search response:', data);
            
            // Handle nested response structure: {success, data: {success, data: []}}
            const bills = data.data?.data || data.data || data || [];
            console.log('Bills found:', bills);
            
            if (bills.length === 0) {
                setGuestSearchError('No bills found for this connection number');
            } else {
                setGuestSearchResults(bills);
            }
        } catch (error: any) {
            setGuestSearchError(error.message || 'Failed to search connection');
        } finally {
            setGuestSearching(false);
        }
    };

    const handleGuestPayBill = (bill: any) => {
        setSelectedBill({
            billId: bill.billId,
            billAmount: bill.outstandingAmount || bill.balanceAmount,
            meterSerialNo: bill.meterSerialNo,
            billNumber: bill.billNumber,
        });
        setPaymentAmount((bill.outstandingAmount || bill.balanceAmount).toString());
        setShowPaymentModal(true);
        setPaymentError(null);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
                    </span>
                );
            case 'UNPAID':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Unpaid
                    </span>
                );
            case 'OVERDUE':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Overdue
                    </span>
                );
            case 'PARTIAL':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Partial
                    </span>
                );
            default:
                return null;
        }
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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Total Outstanding</p>
                            <p className="text-3xl font-bold">{formatCurrency(accountSummary.totalOutstanding)}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Unpaid Bills</p>
                            <p className="text-3xl font-bold">{accountSummary.unpaidBillCount}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-blue-100 text-sm mb-1">Total Bills</p>
                            <p className="text-3xl font-bold">{accountSummary.totalBills}</p>
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
                {filteredBills.some(bill => bill.isOverdue && bill.balanceAmount > 0) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800">Overdue Bills</h3>
                                <p className="text-sm text-red-700">
                                    You have {filteredBills.filter(b => b.isOverdue && b.balanceAmount > 0).length} overdue bill(s).
                                    Please pay as soon as possible to avoid service interruption.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connections Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-blue-600" />
                            My Connections
                        </h2>
                    </div>
                    {connections.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No connections assigned</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {connections.map((conn: Connection) => (
                                <div
                                    key={conn.connectionId}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-600 text-white rounded-lg p-2">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{conn.utilityType}</h3>
                                                <p className="text-xs text-gray-600">{conn.meterSerialNo}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                conn.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {conn.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Unpaid Bills:</span>
                                            <span className="font-semibold text-gray-900">{conn.unpaidBills}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Outstanding:</span>
                                            <span className="font-bold text-red-600">
                                                {formatCurrency(conn.totalOutstanding)}
                                            </span>
                                        </div>
                                    </div>
                                    {conn.totalOutstanding > 0 && (
                                        <button
                                            onClick={() => setConnectionFilter(conn.meterSerialNo)}
                                            className="mt-3 block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            View Bills
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Guest Payment Section - For Renters/Others */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="w-6 h-6 text-purple-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Pay Bill by Connection Number</h2>
                            <p className="text-sm text-gray-600">For renters or others paying on behalf of connection owner</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Enter Connection Number or Meter Serial Number..."
                                value={guestConnectionSearch}
                                onChange={(e) => setGuestConnectionSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchGuestConnection()}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={searchGuestConnection}
                                disabled={guestSearching}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                {guestSearching ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        
                        {guestSearchError && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{guestSearchError}</span>
                            </div>
                        )}
                    </div>

                    {/* Guest Search Results */}
                    {guestSearchResults.length > 0 && (
                        <div className="bg-white rounded-lg overflow-hidden">
                            <div className="bg-purple-600 text-white px-4 py-3">
                                <h3 className="font-semibold">Found {guestSearchResults.length} Unpaid Bill(s)</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {guestSearchResults.map((bill) => (
                                    <div key={bill.billId} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-900">{bill.billNumber}</h4>
                                                <p className="text-sm text-gray-600">Meter: {bill.meterSerialNo}</p>
                                                <p className="text-sm text-gray-600">Connection: {bill.connectionId}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Outstanding Amount</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {formatCurrency(bill.outstandingAmount || bill.balanceAmount)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                                            <div>
                                                <p className="text-gray-600">Utility Type</p>
                                                <p className="font-semibold">{bill.utilityType}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Billing Period</p>
                                                <p className="font-semibold">
                                                    {formatDate(bill.billingPeriodStart)} - {formatDate(bill.billingPeriodEnd)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Due Date</p>
                                                <p className="font-semibold">{formatDate(bill.dueDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                    bill.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                    bill.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {bill.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleGuestPayBill(bill)}
                                            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            Pay This Bill Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Bills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bills..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Connection Filter */}
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={connectionFilter}
                            onChange={(e) => setConnectionFilter(e.target.value)}
                        >
                            <option value="">All Connections</option>
                            {connections.map((conn) => (
                                <option key={conn.connectionId} value={conn.meterSerialNo}>
                                    {conn.utilityType} - {conn.meterSerialNo}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                            <option value="PARTIAL">Partial</option>
                        </select>

                        {/* Clear Filters */}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setConnectionFilter('');
                                setStatusFilter('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Bills Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            All Bills ({filteredBills.length})
                        </h2>
                    </div>
                    {filteredBills.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No bills found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bill Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Utility
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Meter
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Period
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Balance
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBills.map((bill) => (
                                        <tr key={bill.billId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {bill.billNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bill.utilityType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {bill.meterSerialNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(bill.billingPeriodStart)} - {formatDate(bill.billingPeriodEnd)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(bill.dueDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(bill.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                                {formatCurrency(bill.balanceAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(bill.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {bill.balanceAmount > 0 && (
                                                    <button
                                                        onClick={() => handlePayBill(bill)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Payments Section */}
                {recentPayments.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-green-600" />
                                Recent Payments
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Receipt No</th>
                                        <th className="px-4 py-2 text-left">Bill Number</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments.map((payment) => (
                                        <tr key={payment.paymentId} className="border-b">
                                            <td className="px-4 py-2">{payment.receiptNumber}</td>
                                            <td className="px-4 py-2">{payment.billNumber}</td>
                                            <td className="px-4 py-2">{formatDate(payment.paymentDate)}</td>
                                            <td className="px-4 py-2 font-semibold">{formatCurrency(payment.amount)}</td>
                                            <td className="px-4 py-2">{payment.method}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Account Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Home className="w-6 h-6 text-blue-600" />
                            Account Information
                        </h2>
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

            {/* Payment Modal */}
            {showPaymentModal && selectedBill && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Process Payment</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bill Number
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBill.billNumber}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meter Serial No
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedBill.meterSerialNo}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bill Amount
                                    </label>
                                    <input
                                        type="text"
                                        value={formatCurrency(selectedBill.billAmount)}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="ONLINE">Online</option>
                                    </select>
                                </div>

                                {paymentError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        {paymentError}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={processPayment}
                                    disabled={paymentProcessing}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {paymentProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedBill(null);
                                        setPaymentError(null);
                                    }}
                                    disabled={paymentProcessing}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withCustomerAuth(CustomerDashboardPage);
