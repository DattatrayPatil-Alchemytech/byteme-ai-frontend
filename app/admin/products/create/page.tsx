'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createProduct, PRODUCT_CATEGORIES, ProductCategory } from '@/lib/apiHelpers/adminStore';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface DiscountInfo {
  percentage: number;
  validUntil: string;
  minimumPurchase: number;
}

interface ShippingDimensions {
  length: number;
  width: number;
  height: number;
}

interface ShippingInfo {
  weight: number;
  dimensions: ShippingDimensions;
  shippingCost: number;
  estimatedDelivery: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ProductCategory | '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    imageUrl: '',
    images: [] as string[],
    specifications: {} as Record<string, string | number | boolean>,
    tags: [] as string[],
    discountInfo: {
      percentage: 0,
      validUntil: '',
      minimumPurchase: 1
    } as DiscountInfo,
    isEcoFriendly: false,
    ecoDescription: '',
    shippingInfo: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      shippingCost: 0,
      estimatedDelivery: ''
    } as ShippingInfo,
  });

  // Additional form states for dynamic fields
  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare the API payload
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category as ProductCategory,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        discountInfo: Object.keys(formData.discountInfo).length > 0 ? {
          percentage: formData.discountInfo.percentage,
          validUntil: formData.discountInfo.validUntil,
          minimumPurchase: formData.discountInfo.minimumPurchase
        } as Record<string, string | number | boolean> : undefined,
        isEcoFriendly: formData.isEcoFriendly,
        ecoDescription: formData.ecoDescription || undefined,
        shippingInfo: Object.keys(formData.shippingInfo).length > 0 ? {
          weight: formData.shippingInfo.weight,
          dimensions: formData.shippingInfo.dimensions,
          shippingCost: formData.shippingInfo.shippingCost,
          estimatedDelivery: formData.shippingInfo.estimatedDelivery
        } as unknown as Record<string, string | number | boolean> : undefined,
      };

      await createProduct(payload);
      toast.success('Product created successfully!');
    router.push('/admin/products');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.category !== '' &&
      formData.price.trim() !== '' &&
      parseFloat(formData.price) > 0 &&
      formData.stockQuantity.trim() !== '' &&
      parseInt(formData.stockQuantity) >= 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
          <p className="text-muted-foreground">Add a new product to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select 
                      value={formData.category} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('category', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select category</option>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isEcoFriendly"
                    name="isEcoFriendly"
                    checked={formData.isEcoFriendly}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isEcoFriendly">Eco-Friendly Product</Label>
                  </div>

                {formData.isEcoFriendly && (
                  <div className="space-y-2">
                    <Label htmlFor="ecoDescription">Eco-Friendly Description</Label>
                    <Textarea
                      id="ecoDescription"
                      name="ecoDescription"
                      value={formData.ecoDescription}
                      onChange={handleInputChange}
                      placeholder="Describe the eco-friendly features..."
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Main Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {formData.imageUrl && (
                  <div className="space-y-2">
                    <Label>Main Image Preview</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4">
                      <Image
                        src={formData.imageUrl}
                        alt="Product preview"
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/image2.jpg"
                    />
                    <Button type="button" onClick={handleAddImage} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <Label>Added Images:</Label>
                      <div className="space-y-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground flex-1 truncate">{image}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Product Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded">
                        <span className="text-sm">{tag}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTag(index)}
                          className="h-auto p-0 text-primary hover:text-primary/70"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Specification name"
                  />
                  <Input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Specification value"
                  />
                  <Button type="button" onClick={handleAddSpecification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {Object.keys(formData.specifications).length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Specifications:</Label>
                    <div className="space-y-2">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-sm font-medium">{key}:</span>
                          <span className="text-sm text-muted-foreground flex-1">{String(value)}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSpecification(key)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Discount Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Discount Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discountInfo.percentage.toString()}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      discountInfo: {
                        ...prev.discountInfo,
                        percentage: parseFloat(e.target.value) || 0
                      }
                    }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.discountInfo.validUntil}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      discountInfo: {
                        ...prev.discountInfo,
                        validUntil: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumPurchase">Minimum Purchase Quantity</Label>
                  <Input
                    id="minimumPurchase"
                    type="number"
                    min="1"
                    value={formData.discountInfo.minimumPurchase.toString()}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      discountInfo: {
                        ...prev.discountInfo,
                        minimumPurchase: parseInt(e.target.value) || 1
                      }
                    }))}
                    placeholder="1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingInfo.weight.toString()}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        weight: parseFloat(e.target.value) || 0
                      }
                    }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Length"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.shippingInfo.dimensions.length.toString()}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingInfo: {
                          ...prev.shippingInfo,
                          dimensions: {
                            ...prev.shippingInfo.dimensions,
                            length: parseFloat(e.target.value) || 0
                          }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Width"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.shippingInfo.dimensions.width.toString()}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingInfo: {
                          ...prev.shippingInfo,
                          dimensions: {
                            ...prev.shippingInfo.dimensions,
                            width: parseFloat(e.target.value) || 0
                          }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Height"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.shippingInfo.dimensions.height.toString()}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingInfo: {
                          ...prev.shippingInfo,
                          dimensions: {
                            ...prev.shippingInfo.dimensions,
                            height: parseFloat(e.target.value) || 0
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shippingInfo.shippingCost.toString()}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        shippingCost: parseFloat(e.target.value) || 0
                      }
                    }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    id="estimatedDelivery"
                    value={formData.shippingInfo.estimatedDelivery}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      shippingInfo: {
                        ...prev.shippingInfo,
                        estimatedDelivery: e.target.value
                      }
                    }))}
                    placeholder="e.g., 3-5 days"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className={`w-full gradient-ev-green hover-glow ${(isLoading || !isFormValid()) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Create Product</span>
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 