import React, { useState, useEffect } from 'react';
import { productService, type CreateProductRequest, type Product } from '../services/productService';

interface ProductFormProps {
  initialData?: Product; // Changed from CreateProductRequest to Product to include id
  onSubmit?: (product: Product) => void; // Changed to return the created/updated product
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit = () => {},
  isSubmitting = false,
  onCancel,
  submitText = 'Create Product'
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price,
        stock: initialData.stock,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result: Product;
      
      if (initialData && initialData.id) {
        // Update existing product
        result = await productService.updateProduct(initialData.id, formData);
      } else {
        // Create new product
        result = await productService.createProduct(formData);
      }
      
      onSubmit(result); // Pass the created/updated product back
      
      // Reset form after successful submission if not editing
      if (!initialData) {
        setFormData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error saving product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = Boolean(initialData && initialData.id);
  const isProcessing = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
          Product Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isProcessing}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isProcessing}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          placeholder="Enter product description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-3">
            Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
              disabled={isProcessing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-semibold text-gray-800 mb-3">
            Stock *
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            required
            disabled={isProcessing}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;