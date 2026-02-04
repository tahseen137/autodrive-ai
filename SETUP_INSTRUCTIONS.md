# Quick Setup Instructions for Product Comparison

## Step 1: Get Your Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

## Step 2: Configure Your Environment

Create a `.env` file in the root directory of your project:

```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

**Important**: 
- Replace `sk-ant-your-actual-key-here` with your actual API key
- Never commit this file to Git (it's already in .gitignore)
- Keep your API key secret

## Step 3: Restart Your Development Server

If your app is already running, stop it (Ctrl+C) and restart:

```bash
npm start
```

The environment variables are only loaded when the server starts.

## Step 4: Test the Feature

1. Open your app in the browser (usually http://localhost:3000)
2. Click on the **"Products"** tab in the navigation
3. Select 2-4 products by clicking on them
4. Click the **"Compare with AI"** button
5. Wait a few seconds for the AI analysis

## What You'll See

### Comparison Table
- Each feature (Price, Display, Camera, etc.) is scored 0-100
- **Green with ↗️** = Best product for that feature
- **Red with ↘️** = Worst product for that feature
- **Gray with —** = Neutral/middle performance

### AI Recommendations
- 4 specific recommendations based on different use cases
- Each includes the recommended product and detailed reasoning
- Examples: "Best Overall Value", "Best Camera", "Best Battery Life"

## Troubleshooting

### "Failed to analyze products" error
- Check that your API key is correct in the `.env` file
- Make sure you restarted the server after creating `.env`
- Verify your API key is active at https://console.anthropic.com/

### API key not found
- Ensure the `.env` file is in the root directory (same level as package.json)
- Check that the variable name is exactly `REACT_APP_ANTHROPIC_API_KEY`
- React requires the `REACT_APP_` prefix for environment variables

### Comparison shows mock data
- This is the fallback behavior if the API call fails
- Check the browser console (F12) for error messages
- Verify your internet connection

## Cost Information

- Claude API charges per token (input + output)
- Each comparison uses approximately 1,000-2,000 tokens
- Current pricing: ~$0.003 per comparison
- You get free credits when you sign up

## Customization

### Add Your Own Products

Edit `src/ProductComparison.jsx` and update the `productDatabase` array:

```javascript
const productDatabase = [
  {
    id: 1,
    name: 'Your Product Name',
    category: 'Category',
    price: 999,
    brand: 'Brand Name',
    image: 'https://your-image-url.com/image.jpg'
  },
  // Add more products...
];
```

### Change Features Being Analyzed

In the `analyzeProducts` function, modify the features list:

```javascript
Please analyze these products across the following features:
1. Your Feature 1
2. Your Feature 2
3. Your Feature 3
// etc.
```

## Next Steps

- See `PRODUCT_COMPARISON_GUIDE.md` for detailed documentation
- Check `README.md` for full project information
- Customize the product database with your own products
- Adjust the styling to match your brand

## Support

If you encounter issues:
1. Check the browser console for errors (F12 → Console tab)
2. Verify your API key at https://console.anthropic.com/
3. Review the error messages in the alert dialog
4. Check that all dependencies are installed (`npm install`)

Happy comparing! 🚀
