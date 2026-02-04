# 🚗 AutoDrive AI

> An intelligent electric vehicle comparison platform powered by Claude AI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-orange.svg)](https://anthropic.com/)

![AutoDrive AI](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop)

## 🎯 Overview

AutoDrive AI is a next-generation car buying platform that combines modern web design with AI-powered assistance. Compare electric vehicles, discover exclusive offers, and get personalized recommendations through an intelligent chat assistant powered by Anthropic's Claude.

**[Live Demo](#) | [Report Bug](https://github.com/tahseen137/autodrive-ai/issues) | [Request Feature](https://github.com/tahseen137/autodrive-ai/issues)**

## ✨ Features

### 🔄 Multi-Vehicle Comparison
- **Side-by-Side Analysis**: Compare up to 3 vehicles simultaneously
- **Detailed Specs**: Price, range, horsepower, acceleration, ratings
- **Smart Selection**: Visual feedback with highlighted cards
- **Responsive Design**: Adapts seamlessly to any screen size

### 🤖 AI-Powered Assistant
- **Claude Integration**: Conversational AI using Anthropic's Claude API
- **Natural Language**: Ask questions in plain English
- **Context-Aware**: Understands your preferences and budget
- **Real-Time Responses**: Instant, personalized vehicle recommendations

### 💰 Exclusive Offers & Dealer Locations
- **Limited-Time Deals**: Current promotions and federal tax credits
- **Location Finder**: Browse authorized dealers near you
- **Direct Contact**: Phone numbers, addresses, and navigation

## 🛠️ Tech Stack

- **React 18** - Modern component-based architecture
- **Claude AI** - Anthropic's language model for intelligent chat
- **Lucide React** - Beautiful, consistent icon system
- **Custom CSS** - Premium animations and glassmorphic design

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tahseen137/autodrive-ai.git
cd autodrive-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in root directory
echo "REACT_APP_ANTHROPIC_API_KEY=your_api_key_here" > .env
```

4. **Start development server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## 📁 Project Structure

```
autodrive-ai/
├── src/
│   ├── index.js                  # Application entry point
│   └── CarBuyerWebsite.jsx       # Main React component
├── public/
│   └── index.html                # HTML template
├── .env                          # Environment variables (create this)
├── package.json                  # Dependencies & scripts
└── README.md                     # You are here
```

## 🎨 Design Philosophy

AutoDrive AI embraces a **premium automotive aesthetic** with:

- **Bold Color Palette**: Deep space blacks with vibrant orange gradients
- **Typography**: Orbitron (display) + Outfit (body) for modern, futuristic feel
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Motion Design**: Smooth transitions and staggered animations
- **Premium Materials**: Gradient overlays, glow effects, and dynamic shadows

## 🖼️ Screenshots

### Vehicle Comparison
![Comparison View](#)
*Compare electric vehicles side-by-side with detailed specifications*

### AI Chat Assistant
![AI Chat](#)
*Get personalized recommendations from Claude AI*

### Exclusive Offers
![Offers Page](#)
*Browse limited-time deals and federal incentives*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and component patterns
- Maintain design system consistency
- Test across Chrome, Firefox, and Safari
- Ensure responsive behavior on mobile devices
- Document new features in code comments

## 🔮 Roadmap

- [ ] Advanced filtering (price range, features, sliders)
- [ ] User accounts with saved comparisons
- [ ] Real-time dealer inventory integration
- [ ] Financing calculator with APR estimates
- [ ] Trade-in value estimator
- [ ] Virtual test drives with 360° views
- [ ] Mobile app (React Native)
- [ ] AR preview for vehicle visualization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** - Claude AI API
- **Lucide** - Icon system
- **Unsplash** - Vehicle imagery
- **Google Fonts** - Orbitron & Outfit typography

## 📞 Contact

**Tahseen** - [@tahseen137](https://github.com/tahseen137)

Project Link: [https://github.com/tahseen137/autodrive-ai](https://github.com/tahseen137/autodrive-ai)

---

**Built with ⚡ by Tahseen** • *Powered by React & Claude AI*
