import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminBlog } from './AdminBlog';
import { AdminVideos } from './AdminVideos';
import { AdminMedia } from './AdminMedia';
import { AdminSettings } from './AdminSettings';
import { AdminAssetsManager } from './AdminAssetsManager';
import { Menu, X } from 'lucide-react';

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  const { isAdmin, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1310] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B89865] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Protected Admin Area Guard
  if (!isAdmin) {
    return <AdminLogin onSuccess={() => {}} onNavigateHome={onNavigateHome} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard onNavigateTab={setCurrentTab} />;
      case 'assets':
        return <AdminAssetsManager />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'orders':
        return <AdminOrders />;
      case 'blog':
        return <AdminBlog />;
      case 'videos':
        return <AdminVideos />;
      case 'media':
        return <AdminMedia />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1A1310] text-[#FDFCF7] p-4 flex items-center justify-between border-b border-[#2E221C]">
        <span className="font-serif font-bold tracking-wider text-sm">
          D YOUNG LUXURY · ADMIN
        </span>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="text-[#D6C2A7] p-1 focus:outline-none"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 flex">
          <div className="w-64 bg-[#1A1310] h-full">
            <AdminSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
              }}
              onNavigateHome={onNavigateHome}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onNavigateHome={onNavigateHome}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

    </div>
  );
};
