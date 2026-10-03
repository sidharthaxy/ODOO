import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ArrowUpDown, TrendingUp, Eye, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface UserItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  points: number;
  available: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  category: string;
  condition: string;
  createdAt: string;
}

interface SwapParty {
  _id: string;
  username: string;
  email?: string;
}

interface SwapProduct {
  _id: string;
  title: string;
  images?: string[];
  points?: number;
}

interface PendingSwap {
  _id: string;
  type: string;
  status: string;
  sender: SwapParty;
  item: SwapProduct;
  offeredItem: SwapProduct;
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const { user, refreshUser, getToken } = useAuth();

  const [userItems, setUserItems] = React.useState<UserItem[]>([]);
  const [pendingSwaps, setPendingSwaps] = React.useState<PendingSwap[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getHeaders = React.useCallback((): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  const fetchData = React.useCallback(async () => {
    try {
      const itemsRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/my-items`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setUserItems(itemsData.items || []);
      }

      const swapsRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/my-swaps`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      if (swapsRes.ok) {
        const swapsData = await swapsRes.json();
        setPendingSwaps(swapsData.pendingSwaps || []);
      }
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  React.useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleAcceptSwap = async (swapId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/swap/${swapId}/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) {
        setPendingSwaps(prev => prev.filter(s => s._id !== swapId));
        await fetchData();
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/swap/${swapId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) {
        setPendingSwaps(prev => prev.filter(s => s._id !== swapId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) {
        setUserItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
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
                  <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingSwaps.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Account Role</p>
                  <p className="text-2xl font-bold text-gray-900">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Listed Items ({userItems.length})</h3>
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
                  {userItems.length === 0 && <p className="text-gray-500">No items listed yet. Click "Add Item" above to list one!</p>}
                  {userItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.category} • {item.points} pts</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={item.available ? 'success' : 'warning'}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                          <Badge variant={item.status === 'APPROVED' ? 'success' : item.status === 'PENDING' ? 'secondary' : 'error'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/item/${item._id}`}>
                          <Button variant="outline" size="sm" title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteItem(item._id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Swaps */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Pending Swap Requests ({pendingSwaps.length})</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingSwaps.length === 0 && <p className="text-gray-500">No pending swap requests.</p>}
                  {pendingSwaps.map((swap) => (
                    <div key={swap._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <ArrowUpDown className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{swap.sender?.username} wants your "{swap.item?.title}"</p>
                          <p className="text-sm text-gray-500">
                            Offering: {swap.offeredItem?.title}
                          </p>
                          <p className="text-xs text-gray-400">{new Date(swap.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleAcceptSwap(swap._id)} className="bg-green-600 hover:bg-green-700">Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectSwap(swap._id)} className="text-red-600 border-red-300">Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Card */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {user.image ? (
                  <img src={user.image} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-600">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{user.username}</h4>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Role: <span className="font-semibold text-purple-700">{user.role}</span> • Sustainable fashion community member
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};