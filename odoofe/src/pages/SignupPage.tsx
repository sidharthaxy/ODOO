import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shirt, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = {
    hasLength: formData.password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Shirt className="h-10 w-10 text-purple-600" style={{ color: 'rgb(107, 77, 101)' }} />
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Join our community
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-purple-600 hover:text-purple-500"
            style={{ color: 'rgb(107, 77, 101)' }}
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Create your account</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <Input
                label="Full name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <Input
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={errors.password}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Password requirements:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="h-3 w-3 mr-1" />
                      At least 6 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasLetter ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="h-3 w-3 mr-1" />
                      Contains a letter
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="h-3 w-3 mr-1" />
                      Contains a number
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <Input
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-purple-600 hover:text-purple-500"
                    style={{ color: 'rgb(107, 77, 101)' }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-purple-600 hover:text-purple-500"
                    style={{ color: 'rgb(107, 77, 101)' }}
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Create account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};