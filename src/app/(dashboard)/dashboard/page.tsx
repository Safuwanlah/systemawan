import { ShoppingCart, Users, Box, CreditCard } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import OrdersChart from '@/components/dashboard/OrdersChart';
import TopProducts from '@/components/dashboard/TopProducts';
import RecentOrders from '@/components/dashboard/RecentOrders';
import StaggerItem from '@/components/dashboard/StaggerItem';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export default async function Dashboard() {
  // Fetch queries concurrently for fast response
  const [allTransactions, sparepartsCount] = await Promise.all([
    prisma.stockTransaction.findMany({
      select: { type: true, quantity: true, harga: true, date: true, sparepartId: true }
    }),
    prisma.sparepart.count()
  ]);

  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueData = months.map(m => ({ name: m, value: 0 }));
  const ordersData = months.map(m => ({ name: m, value: 0 }));

  let totalIncome = 0;
  let totalExpense = 0;
  const productStats: Record<string, { sales: number, revenue: number }> = {};

  allTransactions.forEach(t => {
    const total = t.quantity * t.harga;
    if (t.type === 'KELUAR') {
      totalIncome += total;
      
      if (!productStats[t.sparepartId]) productStats[t.sparepartId] = { sales: 0, revenue: 0 };
      productStats[t.sparepartId].sales += t.quantity;
      productStats[t.sparepartId].revenue += total;
    } else if (t.type === 'MASUK') {
      totalExpense += total;
    }

    const d = new Date(t.date);
    if (d.getFullYear() === currentYear) {
      const monthIndex = d.getMonth();
      if (t.type === 'KELUAR') {
        revenueData[monthIndex].value += total;
      }
      ordersData[monthIndex].value += t.quantity;
    }
  });

  const newOrders = allTransactions.length;

  const scaledRevenueData = revenueData.map(d => ({
    ...d,
    value: Math.round(d.value / 1000000)
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Fetch only top 5 products details and 5 recent transactions concurrently
  const topProductIds = Object.entries(productStats)
    .sort((a, b) => b[1].sales - a[1].sales)
    .slice(0, 5)
    .map(entry => entry[0]);

  const [topSpareparts, recentTransactions] = await Promise.all([
    prisma.sparepart.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true }
    }),
    prisma.stockTransaction.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { sparepart: { select: { name: true } }, supplier: { select: { name: true } }, user: { select: { name: true } } },
    })
  ]);

  const topProductsData = topProductIds.map(id => {
    const sp = topSpareparts.find(s => s.id === id);
    const stats = productStats[id];
    return {
      id,
      name: sp?.name || 'Unknown',
      sales: stats.sales.toString(),
      revenue: formatCurrency(stats.revenue),
      salesCount: stats.sales
    }
  });

  const recentOrdersData = recentTransactions.map(t => ({
    id: t.nomorTransaksi,
    customer: t.supplier?.name || t.officer || t.user?.name || 'Unknown',
    product: t.sparepart.name,
    date: new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: t.type === 'KELUAR' ? 'Completed' : (t.type === 'MASUK' ? 'Pending' : 'Completed'),
    amount: formatCurrency(t.quantity * t.harga),
    type: t.type
  }));

  return (
    <div className="space-y-6">
      
      {/* Dashboard Header */}
      <StaggerItem>
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-[24px] font-bold text-foreground tracking-tight">Dashboard Utama</h1>
          <div className="text-[13px] text-muted-foreground flex items-center gap-2">
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
            title="Total Transaksi"
            value={newOrders.toString()}
            icon={ShoppingCart}
            trend="+12%"
            trendText="(30 hari)"
            isPositive={true}
            iconColor="#9B51E0"
            iconBg="rgba(155, 81, 224, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Total Pendapatan"
            value={formatCurrency(totalIncome)}
            icon={CreditCard}
            trend="+5.45%"
            trendText="Meningkat"
            isPositive={true}
            iconColor="#20C997"
            iconBg="rgba(32, 201, 151, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Total Pengeluaran"
            value={formatCurrency(totalExpense)}
            icon={CreditCard}
            trend="-2.00%"
            trendText="Pengeluaran"
            isPositive={false}
            iconColor="#3867FF"
            iconBg="rgba(56, 103, 255, 0.1)"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard 
            title="Total Sparepart"
            value={sparepartsCount.toString()}
            icon={Box}
            trend="+2"
            trendText="Baru"
            isPositive={true}
            iconColor="#F5B942"
            iconBg="rgba(245, 185, 66, 0.1)"
          />
        </StaggerItem>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaggerItem className="min-w-0">
          <RevenueChart data={scaledRevenueData} totalValue={formatCurrency(totalIncome)} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <OrdersChart data={ordersData} />
        </StaggerItem>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaggerItem className="lg:col-span-1 min-w-0">
          <TopProducts data={topProductsData} />
        </StaggerItem>
        <StaggerItem className="lg:col-span-2 min-w-0">
          <RecentOrders data={recentOrdersData} />
        </StaggerItem>
      </div>
      
    </div>
  );
}
