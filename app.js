#!/usr/bin/env node

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Global variables
let aiServer = null;
let aiServerReady = false;

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
    console.error('❌ Error: backend directory not found!');
    process.exit(1);
}

// Function to check if AI server is running
function checkAIServerHealth() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3000/health', (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// Function to start AI server
async function startAIServer() {
    console.log('🚀 Starting AI Website Generator Server...');
    
    return new Promise((resolve, reject) => {
        const server = spawn('node', ['server-simple.js'], {
            cwd: backendPath,
            stdio: 'pipe'
        });

        let serverStarted = false;

        server.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            
            if (output.includes('Enhanced AI Server running on port 3000') && !serverStarted) {
                serverStarted = true;
                aiServerReady = true;
                console.log('✅ AI Server is ready!');
                resolve(server);
            }
        });

        server.stderr.on('data', (data) => {
            const error = data.toString();
            if (!error.includes('EADDRINUSE')) {
                console.error('Server Error:', error);
            }
        });

        server.on('error', (error) => {
            console.error('❌ Failed to start AI server:', error.message);
            reject(error);
        });

        server.on('close', (code) => {
            if (code !== 0 && !serverStarted) {
                console.error(`❌ AI server exited with code ${code}`);
                reject(new Error(`Server exited with code ${code}`));
            }
        });

        setTimeout(() => {
            if (!serverStarted) {
                server.kill();
                reject(new Error('Server startup timeout'));
            }
        }, 30000);
    });
}

// Initialize AI server
async function initializeAIServer() {
    try {
        const isRunning = await checkAIServerHealth();
        if (isRunning) {
            console.log('✅ AI Server is already running');
            aiServerReady = true;
            return;
        }

        aiServer = await startAIServer();
        console.log('🎉 AI Server started successfully!');
    } catch (error) {
        console.error('❌ Failed to start AI server:', error.message);
        console.log('⚠️  App will continue but AI features may not work');
    }
}

// Routes
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 AI Website Generator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            font-weight: 700;
        }
        .status {
            text-align: center;
            margin-bottom: 30px;
            padding: 15px;
            border-radius: 10px;
            font-weight: 500;
        }
        .status.ready {
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .status.loading {
            background: rgba(251, 191, 36, 0.2);
            border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        textarea {
            width: 100%;
            height: 120px;
            padding: 15px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            resize: vertical;
        }
        textarea::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        button {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: none;
        }
        .loading {
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .examples {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        .examples h3 {
            margin-bottom: 15px;
        }
        .example {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .example:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Website Generator</h1>
        
        <div id="status" class="status loading">
            <div class="spinner"></div>
            <div>Initializing AI Server...</div>
        </div>
        
        <form id="generateForm">
            <div class="form-group">
                <label for="prompt">Describe your website:</label>
                <textarea 
                    id="prompt" 
                    placeholder="Example: Create a tech startup website for AI solutions with modern design and contact form"
                    required
                ></textarea>
            </div>
            
            <button type="submit" id="generateBtn" disabled>
                🚀 Generate Website
            </button>
        </form>
        
        <div id="result" class="result">
            <h3>🎉 Your Website is Ready!</h3>
            <div id="websiteContent"></div>
        </div>
        
        <div class="examples">
            <h3>💡 Try these examples:</h3>
            <div class="example" onclick="setExample('Create a photography portfolio website with gallery and contact form')">
                📸 Photography Portfolio
            </div>
            <div class="example" onclick="setExample('Create a fashion e-commerce website with product showcase and shopping cart')">
                👗 Fashion E-commerce
            </div>
            <div class="example" onclick="setExample('Create a tech startup website for AI solutions with modern design')">
                🚀 Tech Startup
            </div>
            <div class="example" onclick="setExample('Create a restaurant website with menu, location, and online ordering')">
                🍽️ Restaurant Website
            </div>
        </div>
    </div>

    <script>
        let aiServerReady = false;
        
        // Check AI server status
        async function checkAIServer() {
            try {
                const response = await fetch('http://localhost:3000/health');
                if (response.ok) {
                    aiServerReady = true;
                    updateStatus('ready', '✅ AI Server Ready!');
                    document.getElementById('generateBtn').disabled = false;
                } else {
                    updateStatus('loading', '⏳ Waiting for AI Server...');
                    setTimeout(checkAIServer, 2000);
                }
            } catch (error) {
                updateStatus('loading', '⏳ Starting AI Server...');
                setTimeout(checkAIServer, 2000);
            }
        }
        
        function updateStatus(type, message) {
            const status = document.getElementById('status');
            status.className = \`status \${type}\`;
            status.innerHTML = message;
        }
        
        function setExample(text) {
            document.getElementById('prompt').value = text;
        }
        
        // Handle form submission
        document.getElementById('generateForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const prompt = document.getElementById('prompt').value;
            const btn = document.getElementById('generateBtn');
            const result = document.getElementById('result');
            
            btn.disabled = true;
            btn.textContent = '🔄 Generating...';
            result.style.display = 'none';
            
            try {
                const response = await fetch('http://localhost:3000/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('websiteContent').innerHTML = data.html;
                    result.style.display = 'block';
                    
                    // Show AI insights if available
                    if (data.aiInsights && data.aiInsights.suggestions) {
                        const insights = document.createElement('div');
                        insights.innerHTML = '<h4>💡 AI Suggestions:</h4><ul>' + 
                            data.aiInsights.suggestions.map(s => '<li>' + s + '</li>').join('') + 
                            '</ul>';
                        result.appendChild(insights);
                    }
                } else {
                    throw new Error('Failed to generate website');
                }
            } catch (error) {
                alert('❌ Error generating website. Please try again.');
                console.error('Error:', error);
            } finally {
                btn.disabled = false;
                btn.textContent = '🚀 Generate Website';
            }
        });
        
        // Start checking AI server
        checkAIServer();
    </script>
</body>
</html>
    `);
});

// Proxy API calls to AI server
app.post('/api/generate', async (req, res) => {
    if (!aiServerReady) {
        return res.status(503).json({ error: 'AI Server not ready' });
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate website' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        aiServerReady,
        timestamp: new Date().toISOString()
    });
});

// Start the app
async function startApp() {
    console.log('🤖 AI Website Generator - App Starting...');
    console.log('==========================================');
    
    // Initialize AI server
    await initializeAIServer();
    
    // Start web server
    app.listen(PORT, () => {
        console.log('');
        console.log('🎉 AI Website Generator App is running!');
        console.log('🌐 Open your browser and go to: http://localhost:8080');
        console.log('');
        console.log('📋 Features:');
        console.log('   • Web interface for easy website generation');
        console.log('   • AI-powered content and layout selection');
        console.log('   • Real-time data integration');
        console.log('   • Intelligent suggestions and insights');
        console.log('');
        console.log('📝 Press Ctrl+C to stop the app');
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down AI Website Generator...');
    if (aiServer) {
        aiServer.kill('SIGINT');
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down AI Website Generator...');
    if (aiServer) {
        aiServer.kill('SIGTERM');
    }
    process.exit(0);
});

// Start the app
startApp().catch(error => {
    console.error('❌ Failed to start app:', error);
    process.exit(1);
});
