'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DataTable, Column, Action } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Solar Phone Charger',
    category: 'Electronics',
    price: 29.99,
    stock: 150,
    status: 'active',
    description: 'Portable solar charger for mobile devices',
    sku: 'SOL-001',
    createdAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Eco-Friendly Water Bottle',
    category: 'Lifestyle',
    price: 19.99,
    stock: 200,
    status: 'active',
    description: 'Reusable stainless steel water bottle',
    sku: 'BTL-002',
    createdAt: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop'
  },

  {
    id: 5,
    name: 'Organic Cotton Tote Bag',
    category: 'Fashion',
    price: 24.99,
    stock: 120,
    status: 'active',
    description: 'Sustainable shopping tote bag',
    sku: 'BAG-005',
    createdAt: '2024-02-05',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=100&h=100&fit=crop'
  },
  {
    id: 6,
    name: 'Wind Turbine Kit',
    category: 'Energy',
    price: 199.99,
    stock: 25,
    status: 'active',
    description: 'DIY wind turbine for home energy',
    sku: 'WND-006',
    createdAt: '2024-02-10',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=100&h=100&fit=crop'
  },
  {
    id: 7,
    name: 'Compost Bin',
    category: 'Garden',
    price: 39.99,
    stock: 80,
    status: 'active',
    description: 'Indoor composting solution',
    sku: 'CMP-007',
    createdAt: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop'
  },
  {
    id: 8,
    name: 'Beeswax Food Wraps',
    category: 'Kitchen',
    price: 18.99,
    stock: 200,
    status: 'active',
    description: 'Eco-friendly food storage wraps',
    sku: 'WRP-008',
    createdAt: '2024-02-20',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop'
  },
  {
    id: 9,
    name: 'Electric Bike Charger',
    category: 'Transportation',
    price: 149.99,
    stock: 30,
    status: 'active',
    description: 'Fast charging station for e-bikes',
    sku: 'EBI-009',
    createdAt: '2024-02-25',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=100&h=100&fit=crop'
  },
  {
    id: 10,
    name: 'Recycled Paper Notebook',
    category: 'Office',
    price: 8.99,
    stock: 500,
    status: 'active',
    description: '100% recycled paper notebooks',
    sku: 'NOT-010',
    createdAt: '2024-03-01',
    image: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=100&h=100&fit=crop'
  },
  {
    id: 11,
    name: 'Solar Garden Lights',
    category: 'Garden',
    price: 34.99,
    stock: 100,
    status: 'active',
    description: 'Solar-powered garden lighting',
    sku: 'GLT-011',
    createdAt: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
  },
  {
    id: 12,
    name: 'Hemp Face Mask',
    category: 'Personal Care',
    price: 15.99,
    stock: 150,
    status: 'active',
    description: 'Natural hemp face mask',
    sku: 'MSK-012',
    createdAt: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop'
  },
  {
    id: 13,
    name: 'Bamboo Cutlery Set',
    category: 'Kitchen',
    price: 22.99,
    stock: 180,
    status: 'active',
    description: 'Reusable bamboo cutlery',
    sku: 'CUT-013',
    createdAt: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop'
  },

  {
    id: 15,
    name: 'Organic Soap Bar',
    category: 'Personal Care',
    price: 6.99,
    stock: 400,
    status: 'active',
    description: 'Natural organic soap',
    sku: 'SAP-015',
    createdAt: '2024-03-25',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop'
  },
  {
    id: 16,
    name: 'Solar Panel Kit',
    category: 'Energy',
    price: 599.99,
    stock: 20,
    status: 'active',
    description: 'Residential solar panel system',
    sku: 'SOL-016',
    createdAt: '2024-04-01',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop'
  },
  {
    id: 17,
    name: 'Recycled Glass Vase',
    category: 'Home Decor',
    price: 45.99,
    stock: 60,
    status: 'active',
    description: 'Beautiful recycled glass vase',
    sku: 'VAS-017',
    createdAt: '2024-04-05',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
  },
  {
    id: 18,
    name: 'Bamboo Coffee Cup',
    category: 'Kitchen',
    price: 16.99,
    stock: 250,
    status: 'active',
    description: 'Insulated bamboo coffee cup',
    sku: 'CUP-018',
    createdAt: '2024-04-10',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
  },
  {
    id: 19,
    name: 'Organic Cotton Sheets',
    category: 'Home',
    price: 89.99,
    stock: 75,
    status: 'active',
    description: '100% organic cotton bed sheets',
    sku: 'SHT-019',
    createdAt: '2024-04-15',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=100&h=100&fit=crop'
  },
  {
    id: 20,
    name: 'Solar Phone Case',
    category: 'Electronics',
    price: 49.99,
    stock: 120,
    status: 'active',
    description: 'Phone case with built-in solar charger',
    sku: 'CAS-020',
    createdAt: '2024-04-20',
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=100&h=100&fit=crop'
  }
];

export default function ProductsPage() {
  const router = useRouter();

  const handleEdit = (product: Record<string, unknown>) => {
    router.push(`/admin/products/edit/${product.id as number}`);
  };

  const handleDelete = (product: Record<string, unknown>) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, you would call an API here
      console.log('Deleting product:', product.id);
      alert('Product deleted successfully!');
    }
  };

  const handleCreateProduct = () => {
    router.push('/admin/products/create');
  };

  // Define columns for the DataTable
  const columns: Column[] = [
    {
      key: 'image',
      label: 'Image',
      width: '100px',
      render: (value) => (
        <Image
          src={value as string}
          alt="Product"
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover"
        />
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
      key: 'sku',
      label: 'SKU',
      render: (value) => <span className="font-mono text-sm">{value as string}</span>
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => `$${value as number}`
    },
    {
      key: 'stock',
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

      {/* Products DataTable */}
      <DataTable
        data={mockProducts as unknown as Record<string, unknown>[]}
        columns={columns}
        actions={actions}
        title="Product List"
        searchable={true}
        searchPlaceholder="Search products by name, category, or SKU..."
        searchInputClassName="border border-border bg-background text-foreground rounded-lg px-5 py-3 w-full md:w-64 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-muted placeholder:text-muted-foreground"
        searchKeys={['name', 'category', 'sku']}
        pagination={true}
        itemsPerPageOptions={[5, 10, 20, 50]}
        defaultItemsPerPage={10}
        emptyMessage="No products found"
      />
    </div>
  );
} 