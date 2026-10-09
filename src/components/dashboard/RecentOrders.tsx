export default function RecentOrders() {
  const orders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Product Alpha', date: '24 Oct 2026', status: 'Completed', amount: 'Rp 4.2M' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Product Beta', date: '24 Oct 2026', status: 'Pending', amount: 'Rp 2.1M' },
    { id: '#ORD-003', customer: 'Michael Chen', product: 'Product Gamma', date: '23 Oct 2026', status: 'Completed', amount: 'Rp 5.4M' },
    { id: '#ORD-004', customer: 'Sarah Williams', product: 'Product Delta', date: '23 Oct 2026', status: 'Cancelled', amount: 'Rp 1.2M' },
    { id: '#ORD-005', customer: 'David Taylor', product: 'Product Omega', date: '22 Oct 2026', status: 'Completed', amount: 'Rp 3.8M' },
  ];

  return (
    <div className="bg-[#151832] border border-[#252946] rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-[#252946]">
        <h3 className="font-semibold text-[#F5F7FF] text-[16px]">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#11142B] border-b border-[#252946]">
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Order ID</th>
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Customer</th>
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Product</th>
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Date</th>
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Status</th>
              <th className="px-6 py-4 text-[12px] font-medium text-[#858BA8]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252946]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#11142B] transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-[#3867FF]">{order.id}</td>
                <td className="px-6 py-4 text-[14px] text-[#F5F7FF]">{order.customer}</td>
                <td className="px-6 py-4 text-[14px] text-[#F5F7FF]">{order.product}</td>
                <td className="px-6 py-4 text-[14px] text-[#858BA8]">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    order.status === 'Completed' ? 'bg-[#20C997]/10 text-[#20C997] border-[#20C997]/20' :
                    order.status === 'Pending' ? 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/20' :
                    'bg-[#FF4D67]/10 text-[#FF4D67] border-[#FF4D67]/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-[#F5F7FF]">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
