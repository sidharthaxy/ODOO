import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, Menu, X, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="h-8 w-8 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
            <span className="text-xl font-bold text-gray-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-gray-700 hover:text-purple-600 transition-colors">
              Browse Items
            </Link>
            {isAuthenticated && (
              <Link to="/add-item" className="text-gray-700 hover:text-purple-600 transition-colors">
                List Item
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">{user?.points} points</span>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Items
              </Link>
              {isAuthenticated && (
                <Link
                  to="/add-item"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  List Item
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-gray-600 mb-4">{user?.points} points</div>
                    <div className="space-y-2">
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};