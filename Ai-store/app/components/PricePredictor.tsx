'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Product } from '@/types'
import axios from 'axios'

interface PricePrediction {
  currentPrice: number
  predictions: {
    optimistic: number
    realistic: number
    pessimistic: number
    expectedChange: number
    confidence: number
  }
  historicalTrend: Array<{date: string, price: number}>
  recommendation: string
}

export default function PricePredictor({ product }: { product: Product }) {
  const [prediction, setPrediction] = useState<PricePrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [days, setDays] = useState(30)

  const handlePredict = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/ai/price-prediction', {
        productId: product.id,
        days
      })
      setPrediction(response.data.predictions)
    } catch (error) {
      console.error('Prediction error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Price Prediction</h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Prediction Period (days)
        </label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          min="7"
          max="90"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      <button
        onClick={handlePredict}
        disabled={isLoading}
        className="w-full bg-primary-600 dark:bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg mb-6"
      >
        {isLoading ? 'Analyzing...' : 'Predict Price'}
      </button>

      {prediction && (
        <div className="space-y-6">
          {/* Current Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-600">Current Price</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Predictions */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Optimistic</p>
              <p className="text-xl font-bold text-green-700">
                ${prediction.predictions.optimistic.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {prediction.predictions.optimistic < product.price ? '↓' : '↑'} 
                {Math.abs(((prediction.predictions.optimistic - product.price) / product.price) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-primary-600">
              <p className="text-sm text-gray-600 mb-1">Realistic</p>
              <p className="text-xl font-bold text-blue-700">
                ${prediction.predictions.realistic.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {prediction.predictions.expectedChange > 0 ? '↑' : '↓'} 
                {Math.abs(prediction.predictions.expectedChange).toFixed(1)}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pessimistic</p>
              <p className="text-xl font-bold text-red-700">
                ${prediction.predictions.pessimistic.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {prediction.predictions.pessimistic < product.price ? '↓' : '↑'} 
                {Math.abs(((prediction.predictions.pessimistic - product.price) / product.price) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Prediction Confidence</span>
              <span className="text-lg font-bold text-primary-600">
                {prediction.predictions.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${prediction.predictions.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
            <div className="flex items-start">
              {prediction.predictions.expectedChange > 0 ? (
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
              ) : (
                <TrendingDown className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-primary-900 mb-1">AI Recommendation</p>
                <p className="text-sm text-primary-800">{prediction.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
