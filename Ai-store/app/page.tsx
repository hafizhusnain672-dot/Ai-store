'use client'

import { useEffect, useState } from 'react'
import { products } from '@/lib/products'
import ProductGrid from './components/ProductGrid'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import axios from 'axios'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const cartItems = useCartStore(state => state.items)

  useEffect(() => {
    // Load AI recommendations
    const loadRecommendations = async () => {
      try {
        const response = await axios.post('/api/ai/recommendations', {
          cartItems: cartItems,
          viewedProducts: []
        })
        setRecommendations(response.data.recommendations || [])
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        // Fallback to popular products
        setRecommendations(products.slice(0, 4))
      }
    }

    loadRecommendations()
  }, [cartItems])

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-primary-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6 animate-slide-up">
            <Sparkles className="h-10 w-10 mr-3 animate-pulse-slow" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              AI-Powered Shopping Experience
            </h1>
          </div>
          <p className="text-xl md:text-2xl mt-4 text-primary-100 dark:text-primary-200 max-w-3xl mx-auto leading-relaxed">
            Discover products with the help of AI. Get personalized recommendations, 
            smart search, and instant answers to all your questions.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#recommendations"
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all hover:scale-105 shadow-lg"
            >
              Explore Products
            </a>
            <a
              href="/ai-features"
              className="px-6 py-3 bg-primary-500/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-primary-500/30 transition-all hover:scale-105"
            >
              AI Features
            </a>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section id="recommendations" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
                <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                AI Recommendations for You
              </h2>
            </div>
            <ProductGrid products={recommendations} />
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={products} title="All Products" />
        </div>
      </section>
    </div>
  )
}

