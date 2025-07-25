'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

// Define product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description: string;
  sku: string;
  createdAt: string;
  image: string;
  weight: string;
  dimensions: string;
  brand: string;
  tags: string;
}

// Mock product data (in real app, this would come from API)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Solar Phone Charger',
    category: 'Electronics',
    price: 29.99,
    stock: 150,
    status: 'active',
    description: 'Portable solar charger for mobile devices. This eco-friendly charger uses solar energy to power your mobile devices on the go. Perfect for outdoor activities, camping, and emergency situations.',
    sku: 'SOL-001',
    createdAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&h=400&fit=crop',
    weight: '0.5',
    dimensions: '10 x 5 x 2',
    brand: 'EcoTech',
    tags: 'solar, portable, eco-friendly'
  }
];

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Load product data
    const foundProduct = mockProducts.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [productId]);

  const handleEdit = () => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, you would call an API here
      console.log('Deleting product:', productId);
      alert('Product deleted successfully!');
      router.push('/admin/products');
    }
  };

  const handleBack = () => {
    router.push('/admin/products');
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
          <p className="text-muted-foreground mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleEdit} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={384}
                className="w-full h-96 object-cover rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Category</h4>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Brand</h4>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">SKU</h4>
                  <p className="font-mono text-sm text-muted-foreground">{product.sku}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Status</h4>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
              </div>

              {product.tags && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(',').map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-foreground">${product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stock</span>
                <span className={`font-semibold ${product.stock < 50 ? 'text-red-600' : 'text-foreground'}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.weight && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="text-foreground">{product.dimensions} cm</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleEdit} className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Button>
              <Button onClick={handleDelete} variant="outline" className="w-full text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 