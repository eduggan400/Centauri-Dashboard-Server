# 🚀 Edge-Server

A lightweight, high-performance Node.js control server equipped with real-time client IP request logging, automatic LAN hosting IP resolution, direct system action endpoints, ANSI-colored terminal output, and a **Dark Green Liquid Glass** user interface.

---

## 🎨 Features

- **Dark Green Liquid Glass UI (`index.html`):** Modern glassmorphism interface with responsive layout panels, glowing status indicators, and embedded live console output.
- **LAN Hosting & Network IP Detection:** Automatically detects the host machine's local IP address and bound port on startup to display exact network access URLs.
- **Client IP Tracking:** Every incoming HTTP request and API control action extracts and logs the user's remote IP address (`IPv4` / `IPv6`).
- **Direct System Controls:** Open control panel architecture providing direct access to server functions without authentication barriers.
- **Dual Output Logging:** Real-time colored terminal logs with status emojis, coupled with plain-text persistence to a secure `server.log` file.
- **Power Console:** Interactive controls to execute server actions, save configurations, trigger system diagnostics, or initiate a server process shutdown/kill switch.

---

## 📂 Project Structure

```text
Edge-Server/
├── public/
│   ├── index.html       # Primary Command Center portal
│   ├── control.html     # Dedicated Control Console & Dashboard
│   ├── style.css        # Liquid Glass CSS theme
│   └── app.js           # Client-side API & WebSocket handler
├── .gitignore
├── package.json
├── README.md
├── server.js            # Node.js backend entry point with LAN & IP logging
└── server.log           # Persisted server log file

```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/?utm_source=gemini) (v18+) installed on your machine.

### Installation

1. Clone or download this repository:
```bash
git clone [https://github.com/eduggan400/Edge-Server.git](https://github.com/eduggan400/Edge-Server.git)
cd Edge-Server

```


2. Install dependencies:
```bash
npm install

```



### Running the Server

Start the application:

```bash
npm start

```

---

## 📡 Terminal Output & IP Logging

When launching **Edge-Server**, the terminal logs both local and LAN network URLs, alongside real-time client activity and request IPs:

```text
[2026-09-24T15:35:00.000Z] 🚀 [SERVER STATUS] Edge-Server active on http://localhost:3000
[2026-09-24T15:35:00.005Z] 📡 [NETWORK ACCESS] LAN Access URL: [http://192.168.1.120:3000](http://192.168.1.120:3000)
[2026-09-24T15:35:12.410Z] 🌐 [ACCESS] Request GET / from IP: 192.168.1.50
[2026-09-24T15:35:18.102Z] 🔘 [BUTTON CLICK] Action 'Save Configuration' triggered by IP: 192.168.1.50
[2026-09-24T15:35:25.789Z] 🛑 [SERVER STOP] Server stop initiated by IP: 127.0.0.1

```

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js (`trust proxy` enabled for accurate IP resolution)
* **Styling:** CSS3 (Flexbox/Grid, Backdrop Filters, Custom CSS Variables)
* **Protocols:** WebSockets, REST API

---

## 📜 License

Licensed under the [MIT License](https://www.google.com/search?q=LICENSE&utm_source=gemini).

```

```