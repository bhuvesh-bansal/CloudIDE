# 🤖 AI Website Generator

An advanced AI-powered website generator with learning capabilities, intelligent suggestions, and real-time data integration.

## 🚀 Quick Start

### Automatic Startup (Recommended)
```bash
# Start the AI server automatically
npm start

# Or use the AI-specific command
npm run ai
```

### Manual Startup
```bash
# Start the server directly
npm run server

# Development mode with auto-restart
npm run dev
```

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone or download the project**
2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the AI server:**
   ```bash
   npm start
   ```

## 🎯 Features

### 🤖 AI Learning System
- **Adaptive Learning**: Learns from every website generation
- **Pattern Recognition**: Identifies successful layouts and content
- **Personalized Suggestions**: Provides tailored recommendations
- **Industry Insights**: Analyzes trends across different business types

### 💡 Intelligent Suggestions
- **Industry-Specific**: Tailored advice for each business type
- **Intent-Based**: Different recommendations for portfolios, ecommerce, blogs
- **Context-Aware**: Suggestions based on prompt analysis
- **Real-Time Learning**: Improves suggestions over time

### 🌐 Real-Time Data Integration
- **Live News**: Fetches industry-relevant news
- **Trending Topics**: Gets current trending information
- **Market Insights**: Provides market data and analysis
- **Dynamic Content**: Updates content based on real data

## 🔌 API Endpoints

### Generate Website
```bash
POST /api/generate
Content-Type: application/json

{
  "prompt": "create a tech startup website for AI solutions",
  "userId": "user123"
}
```

### Get Industry Insights
```bash
GET /api/insights/:industry
# Example: /api/insights/technology
```

### Get Intelligent Suggestions
```bash
GET /api/suggestions/:prompt
# Example: /api/suggestions/create%20a%20photography%20portfolio
```

### Get Learning Statistics
```bash
GET /api/learning-stats
```

### Health Check
```bash
GET /health
```

## 🎨 Supported Industries

- **Technology**: AI, software, digital solutions
- **Photography**: Portfolios, creative work
- **Fashion**: E-commerce, style, beauty
- **Food**: Restaurants, delivery, culinary
- **Travel**: Blogs, tourism, adventures
- **Fitness**: Health, wellness, training
- **Real Estate**: Property, housing
- **Legal**: Law firms, legal services
- **Automotive**: Cars, auto services
- **Pet**: Grooming, pet services
- **Beauty**: Spa, cosmetics, wellness

## 🏗️ Layout Types

- **Portfolio**: Showcase work and projects
- **E-commerce**: Online shopping experience
- **Creative**: Artistic and design-focused
- **Business**: Professional corporate sites
- **Blog**: Content and storytelling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
```

### Port Configuration
The server runs on port 3000 by default. You can change this by:
1. Setting the `PORT` environment variable
2. Modifying the port in `server-simple.js`

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Learning Statistics
```bash
curl http://localhost:3000/api/learning-stats
```

## 🛑 Stopping the Server

- **Ctrl+C**: Graceful shutdown
- **Process Management**: The server handles SIGINT and SIGTERM signals

## 🔄 Development

### Auto-Restart (Development)
```bash
npm run dev
```

### Manual Restart
```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

## 📝 Logs

The server provides detailed logging:
- **INFO**: General information and successful operations
- **WARN**: Non-critical issues (API failures, fallbacks)
- **ERROR**: Critical errors and failures

## 🚀 Deployment

### Production
```bash
# Set environment
export NODE_ENV=production

# Start server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Sharing the Project

When sharing this project with others:

1. **Include the README.md** file
2. **Share the entire backend folder**
3. **Provide these startup instructions:**
   ```bash
   cd backend
   npm install
   npm start
   ```

## 🎉 Success Indicators

When the AI server is running successfully, you'll see:
```
🎉 Enhanced AI Server running on port 3000
🔗 Health check: http://localhost:3000/health
🤖 AI Generator: http://localhost:3000/api/generate
✨ Your enhanced AI system is ready!
```

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed
3. Ensure port 3000 is available
4. Check the health endpoint: `http://localhost:3000/health`

---

**Made with ❤️ by the AI Website Generator Team**
