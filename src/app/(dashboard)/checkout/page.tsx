"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Building,
  QrCode,
  Tag,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Loader2,
  ArrowRight,
  Copy,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";

// Types
type Product = {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  thumbnail: string;
};

type PaymentMethod = "ewallet" | "va" | "qris" | "cc";

type CheckoutState = "idle" | "loading" | "error" | "success";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16-inch",
    variant: "M3 Max, 36GB RAM, 1TB SSD",
    price: 52000000,
    qty: 1,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "p2",
    name: "Magic Mouse",
    variant: "Black Multi-Touch",
    price: 1500000,
    qty: 1,
    thumbnail: "https://images.unsplash.com/photo-1615663245857-193e1bf2467b?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function CheckoutPage() {
  // Page States
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("va");
  const [orderNotes, setOrderNotes] = useState("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponState, setCouponState] = useState<"idle" | "valid" | "invalid">("idle");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Checkout States
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionData, setTransactionData] = useState<{ id: string; expiresAt: Date } | null>(null);

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(INITIAL_PRODUCTS);
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Derived calculations
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.qty, 0), [items]);
  const tax = useMemo(() => subtotal * 0.11, [subtotal]);
  const serviceFee = paymentMethod === "cc" ? 5000 : 2000;
  const total = useMemo(() => subtotal + tax + serviceFee - discountAmount, [subtotal, tax, serviceFee, discountAmount]);

  // Handlers
  const handleQtyChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, Math.min(10, item.qty + delta));
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  // Debounced Coupon Validation (Simulasi Optimistic UI)
  useEffect(() => {
    if (!couponCode) {
      setCouponState("idle");
      setDiscountAmount(0);
      return;
    }

    const timer = setTimeout(() => {
      setIsApplyingCoupon(true);
      // Simulate API call
      setTimeout(() => {
        if (couponCode.toUpperCase() === "DISKON20") {
          setCouponState("valid");
          setDiscountAmount(2000000); // 2 juta diskon
        } else {
          setCouponState("invalid");
          setDiscountAmount(0);
        }
        setIsApplyingCoupon(false);
      }, 600);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [couponCode]);

  const handleCheckout = () => {
    if (checkoutState === "loading") return;
    
    setCheckoutState("loading");
    setErrorMessage("");

    // Simulate API request
    setTimeout(() => {
      // Randomize success/error for demo purposes (80% success rate)
      if (Math.random() > 0.2) {
        setCheckoutState("success");
        setTransactionData({
          id: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        });
      } else {
        setCheckoutState("error");
        setErrorMessage("Transaksi gagal diproses. Bank penerbit menolak permintaan ini.");
      }
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Disalin ke clipboard!");
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  // UI Components

  if (isPageLoading) {
    return <CheckoutSkeleton />;
  }

  if (checkoutState === "success" && transactionData) {
    return <SuccessView data={transactionData} method={paymentMethod} onCopy={copyToClipboard} format={formatIDR} total={total} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-12 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Selesaikan Pembayaran</h1>
          <p className="text-gray-500 mt-2">Satu langkah lagi untuk mendapatkan barang impianmu.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* KOLOM KIRI (Main Action) - 60% */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* 1. Item List */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <img src={item.thumbnail} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.variant}</p>
                      <div className="font-semibold text-gray-900 mt-2">{formatIDR(item.price)}</div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          disabled={item.qty <= 1}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          disabled={item.qty >= 10}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Catatan untuk Penjual (Opsional)</label>
                <textarea
                  id="notes"
                  rows={2}
                  className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none p-3 border text-sm"
                  placeholder="Contoh: Tolong packing kayu ya..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </section>

            {/* 2. Payment Methods */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
                Metode Pembayaran
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PaymentOption 
                  id="va" 
                  icon={<Building />} 
                  title="Virtual Account" 
                  desc="BCA, BNI, Mandiri, BRI" 
                  selected={paymentMethod === "va"} 
                  onSelect={() => setPaymentMethod("va")} 
                />
                <PaymentOption 
                  id="ewallet" 
                  icon={<Wallet />} 
                  title="E-Wallet" 
                  desc="GoPay, OVO, Dana" 
                  selected={paymentMethod === "ewallet"} 
                  onSelect={() => setPaymentMethod("ewallet")} 
                />
                <PaymentOption 
                  id="qris" 
                  icon={<QrCode />} 
                  title="QRIS" 
                  desc="Scan dari aplikasi apa saja" 
                  selected={paymentMethod === "qris"} 
                  onSelect={() => setPaymentMethod("qris")} 
                />
                <PaymentOption 
                  id="cc" 
                  icon={<CreditCard />} 
                  title="Kartu Kredit / Debit" 
                  desc="Visa, Mastercard, JCB" 
                  selected={paymentMethod === "cc"} 
                  onSelect={() => setPaymentMethod("cc")} 
                />
              </div>
            </section>

          </div>

          {/* KOLOM KANAN (Summary Card - Sticky) - 40% */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-8">
              
              <h2 className="text-lg font-semibold mb-4">Ringkasan Belanja</h2>
              
              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Makin hemat pakai promo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors sm:text-sm
                      ${couponState === 'invalid' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                        couponState === 'valid' ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50' : 
                        'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
                    placeholder="Masukkan kode promo (Coba: DISKON20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {isApplyingCoupon ? (
                      <Loader2 size={18} className="animate-spin text-blue-500" />
                    ) : couponState === "valid" ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : couponState === "invalid" ? (
                      <XCircle size={18} className="text-red-500" />
                    ) : null}
                  </div>
                </div>
                {couponState === "valid" && (
                  <p className="mt-2 text-sm text-green-600 flex items-center"><CheckCircle2 size={14} className="mr-1"/> Hore! Kamu hemat {formatIDR(discountAmount)}</p>
                )}
                {couponState === "invalid" && (
                  <p className="mt-2 text-sm text-red-600 flex items-center"><XCircle size={14} className="mr-1"/> Kode promo tidak valid atau sudah kadaluarsa.</p>
                )}
              </div>

              <div className="space-y-3 text-sm pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.qty, 0)} Barang)</span>
                  <span className="font-medium">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pajak (PPN 11%)</span>
                  <span className="font-medium">{formatIDR(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Layanan</span>
                  <span className="font-medium">{formatIDR(serviceFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Diskon Promo</span>
                    <span>-{formatIDR(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="py-6 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">Total Tagihan</span>
                <span className="text-2xl font-bold text-blue-600">{formatIDR(total)}</span>
              </div>

              {/* Error Toast / Inline Banner */}
              {checkoutState === "error" && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start border border-red-100">
                  <XCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Pembayaran Gagal</h4>
                    <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* CTA Desktop & Mobile floating */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 lg:static lg:p-0 lg:bg-transparent lg:border-none lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">
                <div className="flex justify-between items-center lg:hidden mb-3 px-2">
                  <span className="text-sm font-medium text-gray-600">Total Pembayaran</span>
                  <span className="text-lg font-bold text-blue-600">{formatIDR(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutState === "loading"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  {checkoutState === "loading" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Memproses...
                    </>
                  ) : checkoutState === "error" ? (
                    "Coba Lagi"
                  ) : (
                    <>
                      Bayar Sekarang <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center text-xs text-gray-500 gap-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span>Transaksi aman & terenkripsi (256-bit SSL)</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Opsi Pembayaran
function PaymentOption({ id, icon, title, desc, selected, onSelect }: any) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-3 group
        ${selected ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
        ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// Skeleton Loading State
function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded-md w-96 mb-8"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 h-64">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 h-64">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>)}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 h-[500px]">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-full mb-8"></div>
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>)}
              </div>
              <div className="mt-8 h-12 bg-gray-300 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success View Component
function SuccessView({ data, method, onCopy, format, total }: any) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center text-slate-900">
        <div className="bg-green-500 p-8 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Pesanan Berhasil!</h1>
          <p className="text-green-50 mt-2">Selesaikan pembayaran sesuai instruksi.</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Total yang harus dibayar</p>
            <p className="text-3xl font-bold text-blue-600">{format(total)}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">ID Transaksi</span>
              <span className="text-sm font-semibold text-gray-900">{data.id}</span>
            </div>
            
            {method === 'va' && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 block">Nomor Virtual Account</span>
                    <span className="text-lg font-mono font-semibold text-gray-900 tracking-wider">8077 392 119 233</span>
                  </div>
                  <button 
                    onClick={() => onCopy("8077392119233")}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl mb-8">
            <Clock size={18} />
            <span className="text-sm font-medium">Selesaikan sebelum 23:59:59</span>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]">
              Cek Status Pembayaran
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-4 rounded-xl transition-all border border-gray-200">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
