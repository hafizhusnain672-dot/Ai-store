'use client'

import { products } from '@/lib/products'
import ProductComparison from '@/app/components/ProductComparison'
import SemanticSearch from '@/app/components/SemanticSearch'
import ReviewAnalyzer from '@/app/components/ReviewAnalyzer'
import { Sparkles, Scale, Search, MessageSquare, TrendingUp, Image as ImageIcon, FileText, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 mr-2" />
            <h1 className="text-4xl font-bold">AI-Powered Features</h1>
          </div>
          <p className="text-center text-primary-100 max-w-2xl mx-auto">
            Explore our advanced AI capabilities designed to enhance your shopping experience
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Search className="h-6 w-6" />}
            title="Semantic Search"
            description="Search naturally using conversational language. AI understands your intent, not just keywords."
            color="blue"
          />
          <FeatureCard
            icon={<Scale className="h-6 w-6" />}
            title="Product Comparison"
            description="Compare multiple products side-by-side with AI-powered analysis of price, ratings, and value."
            color="green"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Price Prediction"
            description="Get AI-powered price predictions to help you decide when to buy for the best deal."
            color="purple"
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Sentiment Analysis"
            description="Analyze customer reviews with AI to understand overall sentiment and key themes."
            color="orange"
          />
          <FeatureCard
            icon={<ImageIcon className="h-6 w-6" />}
            title="Image Analysis"
            description="AI-powered image recognition and analysis for product images and visual search."
            color="pink"
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Description Generator"
            description="Generate compelling product descriptions in different styles using AI."
            color="indigo"
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Review Summarization"
            description="Get AI-generated summaries of customer reviews highlighting key points and themes."
            color="teal"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Smart Recommendations"
            description="Personalized product recommendations based on your browsing and purchase history."
            color="red"
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="AI Chatbot"
            description="24/7 AI shopping assistant ready to answer questions and help you find products."
            color="yellow"
          />
        </div>

        {/* Interactive Features */}
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Try AI Features</h2>
            
            {/* Semantic Search */}
            <div className="mb-12">
              <SemanticSearch />
            </div>

            {/* Product Comparison */}
            <div className="mb-12">
              <ProductComparison products={products} />
            </div>

            {/* Review Analyzer */}
            <div className="mb-12">
              <ReviewAnalyzer />
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
