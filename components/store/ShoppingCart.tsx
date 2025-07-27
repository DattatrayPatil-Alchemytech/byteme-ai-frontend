"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart as CartIcon, 
  Trash2, 
  Plus, 
  Minus, 
  Package,
  Leaf
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectCart, 
  selectCartTotal, 
  selectCartItemCount,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from "@/redux/checkoutSlice";
// import { RootState } from "@/redux/store"; // Removed unused import

interface ShoppingCartProps {
  onCheckout: () => void;
  userTokens: number;
}

export default function ShoppingCart({ onCheckout, userTokens }: ShoppingCartProps) {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateCartItemQuantity({ productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const canCheckout = cartItemCount > 0 && userTokens >= cartTotal;

  if (cartItemCount === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <CartIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Your Cart is Empty</h3>
          <p className="text-muted-foreground text-sm">
            Add some eco-friendly products to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center space-x-2">
            <CartIcon className="text-primary" />
            <span>Shopping Cart</span>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {cartItemCount}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{cartTotal} B3TR</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {item.product.price} B3TR each
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Leaf className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">{item.product.ecoImpact}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-primary text-sm">
                    {item.product.price * item.quantity} B3TR
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{cartTotal} B3TR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{cartTotal} B3TR</span>
            </div>

            {/* Token Balance Check */}
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Balance</span>
                <span className="font-semibold text-primary">{userTokens} B3TR</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-muted-foreground">After Purchase</span>
                <span className={`font-semibold ${userTokens - cartTotal >= 0 ? 'text-success' : 'text-red-500'}`}>
                  {userTokens - cartTotal} B3TR
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={onCheckout}
                disabled={!canCheckout}
                className="w-full gradient-ev-green hover:from-emerald-600 hover:to-green-700 disabled:opacity-50"
              >
                {canCheckout ? 'Proceed to Checkout' : 'Insufficient Tokens'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>

            {/* Environmental Impact */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-green-600 mb-1">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Environmental Impact</span>
              </div>
              <p className="text-xs text-green-600">
                Your cart contains {cartItemCount} eco-friendly products
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 