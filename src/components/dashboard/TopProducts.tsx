interface TopProduct {
  id: string | number;
  name: string;
  sales: string;
  revenue: string;
}

export default function TopProducts({ data }: { data?: TopProduct[] }) {
  const products = data || [
    { id: 1, name: 'Product Alpha', sales: '1,284', revenue: 'Rp 48.2M' },
    { id: 2, name: 'Product Beta', sales: '984', revenue: 'Rp 36.7M' },
    { id: 3, name: 'Product Gamma', sales: '842', revenue: 'Rp 29.4M' },
    { id: 4, name: 'Product Delta', sales: '721', revenue: 'Rp 24.8M' },
    { id: 5, name: 'Product Omega', sales: '612', revenue: 'Rp 19.3M' },
  ];

  return (
    <div className="bg-accent border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="font-semibold text-foreground text-[16px]">Top Products</h3>
      </div>
      <div className="p-6 flex flex-col gap-5">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground font-bold text-[13px] w-4">{index + 1}.</span>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-foreground">{product.name}</span>
                <span className="text-[12px] text-muted-foreground">{product.sales} sales</span>
              </div>
            </div>
            <span className="text-[14px] font-semibold text-foreground">{product.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
