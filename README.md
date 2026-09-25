# 🚀 Edge-Server & Centauri Carbon Printer Dashboard

A unified, lightweight Node.js control server and interactive printer management system for **Centauri Carbon 1 (CC1)** and **Centauri Carbon 2 (CC2)** 3D printers. 

Built with Express, real-time colored logging with automatic LAN hosting detection, client IP request tracking, direct system action endpoints, and an ultra-clean **Dark Green Liquid Glass** interface.

---

## 🎨 Features

### 🖨️ Printer Dashboard & Controls
- **Dual Printer Support:** View live camera feeds, print progress, layer height, time estimates, and real-time temperatures for **CC1**, **CC2**, or **Both** simultaneously.
- **Hardware Telemetry Controls:** Adjust or lock temperatures and fans, control lights, and pause/stop/resume prints.
- **Local Print Replay:** Automated HTTP MJPEG local camera recording (up to 6 FPS) via Docker with built-in playback, seeking, and floating replay controls.
- **Appearance Themes:** Live theme switching (including standard glassmorphism and custom themes) that persists across same-origin tabs.

### 🛡️ Edge-Server Core & Controls
- **Liquid Glass Command Center (`index.html`):** Modern glassmorphism portal featuring live system status badges, quick navigation links, power management controls, and embedded console output.
- **LAN Hosting & Network IP Resolution:** Automatically detects the host machine's local network IP address and bound port on startup to display exact LAN access URLs.
- **Client IP Address Tracking:** Real-time request logging identifying incoming client IP addresses (`IPv4` / `IPv6`) for all navigation requests and API actions.
- **Direct System Controls:** Open control panel architecture without authentication barriers for rapid local network access.
- **Dual Terminal & File Logging:** Colored real-time terminal output with status emojis, paired with clean log persistence in `server.log`.
- **Power Management:** System diagnostics, config saving, process stopping, or emergency kill switch directly from the web interface.

---

## 📂 Project Structure

```text
Edge-Server/
├── public/
│   ├── index.html       # Primary Command Center portal
│   ├── control.html     # Dedicated Printer Console & Telemetry Dashboard
│   ├── style.css        # Liquid Glass CSS theme
│   └── app.js           # Client-side API & WebSocket handler
├── vendor/              # Third-party client dependencies (MQTT.js)
├── tests/               # Protocol & integration tests
├── .gitignore
├── docker-compose.yml   # Docker deployment & UDP discovery service
├── package.json
├── README.md
├── server.js            # Express server entry point with LAN & IP tracking
└── server.log           # Persisted server log file

```

---

## ⚡ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/?utm_source=gemini) (v18+)
* [Docker](https://www.docker.com/?utm_source=gemini) & Docker Compose (Optional, required for CC1 UDP discovery and local print replay)

---

### Local Installation

1. Clone or download this repository:
```bash
git clone [https://github.com/eduggan400/Edge-Server.git](https://github.com/eduggan400/Edge-Server.git)
cd Edge-Server

```


2. Install dependencies:
```bash
npm install

```


3. Run the server:
```bash
npm start

```



---

## 📡 Terminal Output & IP Logging

When starting **Edge-Server**, the console displays the exact local and network addresses for access, alongside real-time client request tracking:

```text
[2026-09-24T15:35:00.000Z] 🚀 [SERVER STATUS] Edge-Server active on http://localhost:3000
[2026-09-24T15:35:00.005Z] 📡 [NETWORK ACCESS] LAN Access URL: [http://192.168.1.120:3000](http://192.168.1.120:3000)
[2026-09-24T15:35:12.410Z] 🌐 [ACCESS] Request GET / from IP: 192.168.1.50
[2026-09-24T15:35:18.102Z] 🔘 [BUTTON CLICK] Action 'Save Configuration' triggered by IP: 192.168.1.50

```

---

### Docker Setup (Recommended for Full Printer Replay)

1. Open a terminal in the project directory and launch the container stack:
```bash
docker compose up -d

```


2. Access the containerized instance at:
```text
http://localhost:8080

```


*(Docker also provides automatic CC1 serial-number discovery over UDP port 3000. On SELinux hosts, append `:z` to volume mounts in `docker-compose.yml` if needed).*
3. To stop the Docker services:
```bash
docker compose down

```



---

## ⚙️ Printer Configuration & Usage

1. Open the dashboard and navigate to **Settings**.
2. Select your printer model and input its LAN IP address (without port or HTTP scheme):
* **CC1:** Leave **Serial Number** blank for automatic UDP discovery, or enter it manually if auto-detect fails.
* **CC2:** Enable **LAN Only** mode on the physical printer, then enter its serial number and LAN access code. *(Firmware must support MQTT over WebSocket on port **9001**)*.


3. Select **Save** to apply settings.

> **Note:** Keep your browser and printers on the same local subnet. Use HTTP when hosting locally to avoid HTTPS mixed-content blocks against local camera streams.

---

## 🧪 Testing & Development

Run printer communication protocol checks without contacting actual hardware:

```bash
node --test tests/protocol.test.cjs

```

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js (`trust proxy` enabled for accurate IP resolution)
* **Frontend:** Vanilla HTML5, CSS3 (Custom Glassmorphism, CSS Variables), JavaScript (ES6+)
* **Protocols:** WebSockets, MQTT.js, UDP Discovery, HTTP MJPEG Video Streaming
* **Containerization:** Docker & Docker Compose

---

## 📜 Credits & License

* **Edge Server & Dashboard Developer:** Created by A.J. Richardson & Ethan Duggan.
* **License:** Licensed under the [MIT License](https://www.google.com/search?q=LICENSE&utm_source=gemini).
* **CC2 Protocol References:** Built with reference to the [Elegoo SDK](https://github.com/elegooofficial/elegoo-link/tree/main/src/lan/adapters/elegoo_fdm_cc2?utm_source=gemini) and [pycentauri documentation](https://github.com/bjan/pycentauri/blob/main/docs/PROTOCOL.md?utm_source=gemini#centauri-carbon-2-cc2-protocol-notes).
* **Bundled Assets:** Includes [MQTT.js](https://github.com/mqttjs/MQTT.js?utm_source=gemini) (MIT License).

---

## ⚠️ Disclaimer

*This project was developed through a combination of human-written code and AI-assisted development.*

```

```