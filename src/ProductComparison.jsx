import React, { useState } from 'react';
import { Search, X, TrendingUp, TrendingDown, Minus, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample product database - replace with your actual data
  const productDatabase = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphone',
      price: 999,
      brand: 'Apple',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Smartphone',
      price: 1199,
      brand: 'Samsung',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Google Pixel 8 Pro',
      category: 'Smartphone',
      price: 899,
      brand: 'Google',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'OnePlus 12',
      category: 'Smartphone',
      price: 799,
      brand: 'OnePlus',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
    }
  ];

  const toggleProductSelection = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
      setComparisonData(null);
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
      setComparisonData(null);
    }
  };

  const analyzeProducts = async () => {
    if (selectedProducts.length < 2) return;

    setIsAnalyzing(true);

    try {
      const prompt = `Compare these ${selectedProducts.length} products and provide a detailed analysis:

${selectedProducts.map((p, i) => `
Product ${i + 1}: ${p.name}
- Brand: ${p.brand}
- Price: $${p.price}
- Category: ${p.category}
`).join('\n')}

Please analyze these products across the following features:
1. Price/Value
2. Display Quality
3. Camera Performance
4. Battery Life
5. Processing Power
6. Build Quality
7. Software Experience
8. Storage Options

For each feature, provide:
- A score from 0-100 for each product
- Identify which product is "best", "worst", or "neutral" for that feature

Then provide 4 specific recommendations for different use cases (e.g., "Best Overall Value", "Best Camera", "Best Battery Life", "Best Performance").

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
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
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.content[0].text;
      
      // Try to parse the JSON response
      let aiResponse;
      try {
        // Remove markdown code blocks if present
        const cleanedText = aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        aiResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('Invalid JSON response from AI');
      }
      
      setComparisonData({
        table: aiResponse.features,
        recommendations: aiResponse.recommendations
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      alert('Failed to analyze products. Please check your API key and try again.');
      
      // Fallback to mock data
      const mockComparison = generateMockComparison(selectedProducts);
      setComparisonData(mockComparison);
    }

    setIsAnalyzing(false);
  };

  const generateMockComparison = (products) => {
    const features = [
      { name: 'Price', category: 'Cost' },
      { name: 'Display Quality', category: 'Screen' },
      { name: 'Camera Performance', category: 'Photography' },
      { name: 'Battery Life', category: 'Power' },
      { name: 'Processing Power', category: 'Performance' },
      { name: 'Build Quality', category: 'Design' },
      { name: 'Software Experience', category: 'Software' },
      { name: 'Storage Options', category: 'Storage' }
    ];

    const comparisonTable = features.map(feature => {
      const scores = products.map(() => Math.floor(Math.random() * 30) + 70);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      return {
        feature: feature.name,
        category: feature.category,
        scores: scores.map((score, idx) => ({
          value: score,
          status: score === maxScore ? 'best' : score === minScore && scores.length > 2 ? 'worst' : 'neutral',
          description: `${score}/100`
        }))
      };
    });

    const recommendations = [
      {
        feature: 'Best Overall Value',
        product: products[0].name,
        reason: 'Offers the best balance of features, performance, and price point for most users.'
      },
      {
        feature: 'Best Camera',
        product: products[1]?.name || products[0].name,
        reason: 'Superior camera system with advanced computational photography and versatile lens options.'
      },
      {
        feature: 'Best Battery Life',
        product: products[2]?.name || products[0].name,
        reason: 'Longest lasting battery with efficient power management and fast charging capabilities.'
      },
      {
        feature: 'Best Performance',
        product: products[0].name,
        reason: 'Most powerful processor delivering smooth multitasking and gaming performance.'
      }
    ];

    return {
      table: comparisonTable,
      recommendations: recommendations.slice(0, Math.min(4, products.length + 1))
    };
  };

  const filteredProducts = productDatabase.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      padding: '2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(255, 107, 0, 0.3);
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', animation: 'fadeIn 0.6s ease-out' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ffa500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Product Comparison
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#b0b0b0' }}>
            Select up to 4 products to compare with AI-powered insights
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(26, 26, 46, 0.6)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(255, 107, 0, 0.3)'
          }}>
            <Search size={20} style={{ color: '#888', marginRight: '1rem' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div style={{
            background: 'rgba(255, 107, 0, 0.05)',
            border: '2px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                Selected Products ({selectedProducts.length}/4)
              </h3>
              <button
                onClick={analyzeProducts}
                disabled={selectedProducts.length < 2 || isAnalyzing}
                style={{
                  background: selectedProducts.length >= 2 ? 'linear-gradient(135deg, #ff6b00, #ffa500)' : '#444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  cursor: selectedProducts.length >= 2 ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: selectedProducts.length >= 2 ? 1 : 0.5
                }}
              >
                <Sparkles size={18} />
                {isAnalyzing ? 'Analyzing...' : 'Compare with AI'}
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(selectedProducts.length, 4)}, 1fr)`,
              gap: '1rem'
            }}>
              {selectedProducts.map(product => (
                <div key={product.id} style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 107, 0, 0.2)',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => toggleProductSelection(product)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(255, 107, 0, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ff6b00'
                    }}
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.75rem'
                    }}
                  />
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                    {product.name}
                  </h4>
                  <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
                    {product.brand}
                  </p>
                  <p style={{ color: '#ff6b00', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonData && (
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            {/* Comparison Table */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.6)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Feature Comparison
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderBottom: '2px solid rgba(255, 107, 0, 0.3)',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        Feature
                      </th>
                      {selectedProducts.map(product => (
                        <th key={product.id} style={{
                          textAlign: 'center',
                          padding: '1rem',
                          borderBottom: '2px solid rgba(255, 107, 0, 0.3)',
                          fontWeight: 700,
                          fontSize: '0.95rem'
                        }}>
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.table.map((row, idx) => (
                      <tr key={idx} style={{
                        background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                      }}>
                        <td style={{
                          padding: '1rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          fontWeight: 600
                        }}>
                          <div>{row.feature}</div>
                          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                            {row.category}
                          </div>
                        </td>
                        {row.scores.map((score, scoreIdx) => (
                          <td key={scoreIdx} style={{
                            padding: '1rem',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: score.status === 'best' 
                              ? 'rgba(34, 197, 94, 0.1)' 
                              : score.status === 'worst' 
                              ? 'rgba(239, 68, 68, 0.1)' 
                              : 'transparent'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem'
                            }}>
                              {score.status === 'best' && <TrendingUp size={18} color="#22c55e" />}
                              {score.status === 'worst' && <TrendingDown size={18} color="#ef4444" />}
                              {score.status === 'neutral' && <Minus size={18} color="#888" />}
                              <span style={{
                                fontWeight: 600,
                                color: score.status === 'best' 
                                  ? '#22c55e' 
                                  : score.status === 'worst' 
                                  ? '#ef4444' 
                                  : '#fff'
                              }}>
                                {score.description}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.6)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                AI Recommendations
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {comparisonData.recommendations.map((rec, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 107, 0, 0.05)',
                    border: '1px solid rgba(255, 107, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {idx === 0 ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {rec.feature}
                      </h4>
                      <p style={{ color: '#ff6b00', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {rec.product}
                      </p>
                      <p style={{ color: '#b0b0b0', fontSize: '0.95rem', margin: 0 }}>
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="card-hover"
              onClick={() => toggleProductSelection(product)}
              style={{
                background: 'rgba(26, 26, 46, 0.6)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: selectedProducts.find(p => p.id === product.id)
                  ? '2px solid #ff6b00'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {selectedProducts.find(p => p.id === product.id) && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  zIndex: 10
                }}>
                  Selected
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#888', marginBottom: '1rem' }}>
                  {product.brand} • {product.category}
                </p>
                <p style={{ color: '#ff6b00', fontSize: '1.5rem', fontWeight: 800 }}>
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
