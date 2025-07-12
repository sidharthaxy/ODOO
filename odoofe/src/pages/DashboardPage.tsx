import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ArrowUpDown, TrendingUp, Edit, Eye, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const userItems = [
    {
      id: 1,
      title: 'Vintage Band T-Shirt',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=150&h=150&fit=crop',
      status: 'active',
      views: 24,
      likes: 8,
      condition: 'Good'
    },
    {
      id: 2,
      title: 'Designer Handbag',
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=150&h=150&fit=crop',
      status: 'pending',
      views: 12,
      likes: 3,
      condition: 'Excellent'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'swap',
      item: 'Blue Denim Jacket',
      partner: 'Sarah M.',
      date: '2 days ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'redeem',
      item: 'Silk Scarf',
      points: 45,
      date: '1 week ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'swap',
      item: 'Winter Coat',
      partner: 'Mike R.',
      date: '2 weeks ago',
      status: 'in_progress'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h1>
          <Link to="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your items and track your sustainable fashion journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Points</p>
                  <p className="text-2xl font-bold text-gray-900">{user.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Listed Items</p>
                  <p className="text-2xl font-bold text-gray-900">{userItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowUpDown className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Items Saved</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Listed Items</h3>
                <Link to="/add-item">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {item.views}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart className="h-4 w-4 mr-1" />
                          {item.likes}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/item/${item.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'swap' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {transaction.type === 'swap' ? (
                          <ArrowUpDown className="h-5 w-5 text-blue-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.item}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.type === 'swap' 
                            ? `Swapped with ${transaction.partner}` 
                            : `Redeemed for ${transaction.points} points`
                          }
                        </p>
                        <p className="text-xs text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'}>
                      {transaction.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since January 2025 • Sustainable fashion enthusiast
                </p>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};