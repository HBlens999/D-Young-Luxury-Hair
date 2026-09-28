import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
  supabase
} from '../../lib/supabase';
import {
  Check,
  Copy,
  Database,
  MessageCircle,
  Save,
  ExternalLink,
  RefreshCw,
  Upload
} from 'lucide-react';

const WEBSITE_IMAGE_BUCKET = 'website-images';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [formData, setFormData] = useState({ ...settings });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [dbTestResult, setDbTestResult] = useState<string | null>(null);
  const [testingDb, setTestingDb] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCeo, setUploadingCeo] = useState(false);

  /**
   * Upload an image permanently to Supabase Storage.
   */
  const uploadImage = async (
    file: File,
    folder: 'logo' | 'ceo'
  ): Promise<string> => {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY settings.'
      );
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }

    if (file.size > 15 * 1024 * 1024) {
      throw new Error('Image is too large. Maximum allowed size is 15MB.');
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() ||
      file.type.split('/')[1] ||
      'jpg';

    const filePath = `branding/${folder}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(WEBSITE_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(WEBSITE_IMAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('Image uploaded, but a public URL could not be generated.');
    }

    return data.publicUrl;
  };

  /**
   * Logo upload
   */
  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingLogo(true);
    setSaveStatus(null);

    try {
      const publicUrl = await uploadImage(file, 'logo');

      setFormData(prev => ({
        ...prev,
        logoUrl: publicUrl
      }));

      setSaveStatus(
        'Logo uploaded successfully. Click "Save Store Settings" to make it permanent in the site settings.'
      );
    } catch (error: any) {
      setSaveStatus(
        `Logo upload failed: ${error?.message || 'Unknown error'}`
      );
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  /**
   * CEO image upload
   */
  const handleCeoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingCeo(true);
    setSaveStatus(null);

    try {
      const publicUrl = await uploadImage(file, 'ceo');

      setFormData(prev => ({
        ...prev,
        ceoImageUrl: publicUrl
      }));

      setSaveStatus(
        'CEO photograph uploaded successfully. Click "Save Store Settings" to make it permanent in the site settings.'
      );
    } catch (error: any) {
      setSaveStatus(
        `CEO image upload failed: ${error?.message || 'Unknown error'}`
      );
    } finally {
      setUploadingCeo(false);
      e.target.value = '';
    }
  };

  /**
   * Save all settings to Supabase.
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaveStatus('Saving store settings...');

      await updateSettings(formData);

      setSaveStatus(
        'Store settings successfully saved. Your images are now permanently stored.'
      );

      setTimeout(() => setSaveStatus(null), 5000);
    } catch (err: any) {
      setSaveStatus(
        'Failed to update settings: ' +
          (err?.message || 'Unknown error')
      );
    }
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);

    setTimeout(() => {
      setCopiedSchema(false);
    }, 3000);
  };

  const testSupabaseConnection = async () => {
    setTestingDb(true);
    setDbTestResult(null);

    if (!supabase) {
      setDbTestResult(
        'Supabase anon key is not yet set in environment.'
      );
      setTestingDb(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1);

      if (error) {
        setDbTestResult(
          `Connected to Supabase project, but the table check returned: ${error.message}`
        );
      } else {
        setDbTestResult(
          'Connected to Supabase successfully! Tables are verified.'
        );
      }
    } catch (err: any) {
      setDbTestResult(
        `Connection check: ${
          err?.message || 'Check network'
        }`
      );
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
          Configure dynamic WhatsApp business numbers, showroom address,
          announcement banners, permanent website images, and database tables.
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

        {/* WhatsApp */}
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    whatsAppNumber: e.target.value
                  })
                }
                placeholder="2348000000000"
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-sm text-[#291C16] font-mono focus:outline-none focus:border-[#8C6A48]"
              />

              <p className="text-[11px] text-[#8C6A48] mt-1">
                Enter international digits format without '+' or spaces.
              </p>
            </div>

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Phone Number (Display on Storefront)
              </label>

              <input
                type="text"
                value={formData.phoneNumber}
                onChange={e =>
                  setFormData({
                    ...formData,
                    phoneNumber: e.target.value
                  })
                }
                placeholder="+234 800 000 0000"
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-sm text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
              />
            </div>

          </div>
        </div>

        {/* Brand Identity */}
        <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-4 text-xs">

          <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-3">
            Brand Identity & Locations
          </h2>

          {/* LOGO */}
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
                  <span className="font-serif font-bold text-[#E5C687] text-lg">
                    DY
                  </span>
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
                  onChange={e =>
                    setFormData({
                      ...formData,
                      logoUrl: e.target.value
                    })
                  }
                  placeholder="Permanent image URL"
                  className="flex-1 px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />

                <label className={`px-4 py-2 ${
                  uploadingLogo
                    ? 'bg-[#8C6A48]'
                    : 'bg-[#291C16] hover:bg-[#3E2D24]'
                } text-[#FDFCF7] text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0`}>

                  {uploadingLogo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo File</span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoUpload}
                  />

                </label>

              </div>

              <p className="text-[11px] text-[#8C6A48] font-light">
                Uploaded images are stored permanently in Supabase Storage.
              </p>

            </div>
          </div>

          {/* CEO */}
          <div className="bg-[#FAF7F2] border border-[#EAE2D7] p-4 flex flex-col sm:flex-row items-center gap-5">

            <div className="shrink-0 flex flex-col items-center">

              <span className="text-[10px] uppercase tracking-wider text-[#8C6A48] font-semibold mb-1.5">
                Current CEO Photo
              </span>

              <div className="w-20 h-24 overflow-hidden border-2 border-[#8C6A48] p-0.5 bg-[#160E0A] shadow-md flex items-center justify-center">

                {formData.ceoImageUrl ? (
                  <img
                    src={formData.ceoImageUrl}
                    alt="CEO Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="font-serif font-bold text-[#E5C687] text-sm">
                    ESC
                  </span>
                )}

              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">

              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48]">
                Official CEO Photograph
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                <input
                  type="text"
                  value={formData.ceoImageUrl || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      ceoImageUrl: e.target.value
                    })
                  }
                  placeholder="Permanent image URL"
                  className="flex-1 px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                />

                <label className={`px-4 py-2 ${
                  uploadingCeo
                    ? 'bg-[#8C6A48]'
                    : 'bg-[#291C16] hover:bg-[#3E2D24]'
                } text-[#FDFCF7] text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0`}>

                  {uploadingCeo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload CEO Photo</span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingCeo}
                    onChange={handleCeoUpload}
                  />

                </label>

              </div>

              <p className="text-[11px] text-[#8C6A48] font-light">
                The CEO photograph is stored permanently in Supabase Storage.
              </p>

            </div>
          </div>

          {/* Other Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Brand Name
              </label>

              <input
                type="text"
                value={formData.brandName}
                onChange={e =>
                  setFormData({
                    ...formData,
                    brandName: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    slogan: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    headOffice: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    branch1: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    branch2: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    deliveryInfo: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    instagramUrl: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    tiktokUrl: e.target.value
                  })
                }
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
                onChange={e =>
                  setFormData({
                    ...formData,
                    businessHours: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />
            </div>

          </div>

        </div>

        {/* Announcement */}
        <div className="bg-white border border-[#EAE2D7] p-6 sm:p-8 space-y-4 text-xs">

          <h2 className="font-serif text-lg font-semibold text-[#291C16] border-b border-[#F4EFEA] pb-3">
            Top Banner Announcement
          </h2>

          <div className="space-y-3">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={e =>
                  setFormData({
                    ...formData,
                    isAnnouncementActive: e.target.checked
                  })
                }
                className="w-4 h-4 text-[#291C16] border-[#D6C2A7]"
              />

              <span className="font-semibold text-[#291C16]">
                Display announcement strip on site header
              </span>

            </label>

            <div>

              <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1.5">
                Announcement Message Text
              </label>

              <input
                type="text"
                value={formData.announcementText}
                onChange={e =>
                  setFormData({
                    ...formData,
                    announcementText: e.target.value
                  })
                }
                className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
              />

            </div>

          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={uploadingLogo || uploadingCeo}
            className="px-8 py-3 bg-[#291C16] hover:bg-[#4A3326] disabled:opacity-50 text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 cursor-pointer shadow-md"
          >

            <Save className="w-4 h-4" />

            <span>Save Store Settings</span>

          </button>

        </div>

      </form>

      {/* Supabase Database */}
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

            <span className="text-[#8C6A48] uppercase tracking-wider block font-semibold">
              Target Supabase Project
            </span>

            <code className="text-[#291C16] font-mono break-all">
              {SUPABASE_URL}
            </code>

          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE2D7] space-y-2">

            <span className="text-[#8C6A48] uppercase tracking-wider block font-semibold">
              Configuration State
            </span>

            <div className="flex items-center justify-between">

              <span className="text-xs font-semibold">
                {isSupabaseConfigured
                  ? '✅ VITE_SUPABASE_ANON_KEY Configured'
                  : '⚠️ Supabase configuration missing'}
              </span>

              <button
                type="button"
                onClick={testSupabaseConnection}
                disabled={testingDb}
                className="px-3 py-1 bg-[#291C16] text-[#FDFCF7] text-[11px] uppercase tracking-wider font-medium flex items-center gap-1"
              >

                <RefreshCw
                  className={`w-3 h-3 ${
                    testingDb ? 'animate-spin' : ''
                  }`}
                />

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

        {/* SQL */}
        <div className="space-y-3 pt-2">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-serif text-sm font-semibold text-[#291C16]">
                Supabase SQL Database Initialization Script
              </h3>

              <p className="text-[11px] text-[#8C6A48] font-light">
                Copy and run this in your Supabase SQL editor to create the database tables and policies.
              </p>

            </div>

            <button
              type="button"
              onClick={copySchemaToClipboard}
              className="px-4 py-2 bg-[#B89865] hover:bg-[#D6C2A7] text-[#1A1310] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >

              {copiedSchema ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}

              <span>
                {copiedSchema
                  ? 'SQL Copied!'
                  : 'Copy SQL Schema'}
              </span>

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
