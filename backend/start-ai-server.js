#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting AI Website Generator Server...\n');

// Check if server file exists
const serverPath = path.join(__dirname, 'server-simple.js');
if (!fs.existsSync(serverPath)) {
    console.error('❌ Error: server-simple.js not found!');
    process.exit(1);
}

// Check if port 3000 is available
const net = require('net');
const testPort = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close();
            resolve(true);
        });
        server.on('error', () => {
            resolve(false);
        });
    });
};

// Start the server with port checking
async function startServer() {
    const portAvailable = await testPort(3000);
    if (!portAvailable) {
        console.log('⚠️  Port 3000 is in use. Attempting to kill existing process...');
        try {
            const { exec } = require('child_process');
            exec('lsof -ti:3000 | xargs kill -9', (error) => {
                if (error) {
                    console.log('⚠️  Could not kill existing process, but continuing...');
                }
            });
            // Wait a moment for the port to be freed
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.log('⚠️  Port cleanup failed, but continuing...');
        }
    }

    console.log('🚀 Launching AI server...');
    
    // Start the server
    const server = spawn('node', [serverPath], {
        stdio: 'inherit',
        cwd: __dirname,
        env: { ...process.env, PORT: '3000' }
    });

    // Handle server events
    server.on('error', (error) => {
        console.error('❌ Failed to start AI server:', error.message);
        process.exit(1);
    });

    server.on('close', (code) => {
        if (code !== 0) {
            console.error(`❌ AI server exited with code ${code}`);
            process.exit(code);
        }
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down AI server...');
        server.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down AI server...');
        server.kill('SIGTERM');
    });

    console.log('✅ AI server startup script ready!');
    console.log('📝 Use Ctrl+C to stop the server\n');
}

startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
