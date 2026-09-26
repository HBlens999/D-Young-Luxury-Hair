import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductVariant, HairType } from '../../types';
import { db } from '../../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  DollarSign, 
  Layers, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Load products and categories
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        db.getProducts(),
        db.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products in admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Quick toggle publish status
  const handleTogglePublish = async (product: Product) => {
    const updated = { ...product, isPublished: !product.isPublished };
    await db.saveProduct(updated);
    showNotice(`Product "${product.name}" is now ${updated.isPublished ? 'Published' : 'Unpublished'}`);
    loadData();
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (product: Product) => {
    const updated = { ...product, isFeatured: !product.isFeatured };
    await db.saveProduct(updated);
    showNotice(`Product "${product.name}" featured status updated`);
    loadData();
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await db.deleteProduct(id);
      showNotice(`Product "${name}" deleted`);
      loadData();
    }
  };

  // Start new product template
  const handleStartNewProduct = () => {
    const defaultCat = categories[0] || { id: 'cat-1', name: 'SDD Vietnamese Bone Straight' };
    const newTemplate: Product = {
      id: 'prod-' + Date.now(),
      name: '',
      slug: '',
      categoryId: defaultCat.id,
      categoryName: defaultCat.name,
      productType: 'Human Hair',
      shortDescription: '',
      description: '',
      mainImage: products[0]?.mainImage || '',
      additionalImages: [],
      texture: 'Super Double Drawn Bone Straight',
      density: '250%',
      capSize: 'Bundle Set',
      origin: 'Vietnamese Temple Donor',
      availability: 'in_stock',
      isFeatured: false,
      isNewArrival: true,
      isPublished: true,
      minPrice: 200000,
      maxPrice: 350000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: [
        { id: 'v-' + Date.now() + '-1', length: '18"', color: 'Natural Black #1B', price: 200000, stockQuantity: 10, sku: 'DY-NEW-18' },
        { id: 'v-' + Date.now() + '-2', length: '20"', color: 'Natural Black #1B', price: 235000, stockQuantity: 10, sku: 'DY-NEW-20' },
        { id: 'v-' + Date.now() + '-3', length: '22"', color: 'Natural Black #1B', price: 270000, stockQuantity: 10, sku: 'DY-NEW-22' },
        { id: 'v-' + Date.now() + '-4', length: '24"', color: 'Natural Black #1B', price: 310000, stockQuantity: 10, sku: 'DY-NEW-24' },
      ]
    };
    setEditingProduct(newTemplate);
    setIsCreatingNew(true);
  };

  // Save product from modal
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      alert('Product name is required');
      return;
    }

    // Auto-generate slug if missing
    let slug = editingProduct.slug;
    if (!slug || !slug.trim()) {
      slug = editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Calculate min and max price from variants
    const prices = editingProduct.variants.map(v => v.price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : editingProduct.minPrice;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : editingProduct.maxPrice;

    // Find category name
    const selectedCat = categories.find(c => c.id === editingProduct.categoryId);
    const categoryName = selectedCat ? selectedCat.name : editingProduct.categoryName;

    const productToSave: Product = {
      ...editingProduct,
      slug,
      minPrice,
      maxPrice,
      categoryName,
      updatedAt: new Date().toISOString()
    };

    await db.saveProduct(productToSave);
    showNotice(`Product "${productToSave.name}" successfully saved!`);
    setEditingProduct(null);
    setIsCreatingNew(false);
    loadData();
  };

  // Variant manager helpers inside editor
  const addVariantRow = () => {
    if (!editingProduct) return;
    const newVariant: ProductVariant = {
      id: 'v-' + Date.now(),
      length: '26"',
      color: 'Natural Black #1B',
      price: 340000,
      stockQuantity: 10,
      sku: `DY-${Date.now().toString().slice(-4)}`
    };
    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, newVariant]
    });
  };

  const removeVariantRow = (id: string) => {
    if (!editingProduct) return;
    if (editingProduct.variants.length <= 1) {
      alert('At least one length variant is required for pricing.');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.filter(v => v.id !== id)
    });
  };

  const updateVariantRow = (id: string, field: keyof ProductVariant, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D7] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#291C16]">
            Hair Products & Length Variants
          </h1>
          <p className="text-xs text-[#8C6A48] mt-1 font-light">
            Manage your Vietnamese bone straight hair lines, lengths (16" to 30"), variant prices in Naira, and stock.
          </p>
        </div>

        <button
          onClick={handleStartNewProduct}
          className="px-4 py-2.5 bg-[#291C16] text-[#FDFCF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#4A3326] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Luxury Product</span>
        </button>
      </div>

      {feedbackNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-[#EAE2D7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4EFEA] border-b border-[#EAE2D7] text-[#8C6A48] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Image & Product Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Type</th>
                <th className="py-3.5 px-4 font-semibold">Price Range (NGN)</th>
                <th className="py-3.5 px-4 font-semibold">Lengths</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F4EFEA]">
              {products.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-[#FBF9F5] transition-colors">
                    
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover bg-[#F4EFEA] border border-[#EAE2D7] shrink-0"
                        />
                        <div>
                          <span className="font-serif text-sm font-semibold text-[#291C16] block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-[#8C6A48]">
                            Slug: /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#4A3326]">
                      {p.categoryName || 'Standard'}
                    </td>

                    {/* Material */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-semibold bg-[#EBE3D8] text-[#291C16]">
                        {p.productType}
                      </span>
                    </td>

                    {/* Price Range */}
                    <td className="py-3 px-4 font-semibold text-[#291C16] tabular-nums">
                      ₦{p.minPrice.toLocaleString()} – ₦{p.maxPrice.toLocaleString()}
                    </td>

                    {/* Length Variants Count */}
                    <td className="py-3 px-4 text-[#6B5344]">
                      {p.variants?.length || 0} lengths
                      <span className="block text-[10px] text-[#8C6A48]">
                        ({p.variants?.map(v => v.length).join(', ')})
                      </span>
                    </td>

                    {/* Published status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`p-1.5 border transition-colors cursor-pointer ${
                            p.isPublished
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-stone-100 border-stone-300 text-stone-500'
                          }`}
                          title={p.isPublished ? 'Click to unpublish' : 'Click to publish'}
                        >
                          {p.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-amber-50 text-amber-900 border border-amber-300">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(JSON.parse(JSON.stringify(p)));
                            setIsCreatingNew(false);
                          }}
                          className="p-1.5 text-[#291C16] hover:bg-[#F4EFEA] border border-[#D6C2A7] transition-colors"
                          title="Edit Product & Variants"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT EDIT / CREATE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white border border-[#EAE2D7] shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#F4EFEA] border-b border-[#EAE2D7] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#291C16]">
                  {isCreatingNew ? 'Create New Luxury Hair Product' : `Edit Product: ${editingProduct.name}`}
                </h2>
                <p className="text-xs text-[#8C6A48] mt-0.5">
                  Configure details, multiple length variants, exact prices, and image URLs.
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#4A3326] hover:text-[#291C16]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Mirror Bone Straight HD Frontal Unit"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                        categoryName: cat ? cat.name : editingProduct.categoryName
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16] focus:outline-none focus:border-[#8C6A48]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Hair Material
                  </label>
                  <select
                    value={editingProduct.productType}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productType: e.target.value as HairType })}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  >
                    <option value="Human Hair">100% Human Hair</option>
                    <option value="Artificial Hair">Artificial Hair</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Availability
                  </label>
                  <select
                    value={editingProduct.availability}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, availability: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  >
                    <option value="in_stock">In Stock & Ready</option>
                    <option value="pre_order">Pre-Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                    Custom URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="auto-generated-from-name"
                    className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Short Summary (Cards & Previews)
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  placeholder="e.g. 100% Vietnamese human hair with liquid glass shine and full ends."
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#8C6A48] mb-1">
                  Full Detailed Description & Atelier Specifications
                </label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                />
              </div>

              {/* Images with File Upload */}
              <div className="space-y-3 bg-[#FAF7F2] p-4 border border-[#EAE2D7]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block uppercase tracking-wider font-semibold text-[#8C6A48]">
                    Main Product Image
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#291C16] text-[#FDFCF7] text-[11px] uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#4A3326] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setEditingProduct({ ...editingProduct, mainImage: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  {editingProduct.mainImage && (
                    <div className="w-16 h-16 shrink-0 border border-[#8C6A48] overflow-hidden bg-black">
                      <img
                        src={editingProduct.mainImage}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingProduct.mainImage}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                    placeholder="Or paste image URL / asset path directly"
                    className="flex-1 px-3 py-2 bg-[#FBF9F5] border border-[#EAE2D7] text-[#291C16]"
                  />
                </div>
              </div>

              {/* VARIANTS SECTION: LENGTH & PRICE CONFIGURATION */}
              <div className="p-4 bg-[#F4EFEA] border border-[#D6C2A7] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#291C16]">
                      Length Variants & Individual Prices (NGN)
                    </h3>
                    <p className="text-[11px] text-[#6B5344]">
                      Define the exact length (e.g. 16", 18", 20", 22", 24") and its exact price in Naira.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="px-3 py-1.5 bg-[#291C16] text-white text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Length</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.variants.map((variant) => (
                    <div key={variant.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 border border-[#EAE2D7]">
                      
                      {/* Length */}
                      <div className="col-span-3">
                        <label className="text-[10px] text-[#8C6A48] uppercase block">Length</label>
                        <input
                          type="text"
                          value={variant.length}
                          onChange={(e) => updateVariantRow(variant.id, 'length', e.target.value)}
                          placeholder={'e.g. 20"'}
                          className="w-full px-2 py-1 bg-[#FBF9F5] border border-[#EAE2D7] font-medium"
                        />
                      </div>

                      {/* Color */}
                      <div className="col-span-3">
                        <label className="text-[10px] text-[#8C6A48] uppercase block">Color Shade</label>
                        <input
                          type="text"
                          value={variant.color || ''}
                          onChange={(e) => updateVariantRow(variant.id, 'color', e.target.value)}
                          placeholder="Natural Black #1B"
                          className="w-full px-2 py-1 bg-[#FBF9F5] border border-[#EAE2D7]"
                        />
                      </div>

                      {/* Price in Naira */}
                      <div className="col-span-3">
                        <label className="text-[10px] text-[#8C6A48] uppercase block">Price (₦ NGN)</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariantRow(variant.id, 'price', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-[#FBF9F5] border border-[#EAE2D7] font-bold tabular-nums"
                        />
                      </div>

                      {/* SKU */}
                      <div className="col-span-2">
                        <label className="text-[10px] text-[#8C6A48] uppercase block">SKU</label>
                        <input
                          type="text"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariantRow(variant.id, 'sku', e.target.value)}
                          placeholder="DY-18"
                          className="w-full px-2 py-1 bg-[#FBF9F5] border border-[#EAE2D7]"
                        />
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 text-right pt-3">
                        <button
                          type="button"
                          onClick={() => removeVariantRow(variant.id)}
                          className="text-red-700 hover:text-red-900 p-1"
                          title="Delete variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#291C16] border-[#D6C2A7]"
                  />
                  <span className="font-semibold text-[#291C16]">Published Live on Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#291C16] border-[#D6C2A7]"
                  />
                  <span className="font-semibold text-[#291C16]">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="w-4 h-4 text-[#291C16] border-[#D6C2A7]"
                  />
                  <span className="font-semibold text-[#291C16]">Mark as New Arrival</span>
                </label>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-[#EAE2D7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 border border-[#D6C2A7] text-[#4A3326] hover:bg-[#F4EFEA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#291C16] hover:bg-[#4A3326] text-white font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Save Product & Update Shop
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
