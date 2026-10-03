import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, User, Clock, Package, X, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

interface ItemOwner {
  _id: string;
  username: string;
  email?: string;
  image?: string;
}

interface ProductItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type?: string;
  size: string;
  condition: string;
  tags?: string[];
  points: number;
  available: boolean;
  images: string[];
  owner: ItemOwner;
  createdAt: string;
}

interface MyItemOption {
  _id: string;
  title: string;
  images: string[];
  available: boolean;
}

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, refreshUser, getToken } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [item, setItem] = useState<ProductItem | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState<ProductItem[]>([]);

  // Swap Modal States
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [myAvailableItems, setMyAvailableItems] = useState<MyItemOption[]>([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState<string>('');
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapFeedback, setSwapFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getHeaders = (): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchItem = async () => {
      setFetchLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data.item);
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error('Failed to fetch item', err);
      } finally {
        setFetchLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/related/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRelatedItems(data.related || []);
        }
      } catch (err) {
        console.error('Failed to fetch related items', err);
      }
    };

    if (id) {
      fetchItem();
      fetchRelated();
    }
  }, [id]);

  const openSwapModal = async () => {
    if (!user) {
      alert("Please log in to request a swap!");
      return;
    }
    setIsSwapModalOpen(true);
    setSwapFeedback(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/my-items`, {
        credentials: 'include',
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const available = (data.items || []).filter((i: MyItemOption) => i.available && i._id !== item?._id);
        setMyAvailableItems(available);
        if (available.length > 0) {
          setSelectedMyItemId(available[0]._id);
        }
      }
    } catch (err) {
      console.error("Error loading user items for swap:", err);
    }
  };

  const handleSendSwapRequest = async () => {
    if (!item || !selectedMyItemId) return;
    setSwapLoading(true);
    setSwapFeedback(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/swap/request`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders(),
        },
        body: JSON.stringify({
          targetItemId: item._id,
          offeredItemId: selectedMyItemId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSwapFeedback({ type: 'success', message: 'Swap request submitted successfully!' });
        setTimeout(() => {
          setIsSwapModalOpen(false);
        }, 1500);
      } else {
        setSwapFeedback({ type: 'error', message: data.message || 'Failed to send swap request' });
      }
    } catch (err) {
      console.error(err);
      setSwapFeedback({ type: 'error', message: 'Network error submitting swap request' });
    } finally {
      setSwapLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!id) return;
    if (!user) {
      alert("Please log in to redeem with points!");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/transaction/redeem/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Successfully redeemed the item! Check your dashboard.');
        if (item) setItem({ ...item, available: false });
        await refreshUser();
      } else {
        setMessage(data.message || 'Failed to redeem item with points');
      }
    } catch {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Item not found.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === item.owner?._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={item.images?.[selectedImageIndex] || 'https://via.placeholder.com/600'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-purple-600 shadow' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4">
                    <Badge variant={item.available ? 'success' : 'error'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                    <span className="text-2xl font-bold text-purple-600" style={{ color: 'rgb(107, 77, 101)' }}>
                      {item.points} points
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? 'text-red-600 border-red-300' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert("Item link copied to clipboard!");
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Item Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="font-medium text-gray-900">{item.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium text-gray-900">{item.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{item.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium text-gray-900">{item.type || 'Standard'}</p>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg my-4 text-sm font-medium ${message.includes('Success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwner ? (
                  <div className="p-4 bg-purple-50 text-purple-800 rounded-lg text-sm text-center">
                    You listed this item. You can manage it from your Dashboard.
                  </div>
                ) : (
                  <>
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={openSwapModal}
                      disabled={!item.available}
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Request Swap
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg" 
                      onClick={handleRedeem}
                      disabled={loading || !item.available}
                    >
                      {loading ? 'Processing...' : `Redeem with ${item.points} Points`}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Uploader Profile */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h3>
                <div className="flex items-center space-x-4">
                  {item.owner?.image ? (
                    <img
                      src={item.owner.image}
                      alt={item.owner.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {item.owner?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.owner?.username || 'Community Member'}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Listed {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Member Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((relItem) => (
                <Card key={relItem._id} hover>
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={relItem.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={relItem.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent>
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{relItem.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{relItem.condition}</Badge>
                      <span className="font-semibold text-purple-600" style={{ color: 'rgb(107, 77, 101)' }}>
                        {relItem.points} pts
                      </span>
                    </div>
                    <Link to={`/item/${relItem._id}`} className="mt-4 block">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request Swap Modal */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button 
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Request an Item Swap</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select one of your available items to offer in exchange for <span className="font-semibold">{item.title}</span>.
            </p>

            {swapFeedback && (
              <div className={`p-3 rounded-lg text-sm mb-4 ${swapFeedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {swapFeedback.message}
              </div>
            )}

            {myAvailableItems.length === 0 ? (
              <div className="text-center py-6 border border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">You have no available items to offer for a swap.</p>
                <Link to="/add-item" onClick={() => setIsSwapModalOpen(false)}>
                  <Button size="sm">List an Item First</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Choose your item to offer:</label>
                <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                  {myAvailableItems.map((myItem) => (
                    <div
                      key={myItem._id}
                      onClick={() => setSelectedMyItemId(myItem._id)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                        selectedMyItemId === myItem._id 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={myItem.images?.[0] || 'https://via.placeholder.com/60'}
                        alt={myItem.title}
                        className="w-12 h-12 rounded object-cover mr-3"
                      />
                      <span className="font-medium text-gray-900 flex-1">{myItem.title}</span>
                      {selectedMyItemId === myItem._id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsSwapModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendSwapRequest}
                    disabled={swapLoading || !selectedMyItemId}
                  >
                    {swapLoading ? 'Sending...' : 'Send Swap Request'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};