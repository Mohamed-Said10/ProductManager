import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productService,
  type Product,
} from "../services/productService";
import ProductForm from "./ProductForm";

const ProductList: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const {
    data: products,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // REMOVED: updateMutation - ProductForm handles this now

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    console.log("=== ProductList.handleEdit ===");
    console.log("Setting editing product:", product);
    setEditingProduct(product);
  };

  // UPDATED: Now receives a Product (result from API call) instead of CreateProductRequest
  const handleUpdate = (updatedProduct: Product) => {
    console.log("=== ProductList.handleUpdate ===");
    console.log("Updated product received from ProductForm:", updatedProduct);
    
    // ProductForm already made the API call successfully
    // We just need to refresh the list and close the modal
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setEditingProduct(null);
    
    console.log("Products list refreshed and modal closed");
  };

  const handleCancelEdit = () => {
    console.log("=== ProductList.handleCancelEdit ===");
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Error loading products</h3>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {products?.length || 0} items
        </span>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Product</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* UPDATED: Removed isSubmitting prop - ProductForm manages its own loading state */}
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleUpdate}  // Now expects Product parameter
              onCancel={handleCancelEdit}
              submitText="Update Product"
            />
          </div>
        </div>
      )}

      {products?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
              ></path>
            </svg>
          </div>
          <h3 className="text-gray-500 text-lg font-medium mb-2">
            No products yet
          </h3>
          <p className="text-gray-400">
            Create your first product to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock} in stock
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  disabled={deleteMutation.isPending}
                  className="btn-secondary flex-1 text-sm py-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? "Processing..." : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteMutation.isPending}
                  className="btn-danger flex-1 text-sm py-1.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-1 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Delete
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Created: {new Date(product.created).toLocaleDateString()}
                </p>
              </div>

              {/* Delete error message */}
              {deleteMutation.isError &&
                deleteMutation.variables === product.id && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-600 text-xs">
                      Error deleting product
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;