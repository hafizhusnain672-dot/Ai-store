'use client'

import { useState } from 'react'
import { MessageSquare, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import axios from 'axios'

interface SentimentResult {
  individual: Array<{
    review: string
    sentiment: 'positive' | 'negative' | 'neutral'
    score: number
    keyPhrases: string[]
  }>
  summary: {
    totalReviews: number
    distribution: {
      positive: number
      negative: number
      neutral: number
    }
    averageSentimentScore: number
    overallSentiment: string
    insights: string[]
  }
}

export default function ReviewAnalyzer() {
  const [reviews, setReviews] = useState<string[]>([''])
  const [results, setResults] = useState<SentimentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addReview = () => {
    setReviews([...reviews, ''])
  }

  const updateReview = (index: number, value: string) => {
    const newReviews = [...reviews]
    newReviews[index] = value
    setReviews(newReviews)
  }

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    const validReviews = reviews.filter(r => r.trim().length > 0)
    if (validReviews.length === 0) return

    setIsLoading(true)
    try {
      const response = await axios.post('/api/ai/sentiment', {
        reviews: validReviews
      })
      setResults(response.data)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <MessageSquare className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Review Sentiment Analysis</h2>
      </div>

      {/* Review Input */}
      <div className="mb-4 space-y-2">
        {reviews.map((review, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={review}
              onChange={(e) => updateReview(index, e.target.value)}
              placeholder={`Review ${index + 1}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={2}
            />
            {reviews.length > 1 && (
              <button
                onClick={() => removeReview(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addReview}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          + Add Another Review
        </button>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading || reviews.every(r => !r.trim())}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors mb-6"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-xl font-semibold">Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(results.summary.distribution.positive)}%
                </p>
                <p className="text-sm text-gray-600">Positive</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {Math.round(results.summary.distribution.neutral)}%
                </p>
                <p className="text-sm text-gray-600">Neutral</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(results.summary.distribution.negative)}%
                </p>
                <p className="text-sm text-gray-600">Negative</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Sentiment:</span>
              <span className={`font-bold capitalize ${
                results.summary.overallSentiment === 'positive' ? 'text-green-600' :
                results.summary.overallSentiment === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {results.summary.overallSentiment}
              </span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${results.summary.averageSentimentScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Insights */}
          {results.summary.insights.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">AI Insights</h3>
              <ul className="space-y-1">
                {results.summary.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-primary-800">• {insight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Individual Reviews */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Individual Analysis</h3>
            <div className="space-y-3">
              {results.individual.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-gray-700 mb-2">{item.review}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.keyPhrases.map((phrase, pIndex) => (
                          <span
                            key={pIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.sentiment === 'positive' ? (
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                      ) : item.sentiment === 'negative' ? (
                        <TrendingDown className="h-4 w-4 inline mr-1" />
                      ) : null}
                      {item.sentiment}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${
                          item.sentiment === 'positive' ? 'bg-green-500' :
                          item.sentiment === 'negative' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${item.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
