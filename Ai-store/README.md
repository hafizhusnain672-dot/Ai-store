# 🤖 AI-Powered E-Commerce Store

A modern, feature-rich e-commerce platform with **9 AI-powered features**, **28 premium products**, and a beautiful **dark theme**. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Key Features

### 🛒 E-Commerce
- **28 Products** across Electronics & Accessories
- Shopping cart with quantity management
- Product search and filtering
- Responsive product grid
- Order summary with tax & shipping

### 🤖 AI Features (9 Total)
1. **AI Chatbot** - 24/7 shopping assistant
2. **Smart Recommendations** - Personalized suggestions
3. **Semantic Search** - Natural language search
4. **Product Comparison** - Side-by-side analysis
5. **Price Prediction** - AI-powered price forecasting
6. **Sentiment Analysis** - Review sentiment detection
7. **Image Analysis** - Product image processing
8. **Review Summarization** - AI-generated summaries
9. **Description Generator** - Auto-generated descriptions

### 🎨 UI/UX
- **Dark Mode** with system preference detection
- Smooth animations and transitions
- Modern card designs
- Gradient effects
- Fully responsive design
- Custom scrollbars

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Optional: OpenAI Integration

Create `.env.local`:
```env
OPENAI_API_KEY=your_api_key_here
```

> **Note**: The app works with mock AI services by default - no API key required for demo!

## 📚 Documentation

For complete documentation, see **[FEATURES.md](./FEATURES.md)** which includes:

- 📋 Complete feature list
- 🛠 Technical stack details
- 🔌 API endpoint documentation
- 🧩 Component reference
- 📖 Usage guide
- 🔮 Future enhancements

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3
- **State**: Zustand
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📁 Project Structure

```
Ai/
├── app/
│   ├── api/ai/          # 9 AI API endpoints
│   ├── components/      # React components
│   ├── contexts/        # Theme context
│   └── [pages]          # App pages
├── lib/                 # Utilities & services
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## 🎯 Features Overview

### E-Commerce Features
- ✅ Product catalog (28 products)
- ✅ Shopping cart system
- ✅ Product detail pages
- ✅ Search functionality
- ✅ Category filtering
- ✅ Responsive design

### AI Features
- ✅ AI Chatbot with context awareness
- ✅ Personalized recommendations
- ✅ Semantic search with intent detection
- ✅ Product comparison tool
- ✅ Price prediction engine
- ✅ Review sentiment analysis
- ✅ Image analysis API
- ✅ Review summarization
- ✅ Description generator

### Theme & Design
- ✅ Dark/Light mode toggle
- ✅ System preference detection
- ✅ Smooth transitions
- ✅ Modern animations
- ✅ Gradient effects
- ✅ Glassmorphism

## 📖 Usage

1. **Browse Products**: Navigate through 28 products
2. **Search**: Use traditional or semantic search
3. **AI Chat**: Click chat icon for AI assistant
4. **Compare**: Visit AI Features page to compare products
5. **Predict Prices**: Check product pages for price predictions
6. **Toggle Theme**: Click sun/moon icon in navbar

## 🔌 API Endpoints

All AI features have dedicated API endpoints:

- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/recommendations` - Get recommendations
- `POST /api/ai/semantic-search` - Semantic search
- `POST /api/ai/compare` - Compare products
- `POST /api/ai/price-prediction` - Predict prices
- `POST /api/ai/sentiment` - Analyze sentiment
- `POST /api/ai/image-analysis` - Analyze images
- `POST /api/ai/summarize-reviews` - Summarize reviews
- `POST /api/ai/generate-description` - Generate descriptions

See [FEATURES.md](./FEATURES.md) for detailed API documentation.

## 🎨 Screenshots

### Features
- Modern dark theme
- Smooth animations
- Responsive design
- AI-powered features
- Beautiful UI

## 🔮 Roadmap

- [ ] Real OpenAI API integration
- [ ] User authentication
- [ ] Payment gateway
- [ ] Order tracking
- [ ] Product reviews system
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] PWA support

## 📝 Notes

- Current implementation uses **mock AI services**
- Products stored in **static array** (no database)
- Cart is **client-side only**
- Ready for production enhancements

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

Built with:
- Next.js
- React
- Tailwind CSS
- Zustand
- Lucide Icons

---

**For detailed documentation, see [FEATURES.md](./FEATURES.md)**

**Version**: 1.0.0 | **Status**: Active Development

