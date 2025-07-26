import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { getProductById, Product } from '@/lib/apiHelpers/storeProducts';
// import { X } from 'lucide-react';
// import { Button } from '@/components/ui/button';

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  productId: string | null;
}

export default function ProductModal({ show, onClose, productId }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (show && productId) {
      setLoading(true);
      setError(null);
      setProduct(null);
      getProductById(productId)
        .then((res) => {
          // Handle both possible response structures
          const productData = res.product || res;
          setProduct(productData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load product');
          setLoading(false);
        });
    } else if (!show) {
      setProduct(null);
      setError(null);
      setLoading(false);
    }
  }, [show, productId]);

  return (
    <Modal show={show} handleClose={onClose} title="Product Details">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      )}
      {error && (
        <div className="text-destructive text-center py-8">{error}</div>
      )}
      {product && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-primary font-semibold">{product.price} B3TR</span>
            <span className="text-muted-foreground">Stock: {product.stockQuantity}</span>
            {product.isEcoFriendly && <span className="text-success">Eco-Friendly</span>}
          </div>
          {product.rating && product.rating !== "0.00" && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rating:</span>
              <span className="text-yellow-500">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          )}
          {product.soldCount > 0 && (
            <div className="text-muted-foreground text-sm">
              Sold: {product.soldCount} units
            </div>
          )}
          {product.ecoDescription && (
            <div className="text-success text-sm">
              {product.ecoDescription}
            </div>
          )}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Specifications:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="text-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
} 