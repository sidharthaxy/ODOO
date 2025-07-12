import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

interface FormData {
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
}

export const AddItemPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: []
  });
  const [images, setImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const categories = [
    'Tops',
    'Bottoms',
    'Outerwear',
    'Dresses',
    'Shoes',
    'Accessories',
    'Activewear',
    'Formal'
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Good',
    'Fair'
  ];

  const sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'One Size'
  ];

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload to a server and get URLs back
      // For demo purposes, we'll create object URLs
      const newImages: string[] = [];
      for (let i = 0; i < Math.min(files.length, 5 - images.length); i++) {
        newImages.push(URL.createObjectURL(files[i]));
      }
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, submit to your backend
      console.log('Submitting item:', { ...formData, images });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">List a New Item</h1>
          <p className="text-gray-600 mt-2">Share your fashion finds with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
              <p className="text-sm text-gray-600">Add up to 5 photos. The first photo will be the main image.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 text-center">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.images && (
                <p className="mt-2 text-sm text-red-600">{errors.images}</p>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Title *"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={errors.title}
                placeholder="e.g., Vintage Denim Jacket"
                maxLength={100}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  rows={4}
                  maxLength={1000}
                  placeholder="Describe the item, its condition, any special features, etc."
                  className={`
                    w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}
                  `}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.description.length}/1000
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    className={`
                      w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}
                    `}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size *
                  </label>
                  <select
                    value={formData.size}
                    onChange={handleInputChange('size')}
                    className={`
                      w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}
                    `}
                  >
                    <option value="">Select size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.size && (
                    <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={handleInputChange('condition')}
                    className={`
                      w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      ${errors.condition ? 'border-red-500 focus:ring-red-500' : ''}
                    `}
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
                  )}
                </div>
              </div>

              <Input
                label="Type (Optional)"
                value={formData.type}
                onChange={handleInputChange('type')}
                placeholder="e.g., Blazer, Sneakers, Handbag"
                helperText="Be specific about the type of item"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              <p className="text-sm text-gray-600">Add tags to help others discover your item</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-purple-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  disabled={!currentTag.trim() || formData.tags.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formData.tags.length}/10 tags
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Publishing...' : 'Publish Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};