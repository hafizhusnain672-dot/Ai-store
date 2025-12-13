import { NextRequest, NextResponse } from 'next/server'
import { products, getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, days } = body
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const predictionDays = days || 30
    
    // AI-powered price prediction
    const currentPrice = product.price
    const rating = product.rating
    const reviews = product.reviews
    const category = product.category
    
    // Mock prediction algorithm
    // In production, this would use ML models trained on historical data
    const baseVolatility = 0.05 // 5% base price change possibility
    const ratingFactor = (5 - rating) * 0.02 // Lower rating = more likely to drop
    const reviewFactor = reviews > 200 ? -0.01 : 0.01 // Popular products more stable
    const categoryFactor = category === 'Electronics' ? 0.03 : 0.01 // Electronics more volatile
    
    const volatility = baseVolatility + ratingFactor + reviewFactor + categoryFactor
    
    // Generate predictions for different scenarios
    const predictions = {
      optimistic: currentPrice * (1 - volatility * 0.5), // Price might drop slightly
      realistic: currentPrice * (1 + volatility * 0.3), // Small increase
      pessimistic: currentPrice * (1 + volatility * 1.2), // Larger increase
      current: currentPrice
    }
    
    // Historical trend simulation
    const historicalData = generateHistoricalData(currentPrice, 30)
    
    const analysis = {
      productId: product.id,
      productName: product.name,
      currentPrice,
      predictionDays,
      predictions: {
        ...predictions,
        expectedChange: ((predictions.realistic - currentPrice) / currentPrice) * 100,
        confidence: calculateConfidence(rating, reviews)
      },
      historicalTrend: historicalData,
      factors: {
        rating: {
          value: rating,
          impact: rating >= 4.5 ? 'Stabilizing (high rating)' : 'Moderate volatility expected'
        },
        reviews: {
          value: reviews,
          impact: reviews > 200 ? 'High demand indicator' : 'Limited data available'
        },
        category: {
          value: category,
          impact: category === 'Electronics' ? 'Higher price volatility' : 'More stable pricing'
        }
      },
      recommendation: generatePriceRecommendation(predictions, currentPrice)
    }
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Price prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to predict price' },
      { status: 500 }
    )
  }
}

function generateHistoricalData(currentPrice: number, days: number): Array<{date: string, price: number}> {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
    const price = currentPrice * (1 + variation)
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    })
  }
  
  return data
}

function calculateConfidence(rating: number, reviews: number): number {
  // Higher rating and more reviews = higher confidence
  const ratingConfidence = (rating / 5) * 0.5
  const reviewConfidence = Math.min(reviews / 500, 1) * 0.5
  
  return Math.round((ratingConfidence + reviewConfidence) * 100)
}

function generatePriceRecommendation(predictions: any, currentPrice: number): string {
  const expectedChange = ((predictions.realistic - currentPrice) / currentPrice) * 100
  
  if (expectedChange < -2) {
    return 'Price is expected to decrease. Consider waiting for a better deal.'
  } else if (expectedChange > 5) {
    return 'Price may increase soon. Consider purchasing now.'
  } else {
    return 'Price is relatively stable. Good time to purchase if you need it.'
  }
}
