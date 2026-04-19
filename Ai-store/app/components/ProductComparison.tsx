'use client'

import { useState } from 'react'
import { Scale, TrendingUp, DollarSign, Star } from 'lucide-react'
import { Product } from '@/types'
import axios from 'axios'

interface ComparisonResult {
  products: Product[]
  analysis: {
    priceComparison: any
    ratingComparison: any
    valueAnalysis: any[]
    insights: string[]
  }
}

export default function ProductComparison({ products }: { products: Product[] }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [comparison, setComparison] = useState<ComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      } else if (prev.length < 4) {
        return [...prev, productId]
      }
      return prev
    })
  }

  const handleCompare = async () => {
    if (selectedProducts.length < 2) return

    setIsLoading(true)
    try {
      const response = await axios.post('/api/ai/compare', {
        productIds: selectedProducts
      })
      setComparison(response.data)
    } catch (error) {
      console.error('Comparison error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Scale className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Product Comparison</h2>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-3">Select 2-4 products to compare:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                selectedProducts.includes(product.id)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={selectedProducts.length < 2 || isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Comparing...' : `Compare ${selectedProducts.length} Products`}
      </button>

      {comparison && (
        <div className="mt-6 space-y-6">
          {/* Price Comparison */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-xl font-semibold">Price Analysis</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cheapest</p>
                <p className="text-lg font-bold text-green-700">
                  {comparison.analysis.priceComparison.cheapest.name}
                </p>
                <p className="text-2xl font-bold">${comparison.analysis.priceComparison.cheapest.price.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${comparison.analysis.priceComparison.priceRange.average.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Most Expensive</p>
                <p className="text-lg font-bold text-red-700">
                  {comparison.analysis.priceComparison.mostExpensive.name}
                </p>
                <p className="text-2xl font-bold">${comparison.analysis.priceComparison.mostExpensive.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Rating Comparison */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-xl font-semibold">Rating Analysis</h3>
            </div>
            <div className="space-y-2">
              {comparison.products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{product.name}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Analysis */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-xl font-semibold">Value Analysis</h3>
            </div>
            <div className="space-y-2">
              {comparison.analysis.valueAnalysis.map((item: any) => (
                <div key={item.productId} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{item.productName}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.recommendation === 'Best Value' 
                        ? 'bg-green-100 text-green-700'
                        : item.recommendation === 'Good Choice'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.recommendation}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, item.valueScore * 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
            <ul className="space-y-2">
              {comparison.analysis.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
