# Product Comparison Feature Guide

## Overview
The Product Comparison feature allows users to compare up to 4 products side-by-side with AI-powered analysis using Claude API. The comparison includes:

- **Feature comparison table** with visual indicators for best/worst features
- **AI-generated recommendations** based on specific use cases
- **Interactive product selection** with search functionality
- **Responsive design** matching your existing app theme

## Quick Setup

1. **Get your Claude API key** from https://console.anthropic.com/
2. **Create a `.env` file** in the root directory:
   ```env
   REACT_APP_ANTHROPIC_API_KEY=your_actual_api_key_here
   ```
3. **Restart your development server** to load the environment variables
4. **Navigate to the Products tab** and start comparing!

## Features

### 1. Product Selection
- Users can select up to 4 products from the product grid
- Search functionality to filter products
- Visual indication of selected products
- Easy removal of selected products

### 2. AI-Powered Comparison
- Analyzes all features across selected products
- Highlights best and worst features with visual indicators:
  - 🟢 Green with ↗️ for best features
  - 🔴 Red with ↘️ for worst features
  - ⚪ Gray with — for neutral features

### 3. Smart Recommendations
- AI generates specific recommendations for different use cases
- Each recommendation includes:
  - Feature category (e.g., "Best Overall Value", "Best Camera")
  - Recommended product
  - Detailed reasoning

## How It Works

The component now uses the Claude API for real-time product analysis. When you click "Compare with AI":

1. Selected products are sent to Claude API
2. Claude analyzes features like price, display, camera, battery, performance, etc.
3. Each product gets scored (0-100) for each feature
4. Best and worst products are identified for each feature
5. AI generates 4 personalized recommendations

### API Implementation

The component uses Claude 3.5 Sonnet for analysis:

```javascript
const analyzeProducts = async () => {
  if (selectedProducts.length < 2) return;
  
  setIsAnalyzing(true);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Compare these products and provide a detailed analysis:
          
${selectedProducts.map((p, i) => `
Product ${i + 1}: ${p.name}
- Brand: ${p.brand}
- Price: $${p.price}
- Category: ${p.category}
`).join('\n')}

Please provide:
1. A feature-by-feature comparison with scores (0-100) for each product
2. Identify the best and worst product for each feature
3. Generate 4 specific recommendations based on different use cases

Format your response as JSON with this structure:
{
  "features": [
    {
      "name": "Feature Name",
      "category": "Category",
      "scores": [
        {"value": 85, "status": "best", "description": "85/100"},
        {"value": 70, "status": "neutral", "description": "70/100"}
      ]
    }
  ],
  "recommendations": [
    {
      "feature": "Best for...",
      "product": "Product Name",
      "reason": "Detailed explanation"
    }
  ]
}`
        }]
      })
    });

    const data = await response.json();
    const aiResponse = JSON.parse(data.content[0].text);
    
    setComparisonData({
      table: aiResponse.features,
      recommendations: aiResponse.recommendations
    });
  } catch (error) {
    console.error('AI analysis failed:', error);
    // Fallback to mock data
    const mockComparison = generateMockComparison(selectedProducts);
    setComparisonData(mockComparison);
  }

  setIsAnalyzing(false);
};
```

### Option 2: Using OpenAI GPT-4

```javascript
const analyzeProducts = async () => {
  if (selectedProducts.length < 2) return;
  
  setIsAnalyzing(true);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{
          role: 'user',
          content: `Compare these products: ${JSON.stringify(selectedProducts)}
          
          Provide a detailed comparison with feature scores and recommendations in JSON format.`
        }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    setComparisonData({
      table: aiResponse.features,
      recommendations: aiResponse.recommendations
    });
  } catch (error) {
    console.error('AI analysis failed:', error);
  }

  setIsAnalyzing(false);
};
```

### Option 3: Using Your Backend API

```javascript
const analyzeProducts = async () => {
  if (selectedProducts.length < 2) return;
  
  setIsAnalyzing(true);

  try {
    const response = await fetch('/api/compare-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: selectedProducts
      })
    });

    const data = await response.json();
    setComparisonData(data);
  } catch (error) {
    console.error('Comparison failed:', error);
  }

  setIsAnalyzing(false);
};
```

## Environment Variables

Add these to your `.env` file:

```env
# For Claude API
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here

# For OpenAI API
REACT_APP_OPENAI_API_KEY=your_api_key_here

# For custom backend
REACT_APP_API_URL=https://your-api.com
```

## Customization

### Adding More Products

Update the `productDatabase` array in `ProductComparison.jsx`:

```javascript
const productDatabase = [
  {
    id: 1,
    name: 'Product Name',
    category: 'Category',
    price: 999,
    brand: 'Brand Name',
    image: 'image-url'
  },
  // Add more products...
];
```

### Customizing Features

Modify the `generateMockComparison` function to include your specific features:

```javascript
const features = [
  { name: 'Your Feature 1', category: 'Category 1' },
  { name: 'Your Feature 2', category: 'Category 2' },
  // Add more features...
];
```

### Styling

The component uses inline styles matching your existing theme. To customize:

1. Colors: Change the gradient values (`#ff6b00`, `#ffa500`)
2. Fonts: Update the `fontFamily` properties
3. Spacing: Adjust padding and margin values

## Usage

1. Navigate to the "Products" tab in your app
2. Search for products using the search bar
3. Click on products to select them (up to 4)
4. Click "Compare with AI" button
5. View the comparison table and recommendations

## Tips

- Start with at least 2 products for meaningful comparisons
- The AI analysis considers price, features, and use cases
- Recommendations are tailored to different user needs
- The comparison table highlights strengths and weaknesses

## Future Enhancements

- Export comparison as PDF
- Share comparison via link
- Save favorite comparisons
- Add more detailed product specifications
- Include user reviews in analysis
- Add price history tracking
