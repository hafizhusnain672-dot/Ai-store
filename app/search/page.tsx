'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { searchProducts } from '@/lib/products'
import ProductGrid from '../components/ProductGrid'
import { Product } from '@/types'
import { Sparkles } from 'lucide-react'
import SemanticSearch from '../components/SemanticSearch'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    if (query) {
      const searchResults = searchProducts(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 text-primary-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
        </div>

        {/* AI Semantic Search */}
        <div className="mb-8">
          <SemanticSearch />
        </div>

        {/* Traditional Search Results */}
        {query && (
          <div className="mt-8">
            <p className="text-gray-600 mb-4">
              Traditional search found {results.length} product{results.length !== 1 ? 's' : ''} matching "{query}"
            </p>
            {results.length > 0 && <ProductGrid products={results} />}
            {results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found. Try using the AI Semantic Search above for better results!
                </p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Use the AI Semantic Search above to find products naturally.</p>
            <p className="text-sm text-gray-400">
              Try queries like: "affordable wireless headphones" or "gaming keyboard under $150"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

