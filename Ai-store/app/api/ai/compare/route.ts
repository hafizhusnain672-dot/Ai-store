import { NextRequest, NextResponse } from 'next/server'
import { products, getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds } = body
    
    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 product IDs are required' },
        { status: 400 }
      )
    }
    
    const productsToCompare = productIds
      .map((id: string) => getProductById(id))
      .filter(Boolean)
    
    if (productsToCompare.length < 2) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      )
    }
    
    // AI-powered comparison analysis
    const comparison = {
      products: productsToCompare,
      analysis: {
        priceComparison: {
          cheapest: productsToCompare.reduce((min, p) => 
            p.price < min.price ? p : min
          ),
          mostExpensive: productsToCompare.reduce((max, p) => 
            p.price > max.price ? p : max
          ),
          priceRange: {
            min: Math.min(...productsToCompare.map(p => p.price)),
            max: Math.max(...productsToCompare.map(p => p.price)),
            average: productsToCompare.reduce((sum, p) => sum + p.price, 0) / productsToCompare.length
          }
        },
        ratingComparison: {
          highest: productsToCompare.reduce((max, p) => 
            p.rating > max.rating ? p : max
          ),
          lowest: productsToCompare.reduce((min, p) => 
            p.rating < min.rating ? p : min
          ),
          average: productsToCompare.reduce((sum, p) => sum + p.rating, 0) / productsToCompare.length
        },
        valueAnalysis: productsToCompare.map(product => ({
          productId: product.id,
          productName: product.name,
          valueScore: (product.rating * 20) / (product.price / 10), // Higher rating, lower price = better value
          recommendation: product.rating >= 4.5 && product.price <= 200 
            ? 'Best Value' 
            : product.rating >= 4.0 
            ? 'Good Choice' 
            : 'Consider Alternatives'
        })),
        insights: generateComparisonInsights(productsToCompare)
      }
    }
    
    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Comparison error:', error)
    return NextResponse.json(
      { error: 'Failed to compare products' },
      { status: 500 }
    )
  }
}

function generateComparisonInsights(products: any[]): string[] {
  const insights: string[] = []
  
  const priceRange = Math.max(...products.map(p => p.price)) - Math.min(...products.map(p => p.price))
  if (priceRange > 100) {
    insights.push(`There's a significant price difference of $${priceRange.toFixed(2)} between these products.`)
  }
  
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length
  if (avgRating >= 4.5) {
    insights.push('All products have excellent ratings, indicating high customer satisfaction.')
  } else if (avgRating < 4.0) {
    insights.push('Consider reading reviews carefully as average ratings are below 4.0.')
  }
  
  const bestValue = products.reduce((best, p) => {
    const valueScore = (p.rating * 20) / (p.price / 10)
    const bestScore = (best.rating * 20) / (best.price / 10)
    return valueScore > bestScore ? p : best
  })
  
  insights.push(`${bestValue.name} offers the best value with a high rating-to-price ratio.`)
  
  const categories = new Set(products.map(p => p.category))
  if (categories.size === 1) {
    insights.push('All products are in the same category, making comparison straightforward.')
  }
  
  return insights
}
