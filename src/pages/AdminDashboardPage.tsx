import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Eye, 
  Check, 
  X, 
  Search, 
  Filter,
  BarChart3,
  Settings,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 5247,
    activeListings: 1834,
    pendingApprovals: 23,
    flaggedItems: 7,
    totalSwaps: 12456,
    monthlyGrowth: 15.3
  };

  const recentActivity = [
    {
      id: 1,
      type: 'user_signup',
      user: 'Sarah Johnson',
      time: '2 minutes ago',
      details: 'New user registration'
    },
    {
      id: 2,
      type: 'item_flagged',
      user: 'Mike Chen',
      time: '15 minutes ago',
      details: 'Item flagged for review: "Designer Handbag"'
    },
    {
      id: 3,
      type: 'swap_completed',
      user: 'Emma Wilson',
      time: '1 hour ago',
      details: 'Completed swap with Alex Rodriguez'
    },
    {
      id: 4,
      type: 'item_approved',
      user: 'David Kim',
      time: '2 hours ago',
      details: 'Item approved: "Vintage Leather Jacket"'
    }
  ];

  const pendingItems = [
    {
      id: 1,
      title: 'Vintage Band T-Shirt',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=150&h=150&fit=crop',
      uploader: 'John Doe',
      uploadDate: '2 hours ago',
      category: 'Tops',
      flagged: false
    },
    {
      id: 2,
      title: 'Designer Handbag',
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=150&h=150&fit=crop',
      uploader: 'Jane Smith',
      uploadDate: '5 hours ago',
      category: 'Accessories',
      flagged: true
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeListings.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Available for swap</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSwaps.toLocaleString()}</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                <p className="text-sm text-yellow-600">Needs attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Flagged Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.flaggedItems}</p>
                <p className="text-sm text-red-600">Requires review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Platform Health</p>
                <p className="text-3xl font-bold text-green-600">98.5%</p>
                <p className="text-sm text-gray-500">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'user_signup' ? 'bg-green-100' :
                  activity.type === 'item_flagged' ? 'bg-red-100' :
                  activity.type === 'swap_completed' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'user_signup' && <Users className="h-5 w-5 text-green-600" />}
                  {activity.type === 'item_flagged' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  {activity.type === 'swap_completed' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'item_approved' && <Check className="h-5 w-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Pending Items ({pendingItems.length})</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingItems.map((item) => (
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
                        {item.flagged && (
                          <Badge variant="error">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage ReWear platform and community</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ 
                borderColor: activeTab === 'overview' ? 'rgb(107, 77, 101)' : undefined,
                color: activeTab === 'overview' ? 'rgb(107, 77, 101)' : undefined
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'moderation'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ 
                borderColor: activeTab === 'moderation' ? 'rgb(107, 77, 101)' : undefined,
                color: activeTab === 'moderation' ? 'rgb(107, 77, 101)' : undefined
              }}
            >
              Content Moderation
              {stats.pendingApprovals > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ 
                borderColor: activeTab === 'users' ? 'rgb(107, 77, 101)' : undefined,
                color: activeTab === 'users' ? 'rgb(107, 77, 101)' : undefined
              }}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ 
                borderColor: activeTab === 'settings' ? 'rgb(107, 77, 101)' : undefined,
                color: activeTab === 'settings' ? 'rgb(107, 77, 101)' : undefined
              }}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'moderation' && renderModeration()}
        {activeTab === 'users' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};