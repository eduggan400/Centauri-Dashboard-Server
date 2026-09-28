const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'server.log');

// ==========================================
// EDGE SERVER AUTH CONFIGURATION
// Set to true to require login.html -> index.html
// Set to false to bypass login and serve index.html directly
// ==========================================
const ENABLE_EDGE_AUTH = false;

// Enable trust proxy to correctly extract IP addresses if behind a reverse proxy (e.g., Docker, Nginx)
app.enable('trust proxy');

// ANSI Color Codes for Terminal Styling
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
  bold: '\x1b[1m'
};

// Logging helper function
function writeLog(type, message, color = COLORS.reset, emoji = 'ℹ️') {
  const timestamp = new Date().toISOString();
  const fileEntry = `[${timestamp}] [${type}] ${message}\n`;
  const terminalEntry = `${COLORS.dim}[${timestamp}]${COLORS.reset} ${emoji} ${color}${COLORS.bold}[${type}]${COLORS.reset} ${color}${message}${COLORS.reset}\n`;

  process.stdout.write(terminalEntry);

  fs.appendFile(LOG_FILE, fileEntry, { mode: 0o600 }, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Helper to format IPv6/IPv4 client addresses neatly
function getClientIp(req) {
  const rawIp = req.ip || req.socket.remoteAddress || 'Unknown IP';
  return rawIp.startsWith('::ffff:') ? rawIp.replace('::ffff:', '') : rawIp;
}

// Helper to find the host machine's primary local network IP
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware for Edge Auth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'edge-server-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  })
);

// Incoming connection logger middleware
app.use((req, res, next) => {
  if (!req.path.startsWith('/public') && !req.path.includes('.')) {
    const ip = getClientIp(req);
    writeLog('ACCESS', `Request ${req.method} ${req.path} from IP: ${ip}`, COLORS.cyan, '🌐');
  }
  next();
});

// Authentication Guard Middleware
function authGuard(req, res, next) {
  // If Auth is OFF, skip check
  if (!ENABLE_EDGE_AUTH) {
    return next();
  }

  // Allow unrestricted access to login page, static assets (css/js/images), and auth API routes
  if (
    req.path === '/login.html' ||
    req.path === '/api/login' ||
    req.path.startsWith('/public') ||
    req.path.includes('.')
  ) {
    return next();
  }

  // Check for active user session
  const isAuthenticated = req.session && req.session.user;
  if (isAuthenticated) {
    return next();
  }

  // Redirect to login if unauthenticated
  return res.redirect('/login.html');
}

// Apply auth guard
app.use(authGuard);

// Serve public static assets directly
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Root route handler
app.get('/', (req, res) => {
  if (!ENABLE_EDGE_AUTH) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  const isAuthenticated = req.session && req.session.user;
  if (isAuthenticated) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  return res.redirect('/login.html');
});

// Auth API - Login Endpoint
app.post('/api/login', (req, res) => {
  if (!ENABLE_EDGE_AUTH) {
    return res.json({ success: true, redirect: '/' });
  }

  const { username, password } = req.body;
  const clientIp = getClientIp(req);

  // Simple authentication check (replace with your user lookup/validation logic)
  if (username === 'admin' && password === 'password') {
    req.session.user = { username };
    writeLog('AUTH', `Successful login for ${username} from IP: ${clientIp}`, COLORS.green, '🔑');
    return res.json({ success: true, redirect: '/' });
  }

  writeLog('AUTH', `Failed login attempt for ${username} from IP: ${clientIp}`, COLORS.red, '⚠️');
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Auth API - Logout Endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, redirect: '/' });
  });
});

// Direct Action Endpoint
app.post('/api/control/action', (req, res) => {
  const { actionName } = req.body;
  const clientIp = getClientIp(req);

  if (actionName === 'EMERGENCY KILL SWITCH') {
    writeLog('KILL SWITCH', `EMERGENCY KILL TRIGGERED by IP: ${clientIp}. SHUTTING DOWN!`, COLORS.red, '💥');
    res.json({ status: 'Terminating', action: actionName, ip: clientIp });

    setTimeout(() => {
      process.exit(1);
    }, 1000);
    return;
  }

  if (actionName === 'Stop Server Process') {
    writeLog('SERVER STOP', `Server stop initiated by IP: ${clientIp}.`, COLORS.yellow, '🛑');
    res.json({ status: 'Stopping', action: actionName, ip: clientIp });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
    return;
  }

  writeLog('BUTTON CLICK', `Action '${actionName}' triggered by IP: ${clientIp}`, COLORS.yellow, '🔘');
  res.json({ status: 'Executed', action: actionName, ip: clientIp });
});

// Start Server on 0.0.0.0 to allow local network connections
const server = app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalNetworkIp();
  const activePort = server.address().port;

  writeLog('SERVER STATUS', `Edge-Server active on http://localhost:${activePort}`, COLORS.green, '🚀');
  writeLog('NETWORK ACCESS', `LAN Access URL: http://${localIp}:${activePort}`, COLORS.magenta, '📡');
  writeLog('EDGE AUTH', `Authentication status: ${ENABLE_EDGE_AUTH ? 'ENABLED' : 'DISABLED'}`, COLORS.yellow, '🔒');
});