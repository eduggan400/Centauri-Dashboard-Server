# 🚀 Edge-Server Control Console

An authentication-enabled control console built with Node.js and Express. It features a dark-mode, glassmorphism UI styled with the **Orbitron** typography theme, unified under a single shared CSS file.

---

## 📸 Features

* **Glassmorphism UI:** Built with dark theme styling, Orbitron typography, dynamic blur effects, and status indicators.
* **Unified Styling:** Uses a single shared stylesheet (`/public/style.css`) across both authentication and dashboard interfaces.
* **Session-Based Authentication:** Protects server controls via Express sessions with configurable `ENABLE_EDGE_AUTH` enforcement.
* **Network & Access Logging:** Logs incoming requests, local LAN IP addresses, and authentication attempts to both stdout (with ANSI colors) and `server.log`.
* **Direct Action Endpoints:** Interactive console buttons for server management, diagnostic reports, and process control (including grace stops and kill switch execution).

---

## 📁 Project Structure

```text
Edge-Server/
├── server.js          # Express app entry point & route management
├── server.log         # Automatically generated server activity log
├── package.json       # Dependencies and scripts
└── public/            # Static asset directory
    ├── index.html     # Main Control Console
    ├── login.html     # Authentication Interface
    ├── style.css      # Shared Orbitron Glassmorphism CSS
    └── app.js         # Frontend console logic
```

---

## 🛠️ Installation & Setup

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/eduggan400/Edge-Server.git
   cd Edge-Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   # or
   node server.js
   ```

4. **Access the Console:**
   * **Local:** `http://localhost:3000`
   * **LAN Access:** Use the network URL provided in the console log startup banner (e.g., `http://192.168.x.x:3000`).

---

## 🔐 Credentials & Config

* **Default Admin Username:** `admin`
* **Default Admin Password:** `password`

### Toggling Authentication

In `server.js`, you can bypass the login screen during local testing by setting:

```javascript
const ENABLE_EDGE_AUTH = false;
```

Set back to `true` to re-enable session-based route protection.

---

## ⚡ API Reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/login` | Authenticates username/password and establishes session |
| `POST` | `/api/logout` | Destroys current session and redirects to login |
| `POST` | `/api/control/action` | Triggers direct server commands (`Save Config`, `Purge Cache`, `Stop Server Process`, `EMERGENCY KILL SWITCH`) |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
