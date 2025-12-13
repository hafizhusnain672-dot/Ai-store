import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviews } = body
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Reviews array is required' },
        { status: 400 }
      )
    }
    
    // AI-powered review summarization
    const summary = {
      totalReviews: reviews.length,
      overallSentiment: analyzeOverallSentiment(reviews),
      keyPoints: extractKeyPoints(reviews),
      pros: extractPros(reviews),
      cons: extractCons(reviews),
      themes: identifyThemes(reviews),
      summary: generateSummary(reviews),
      ratingDistribution: calculateRatingDistribution(reviews)
    }
    
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Review summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to summarize reviews' },
      { status: 500 }
    )
  }
}

function analyzeOverallSentiment(reviews: string[]): {
  sentiment: 'positive' | 'negative' | 'mixed'
  score: number
} {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'good', 'wonderful', 'fantastic', 'awesome', 'best', 'highly recommend', 'satisfied', 'happy']
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointed', 'waste', 'poor', 'worst', 'broken', 'defective', 'useless', 'regret']
  
  let positiveCount = 0
  let negativeCount = 0
  
  reviews.forEach(review => {
    const lower = review.toLowerCase()
    positiveWords.forEach(word => {
      if (lower.includes(word)) positiveCount++
    })
    negativeWords.forEach(word => {
      if (lower.includes(word)) negativeCount++
    })
  })
  
  const score = positiveCount > negativeCount 
    ? 0.5 + Math.min(0.5, (positiveCount - negativeCount) / reviews.length)
    : 0.5 - Math.min(0.5, (negativeCount - positiveCount) / reviews.length)
  
  const sentiment = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'mixed'
  
  return { sentiment, score }
}

function extractKeyPoints(reviews: string[]): string[] {
  const keyPoints: string[] = []
  const keywords = [
    { word: 'quality', point: 'Product quality' },
    { word: 'price', point: 'Value for money' },
    { word: 'delivery', point: 'Shipping and delivery' },
    { word: 'customer service', point: 'Customer support' },
    { word: 'easy', point: 'Ease of use' },
    { word: 'durable', point: 'Durability' },
    { word: 'design', point: 'Design and aesthetics' },
    { word: 'battery', point: 'Battery life' }
  ]
  
  keywords.forEach(({ word, point }) => {
    const mentions = reviews.filter(r => r.toLowerCase().includes(word)).length
    if (mentions >= reviews.length * 0.2) { // Mentioned in at least 20% of reviews
      keyPoints.push(point)
    }
  })
  
  return keyPoints
}

function extractPros(reviews: string[]): string[] {
  const pros: string[] = []
  const positivePhrases = [
    { phrase: 'great quality', pro: 'High quality product' },
    { phrase: 'good value', pro: 'Good value for money' },
    { phrase: 'fast shipping', pro: 'Fast delivery' },
    { phrase: 'easy to use', pro: 'User-friendly' },
    { phrase: 'durable', pro: 'Long-lasting' },
    { phrase: 'excellent', pro: 'Excellent performance' },
    { phrase: 'love it', pro: 'Highly appreciated by customers' }
  ]
  
  positivePhrases.forEach(({ phrase, pro }) => {
    const mentions = reviews.filter(r => r.toLowerCase().includes(phrase)).length
    if (mentions >= 2) {
      pros.push(pro)
    }
  })
  
  return pros.length > 0 ? pros : ['Generally positive feedback']
}

function extractCons(reviews: string[]): string[] {
  const cons: string[] = []
  const negativePhrases = [
    { phrase: 'defective', con: 'Some quality issues reported' },
    { phrase: 'poor quality', con: 'Quality concerns' },
    { phrase: 'slow shipping', con: 'Delivery delays' },
    { phrase: 'difficult', con: 'Complex to use' },
    { phrase: 'broken', con: 'Durability issues' },
    { phrase: 'disappointed', con: 'Did not meet expectations' }
  ]
  
  negativePhrases.forEach(({ phrase, con }) => {
    const mentions = reviews.filter(r => r.toLowerCase().includes(phrase)).length
    if (mentions >= 2) {
      cons.push(con)
    }
  })
  
  return cons
}

function identifyThemes(reviews: string[]): Array<{theme: string, frequency: number}> {
  const themes = [
    'Quality',
    'Price',
    'Delivery',
    'Customer Service',
    'Ease of Use',
    'Design',
    'Performance',
    'Durability'
  ]
  
  return themes.map(theme => {
    const lowerTheme = theme.toLowerCase()
    const frequency = reviews.filter(r => r.toLowerCase().includes(lowerTheme)).length
    return { theme, frequency }
  }).filter(t => t.frequency > 0).sort((a, b) => b.frequency - a.frequency)
}

function generateSummary(reviews: string[]): string {
  const sentiment = analyzeOverallSentiment(reviews)
  const keyPoints = extractKeyPoints(reviews)
  const pros = extractPros(reviews)
  const cons = extractCons(reviews)
  
  let summary = `Based on ${reviews.length} reviews, customers have a ${sentiment.sentiment} overall experience. `
  
  if (keyPoints.length > 0) {
    summary += `Key discussion points include ${keyPoints.slice(0, 3).join(', ')}. `
  }
  
  if (pros.length > 0) {
    summary += `Positive aspects mentioned: ${pros.slice(0, 2).join(' and ')}. `
  }
  
  if (cons.length > 0) {
    summary += `Areas for improvement: ${cons.slice(0, 2).join(' and ')}. `
  }
  
  return summary.trim()
}

function calculateRatingDistribution(reviews: string[]): {
  positive: number
  neutral: number
  negative: number
} {
  const sentiment = analyzeOverallSentiment(reviews)
  const positive = sentiment.score > 0.6 ? Math.round(sentiment.score * 100) : 0
  const negative = sentiment.score < 0.4 ? Math.round((1 - sentiment.score) * 100) : 0
  const neutral = 100 - positive - negative
  
  return { positive, neutral, negative }
}
