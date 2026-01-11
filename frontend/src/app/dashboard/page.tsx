"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Cable,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Droplets,
  Zap,
  Flame,
  AlertTriangle,
} from "lucide-react";
import BillingDashboard from "@/components/BillingDashboard";
import { dashboardApi, type DashboardStats } from "@/lib/api/dashboard";

function formatCurrencyLKR(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatCompactCurrencyUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(amount) ? amount : 0);
}

// Stat card component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === "increase" ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span
          className={`text-sm font-medium ${
            changeType === "increase" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
}

// Utility card component
function UtilityCard({
  title,
  activeConnections,
  pendingBills,
  icon: Icon,
  iconColor,
  bgColor,
}: {
  title: string;
  activeConnections: number;
  pendingBills: number;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className={`card p-6 ${bgColor}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-8 w-8 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Active Connections</p>
          <p className="text-2xl font-bold text-gray-900">
            {activeConnections.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Pending Bills</p>
          <p className="text-2xl font-bold text-gray-900">
            {pendingBills.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Recent activity item
function ActivityItem({
  title,
  description,
  time,
  type,
}: {
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
}) {
  const colors = {
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    info: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div
        className={`w-2 h-2 mt-2 rounded-full ${colors[type].split(" ")[0]}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getStats();
        if (mounted) setStats(data);
      } catch (e: any) {
        if (mounted) {
          // Check if it's an authentication error
          const errorMsg = e?.response?.status === 401
            ? "Please login to view the dashboard"
            : e?.message || "Failed to load dashboard data";
          setError(errorMsg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const utilityMap = useMemo(() => {
    const map = new Map<string, { activeConnections: number; pendingBills: number }>();
    for (const u of stats?.utilityStats || []) {
      map.set(u.utilityType.toLowerCase(), {
        activeConnections: u.activeConnections,
        pendingBills: u.pendingBills,
      });
    }
    return map;
  }, [stats]);

  const water = utilityMap.get("water");
  const electricity = utilityMap.get("electricity");
  const gas = utilityMap.get("gas");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s an overview of your utility management
          system.
        </p>
      </div>

      {error ? (
        <div className="card p-6 border border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              {error.includes("login") && (
                <div className="mt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Go to Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={loading ? "…" : (stats?.totalCustomers ?? 0).toLocaleString()}
          change={`${stats?.customerGrowthPercent ?? 0}%`}
          changeType={(stats?.customerGrowthPercent ?? 0) >= 0 ? "increase" : "decrease"}
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Active Connections"
          value={loading ? "…" : (stats?.activeConnections ?? 0).toLocaleString()}
          change={`${stats?.connectionsChangePercent ?? 0}%`}
          changeType={(stats?.connectionsChangePercent ?? 0) >= 0 ? "increase" : "decrease"}
          icon={Cable}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Bills Generated"
          value={loading ? "…" : (stats?.billsGenerated ?? 0).toLocaleString()}
          change={`${stats?.billsChangePercent ?? 0}%`}
          changeType={(stats?.billsChangePercent ?? 0) >= 0 ? "increase" : "decrease"}
          icon={FileText}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Revenue (MTD)"
          value={
            loading
              ? "…"
              : formatCompactCurrencyUSD((stats?.revenueMTD ?? 0) / 300)
          }
          change={`${stats?.revenueChangePercent ?? 0}%`}
          changeType={(stats?.revenueChangePercent ?? 0) >= 0 ? "increase" : "decrease"}
          icon={CreditCard}
          iconColor="bg-orange-500"
        />
      </div>

      {/* Utility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UtilityCard
          title="Water"
          activeConnections={water?.activeConnections ?? 0}
          pendingBills={water?.pendingBills ?? 0}
          icon={Droplets}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
        />
        <UtilityCard
          title="Electricity"
          activeConnections={electricity?.activeConnections ?? 0}
          pendingBills={electricity?.pendingBills ?? 0}
          icon={Zap}
          iconColor="text-yellow-500"
          bgColor="bg-yellow-50"
        />
        <UtilityCard
          title="Gas"
          activeConnections={gas?.activeConnections ?? 0}
          pendingBills={gas?.pendingBills ?? 0}
          icon={Flame}
          iconColor="text-orange-500"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Billing Dashboard Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Billing Overview
        </h2>
        <div className="card p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrencyLKR(stats?.billingOverview?.totalRevenue ?? 0)}
              </p>
              <p className="text-sm text-gray-500">
                {(stats?.billingOverview?.revenueChangePercent ?? 0).toString()}% from last month
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding Bills</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrencyLKR(stats?.billingOverview?.outstandingAmount ?? 0)}
              </p>
              <p className="text-sm text-gray-500">
                {(stats?.billingOverview?.outstandingCount ?? 0).toLocaleString()} bills
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrencyLKR(stats?.billingOverview?.overdueAmount ?? 0)}
              </p>
              <p className="text-sm text-gray-500">
                {(stats?.billingOverview?.overdueCount ?? 0).toLocaleString()} bills
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-xl font-semibold text-gray-900">
                {(stats?.billingOverview?.collectionRate ?? 0).toString()}%
              </p>
              <p className="text-sm text-gray-500">
                Target: {(stats?.billingOverview?.targetCollectionRate ?? 0).toString()}%
              </p>
            </div>
          </div>
        </div>
        <BillingDashboard />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="card-body divide-y divide-gray-100">
            <ActivityItem
              title="New customer registered"
              description="John Smith - Residential connection"
              time="5 min ago"
              type="success"
            />
            <ActivityItem
              title="Payment received"
              description="Bill #45678 - $156.50"
              time="15 min ago"
              type="success"
            />
            <ActivityItem
              title="Meter reading submitted"
              description="Route A-15 completed by James Wilson"
              time="1 hour ago"
              type="info"
            />
            <ActivityItem
              title="Service disconnection scheduled"
              description="Account #12345 - Non-payment"
              time="2 hours ago"
              type="warning"
            />
            <ActivityItem
              title="Work order completed"
              description="WO-789 - Meter installation"
              time="3 hours ago"
              type="success"
            />
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Alerts & Notifications
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Critical: Network outage detected
                </p>
                <p className="text-sm text-red-600">
                  Water distribution in Zone 4 affected. Maintenance team
                  dispatched.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Warning: High consumption alert
                </p>
                <p className="text-sm text-yellow-600">
                  15 accounts show unusual consumption patterns this month.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Info: Scheduled maintenance
                </p>
                <p className="text-sm text-blue-600">
                  Electricity substation maintenance scheduled for Dec 30, 2024.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
