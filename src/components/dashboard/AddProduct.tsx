import React, { useState } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';

interface Feature {
  id: number;
  text: string;
}

interface Size {
  id: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

function AddProduct() {
  const [features, setFeatures] = useState<Feature[]>([{ id: 1, text: '' }]);
  const [sizes, setSizes] = useState<Size[]>([{ id: 1, value: '' }]);
  const [colors, setColors] = useState<Color[]>([{ id: 1, name: '' }]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    target_audience: '',
    precio: '',
    original_price: '',
    rating: '0',
    reviews: '0',
    stock: '',
    estado: 'active',
    stock_minimo: '5'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle features
  const addFeature = () => {
    setFeatures(prev => [...prev, { id: Date.now(), text: '' }]);
  };

  const removeFeature = (id: number) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const updateFeature = (id: number, text: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === id ? { ...feature, text } : feature
    ));
  };

  // Handle sizes
  const addSize = () => {
    setSizes(prev => [...prev, { id: Date.now(), value: '' }]);
  };

  const removeSize = (id: number) => {
    setSizes(prev => prev.filter(size => size.id !== id));
  };

  const updateSize = (id: number, value: string) => {
    setSizes(prev => prev.map(size => 
      size.id === id ? { ...size, value } : size
    ));
  };

  // Handle colors
  const addColor = () => {
    setColors(prev => [...prev, { id: Date.now(), name: '' }]);
  };

  const removeColor = (id: number) => {
    setColors(prev => prev.filter(color => color.id !== id));
  };

  const updateColor = (id: number, name: string) => {
    setColors(prev => prev.map(color => 
      color.id === id ? { ...color, name } : color
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          imagen: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      ...formData,
      features: features.map(f => f.text).filter(Boolean),
      sizes: sizes.map(s => s.value).filter(Boolean),
      colors: colors.map(c => c.name).filter(Boolean),
      fecha_creacion: new Date().toISOString()
    };

    try {

      console.log(JSON.stringify(productData));

      const response = await fetch(`${API_URL}/guardarProductos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data  = response.json();

      console.log('Response Data:', data);
      
      // Reset form
      setFormData({
        sku: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        imagen: '',
        target_audience: '',
        precio: '',
        original_price: '',
        rating: '0',
        reviews: '0',
        stock: '',
        estado: 'active',
        stock_minimo: '5'
      });
      setFeatures([{ id: 1, text: '' }]);
      setSizes([{ id: 1, value: '' }]);
      setColors([{ id: 1, name: '' }]);
      setImagePreview('');

      alert('Product added successfully!');
      
    } catch (error) {
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="">Select category</option>
                <option value="Sports">Sports</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Running">Running</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Target Audience</label>
              <select
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="">Select target audience</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Original Price</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
              <input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, imagen: '' }));
                    }}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature.id} className="flex gap-2">
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => updateFeature(feature.id, e.target.value)}
                  placeholder="Enter feature"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(feature.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center text-black hover:text-gray-700"
            >
              <Plus className="w-5 h-5 mr-1" /> Add Feature
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size.id} className="flex gap-2">
                <input
                  type="text"
                  value={size.value}
                  onChange={(e) => updateSize(size.id, e.target.value)}
                  placeholder="Enter size"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => removeSize(size.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="flex items-center text-black hover:text-gray-700"
            >
              <Plus className="w-5 h-5 mr-1" /> Add Size
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
          <div className="space-y-2">
            {colors.map((color) => (
              <div key={color.id} className="flex gap-2">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(color.id, e.target.value)}
                  placeholder="Enter color"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => removeColor(color.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="flex items-center text-black hover:text-gray-700"
            >
              <Plus className="w-5 h-5 mr-1" /> Add Color
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;