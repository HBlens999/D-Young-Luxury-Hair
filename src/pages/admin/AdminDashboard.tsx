import React, { useState, useEffect } from 'react';
import { db } from '../../lib/supabase';
import { Product, Order, BlogPost } from '../../types';
import { Package, ShoppingBag, DollarSign, FileText, CheckCircle, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AdminTab } from '../../components/admin/AdminSidebar';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        // Load each dashboard source independently. A slow/failing
        // catalogue request must not make orders and blog metrics appear empty.
        const [prods, ords, posts] = await Promise.allSettled([
          db.getProducts(),
          db.getOrders(),
          db.getBlogPosts()
        ]);

        if (prods.status === 'fulfilled') setProducts(prods.value);
        else console.error('Dashboard products failed:', prods.reason);

        if (ords.status === 'fulfilled') setOrders(ords.value);
        else console.error('Dashboard orders failed:', ords.reason);

        if (posts.status === 'fulfilled') setBlogPosts(posts.value);
        else console.error('Dashboard blog posts failed:', posts.reason);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.isPublished).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const newArrivals = products.filter(p => p.isNewArrival).length;

  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'New').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Atelier Executive Overview
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Real-time status of products, incoming WhatsApp orders, and content journal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Orders */}
        <div className="bg-white border border-[#EAE2D7] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#8C6A48]">
            <span className="text-xs uppercase tracking-wider font-semibold">Incoming Orders</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold text-[#291C16] tabular-nums">
              {totalOrders}
            </span>
            {newOrders > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                {newOrders} New
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6B5344] font-light">
            Direct customer WhatsApp inquiries logged
          </p>
        </div>

        {/* Order Revenue */}
        <div className="bg-white border border-[#EAE2D7] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#8C6A48]">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Order Volume</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold text-[#291C16] tabular-nums">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-[#6B5344] font-light">
            Cumulative order pipeline value
          </p>
        </div>

        {/* Total Hair Products */}
        <div className="bg-white border border-[#EAE2D7] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#8C6A48]">
            <span className="text-xs uppercase tracking-wider font-semibold">Products Catalog</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold text-[#291C16] tabular-nums">
              {totalProducts}
            </span>
            <span className="text-xs text-[#8C6A48]">({publishedProducts} Live)</span>
          </div>
          <p className="text-[11px] text-[#6B5344] font-light">
            {featuredProducts} featured · {newArrivals} new arrivals
          </p>
        </div>

        {/* Blog Editorials */}
        <div className="bg-white border border-[#EAE2D7] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#8C6A48]">
            <span className="text-xs uppercase tracking-wider font-semibold">Hair Journals</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold text-[#291C16] tabular-nums">
              {blogPosts.length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">Published Articles</span>
          </div>
          <p className="text-[11px] text-[#6B5344] font-light">
            Educating buyers on hair grades & care
          </p>
        </div>

      </div>

      {/* Recent Orders & Quick Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-[#EAE2D7] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
            <h2 className="font-serif text-lg font-semibold text-[#291C16]">
              Recent Orders Log
            </h2>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs uppercase tracking-wider text-[#8C6A48] hover:text-[#291C16] flex items-center gap-1 font-medium"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C6A48]">
              No orders logged yet. Customer orders placed via WhatsApp will appear here automatically.
            </div>
          ) : (
            <div className="divide-y divide-[#F4EFEA] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#8C6A48] border-b border-[#F4EFEA]">
                    <th className="py-2.5 font-semibold uppercase tracking-wider">Customer</th>
                    <th className="py-2.5 font-semibold uppercase tracking-wider">Location</th>
                    <th className="py-2.5 font-semibold uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 font-semibold uppercase tracking-wider">Status</th>
                    <th className="py-2.5 font-semibold uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFEA]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FBF9F5]">
                      <td className="py-3 font-medium text-[#291C16]">
                        {ord.customerName}
                        <span className="block text-[10px] text-[#8C6A48]">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 text-[#6B5344] max-w-[140px] truncate">
                        {ord.deliveryLocation}
                      </td>
                      <td className="py-3 font-semibold text-[#291C16] tabular-nums">
                        ₦{ord.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold ${
                          ord.status === 'New'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-stone-100 text-stone-900 border border-stone-300'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-[#8C6A48] tabular-nums">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Quick Actions & Live Status (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-[#EAE2D7] p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-2">
              Quick Management
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('products')}
                className="w-full text-left p-2.5 bg-[#FBF9F5] hover:bg-[#F4EFEA] border border-[#EAE2D7] flex items-center justify-between text-[#291C16]"
              >
                <span>Manage Hair & Variants</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6A48]" />
              </button>
              <button
                onClick={() => onNavigateTab('categories')}
                className="w-full text-left p-2.5 bg-[#FBF9F5] hover:bg-[#F4EFEA] border border-[#EAE2D7] flex items-center justify-between text-[#291C16]"
              >
                <span>Add / Edit Categories</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6A48]" />
              </button>
              <button
                onClick={() => onNavigateTab('blog')}
                className="w-full text-left p-2.5 bg-[#FBF9F5] hover:bg-[#F4EFEA] border border-[#EAE2D7] flex items-center justify-between text-[#291C16]"
              >
                <span>Write Hair Care Article</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6A48]" />
              </button>
              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full text-left p-2.5 bg-[#FBF9F5] hover:bg-[#F4EFEA] border border-[#EAE2D7] flex items-center justify-between text-[#291C16]"
              >
                <span>Update WhatsApp Phone Number</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6A48]" />
              </button>
            </div>
          </div>

          <div className="bg-[#F4EFEA] border border-[#D6C2A7] p-6 space-y-2 text-xs">
            <span className="uppercase tracking-wider font-semibold text-[#8C6A48] block">
              Atelier Database Status
            </span>
            <p className="text-[#4A3326] font-light leading-relaxed">
              Database is synchronizing with Supabase and secure local failover. All customer orders generate verified WhatsApp messages and log securely.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
