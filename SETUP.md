# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Overview

### E-Commerce Features
- ✅ Product catalog with 8 sample products
- ✅ Shopping cart with add/remove/update quantities
- ✅ Product detail pages
- ✅ Search functionality
- ✅ Responsive design

### AI Features
- ✅ **AI Chatbot**: Click the chat icon in bottom-right corner
  - Ask about products, prices, shipping, returns
  - Get product recommendations
  - Natural language queries
  
- ✅ **Smart Recommendations**: 
  - Homepage shows AI-recommended products
  - Product pages show related items
  - Based on cart contents and browsing

- ✅ **Enhanced Search**:
  - Search bar in navbar
  - AI-powered product matching
  - Natural language search support

## Customization

### Adding Products
Edit `lib/products.ts` to add more products. Each product needs:
- id, name, description, price, image, category, rating, reviews, inStock, tags

### AI Integration
The app uses a mock AI service by default. To use OpenAI:
1. Get an API key from OpenAI
2. Create `.env.local` file
3. Add: `OPENAI_API_KEY=your_key_here`
4. Update `lib/aiService.ts` to use OpenAI API

### Styling
- Tailwind CSS is configured in `tailwind.config.js`
- Colors can be customized in the theme section
- Global styles in `app/globals.css`

## Production Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **AI**: Mock service (easily replaceable with OpenAI)

