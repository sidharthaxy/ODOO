import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, User, MapPin, Clock, Package } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - in real app, fetch based on id
  const item = {
    id: 1,
    title: 'Vintage Denim Jacket',
    description: 'Beautiful vintage denim jacket in excellent condition. This classic piece has been well-maintained and shows minimal wear. Perfect for layering in spring and fall. Features original buttons and classic cut that never goes out of style.',
    images: [
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?w=600&h=600&fit=crop',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=600&h=600&fit=crop',
      'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?w=600&h=600&fit=crop'
    ],
    condition: 'Excellent',
    size: 'M',
    category: 'Outerwear',
    type: 'Jacket',
    tags: ['vintage', 'denim', 'casual', 'spring'],
    points: 75,
    available: true,
    uploader: {
      name: 'Sarah Mitchell',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
      rating: 4.8,
      totalSwaps: 24,
      joinDate: 'Member since 2023',
      location: 'San Francisco, CA'
    }
  };

  const relatedItems = [
    {
      id: 2,
      title: 'Classic Wool Coat',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=300&h=300&fit=crop',
      points: 95,
      condition: 'Good'
    },
    {
      id: 3,
      title: 'Designer Silk Blouse',
      image: 'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?w=300&h=300&fit=crop',
      points: 120,
      condition: 'Like New'
    }
  ];

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
                    src={item.images[selectedImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-purple-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ borderColor: selectedImageIndex === index ? 'rgb(107, 77, 101)' : undefined }}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
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
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Item Attributes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
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
                  <p className="font-medium text-gray-900">{item.type}</p>
                </div>
              </div>

              {/* Tags */}
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

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Package className="h-5 w-5 mr-2" />
                  Request Swap
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Redeem with Points
                </Button>
              </div>
            </div>

            {/* Uploader Profile */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={item.uploader.avatar}
                    alt={item.uploader.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.uploader.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {item.uploader.rating}
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {item.uploader.totalSwaps} swaps
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.uploader.joinDate}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.uploader.location}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((relatedItem) => (
              <Card key={relatedItem.id} hover>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={relatedItem.image}
                    alt={relatedItem.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedItem.title}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{relatedItem.condition}</Badge>
                    <span className="font-semibold text-purple-600" style={{ color: 'rgb(107, 77, 101)' }}>
                      {relatedItem.points} pts
                    </span>
                  </div>
                  <Link to={`/item/${relatedItem.id}`} className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};