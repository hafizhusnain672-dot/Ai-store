'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl dark:hover:shadow-primary-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              product.inStock
                ? 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/50'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            <span className="sm:hidden">{product.inStock ? 'Add' : 'Out'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

