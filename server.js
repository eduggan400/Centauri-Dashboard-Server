const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'server.log');

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

// Helper to format IPv6/IPv4 addresses neatly
function getClientIp(req) {
  const rawIp = req.ip || req.socket.remoteAddress || 'Unknown IP';
  return rawIp.startsWith('::ffff:') ? rawIp.replace('::ffff:', '') : rawIp;
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Incoming connection logger middleware to track access IP
app.use((req, res, next) => {
  // Ignore noise from static asset requests
  if (!req.path.startsWith('/public') && !req.path.includes('.')) {
    const ip = getClientIp(req);
    writeLog('ACCESS', `Request ${req.method} ${req.path} from IP: ${ip}`, COLORS.cyan, '🌐');
  }
  next();
});

// Serve public static assets directly
app.use(express.static(path.join(__dirname, 'public'), { index: 'control.html' }));

// Root route direct serve
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
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

// Start Server
app.listen(PORT, () => {
  writeLog('SERVER STATUS', `Edge-Server active on http://localhost:${PORT}`, COLORS.green, '🚀');
});