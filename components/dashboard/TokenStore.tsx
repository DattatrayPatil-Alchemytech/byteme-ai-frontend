'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckoutPage from '@/components/store/CheckoutPage';
import { RootState, AppDispatch } from '@/redux/store';
import { setProducts, setLoading, setError, openProductModal, closeProductModal } from '@/redux/storeProductsSlice';
import { getProducts, PRODUCT_CATEGORIES, Product, ProductCategory } from '@/lib/apiHelpers/storeProducts';
import { Eye, ShoppingCart, Package } from 'lucide-react';
import ProductModal from '@/components/modals/ProductModal';
import toast from 'react-hot-toast';

export default function TokenStore() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error, total, showProductModal, selectedProductId } = useSelector((state: RootState) => state.storeProducts);
  const { user } = useSelector((state: RootState) => state.user);
  const userTokens = user?.b3trBalance || 0;
  const isMounted = useRef(false);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(20);
  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);


  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 3000);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch products from API when filters change
  useEffect(() => {
    // Skip the first render to prevent double API calls
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getProducts(
          currentPage,
          currentLimit,
          selectedCategory === 'all' ? undefined : selectedCategory,
          debouncedSearch || undefined
        );
        dispatch(setProducts(response));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
        dispatch(setError(errorMessage));
      }
    };
    fetchProducts();
  }, [dispatch, selectedCategory, debouncedSearch, currentPage, currentLimit]);

  // Initial load - fetch products on mount
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getProducts(
          1,
          20,
          undefined,
          undefined
        );
        dispatch(setProducts(response));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
        dispatch(setError(errorMessage));
      }
    };
    fetchInitialProducts();
  }, [dispatch]);

  // Handle shopping cart click
  const handlePurchaseClick = (product: Product) => {
    const productPrice = parseFloat(product.price);
    const maxQuantity = Math.floor(userTokens / productPrice);
    
    if (maxQuantity < 1) {
      toast.error(`Insufficient tokens. You need at least ${productPrice} B3TR tokens to purchase this item.`);
      return;
    }
    
    setCheckoutProduct(product);
    setCheckoutQuantity(1); // Default quantity
    setIsCheckout(true);
  };

  // Handle quantity change in checkout
  const handleQuantityChange = (newQuantity: number) => {
    if (!checkoutProduct) return;
    
    const productPrice = parseFloat(checkoutProduct.price);
    const maxQuantity = Math.floor(userTokens / productPrice);
    
    if (newQuantity > maxQuantity) {
      alert(`Maximum quantity allowed: ${maxQuantity} (based on your available tokens)`);
      return;
    }
    
    if (newQuantity > checkoutProduct.stockQuantity) {
      alert(`Maximum quantity available: ${checkoutProduct.stockQuantity}`);
      return;
    }
    
    setCheckoutQuantity(newQuantity);
  };

  // Pagination logic
  const totalPages = Math.ceil(total / currentLimit);

  // If in checkout mode, show checkout page
  if (isCheckout && checkoutProduct) {
    const checkoutProductCompat = {
      id: parseInt(checkoutProduct.id),
      name: checkoutProduct.name,
      description: checkoutProduct.description,
      category: checkoutProduct.category,
      price: parseFloat(checkoutProduct.price),
      stock: checkoutProduct.stockQuantity,
      ecoImpact: checkoutProduct.isEcoFriendly ? 'Eco-Friendly' : 'Standard',
      features: checkoutProduct.tags || [],
      image: checkoutProduct.imageUrl || undefined,
    };
    return (
      <CheckoutPage
        product={checkoutProductCompat}
        quantity={checkoutQuantity}
        userTokens={userTokens}
        onBack={() => setIsCheckout(false)}
        onPurchaseComplete={() => setIsCheckout(false)}
        onQuantityChange={handleQuantityChange}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* User Tokens */}
      <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground font-semibold text-lg">Your B3TR Tokens</h3>
              <p className="text-muted-foreground text-sm">Available for purchases</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient-ev-green">{userTokens}</div>
              <div className="text-sm text-muted-foreground">B3TR Tokens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {['all', ...PRODUCT_CATEGORIES].map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category as ProductCategory | 'all')}
              className="text-xs"
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
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

      {/* Full-width Product List */}
      <div className="space-y-4">
        {products.length === 0 && !isLoading && !error ? (
          <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm w-full">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Available</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory !== 'all' 
                  ? `No products found in the "${selectedCategory}" category.`
                  : debouncedSearch 
                    ? `No products found matching "${debouncedSearch}".`
                    : "There are currently no products available in the store."
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
              </div>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm cursor-pointer w-full">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground font-semibold text-lg mb-1 truncate">{product.name}</h4>
                    <p className="text-muted-foreground text-sm mb-2 truncate">{product.description}</p>
                    <div className="flex items-center space-x-4 text-sm flex-wrap">
                      <span className="text-primary font-semibold">{product.price} B3TR</span>
                      <span className="text-muted-foreground">Stock: {product.stockQuantity}</span>
                      {product.isEcoFriendly && (
                        <span className="text-success">Eco-Friendly</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <Button size="icon" variant="outline" className="rounded-full" title="View Details" onClick={() => dispatch(openProductModal(product.id))}>
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="rounded-full" 
                      title="Purchase"
                      onClick={() => handlePurchaseClick(product)}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
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
      <ProductModal
        show={showProductModal}
        onClose={() => dispatch(closeProductModal())}
        productId={selectedProductId}
      />
    </div>
  );
} 