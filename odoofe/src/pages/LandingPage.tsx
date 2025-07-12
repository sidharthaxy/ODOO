import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Users, Heart, Star, Shirt, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const featuredItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?w=300&h=300&fit=crop',
      condition: 'Excellent',
      size: 'M',
      points: 75
    },
    {
      id: 2,
      title: 'Designer Silk Blouse',
      image: 'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?w=300&h=300&fit=crop',
      condition: 'Like New',
      size: 'S',
      points: 120
    },
    {
      id: 3,
      title: 'Classic Wool Coat',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=300&h=300&fit=crop',
      condition: 'Good',
      size: 'L',
      points: 95
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200 rounded-full opacity-15"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-purple-300 rounded-full opacity-25"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                Sustainable Fashion
              </span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mt-2" style={{ 
                background: 'linear-gradient(135deg, rgb(107, 77, 101), rgb(147, 51, 234), rgb(236, 72, 153))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Starts Here
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span className="font-medium text-purple-700">Join our community clothing exchange platform.</span> 
              <span className="text-gray-600"> Swap, trade, and discover amazing pieces while </span>
              <span className="font-medium text-green-700">reducing fashion waste</span>
              <span className="text-gray-600"> and building a more </span>
              <span className="font-medium text-blue-700">sustainable wardrobe.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Items
                </Button>
              </Link>
              <Link to="/add-item">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  List an Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Why Choose ReWear?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover the benefits of sustainable fashion and community-driven clothing exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg">
                  <Recycle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <span className="text-green-700">Sustainable</span> Impact
                </h3>
                <p className="text-gray-600">
                  Reduce fashion waste by giving clothes a second life. Every swap contributes to a more sustainable future.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <span className="text-blue-700">Community</span> Driven
                </h3>
                <p className="text-gray-600">
                  Connect with fellow fashion enthusiasts and build meaningful relationships through clothing exchange.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <span className="text-pink-700">Curated</span> Quality
                </h3>
                <p className="text-gray-600">
                  Discover unique, quality pieces that have been loved and cared for by fellow community members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Featured Items
              </span>
            </h2>
            <p className="text-xl text-gray-700">
              Discover amazing pieces waiting for their next owner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} hover>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Size: {item.size}</span>
                    <span>Condition: {item.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-600" style={{ color: 'rgb(107, 77, 101)' }}>
                      {item.points} points
                    </span>
                    <Link to={`/item/${item.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button size="lg" variant="outline">
                View All Items
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-700 font-medium">Items Exchanged</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                5K+
              </div>
              <div className="text-gray-700 font-medium">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                2.5T
              </div>
              <div className="text-gray-700 font-medium">CO2 Saved (lbs)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-gray-700 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, rgb(107, 77, 101), rgb(147, 51, 234), rgb(236, 72, 153))'
      }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of fashion lovers who are making a difference, one swap at a time.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-50 relative z-10 shadow-xl">
              Join ReWear Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};