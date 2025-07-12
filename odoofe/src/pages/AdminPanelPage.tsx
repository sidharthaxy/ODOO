import React, { useState } from 'react';
import { Eye, Check, X, AlertTriangle, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface PendingItem {
  id: number;
  title: string;
  image: string;
  uploader: string;
  uploadDate: string;
  category: string;
  condition: string;
  description: string;
  flagged: boolean;
  flagReason?: string;
}

export const AdminPanelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    {
      id: 1,
      title: 'Vintage Band T-Shirt',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=150&h=150&fit=crop',
      uploader: 'John Doe',
      uploadDate: '2 hours ago',
      category: 'Tops',
      condition: 'Good',
      description: 'Classic vintage band t-shirt from the 90s. Some minor wear but overall in good condition.',
      flagged: false
    },
    {
      id: 2,
      title: 'Designer Handbag',
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=150&h=150&fit=crop',
      uploader: 'Jane Smith',
      uploadDate: '5 hours ago',
      category: 'Accessories',
      condition: 'Excellent',
      description: 'Authentic designer handbag in excellent condition. No signs of wear.',
      flagged: true,
      flagReason: 'Suspicious pricing'
    },
    {
      id: 3,
      title: 'Winter Coat',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=150&h=150&fit=crop',
      uploader: 'Mike Johnson',
      uploadDate: '1 day ago',
      category: 'Outerwear',
      condition: 'Like New',
      description: 'Warm winter coat, barely worn. Perfect for cold weather.',
      flagged: false
    }
  ]);

  const stats = {
    totalPending: pendingItems.length,
    flagged: pendingItems.filter(item => item.flagged).length,
    approved: 45,
    rejected: 12
  };

  const handleApprove = (id: number) => {
    setPendingItems(items => items.filter(item => item.id !== id));
    console.log(`Approved item ${id}`);
  };

  const handleReject = (id: number) => {
    setPendingItems(items => items.filter(item => item.id !== id));
    console.log(`Rejected item ${id}`);
  };

  const filteredItems = pendingItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.uploader.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || 
                         (statusFilter === 'flagged' && item.flagged) ||
                         (statusFilter === 'normal' && !item.flagged);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage pending listings and moderate content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flagged Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <X className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title or uploader..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Items</option>
                    <option value="flagged">Flagged</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Items */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Items ({filteredItems.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center space-x-4 p-4 border rounded-lg ${
                    item.flagged ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">by {item.uploader} • {item.uploadDate}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge variant="secondary">{item.condition}</Badge>
                          {item.flagged && (
                            <Badge variant="error">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {item.flagged && item.flagReason && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm">
                        <strong className="text-red-800">Flag Reason:</strong> {item.flagReason}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReject(item.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Eye className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters.' 
                      : 'All items have been reviewed.'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};