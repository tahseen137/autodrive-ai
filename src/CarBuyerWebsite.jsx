import React, { useState, useEffect } from 'react';
import { Search, MapPin, Zap, MessageSquare, ChevronRight, Car, TrendingUp, Star, X } from 'lucide-react';
import ProductComparison from './ProductComparison';

const CarBuyerWebsite = () => {
  const [selectedTab, setSelectedTab] = useState('compare');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showChat, setShowChat] = useState(false);

  // Sample car data
  const carDatabase = [
    {
      id: 1,
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 42990,
      type: 'Electric',
      range: 358,
      horsepower: 283,
      acceleration: 5.8,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      features: ['Autopilot', 'Premium Interior', 'Glass Roof'],
      rating: 4.8
    },
    {
      id: 2,
      make: 'BMW',
      model: 'i4',
      year: 2024,
      price: 59400,
      type: 'Electric',
      range: 301,
      horsepower: 335,
      acceleration: 5.5,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      features: ['M Sport Package', 'Harman Kardon Audio', 'Heated Seats'],
      rating: 4.7
    },
    {
      id: 3,
      make: 'Ford',
      model: 'Mustang Mach-E',
      year: 2024,
      price: 46995,
      type: 'Electric',
      range: 312,
      horsepower: 346,
      acceleration: 5.2,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
      features: ['BlueCruise', 'Bang & Olufsen Sound', 'Panoramic Roof'],
      rating: 4.6
    },
    {
      id: 4,
      make: 'Porsche',
      model: 'Taycan',
      year: 2024,
      price: 90900,
      type: 'Electric',
      range: 246,
      horsepower: 402,
      acceleration: 4.0,
      image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=400&h=300&fit=crop',
      features: ['Sport Chrono', 'Adaptive Air Suspension', 'Burmester Audio'],
      rating: 4.9
    },
    {
      id: 5,
      make: 'Hyundai',
      model: 'Ioniq 5',
      year: 2024,
      price: 43975,
      type: 'Electric',
      range: 303,
      horsepower: 225,
      acceleration: 7.4,
      image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop',
      features: ['Vehicle-to-Load', 'Augmented Reality HUD', 'Relaxation Seats'],
      rating: 4.5
    },
    {
      id: 6,
      make: 'Rivian',
      model: 'R1T',
      year: 2024,
      price: 73000,
      type: 'Electric Truck',
      range: 314,
      horsepower: 533,
      acceleration: 4.5,
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop',
      features: ['Quad Motor', 'Camp Kitchen', 'Gear Tunnel'],
      rating: 4.7
    }
  ];

  const exclusiveOffers = [
    {
      id: 1,
      title: 'Early Bird Special',
      description: '$5,000 off MSRP on select 2024 models',
      validUntil: '2025-12-31',
      badge: 'Limited Time'
    },
    {
      id: 2,
      title: 'Federal Tax Credit',
      description: 'Up to $7,500 in federal incentives for eligible EVs',
      validUntil: '2025-12-31',
      badge: 'Government Incentive'
    },
    {
      id: 3,
      title: 'Zero Down Payment',
      description: '0% APR financing for 60 months on approved credit',
      validUntil: '2025-11-30',
      badge: 'Financing Deal'
    }
  ];

  const dealerLocations = [
    { name: 'Premium Auto Group Downtown', address: '123 Main St, New York, NY', distance: '2.3 miles', phone: '(555) 123-4567' },
    { name: 'Elite Motors West Side', address: '456 Broadway, New York, NY', distance: '3.8 miles', phone: '(555) 234-5678' },
    { name: 'Luxury Car Center', address: '789 Park Ave, New York, NY', distance: '4.5 miles', phone: '(555) 345-6789' }
  ];

  const toggleCarSelection = (car) => {
    if (selectedCars.find(c => c.id === car.id)) {
      setSelectedCars(selectedCars.filter(c => c.id !== car.id));
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const handleAIChat = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const carContext = `Available cars: ${carDatabase.map(car => 
        `${car.year} ${car.make} ${car.model} ($${car.price.toLocaleString()}, ${car.range}mi range, ${car.horsepower}hp)`
      ).join(', ')}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            ...chatMessages.map(msg => ({ role: msg.role, content: msg.content })),
            { 
              role: 'user', 
              content: `You are a helpful car buying assistant. Help users find the perfect car based on their needs and preferences. ${carContext}\n\nUser question: ${userMessage}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ 
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Orbitron:wght@700;900&display=swap');
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(255, 107, 0, 0.4);
        }

        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }

        .glow-border {
          position: relative;
          overflow: hidden;
        }

        .glow-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b00, #ffa500, #ff6b00);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .glow-border:hover::before {
          opacity: 1;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #ff6b00 50%, #fff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
        padding: '1.5rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        animation: 'slideInFromTop 0.6s ease-out'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Car size={36} style={{ color: '#ff6b00' }} />
            <h1 style={{ 
              fontFamily: "'Orbitron', sans-serif", 
              fontSize: '2rem', 
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(135deg, #ff6b00 0%, #ffa500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px'
            }}>
              AUTODRIVE AI
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedTab('compare')}
              style={{
                background: selectedTab === 'compare' ? 'linear-gradient(135deg, #ff6b00, #ffa500)' : 'transparent',
                color: '#fff',
                border: selectedTab === 'compare' ? 'none' : '1px solid rgba(255, 107, 0, 0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Compare
            </button>
            <button
              onClick={() => setSelectedTab('products')}
              style={{
                background: selectedTab === 'products' ? 'linear-gradient(135deg, #ff6b00, #ffa500)' : 'transparent',
                color: '#fff',
                border: selectedTab === 'products' ? 'none' : '1px solid rgba(255, 107, 0, 0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Products
            </button>
            <button
              onClick={() => setSelectedTab('offers')}
              style={{
                background: selectedTab === 'offers' ? 'linear-gradient(135deg, #ff6b00, #ffa500)' : 'transparent',
                color: '#fff',
                border: selectedTab === 'offers' ? 'none' : '1px solid rgba(255, 107, 0, 0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Offers
            </button>
            <button
              onClick={() => setSelectedTab('locations')}
              style={{
                background: selectedTab === 'locations' ? 'linear-gradient(135deg, #ff6b00, #ffa500)' : 'transparent',
                color: '#fff',
                border: selectedTab === 'locations' ? 'none' : '1px solid rgba(255, 107, 0, 0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              Locations
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* Hero Section */}
        {selectedTab === 'compare' && (
          <div style={{ marginBottom: '3rem', animation: 'fadeInScale 0.6s ease-out' }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 800, 
              marginBottom: '1rem',
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '1px'
            }} className="shimmer-text">
              Find Your Perfect Ride
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#b0b0b0', marginBottom: '2rem', fontWeight: 300 }}>
              Compare the latest electric vehicles with AI-powered insights. Select up to 3 cars to compare.
            </p>
          </div>
        )}

        {/* Compare Tab */}
        {selectedTab === 'compare' && (
          <div>
            {/* Selected Cars for Comparison */}
            {selectedCars.length > 0 && (
              <div style={{ 
                background: 'rgba(255, 107, 0, 0.05)',
                border: '2px solid rgba(255, 107, 0, 0.3)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '3rem',
                animation: 'fadeInScale 0.4s ease-out'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>
                  Comparing {selectedCars.length} {selectedCars.length === 1 ? 'Vehicle' : 'Vehicles'}
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${selectedCars.length}, 1fr)`, 
                  gap: '2rem' 
                }}>
                  {selectedCars.map(car => (
                    <div key={car.id} style={{ 
                      background: 'rgba(26, 26, 46, 0.8)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 107, 0, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                          {car.year} {car.make} {car.model}
                        </h4>
                        <button
                          onClick={() => toggleCarSelection(car)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b00',
                            cursor: 'pointer',
                            padding: '0.25rem'
                          }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div style={{ color: '#ff6b00', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                        ${car.price.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#888' }}>Range:</span>
                          <span style={{ fontWeight: 600 }}>{car.range} miles</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#888' }}>Horsepower:</span>
                          <span style={{ fontWeight: 600 }}>{car.horsepower} hp</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#888' }}>0-60 mph:</span>
                          <span style={{ fontWeight: 600 }}>{car.acceleration}s</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#888' }}>Rating:</span>
                          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={16} fill="#ff6b00" color="#ff6b00" />
                            {car.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Car Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem' 
            }}>
              {carDatabase.map((car, index) => (
                <div
                  key={car.id}
                  className="card-hover glow-border"
                  style={{
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: selectedCars.find(c => c.id === car.id) ? '2px solid #ff6b00' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s backwards`,
                    position: 'relative'
                  }}
                  onClick={() => toggleCarSelection(car)}
                >
                  {selectedCars.find(c => c.id === car.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <TrendingUp size={16} />
                      Selected
                    </div>
                  )}
                  <div style={{ 
                    height: '240px', 
                    overflow: 'hidden',
                    position: 'relative'
                  }} className="clip-diagonal">
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(to top, rgba(26, 26, 46, 0.95), transparent)'
                    }} />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                          {car.make} {car.model}
                        </h3>
                        <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>{car.year} • {car.type}</p>
                      </div>
                      <div style={{ 
                        background: 'rgba(255, 107, 0, 0.1)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Star size={16} fill="#ff6b00" color="#ff6b00" />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{car.rating}</span>
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 800, 
                      color: '#ff6b00',
                      marginBottom: '1rem',
                      fontFamily: "'Orbitron', sans-serif"
                    }}>
                      ${car.price.toLocaleString()}
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      <div>
                        <div style={{ color: '#666', marginBottom: '0.25rem' }}>Range</div>
                        <div style={{ fontWeight: 600 }}>{car.range} mi</div>
                      </div>
                      <div>
                        <div style={{ color: '#666', marginBottom: '0.25rem' }}>Power</div>
                        <div style={{ fontWeight: 600 }}>{car.horsepower} hp</div>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem',
                      marginTop: '1rem'
                    }}>
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx}
                          style={{ 
                            background: 'rgba(255, 107, 0, 0.15)',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid rgba(255, 107, 0, 0.3)'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {selectedTab === 'offers' && (
          <div style={{ animation: 'fadeInScale 0.6s ease-out' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 800, 
              marginBottom: '1rem',
              fontFamily: "'Orbitron', sans-serif"
            }} className="shimmer-text">
              Exclusive Offers
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#b0b0b0', marginBottom: '3rem', fontWeight: 300 }}>
              Limited-time deals and incentives to help you save on your next vehicle.
            </p>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {exclusiveOffers.map((offer, index) => (
                <div
                  key={offer.id}
                  className="card-hover"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(26, 26, 46, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animation: `fadeInScale 0.6s ease-out ${index * 0.15}s backwards`
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      marginBottom: '1rem'
                    }}>
                      <Zap size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      {offer.badge}
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '1.15rem', color: '#b0b0b0', marginBottom: '0.5rem' }}>
                      {offer.description}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: '#888' }}>
                      Valid until: {new Date(offer.validUntil).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform 0.3s',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Claim Offer
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {selectedTab === 'products' && (
          <ProductComparison />
        )}

        {/* Locations Tab */}
        {selectedTab === 'locations' && (
          <div style={{ animation: 'fadeInScale 0.6s ease-out' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 800, 
              marginBottom: '1rem',
              fontFamily: "'Orbitron', sans-serif"
            }} className="shimmer-text">
              Dealer Locations
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#b0b0b0', marginBottom: '3rem', fontWeight: 300 }}>
              Find authorized dealers near you for test drives and purchases.
            </p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {dealerLocations.map((location, index) => (
                <div
                  key={index}
                  className="card-hover"
                  style={{
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={32} color="#fff" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {location.name}
                      </h3>
                      <p style={{ color: '#b0b0b0', marginBottom: '0.25rem', fontSize: '1rem' }}>
                        {location.address}
                      </p>
                      <p style={{ color: '#888', fontSize: '0.95rem' }}>
                        {location.distance} away • {location.phone}
                      </p>
                    </div>
                  </div>
                  <button style={{
                    background: 'rgba(255, 107, 0, 0.2)',
                    color: '#ff6b00',
                    border: '1px solid #ff6b00',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b00, #ffa500)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)';
                    e.currentTarget.style.color = '#ff6b00';
                  }}
                  >
                    Get Directions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AI Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '70px',
          height: '70px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(255, 107, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s, box-shadow 0.3s',
          zIndex: 1000
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(255, 107, 0, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 107, 0, 0.5)';
        }}
      >
        <MessageSquare size={32} />
      </button>

      {/* AI Chat Panel */}
      {showChat && (
        <div style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: '420px',
          height: '600px',
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          animation: 'fadeInScale 0.3s ease-out'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>AI Assistant</h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                Ask me anything about cars
              </p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {chatMessages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#666', 
                marginTop: '2rem',
                fontSize: '0.95rem'
              }}>
                <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Start a conversation to get personalized car recommendations!</p>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #ff6b00, #ffa500)'
                    : 'rgba(26, 26, 46, 0.8)',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  maxWidth: '80%',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  animation: 'fadeInScale 0.3s ease-out'
                }}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(26, 26, 46, 0.8)',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                fontSize: '0.95rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00', animation: 'pulse 1.5s infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00', animation: 'pulse 1.5s infinite 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 107, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask about cars..."
                style={{
                  flex: 1,
                  background: 'rgba(26, 26, 46, 0.8)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '0.875rem 1.25rem',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: "'Outfit', sans-serif"
                }}
              />
              <button
                onClick={handleAIChat}
                disabled={isLoading || !userInput.trim()}
                style={{
                  background: 'linear-gradient(135deg, #ff6b00, #ffa500)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.875rem 1.5rem',
                  color: '#fff',
                  cursor: isLoading || !userInput.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: isLoading || !userInput.trim() ? 0.5 : 1,
                  transition: 'opacity 0.3s',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarBuyerWebsite;