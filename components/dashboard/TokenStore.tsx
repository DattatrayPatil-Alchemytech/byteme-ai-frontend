'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  ecoImpact: string;
  features: string[];
}

interface PurchaseHistory {
  id: number;
  product: { name: string; category: string };
  quantity: number;
  totalCost: number;
  date: string;
}

interface TokenStoreProps {
  products: Product[];
  userTokens: number;
  onPurchase: (productId: number, quantity: number) => void;
  purchaseHistory: PurchaseHistory[];
}

export default function TokenStore({ products, userTokens, onPurchase, purchaseHistory }: TokenStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['all', 'electronics', 'accessories', 'clothing'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handlePurchase = (product: Product) => {
    if (userTokens >= product.price) {
      onPurchase(product.id, 1);
      setSelectedProduct(null);
    }
  };

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
              <div className="text-3xl font-bold text-gradient-ev-green">{userTokens.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">B3TR Tokens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'gradient-ev-green text-white shadow-lg'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-6">Available Products</h3>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-foreground font-semibold text-lg mb-2">{product.name}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-primary font-semibold">{product.price} B3TR</span>
                        <span className="text-muted-foreground">Stock: {product.stock}</span>
                        <span className="text-success">{product.ecoImpact}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 gradient-ev-green rounded-lg flex items-center justify-center text-white font-bold">
                        {product.category.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Details / Purchase History */}
        <div>
          {selectedProduct ? (
            <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">{selectedProduct.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                
                <div className="bg-card/50 rounded-lg p-4">
                  <h5 className="text-foreground font-semibold mb-2">Features:</h5>
                  <ul className="space-y-1">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                  <h5 className="text-success font-semibold mb-1">Environmental Impact</h5>
                  <p className="text-success/80 text-sm">{selectedProduct.ecoImpact}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{selectedProduct.price} B3TR</div>
                    <div className="text-sm text-muted-foreground">Stock: {selectedProduct.stock} available</div>
                  </div>
                  <Button
                    onClick={() => handlePurchase(selectedProduct)}
                    disabled={userTokens < selectedProduct.price}
                    className="gradient-ev-green hover:from-emerald-600 hover:to-green-700 disabled:opacity-50"
                  >
                    {userTokens >= selectedProduct.price ? 'Purchase' : 'Insufficient Tokens'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                      <div>
                        <p className="text-foreground font-medium">{purchase.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.quantity}x • {new Date(purchase.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-semibold">-{purchase.totalCost} B3TR</p>
                        <p className="text-xs text-muted-foreground">{purchase.product.category}</p>
                      </div>
                    </div>
                  ))}
                  
                  {purchaseHistory.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🛍️</div>
                      <p className="text-muted-foreground">No purchases yet</p>
                      <p className="text-sm text-muted-foreground">Start shopping with your B3TR tokens!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 