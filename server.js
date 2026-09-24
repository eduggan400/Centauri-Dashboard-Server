const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'server.log');

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

// Logging helper
function writeLog(type, message, color = COLORS.reset, emoji = 'ℹ️') {
  const timestamp = new Date().toISOString();
  const fileEntry = `[${timestamp}] [${type}] ${message}\n`;
  const terminalEntry = `${COLORS.dim}[${timestamp}]${COLORS.reset} ${emoji} ${color}${COLORS.bold}[${type}]${COLORS.reset} ${color}${message}${COLORS.reset}\n`;

  process.stdout.write(terminalEntry);

  fs.appendFile(LOG_FILE, fileEntry, { mode: 0o600 }, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: 'super-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 3600000 }
}));

// Connection / Disconnection Logger
app.use((req, res, next) => {
  const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const username = req.session.user ? req.session.user : 'Anonymous';

  if (!req.session.connected) {
    req.session.connected = true;
    writeLog('CONNECT', `User connected | IP: ${userIp} | Session User: ${username}`, COLORS.cyan, '🔌');
  }

  res.on('finish', () => {
    if (req.path === '/logout' && req.method === 'POST') {
      writeLog('DISCONNECT', `User logged out | User: ${username}`, COLORS.yellow, '👋');
    }
  });

  next();
});

// Serve public static assets
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

// Redirect root (/) to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Auth Middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'secret123') {
    req.session.authenticated = true;
    req.session.user = username;
    writeLog('AUTH SUCCESS', `User '${username}' logged in successfully.`, COLORS.green, '🔓');
    return res.json({ success: true, redirect: '/control.html' });
  }

  writeLog('AUTH FAILURE', `Failed login attempt for user '${username}'.`, COLORS.red, '🚨');
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Secure Control Page Route
app.get('/control.html', (req, res, next) => {
  if (!req.session || !req.session.authenticated) {
    writeLog('UNAUTHORIZED', `Attempted access to /control.html without session.`, COLORS.red, '⛔');
    return res.redirect('/login.html');
  }
  writeLog('PAGE ACCESS', `User '${req.session.user}' accessed Control Page.`, COLORS.magenta, '👁️');
  next();
});

// Secure Action Endpoint
app.post('/api/control/action', requireAuth, (req, res) => {
  const { actionName } = req.body;
  const username = req.session.user;

  if (actionName === 'EMERGENCY KILL SWITCH') {
    writeLog('KILL SWITCH', `EMERGENCY KILL TRIGGERED BY '${username}'. SHUTTING DOWN!`, COLORS.red, '💥');
    res.json({ status: 'Terminating', action: actionName });

    // Shut down process after short delay
    setTimeout(() => {
      process.exit(1);
    }, 1000);
    return;
  }

  if (actionName === 'Stop Server Process') {
    writeLog('SERVER STOP', `Server stop initiated by '${username}'.`, COLORS.yellow, '🛑');
    res.json({ status: 'Stopping', action: actionName });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
    return;
  }

  writeLog('BUTTON CLICK', `User '${username}' triggered action: '${actionName}'`, COLORS.yellow, '🔘');
  res.json({ status: 'Executed', action: actionName });
});

// Start Server
app.listen(PORT, () => {
  writeLog('SERVER STATUS', `Edge-Server active on http://localhost:${PORT}`, COLORS.green, '🚀');
});