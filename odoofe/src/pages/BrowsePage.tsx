import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package, ArrowUpDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

interface ProductItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type?: string;
  size: string;
  condition: string;
  points: number;
  available: boolean;
  images: string[];
  owner?: { username: string; image?: string };
}

const CATEGORIES = [
  'All',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Shoes',
  'Accessories',
  'Activewear',
  'Formal'
];

const CONDITIONS = [
  'All',
  'Like New',
  'Excellent',
  'Good',
  'Fair'
];

export const BrowsePage: React.FC = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedCondition !== 'All') params.append('condition', selectedCondition);
        if (search.trim()) params.append('search', search.trim());
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/search/all?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching browse items:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchItems, 250);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory, selectedCondition, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Available Items</h1>
          <p className="text-gray-600 mt-2">Discover curated, sustainable pieces ready for swap or redemption</p>
        </div>

        {/* Filter & Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by keywords, tags, or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Condition */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Conditions' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="points-asc">Points: Low to High</option>
                  <option value="points-desc">Points: High to Low</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === cat ? 'rgb(107, 77, 101)' : undefined
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search keywords.</p>
            <Button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedCondition('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item._id} hover className="flex flex-col">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 relative">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/300'}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="shadow-sm bg-white bg-opacity-90">
                      {item.condition}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 truncate" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{item.category} • Size {item.size}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <span className="font-bold text-lg text-purple-700" style={{ color: 'rgb(107, 77, 101)' }}>
                      {item.points} pts
                    </span>
                    <Link to={`/item/${item._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
