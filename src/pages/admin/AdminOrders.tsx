import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { db } from '../../lib/supabase';
import { MessageCircle, Phone, MapPin, Eye, Check, X, Filter } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadOrders = async () => {
    const data = await db.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await db.updateOrderStatus(orderId, newStatus);
    setFeedback(`Order status updated to "${newStatus}"`);
    setTimeout(() => setFeedback(null), 3000);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    loadOrders();
  };

  const statuses: OrderStatus[] = ['New', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Orders & WhatsApp Inquiries
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Review customer orders, delivery locations, line items, and coordinate order status.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#8C6A48]" />
          <span className="text-[#8C6A48]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#EAE2D7] text-[#291C16] focus:outline-none"
          >
            <option value="all">All ({orders.length})</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st} ({orders.filter(o => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-[#EAE2D7] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8C6A48]">
            No orders match the selected status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4EFEA] border-b border-[#EAE2D7] text-[#8C6A48] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer & Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Delivery Location</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F4EFEA]">
                {filteredOrders.map((ord) => {
                  const cleanPhone = (ord.customerWhatsApp || ord.customerPhone).replace(/[^0-9]/g, '');
                  const directWhatsAppChat = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${ord.customerName}, this is D Young Luxury Hairs regarding your order #${ord.id}.`)}`;

                  return (
                    <tr key={ord.id} className="hover:bg-[#FBF9F5] transition-colors">
                      
                      <td className="py-3.5 px-4 font-mono font-medium text-[#291C16]">
                        {ord.id}
                        <span className="block text-[10px] text-[#8C6A48] font-sans">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#291C16] block">
                          {ord.customerName}
                        </span>
                        <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[#6B5344]">
                          <Phone className="w-3 h-3 text-[#8C6A48]" />
                          <span>{ord.customerPhone}</span>
                          {ord.customerWhatsApp && (
                            <a
                              href={directWhatsAppChat}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-900"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#6B5344] max-w-xs truncate">
                        {ord.deliveryLocation}
                      </td>

                      <td className="py-3.5 px-4 text-[#291C16]">
                        {ord.items?.length || 0} item(s)
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#291C16] tabular-nums">
                        ₦{ord.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 text-[11px] font-semibold border bg-white cursor-pointer focus:outline-none"
                        >
                          {statuses.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 text-xs border border-[#D6C2A7] hover:bg-[#F4EFEA] text-[#291C16] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-[#EAE2D7] shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#291C16]">
                  Order #{selectedOrder.id}
                </h2>
                <span className="text-xs text-[#8C6A48]">
                  Created {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#8C6A48]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-[#FBF9F5] p-4 border border-[#EAE2D7]">
              <div>
                <span className="text-[#8C6A48] uppercase font-semibold block">Customer Name:</span>
                <span className="font-medium text-[#291C16] text-sm">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-[#8C6A48] uppercase font-semibold block">Phone / WhatsApp:</span>
                <span className="font-medium text-[#291C16]">{selectedOrder.customerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#8C6A48] uppercase font-semibold block">Delivery Location:</span>
                <span className="text-[#4A3326]">{selectedOrder.deliveryLocation}</span>
              </div>
              {selectedOrder.customerNote && (
                <div className="col-span-2 pt-2 border-t border-[#EAE2D7]">
                  <span className="text-[#8C6A48] uppercase font-semibold block">Customer Special Instructions:</span>
                  <p className="text-[#291C16] italic">{selectedOrder.customerNote}</p>
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-3">
              <h3 className="font-serif text-base font-semibold text-[#291C16]">
                Ordered Hair Items
              </h3>
              <div className="divide-y divide-[#F4EFEA] border border-[#EAE2D7] max-h-60 overflow-y-auto">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-[#291C16] block">{item.productName}</span>
                      <span className="text-[#8C6A48]">
                        Length: {item.length} {item.color ? `· Color: ${item.color}` : ''} × Qty {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#291C16] tabular-nums">
                      ₦{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#F4EFEA]">
              <div>
                <span className="text-xs text-[#8C6A48]">Order Total:</span>
                <span className="font-bold text-lg text-[#291C16] tabular-nums ml-2">
                  ₦{selectedOrder.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-[#D6C2A7] text-xs text-[#4A3326]"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
