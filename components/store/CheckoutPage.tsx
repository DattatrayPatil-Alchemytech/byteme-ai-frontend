"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Package, 
  Truck, 
  Shield, 
  Leaf,
  Wallet,
  Clock,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  ecoImpact: string;
  features: string[];
  image?: string;
}

interface CheckoutPageProps {
  product: Product;
  quantity: number;
  userTokens: number;
  onBack: () => void;
  onPurchaseComplete: (orderId: string) => void;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialInstructions: string;
}

export default function CheckoutPage({ 
  product, 
  quantity, 
  userTokens, 
  onBack, 
  onPurchaseComplete 
}: CheckoutPageProps) {
  const router = useRouter();
  const [step, setStep] = useState<"shipping" | "review" | "processing" | "success">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    specialInstructions: "",
  });

  const subtotal = product.price * quantity;
  const shippingCost = 0; // Free shipping for B3TR purchases
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinueToReview = () => {
    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("review");
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    setStep("processing");

    try {
      // Simulate API call for purchase processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate success
      setStep("success");
      onPurchaseComplete(orderId);
      
      toast.success("Purchase completed successfully!");
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
      setStep("review");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToShipping = () => {
    setStep("shipping");
  };

  const handleViewOrder = (orderId: string) => {
    // Navigate to order details or dashboard
    router.push("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase with B3TR tokens</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { key: "shipping", label: "Shipping", icon: MapPin },
          { key: "review", label: "Review", icon: CreditCard },
          { key: "processing", label: "Processing", icon: Package },
          { key: "success", label: "Complete", icon: CheckCircle },
        ].map((stepInfo, index) => {
          const Icon = stepInfo.icon;
          const isActive = step === stepInfo.key;
          const isCompleted = ["shipping", "review", "processing", "success"].indexOf(step) > index;
          
          return (
            <div key={stepInfo.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                isActive 
                  ? "border-primary bg-primary text-white" 
                  : isCompleted 
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted text-muted-foreground"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {index < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  isCompleted ? "bg-green-500" : "bg-muted"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === "shipping" && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="text-primary" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-foreground">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-foreground">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-foreground">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-foreground">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-foreground">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialInstructions" className="text-foreground">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={shippingInfo.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleContinueToReview}
                  className="w-full gradient-ev-green hover:from-emerald-600 hover:to-green-700"
                >
                  Continue to Review
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "review" && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="text-primary" />
                  Review Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Review */}
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">Qty: {quantity}</span>
                        <span className="text-sm text-success">{product.ecoImpact}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{product.price} B3TR</div>
                      <div className="text-sm text-muted-foreground">per item</div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info Review */}
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="text-primary" />
                    Shipping Address
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                    {shippingInfo.phone && <p>📞 {shippingInfo.phone}</p>}
                    <p>📧 {shippingInfo.email}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToShipping}
                    className="flex-1"
                  >
                    Back to Shipping
                  </Button>
                  <Button 
                    onClick={handleConfirmPurchase}
                    className="flex-1 gradient-ev-green hover:from-emerald-600 hover:to-green-700"
                  >
                    Confirm Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "processing" && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Processing Your Order</h3>
                <p className="text-muted-foreground mb-6">
                  Please wait while we process your purchase and deduct B3TR tokens...
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Securing your transaction</span>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "success" && (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h3>
                <p className="text-muted-foreground mb-6">
                  Your purchase has been completed successfully. You will receive a confirmation email shortly.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                    <Leaf className="w-5 h-5" />
                    <span className="font-semibold">Eco-Friendly Purchase</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Thank you for choosing sustainable products! Your purchase supports environmental initiatives.
                  </p>
                </div>
                <div className="space-y-4">
                  <Button 
                    onClick={() => router.push("/dashboard")}
                    className="w-full gradient-ev-green hover:from-emerald-600 hover:to-green-700"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/dashboard")}
                    className="w-full"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg sticky top-6">
            <CardHeader>
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Summary */}
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{subtotal} B3TR</div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{subtotal} B3TR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{total} B3TR</span>
                </div>
              </div>

              {/* Token Balance */}
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span className="font-semibold text-primary">{userTokens} B3TR</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">After Purchase</span>
                  <span className={`font-semibold ${userTokens - total >= 0 ? 'text-success' : 'text-red-500'}`}>
                    {userTokens - total} B3TR
                  </span>
                </div>
              </div>

              {/* Eco Impact */}
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-600 mb-1">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm font-medium">Environmental Impact</span>
                </div>
                <p className="text-xs text-green-600">{product.ecoImpact}</p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure B3TR transaction</span>
              </div>
            </CardContent>
          </Card>

          {/* Features Highlight */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Product Features</h4>
              <div className="space-y-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 