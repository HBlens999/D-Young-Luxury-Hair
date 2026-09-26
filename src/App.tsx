/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { VideosPage } from './pages/VideosPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { DeliveryInfoPage } from './pages/DeliveryInfoPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/admin/AdminPage';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentQuery, setCurrentQuery] = useState<string>(() => {
    return window.location.search || '';
  });

  // Listen to popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentQuery(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const handleNavigate = (pathWithQuery: string) => {
    const [path, query] = pathWithQuery.split('?');
    const searchString = query ? `?${query}` : '';
    window.history.pushState({}, '', path + searchString);
    setCurrentPath(path);
    setCurrentQuery(searchString);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Parse queries like ?category=...
  const queryParams = new URLSearchParams(currentQuery);
  const initialCategorySlug = queryParams.get('category') || undefined;

  // Route resolver
  const renderPage = () => {
    // Admin
    if (isAdminRoute) {
      return <AdminPage onNavigateHome={() => handleNavigate('/')} />;
    }

    // Home
    if (currentPath === '/') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    // Shop
    if (currentPath === '/shop') {
      return <ShopPage onNavigate={handleNavigate} initialCategorySlug={initialCategorySlug} />;
    }

    // Categories
    if (currentPath === '/categories') {
      return <CategoriesPage onNavigate={handleNavigate} />;
    }

    // Product Details: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} onNavigate={handleNavigate} />;
    }

    // Cart
    if (currentPath === '/cart') {
      return <CartPage onNavigate={handleNavigate} />;
    }

    // Checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={handleNavigate} />;
    }

    // Blog list
    if (currentPath === '/blog') {
      return <BlogPage onNavigate={handleNavigate} />;
    }

    // Blog single: /blog/:slug
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={handleNavigate} />;
    }

    // Videos
    if (currentPath === '/videos') {
      return <VideosPage onNavigate={handleNavigate} />;
    }

    // About
    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    // Contact
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    // FAQ
    if (currentPath === '/faq') {
      return <FAQPage onNavigate={handleNavigate} />;
    }

    // Delivery Information
    if (currentPath === '/delivery') {
      return <DeliveryInfoPage onNavigate={handleNavigate} />;
    }

    // Legal
    if (currentPath === '/privacy') {
      return <LegalPage type="privacy" />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" />;
    }

    // Default Fallback: Home
    return <HomePage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#291C16]">
      {/* Customer Header */}
      {!isAdminRoute && (
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
      )}

      {/* Main View */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Customer Footer */}
      {!isAdminRoute && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </CartProvider>
    </SettingsProvider>
  );
}
