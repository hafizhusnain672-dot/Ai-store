'use client'

import { useParams } from 'next/navigation'
import { getProductById, products } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import ProductGrid from '@/app/components/ProductGrid'
import PricePredictor from '@/app/components/PricePredictor'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = getProductById(productId)
  const addItem = useCartStore(state => state.addItem)
  const cartItems = useCartStore(state => state.items)
  const [recommendations, setRecommendations] = useState<Product[]>([])

  useEffect(() => {
    if (product) {
      const loadRecommendations = async () => {
        try {
          const response = await axios.post('/api/ai/recommendations', {
            cartItems: cartItems,
            viewedProducts: [product.id]
          })
          setRecommendations(response.data.recommendations || [])
        } catch (error) {
          console.error('Failed to load recommendations:', error)
          // Fallback: show products from same category
          const sameCategory = products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
          setRecommendations(sameCategory)
        }
      }
      loadRecommendations()
    }
  }, [product, cartItems])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/" className="text-primary-600 hover:underline">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative h-96 lg:h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold gradient-text">
              ${product.price.toFixed(2)}
            </p>
            {product.inStock && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                In Stock
              </span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Category: </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{product.category}</span>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
              product.inStock
                ? 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/50'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>

          {product.inStock && (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>In Stock - Ready to ship</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Price Prediction */}
      <section className="mt-16">
        <PricePredictor product={product} />
      </section>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            You Might Also Like
          </h2>
          <ProductGrid products={recommendations} />
        </section>
      )}
    </div>
  )
}

