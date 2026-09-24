<<<<<<< HEAD
# Edge-Server
=======
# 🚀 Edge-Server

A fast, lightweight, and secure Node.js control server equipped with session-based authentication, interactive system controls, styled terminal logging, and a **Dark Green Liquid Glass** user interface.

---

## 🎨 Features

- **Dark Green Liquid Glass UI:** Modern glassmorphism CSS interface with responsive layout cards and interactive status badges.
- **Server-Side Authentication:** Protected control routes using Express sessions.
- **Dual Output Logging:** Real-time colored terminal logs with status emojis, coupled with plain-text persistence to a secure `server.log` file.
- **Control Console:** Interactive buttons to trigger server actions, save configurations, trigger system diagnostics, or initiate a server process shutdown/kill switch.

---

## 📂 Project Structure

```text
Edge-Server/
├── public/
│   ├── index.html       # Landing redirect
│   ├── login.html       # Login portal
│   ├── control.html     # Secure control panel
│   ├── style.css        # Liquid Glass CSS theme
│   └── app.js           # Client-side API handler
├── .gitignore
├── package.json
├── README.md
├── server.js            # Main server entry point
└── server.log           # Secure server log file
>>>>>>> 9c0dfba (First Push)
