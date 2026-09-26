import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SiteSettings } from '../../types';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  isSupabaseConfigured, 
  SUPABASE_SQL_SCHEMA,
  supabase
} from '../../lib/supabase';
import { Check, Copy, Database, MessageCircle, Save, ExternalLink, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [dbTestResult, setDbTestResult] = useState<string | null>(null);
  const [testingDb, setTestingDb] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setSaveStatus('Store settings successfully updated! WhatsApp ordering links are now synchronized.');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus('Failed to update settings: ' + err.message);
    }
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const testSupabaseConnection = async () => {
    setTestingDb(true);
    setDbTestResult(null);

    if (!supabase) {
      setDbTestResult('Supabase anon key is not yet set in environment. App is using local fault-tolerant database.');
      setTestingDb(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('site_settings').select('id').limit(1);
      if (error) {
        setDbTestResult(`Connected to Supabase project, but tables are pending. Run the SQL schema script below in Supabase SQL editor to create all tables.`);
      } else {
        setDbTestResult(`Connected to Supabase successfully! Tables are verified.`);
      }
    } catch (err: any) {
      setDbTestResult(`Connection check: ${err.message || 'Check network'}`);
    } finally {
      setTestingDb(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      
      {/* Title */}
      <div className="border-b border-[#EAE2D7] pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
          Store Settings & Supabase Database
        </h1>
        <p className="text-xs text-[#8C6A48] mt-1 font-light">
          Configure dynamic WhatsApp business numbers, showroom address, announcement banners, and database tables.
        </p>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: WhatsApp Ordering Configuration */}
        <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F4EFEA] pb-3">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h2 className="font-serif text-lg font-semibold text-[#291C16]">
              WhatsApp Ordering Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Official WhatsApp Business Number (Digits with country code) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsAppNumber}
                onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
                placeholder="2348000000000"
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-sm text-[#291C16] font-mono focus:outline-none focus:border-[#8C6A48]"
              />
              <p className="text-[11px] text-[#8C6A48] mt-1">
                Enter international digits format without '+' or spaces (e.g. <code>2348012345678</code>). All customer "Order via WhatsApp" clicks route here.
              </p>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Phone Number (Display on Storefront)
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+234 800 000 0000"
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-sm text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Store Identity & Contact */}
        <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-4 text-xs">
          <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-3">
            Brand Identity & Locations
          </h2>

          {/* Official Brand Logo Setting */}
          <div className="bg-[#FAF7F2] border border-[#EAE2D7] p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1.5">
                Current Active Logo
              </span>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C5A059] p-0.5 bg-[#160E0A] shadow-md flex items-center justify-center">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="D Young Luxury Hairs Logo Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="font-serif font-bold text-[#E5C687] text-lg">DY</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48]">
                Official Brand Logo Image
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="Paste Logo Image URL or upload below"
                  className="flex-1 px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />
                <label className="px-4 py-2 bg-[#291C16] text-[#FDFCF7] hover:bg-[#3E2D24] text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0">
                  <span>Upload Logo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          const result = uploadEvent.target?.result as string;
                          if (result) {
                            setFormData((prev) => ({ ...prev, logoUrl: result }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#8C6A48] font-light">
                This exact logo appears across the website Header, Hero section, watermark stamps, and Footer.
              </p>
            </div>
          </div>

          {/* Official CEO Photograph Setting */}
          <div className="bg-[#FAF7F2] border border-[#EAE2D7] p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1.5">
                Current CEO Photo
              </span>
              <div className="w-20 h-24 overflow-hidden border-2 border-[#8C6A48] p-0.5 bg-[#160E0A] shadow-md flex items-center justify-center">
                {formData.ceoImageUrl ? (
                  <img
                    src={formData.ceoImageUrl}
                    alt="Eze Stephen Chidubem Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="font-serif font-bold text-[#E5C687] text-sm">ESC</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48]">
                Official CEO Photograph (Eze Stephen Chidubem)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={formData.ceoImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, ceoImageUrl: e.target.value })}
                  placeholder="Paste CEO Image URL or upload below"
                  className="flex-1 px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />
                <label className="px-4 py-2 bg-[#291C16] text-[#FDFCF7] hover:bg-[#3E2D24] text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0">
                  <span>Upload CEO Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          const result = uploadEvent.target?.result as string;
                          if (result) {
                            setFormData((prev) => ({ ...prev, ceoImageUrl: result }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#8C6A48] font-light">
                The exact original photograph of owner &amp; founder Eze Stephen Chidubem displayed in the About and Contact sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Official Slogan
              </label>
              <input
                type="text"
                value={formData.slogan || 'Premium Hair or Nothing'}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Head Office (Awka)
              </label>
              <input
                type="text"
                value={formData.headOffice || ''}
                onChange={(e) => setFormData({ ...formData, headOffice: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Branch (Kano Street, Awka)
              </label>
              <input
                type="text"
                value={formData.branch1 || ''}
                onChange={(e) => setFormData({ ...formData, branch1: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Branch Office (St Edwin Plaza, Awka)
              </label>
              <input
                type="text"
                value={formData.branch2 || ''}
                onChange={(e) => setFormData({ ...formData, branch2: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Delivery Coverage
              </label>
              <input
                type="text"
                value={formData.deliveryInfo || 'All over Nigeria'}
                onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                TikTok URL
              </label>
              <input
                type="url"
                value={formData.tiktokUrl || 'https://tiktok.com/@d.young.hairs'}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Business Hours
              </label>
              <input
                type="text"
                value={formData.businessHours || 'Open every day'}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Announcement Header Bar */}
        <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-4 text-xs">
          <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-3">
            Top Banner Announcement
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                className="w-4 h-4 text-[#291C16] border-[#D6C2A7]"
              />
              <span className="font-semibold text-[#291C16]">Display announcement strip on site header</span>
            </label>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                placeholder="e.g. Complimentary luxury satin bonnet included with all Super Double Drawn orders this month."
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#291C16] hover:bg-[#4A3326] text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>

      </form>

      {/* Section 4: Supabase Database Integration & 1-Click SQL Schema */}
      <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#8C6A48]" />
            <h2 className="font-serif text-lg font-semibold text-[#291C16]">
              Supabase Project & Schema Configuration
            </h2>
          </div>

          <a
            href="https://supabase.com/dashboard/project/geikolbqvlrcucobzwlt/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8C6A48] hover:text-[#291C16] flex items-center gap-1"
          >
            <span>Open Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE2D7] space-y-1">
            <span className="text-[#8C6A48] uppercase tracking-wider block font-semibold">Target Supabase Project</span>
            <code className="text-[#291C16] font-mono break-all">{SUPABASE_URL}</code>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE2D7] space-y-2">
            <span className="text-[#8C6A48] uppercase tracking-wider block font-semibold">Configuration State</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">
                {isSupabaseConfigured ? '✅ VITE_SUPABASE_ANON_KEY Configured' : 'ℹ️ Using Synchronized Storage Cache'}
              </span>
              <button
                onClick={testSupabaseConnection}
                disabled={testingDb}
                className="px-3 py-1 bg-[#291C16] text-[#FDFCF7] text-[11px] uppercase tracking-wider font-medium flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${testingDb ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
            {dbTestResult && (
              <p className="text-[11px] text-[#4A3326] bg-[#F4EFEA] p-2 border border-[#D6C2A7]">
                {dbTestResult}
              </p>
            )}
          </div>
        </div>

        {/* 1-Click SQL Copy */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-sm font-semibold text-[#291C16]">
                Supabase SQL Database Initialization Script
              </h3>
              <p className="text-[11px] text-[#8C6A48] font-light">
                Copy and run this in your Supabase SQL editor to create all 8 tables and Row Level Security policies.
              </p>
            </div>
            <button
              onClick={copySchemaToClipboard}
              className="px-4 py-2 bg-[#B89865] hover:bg-[#D6C2A7] text-[#1A1310] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-[#1A1310] text-[#D6C2A7] text-[11px] font-mono rounded-none overflow-x-auto max-h-60 border border-[#2E221C]">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
