import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  FileText, 
  Video, 
  Image, 
  Settings, 
  LogOut, 
  Store,
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'assets'
  | 'categories' 
  | 'orders' 
  | 'blog' 
  | 'videos' 
  | 'media' 
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateHome: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome
}) => {
  const { logout, userEmail } = useAuth();

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Original Photos & Assets', icon: Image },
    { id: 'products', label: 'Products & Variants', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Orders & WhatsApp', icon: ShoppingBag },
    { id: 'blog', label: 'Blog CMS', icon: FileText },
    { id: 'videos', label: 'Video CMS', icon: Video },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'settings', label: 'Store & Database', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1A1310] text-[#EBE3D8] border-r border-[#2E221C] flex flex-col justify-between shrink-0 min-h-screen">
      
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-[#2E221C] flex items-center justify-between">
          <BrandLogo size="sm" variant="gold" showSlogan={false} />
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium tracking-wide transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#B89865] text-[#1A1310] font-semibold'
                    : 'text-[#D6C2A7]/80 hover:text-[#FDFCF7] hover:bg-[#291C16]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-[#2E221C] space-y-2">
        <div className="px-3 py-2 text-[11px] text-[#A68F7B]">
          <span className="block text-[#D6C2A7] font-medium truncate">
            {userEmail || 'Store Owner Admin'}
          </span>
          <span className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Authorized Session
          </span>
        </div>

        <button
          onClick={onNavigateHome}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#D6C2A7] hover:text-[#FDFCF7] hover:bg-[#291C16] transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>View Public Store</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
