'use client'

import { useState } from 'react'
import { Search, Sparkles, Filter } from 'lucide-react'
import { Product } from '@/types'
import axios from 'axios'
import ProductCard from './ProductCard'

interface SearchResult {
  query: string
  intent: { type: string; confidence: number }
  results: Array<Product & { relevanceScore: number }>
  insights: string[]
}

export default function SemanticSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: ''
  })

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await axios.post('/api/ai/semantic-search', {
        query,
        filters: {
          category: filters.category || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          minRating: filters.minRating ? Number(filters.minRating) : undefined
        }
      })
      setResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <Sparkles className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Semantic Search</h2>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search naturally: 'affordable wireless headphones' or 'gaming keyboard under $150'"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <details className="mb-4">
        <summary className="flex items-center cursor-pointer text-gray-700 hover:text-primary-600">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
        </summary>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            min="1"
            max="5"
            step="0.1"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </details>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Intent & Insights */}
          <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
            <div className="mb-2">
              <span className="text-sm text-gray-600">Detected Intent: </span>
              <span className="font-semibold text-primary-700 capitalize">
                {results.intent.type}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({Math.round(results.intent.confidence * 100)}% confidence)
              </span>
            </div>
            {results.insights.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">AI Insights:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {results.insights.map((insight, index) => (
                    <li key={index}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-gray-600">
            Found {results.totalResults} result{results.totalResults !== 1 ? 's' : ''}
          </div>

          {/* Products Grid */}
          {results.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    {Math.round(product.relevanceScore)}% match
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products found. Try different search terms.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
