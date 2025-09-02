export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
}



const API_BASE_URL = 'http://localhost:8081';

// Helper function for HTTP requests
async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    return api<Product[]>('/products');
  },

  // Get product by ID
  getProduct: async (id: number): Promise<Product> => {
    return api<Product>(`/products/${id}`);
  },

  // Create new product
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    return api<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Update product
  updateProduct: async (id: number, product: CreateProductRequest): Promise<Product> => {
    console.log('=== ProductService.updateProduct called ===');
    console.log('ID parameter:', id);
    console.log('Product data:', product);
    console.log('API URL:', `${API_BASE_URL}/api/products/${id}`);
    
    // CRITICAL: Make sure you're NOT sending the ID in the request body
    // The request body should only contain: name, description, price, stock
    const requestBody = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
      // Do NOT include: id: id or id: product.id
    };
    
    console.log('Request body being sent:', requestBody);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Only send the fields, not the ID
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      console.log('=== ProductService.updateProduct completed ===');
      
      return result;
    } catch (error) {
      console.error('=== ProductService.updateProduct ERROR ===');
      console.error('Error details:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await api(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};