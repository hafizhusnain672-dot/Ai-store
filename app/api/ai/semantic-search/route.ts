import { NextRequest, NextResponse } from 'next/server'
import { products, searchProducts } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters } = body
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }
    
    // AI-powered semantic search
    // Understands intent and context, not just keywords
    const lowerQuery = query.toLowerCase()
    
    // Intent detection
    const intent = detectSearchIntent(lowerQuery)
    
    // Semantic expansion - understand synonyms and related terms
    const expandedTerms = expandSearchTerms(lowerQuery)
    
    // Perform semantic search
    let results = performSemanticSearch(expandedTerms, products)
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        results = results.filter(p => p.category === filters.category)
      }
      if (filters.minPrice !== undefined) {
        results = results.filter(p => p.price >= filters.minPrice)
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter(p => p.price <= filters.maxPrice)
      }
      if (filters.minRating !== undefined) {
        results = results.filter(p => p.rating >= filters.minRating)
      }
    }
    
    // Relevance scoring
    const scoredResults = results.map(product => ({
      ...product,
      relevanceScore: calculateRelevanceScore(product, expandedTerms, intent)
    }))
    
    // Sort by relevance
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
    
    // Generate search insights
    const insights = generateSearchInsights(intent, scoredResults.length, expandedTerms)
    
    return NextResponse.json({
      query,
      intent,
      expandedTerms,
      results: scoredResults,
      totalResults: scoredResults.length,
      insights
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform semantic search' },
      { status: 500 }
    )
  }
}

function detectSearchIntent(query: string): {
  type: 'product' | 'category' | 'feature' | 'price' | 'comparison' | 'general'
  confidence: number
} {
  if (query.includes('compare') || query.includes('vs') || query.includes('difference')) {
    return { type: 'comparison', confidence: 0.9 }
  }
  if (query.includes('under') || query.includes('below') || query.includes('cheap') || query.includes('affordable')) {
    return { type: 'price', confidence: 0.85 }
  }
  if (query.includes('wireless') || query.includes('bluetooth') || query.includes('rgb') || query.includes('ergonomic')) {
    return { type: 'feature', confidence: 0.8 }
  }
  if (query.includes('electronics') || query.includes('accessories')) {
    return { type: 'category', confidence: 0.9 }
  }
  
  return { type: 'product', confidence: 0.7 }
}

function expandSearchTerms(query: string): string[] {
  const terms = [query]
  
  // Synonym mapping
  const synonyms: { [key: string]: string[] } = {
    'headphone': ['earphone', 'earbud', 'audio', 'sound'],
    'keyboard': ['typing', 'input', 'peripheral'],
    'mouse': ['pointer', 'input device', 'peripheral'],
    'monitor': ['screen', 'display', 'screen'],
    'webcam': ['camera', 'video', 'conference'],
    'wireless': ['bluetooth', 'cordless', 'cable-free'],
    'cheap': ['affordable', 'budget', 'inexpensive', 'low price'],
    'expensive': ['premium', 'high-end', 'luxury'],
    'gaming': ['game', 'gamer', 'esports'],
    'work': ['office', 'professional', 'business']
  }
  
  Object.entries(synonyms).forEach(([key, values]) => {
    if (query.includes(key)) {
      values.forEach(synonym => {
        if (!terms.includes(synonym)) {
          terms.push(synonym)
        }
      })
    }
  })
  
  return terms
}

function performSemanticSearch(terms: string[], productList: typeof products): typeof products {
  const results: typeof products = []
  const seenIds = new Set<string>()
  
  terms.forEach(term => {
    const matches = searchProducts(term)
    matches.forEach(product => {
      if (!seenIds.has(product.id)) {
        results.push(product)
        seenIds.add(product.id)
      }
    })
  })
  
  return results
}

function calculateRelevanceScore(product: any, terms: string[], intent: any): number {
  let score = 0
  
  // Name match
  terms.forEach(term => {
    if (product.name.toLowerCase().includes(term)) {
      score += 10
    }
    if (product.description.toLowerCase().includes(term)) {
      score += 5
    }
    if (product.tags?.some((tag: string) => tag.toLowerCase().includes(term))) {
      score += 7
    }
  })
  
  // Intent-based scoring
  if (intent.type === 'price' && product.price < 100) {
    score += 5
  }
  if (intent.type === 'feature') {
    const featureTerms = terms.filter(t => 
      ['wireless', 'bluetooth', 'rgb', 'ergonomic', 'gaming'].includes(t)
    )
    if (featureTerms.some(ft => 
      product.name.toLowerCase().includes(ft) || 
      product.description.toLowerCase().includes(ft)
    )) {
      score += 8
    }
  }
  
  // Rating boost
  if (product.rating >= 4.5) {
    score += 3
  }
  
  return score
}

function generateSearchInsights(intent: any, resultCount: number, terms: string[]): string[] {
  const insights: string[] = []
  
  if (resultCount === 0) {
    insights.push('No products found. Try different search terms or browse categories.')
  } else if (resultCount === 1) {
    insights.push('Found one exact match for your search.')
  } else if (resultCount < 5) {
    insights.push(`Found ${resultCount} products matching your search.`)
  } else {
    insights.push(`Found ${resultCount} products. Use filters to narrow down your search.`)
  }
  
  if (intent.type === 'price') {
    insights.push('You seem to be looking for budget-friendly options. Consider our accessories category.')
  }
  
  if (terms.length > 1) {
    insights.push(`Search expanded to include related terms: ${terms.slice(1).join(', ')}`)
  }
  
  return insights
}
