import React from 'react';
import { Shirt, Heart, Recycle, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shirt className="h-8 w-8 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
              <span className="text-xl font-bold text-gray-900">ReWear</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Building a sustainable fashion community through clothing exchange. 
              Give your clothes a second life and discover unique pieces from fellow fashion lovers.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Recycle className="h-4 w-4 mr-1" />
                Sustainable
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                Community
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Heart className="h-4 w-4 mr-1" />
                Eco-friendly
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="/browse" className="text-gray-600 hover:text-purple-600 transition-colors">Browse Items</a></li>
              <li><a href="/add-item" className="text-gray-600 hover:text-purple-600 transition-colors">List an Item</a></li>
              <li><a href="/how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How it Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">Contact Us</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2025 ReWear. All rights reserved. Built with sustainability in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};