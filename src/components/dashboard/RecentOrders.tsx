export default function RecentOrders() {
  const orders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Product Alpha', date: '24 Oct 2026', status: 'Completed', amount: 'Rp 4.2M' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Product Beta', date: '24 Oct 2026', status: 'Pending', amount: 'Rp 2.1M' },
    { id: '#ORD-003', customer: 'Michael Chen', product: 'Product Gamma', date: '23 Oct 2026', status: 'Completed', amount: 'Rp 5.4M' },
    { id: '#ORD-004', customer: 'Sarah Williams', product: 'Product Delta', date: '23 Oct 2026', status: 'Cancelled', amount: 'Rp 1.2M' },
    { id: '#ORD-005', customer: 'David Taylor', product: 'Product Omega', date: '22 Oct 2026', status: 'Completed', amount: 'Rp 3.8M' },
  ];

  return (
    <div className="bg-accent border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="font-semibold text-foreground text-[16px]">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Order ID</th>
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-[12px] font-medium text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252946]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-card transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-[#3867FF]">{order.id}</td>
                <td className="px-6 py-4 text-[14px] text-foreground">{order.customer}</td>
                <td className="px-6 py-4 text-[14px] text-foreground">{order.product}</td>
                <td className="px-6 py-4 text-[14px] text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    order.status === 'Completed' ? 'bg-[#20C997]/10 text-[#20C997] border-[#20C997]/20' :
                    order.status === 'Pending' ? 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/20' :
                    'bg-[#FF4D67]/10 text-[#FF4D67] border-[#FF4D67]/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-foreground">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
