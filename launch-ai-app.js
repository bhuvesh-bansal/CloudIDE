#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('🤖 AI Website Generator - App Launcher');
console.log('=======================================');
console.log('');

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
    console.error('❌ Error: backend directory not found!');
    console.error('Please run this script from the project root directory');
    process.exit(1);
}

// Check if server file exists
const serverPath = path.join(backendPath, 'server-simple.js');
if (!fs.existsSync(serverPath)) {
    console.error('❌ Error: server-simple.js not found in backend directory!');
    process.exit(1);
}

// Function to check if server is running
function checkServerHealth() {
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

// Function to start the AI server
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
            
            // Check if server is ready
            if (output.includes('Enhanced AI Server running on port 3000') && !serverStarted) {
                serverStarted = true;
                console.log('\n✅ AI Server is ready!');
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

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!serverStarted) {
                server.kill();
                reject(new Error('Server startup timeout'));
            }
        }, 30000);
    });
}

// Main app launcher
async function launchApp() {
    try {
        // Check if server is already running
        const isRunning = await checkServerHealth();
        if (isRunning) {
            console.log('✅ AI Server is already running on port 3000');
            console.log('🌐 Access your AI Website Generator at: http://localhost:3000');
            console.log('');
            console.log('📋 Available endpoints:');
            console.log('   • Generate website: POST http://localhost:3000/api/generate');
            console.log('   • Health check: GET http://localhost:3000/health');
            console.log('   • Learning stats: GET http://localhost:3000/api/learning-stats');
            console.log('');
            console.log('📝 Press Ctrl+C to stop the server');
            return;
        }

        // Start the server
        const server = await startAIServer();
        
        console.log('\n🎉 AI Website Generator is now running!');
        console.log('🌐 Access your AI Website Generator at: http://localhost:3000');
        console.log('');
        console.log('📋 Available endpoints:');
        console.log('   • Generate website: POST http://localhost:3000/api/generate');
        console.log('   • Health check: GET http://localhost:3000/health');
        console.log('   • Learning stats: GET http://localhost:3000/api/learning-stats');
        console.log('');
        console.log('📝 Press Ctrl+C to stop the server');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down AI Website Generator...');
            server.kill('SIGINT');
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Shutting down AI Website Generator...');
            server.kill('SIGTERM');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Failed to launch AI Website Generator:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Make sure Node.js is installed');
        console.log('   2. Check if port 3000 is available');
        console.log('   3. Verify all files are present in the backend directory');
        console.log('   4. Try running: cd backend && npm install && npm start');
        process.exit(1);
    }
}

// Start the app
launchApp();
