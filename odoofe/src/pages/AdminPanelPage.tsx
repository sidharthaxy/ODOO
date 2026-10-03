import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Search, Filter, Package, List, UserPlus, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface PendingItem {
  _id: string;
  title: string;
  images: string[];
  owner: { username: string; email: string };
  createdAt: string;
  category: string;
  condition: string;
  description: string;
  flagged: boolean;
  flagReason?: string;
}

interface TransactionItem {
  _id: string;
  type: string;
  status: string;
  sender: { username: string; email: string };
  receiver: { username: string; email: string };
  item?: { title: string };
  offeredItem?: { title: string };
  points?: number;
  createdAt: string;
}

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  role?: string;
}

export const AdminPanelPage: React.FC = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'transactions' | 'admins'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [activeItems, setActiveItems] = useState<PendingItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState<AdminUser | null>(null);

  const getHeaders = React.useCallback((): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  const fetchPendingItems = React.useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/pending-items`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success && data.pendingItems) setPendingItems(data.pendingItems);
    } catch (err) { console.error("Failed to load pending items", err); }
  }, [getHeaders]);

  const fetchActiveItems = React.useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/active-items`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success && data.activeItems) setActiveItems(data.activeItems);
    } catch (err) { console.error("Failed to load active items", err); }
  }, [getHeaders]);

  const fetchTransactions = React.useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/all`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success && data.transactions) setTransactions(data.transactions);
    } catch (err) { console.error("Failed to load transactions", err); }
  }, [getHeaders]);

  const fetchAdmins = React.useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/admins`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success && data.admins) setAdmins(data.admins);
    } catch (err) { console.error("Failed to load admins", err); }
  }, [getHeaders]);

  useEffect(() => {
    fetchPendingItems();
    fetchActiveItems();
    fetchTransactions();
    fetchAdmins();
  }, [fetchPendingItems, fetchActiveItems, fetchTransactions, fetchAdmins]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/approve-item/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) {
        setPendingItems(items => items.filter(item => item._id !== id));
        fetchActiveItems();
      }
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/reject-item/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) setPendingItems(items => items.filter(item => item._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleUnlist = async (id: string) => {
    if (!window.confirm("Are you sure you want to forcibly unlist this active item?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/unlist-item/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) setActiveItems(items => items.filter(item => item._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/search-user?email=${encodeURIComponent(searchEmail)}`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchedUser(data.user);
      } else {
        setSearchedUser(null);
        alert(data.message || 'User not found');
      }
    } catch (err) {
      console.error(err);
      alert('Network error searching user');
    }
  };

  const handleGrantAdminToSearchedUser = async () => {
    if (!searchedUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/add-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders(),
        },
        body: JSON.stringify({ email: searchedUser.email }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchedUser(null);
        setSearchEmail('');
        fetchAdmins();
        alert('Admin added successfully!');
      } else {
        alert(data.message || 'Failed to add admin');
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding admin');
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this admin's privileges?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/admin/remove-admin/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(admins.filter(a => a._id !== id));
      } else {
        alert(data.message || 'Failed to remove admin privileges');
      }
    } catch (err) { console.error(err); }
  };

  // Rendering Helpers
  const renderItemsList = (items: PendingItem[], isPending: boolean) => {
    const filtered = items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.owner?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === 'all' || 
                           (statusFilter === 'flagged' && item.flagged) ||
                           (statusFilter === 'normal' && !item.flagged);
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4"><Package className="h-12 w-12 mx-auto" /></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or there are no items here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item._id} className={`flex items-center space-x-4 p-4 border rounded-lg ${item.flagged ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
            <img src={item.images?.[0] || 'https://via.placeholder.com/150'} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">by {item.owner?.username} • {new Date(item.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <Badge variant="secondary">{item.condition}</Badge>
                  {item.flagged && <Badge variant="error"><AlertTriangle className="h-3 w-3 mr-1" />Flagged</Badge>}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex space-x-2">
              {isPending ? (
                <>
                  <Button size="sm" onClick={() => handleApprove(item._id)} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(item._id)} className="text-red-600 border-red-300 hover:bg-red-50">
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleUnlist(item._id)} className="text-red-600 border-red-300 hover:bg-red-50">
                  <X className="h-4 w-4 mr-1" /> Unlist Item
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTransactionsList = () => {
    if (transactions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4"><List className="h-12 w-12 mx-auto" /></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {transactions.map(t => (
          <div key={t._id} className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant={t.type === 'SWAP' ? 'secondary' : 'primary'}>{t.type}</Badge>
                <Badge variant={
                  t.status === 'COMPLETED' ? 'success' : 
                  t.status === 'PENDING' ? 'secondary' : 'error'
                }>{t.status}</Badge>
                <span className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{t.sender?.username}</span> requested 
                {t.type === 'SWAP' 
                  ? ` item "${t.item?.title}" from ` 
                  : ` redemption of "${t.item?.title}" belonging to `}
                <span className="font-semibold">{t.receiver?.username}</span>
              </p>
              {t.type === 'SWAP' && t.offeredItem && (
                <p className="text-sm text-gray-600 mt-1">Offered in return: "{t.offeredItem.title}"</p>
              )}
              {t.type === 'REDEEM' && (
                <p className="text-sm text-purple-600 mt-1 font-semibold">{t.points} points exchanged</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAdminsList = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Add Admin</h3>
          <form onSubmit={handleSearchUser} className="flex space-x-4">
            <div className="flex-1">
              <Input 
                type="email" 
                placeholder="Enter user's email address to search..." 
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" /> Search User
            </Button>
          </form>

          {searchedUser && (
            <div className="mt-6 p-4 border border-purple-200 bg-purple-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-200 p-3 rounded-full">
                  <User className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{searchedUser.username}</h4>
                  <p className="text-sm text-gray-600">{searchedUser.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Current Role: <span className="font-semibold">{searchedUser.role || 'USER'}</span></p>
                </div>
              </div>
              <div>
                {searchedUser.role === 'ADMIN' ? (
                  <Badge variant="success">Already Admin</Badge>
                ) : (
                  <Button onClick={handleGrantAdminToSearchedUser} className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" /> Grant Admin Rights
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Administrators ({admins.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map(admin => (
              <Card key={admin._id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{admin.username}</h4>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveAdmin(admin._id)} className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage listings, platform transactions, and staff rights.</p>
        </div>

        {/* Filters/Search (Only relevant for Items) */}
        {(activeTab === 'pending' || activeTab === 'active') && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search by title or uploader..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">All Items</option>
                    <option value="flagged">Flagged</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Interface */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex space-x-8 overflow-x-auto">
              <button 
                className={`pb-4 text-sm font-medium whitespace-nowrap ${activeTab === 'pending' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Review ({pendingItems.length})
              </button>
              <button 
                className={`pb-4 text-sm font-medium whitespace-nowrap ${activeTab === 'active' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('active')}
              >
                Active Items ({activeItems.length})
              </button>
              <button 
                className={`pb-4 text-sm font-medium whitespace-nowrap ${activeTab === 'transactions' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('transactions')}
              >
                All Transactions ({transactions.length})
              </button>
              <button 
                className={`pb-4 text-sm font-medium whitespace-nowrap ${activeTab === 'admins' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('admins')}
              >
                Admins ({admins.length})
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {activeTab === 'pending' && renderItemsList(pendingItems, true)}
            {activeTab === 'active' && renderItemsList(activeItems, false)}
            {activeTab === 'transactions' && renderTransactionsList()}
            {activeTab === 'admins' && renderAdminsList()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};