'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SafeImage from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/button';
import { DataTable, Column, Action } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { RootState, AppDispatch } from '@/redux/store';
import { setProducts, setLoading, setError, openDeleteModal, closeDeleteModal } from '@/redux/adminStoreSlice';
import { getAllProducts, deleteProduct, PRODUCT_CATEGORIES, ProductCategory } from '@/lib/apiHelpers/adminStore';
import DeleteProductModal from '@/components/modals/DeleteProductModal';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error, total, showDeleteModal, selectedProductIdForDelete } = useSelector((state: RootState) => state.adminStore);
  const isMounted = useRef(false);

  // Local state for filters and pagination
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(20);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 3000);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getAllProducts(
          currentPage,
          currentLimit,
          selectedCategory === 'all' ? undefined : selectedCategory,
          debouncedSearch || undefined
        );
        dispatch(setProducts(response));
        dispatch(setLoading(false));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        toast.error(errorMessage);
      }
    };

    // Only fetch on mount or when filters change
    if (isMounted.current) {
      fetchProducts();
    } else {
      isMounted.current = true;
      fetchProducts();
    }
  }, [dispatch, selectedCategory, debouncedSearch, currentPage, currentLimit]);

  // Pagination logic
  const totalPages = Math.ceil(total / currentLimit);

  const handleEdit = (product: Record<string, unknown>) => {
    router.push(`/admin/products/edit/${product.id as string}`);
  };

  const handleDelete = (product: Record<string, unknown>) => {
    dispatch(openDeleteModal(product.id as string));
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProductIdForDelete) return;
    
    try {
      dispatch(setLoading(true));
      await deleteProduct(selectedProductIdForDelete);
      toast.success('Product deleted successfully!');
      dispatch(closeDeleteModal());
      
      // Refresh the products list
      const response = await getAllProducts(
        currentPage,
        currentLimit,
        selectedCategory === 'all' ? undefined : selectedCategory,
        debouncedSearch || undefined
      );
      dispatch(setProducts(response));
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      toast.error(errorMessage);
    }
  };

  const handleCreateProduct = () => {
    router.push('/admin/products/create');
  };

  // Define columns for the DataTable
  const columns: Column[] = [
    {
      key: 'imageUrl',
      label: 'Image',
      width: '100px',
      render: (value) => (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          <SafeImage
            src={value as string}
            alt="Product"
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg object-cover"
            fallbackText="No Image"
            fallbackClassName="w-12 h-12 rounded-lg"
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-foreground">{value as string}</div>
          <div className="text-sm text-muted-foreground">{row.description as string}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => <Badge variant="secondary">{value as string}</Badge>
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, row) => (
        <div>
          <div className="font-medium">${String(value)}</div>
          {(row.originalPrice !== undefined && row.originalPrice !== null && row.originalPrice !== value) ? (
            <div className="text-sm text-muted-foreground line-through">
              ${String(row.originalPrice)}
            </div>
          ) : null}
        </div>
      )
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      render: (value) => (
        <span className={(value as number) < 50 ? 'text-red-600 font-medium' : 'text-foreground'}>
          {value as number}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={(value as string) === 'active' ? 'default' : 'secondary'}>
          {value as string}
        </Badge>
      )
    },
    {
      key: 'isEcoFriendly',
      label: 'Eco-Friendly',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value as string).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Define actions for the DataTable
  const actions: Action[] = [
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleCreateProduct} className="gradient-ev-green hover-glow">
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>

      {/* Categories and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as ProductCategory | 'all');
              setCurrentPage(1); // Reset to first page when category changes
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minWidth: 160 }}
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
            placeholder="Search products..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minWidth: 200 }}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading products...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Products DataTable */}
      {!isLoading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12 mt-30">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory !== 'all' 
                  ? `No products found in the "${selectedCategory}" category.`
                  : debouncedSearch 
                    ? `No products found matching "${debouncedSearch}".`
                    : "There are currently no products in your catalog. Create your first product to get started."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {selectedCategory !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory('all')}
                    className="text-sm"
                  >
                    View All Categories
                  </Button>
                )}
                {debouncedSearch && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      setDebouncedSearch('');
                    }}
                    className="text-sm"
                  >
                    Clear Search
                  </Button>
                )}
                <Button onClick={handleCreateProduct} className="gradient-ev-green hover-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={products as unknown as Record<string, unknown>[]}
                columns={columns}
                actions={actions}
                title="Product List"
                searchable={false} // We're handling search manually
                pagination={false} // We're handling pagination manually
                emptyMessage="No products found"
              />
              
              {/* Custom Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center mt-6 gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Page</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <span className="text-sm font-semibold">{currentPage} / {totalPages}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                  <select
                    className="ml-4 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={currentLimit}
                    onChange={e => {
                      setCurrentLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[10, 20, 50, 100].map((l) => (
                      <option key={l} value={l}>{l} / page</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Product Modal */}
      <DeleteProductModal
        show={showDeleteModal}
        onClose={() => dispatch(closeDeleteModal())}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
} 