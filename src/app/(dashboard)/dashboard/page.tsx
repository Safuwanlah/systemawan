import { ShoppingCart, Users, Box, CreditCard } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import OrdersChart from '@/components/dashboard/OrdersChart';
import TopProducts from '@/components/dashboard/TopProducts';
import RecentOrders from '@/components/dashboard/RecentOrders';
import StaggerItem from '@/components/dashboard/StaggerItem';

export const revalidate = 0;

export default async function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* Dashboard Header */}
      <StaggerItem>
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-[24px] font-bold text-[#F5F7FF] tracking-tight">Dashboard Utama</h1>
          <div className="text-[13px] text-[#858BA8] flex items-center gap-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#3867FF]">Overview</span>
          </div>
        </div>
      </StaggerItem>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggerItem>
          <StatCard 
            title="New Orders"
            value="34567"
            icon={ShoppingCart}
            trend="+2.00%"
            trendText="(30 days)"
            isPositive={true}
            iconColor="#9B51E0"
            iconBg="rgba(155, 81, 224, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Total Income"
            value="$74,567"
            icon={CreditCard}
            trend="+5.45%"
            trendText="Increased"
            isPositive={true}
            iconColor="#20C997"
            iconBg="rgba(32, 201, 151, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Total Expense"
            value="$24,567"
            icon={CreditCard}
            trend="-2.00%"
            trendText="Expense"
            isPositive={false}
            iconColor="#3867FF"
            iconBg="rgba(56, 103, 255, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="New User"
            value="34567"
            icon={Users}
            trend="-25.00%"
            trendText="Earning"
            isPositive={false}
            iconColor="#F5B942"
            iconBg="rgba(245, 185, 66, 0.1)"
          />
        </StaggerItem>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaggerItem className="min-w-0">
          <RevenueChart />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <OrdersChart />
        </StaggerItem>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaggerItem className="lg:col-span-1 min-w-0">
          <TopProducts />
        </StaggerItem>
        <StaggerItem className="lg:col-span-2 min-w-0">
          <RecentOrders />
        </StaggerItem>
      </div>
      
    </div>
  );
}
