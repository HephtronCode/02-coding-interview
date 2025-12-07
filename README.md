# Nexus Coding Interview Platform

A real-time collaborative coding platform for technical interviews, built with React, Node.js, and Socket.IO.

## 🌟 Overview

Nexus is a full-stack application that enables real-time collaborative coding sessions between interviewers and candidates. The platform allows multiple users to join virtual "rooms" where they can simultaneously edit code and see each other's changes in real-time.

## 🏗️ Architecture

The application follows a client-server architecture:

- **Frontend (Client)**: React application with real-time capabilities
- **Backend (Server)**: Node.js/Express server with Socket.IO for real-time communication
- **Communication**: WebSocket connections for instant synchronization

### Tech Stack

**Frontend:**

- React 19.2 - Modern UI framework
- Vite 7.2 - Fast build tool and dev server
- TailwindCSS 4.1 - Utility-first CSS with custom Nexus theme
- Socket.IO Client 4.8 - Real-time WebSocket communication
- Monaco Editor 4.7 - VS Code-powered code editor with syntax highlighting
- Pyodide 0.25 - Python runtime in WebAssembly for in-browser execution
- ESLint - Code quality and linting

**Backend:**

- Node.js with Express 5.2
- Socket.IO 4.8 - WebSocket server for real-time events
- CORS 2.8 - Cross-origin resource sharing
- dotenv 17.2 - Environment variable management
- Static file serving for production deployment

**DevOps & Deployment:**

- Docker - Multi-stage containerization
- Dockerfile with optimized build process
- .dockerignore for efficient builds

**Testing:**

- Mocha - Test framework
- Chai - Assertion library
- Socket.IO Client - For integration testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm package manager

### Installation

1. **Install dependencies for both client and server:**

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

2. **Set up environment variables:**

Create a `.env` file in the `server` directory:

```env
PORT=3000
```

### Running the Application

**Option 1: Run both client and server concurrently (recommended):**

```bash
# From the root directory
pnpm install
pnpm run dev
```

**Option 2: Run separately:**

1. **Start the server:**

```bash
# From the server directory
cd server
pnpm run dev
```

2. **Start the client:**

```bash
# From the client directory
cd client
pnpm run dev
```

3. **Access the application:**

Open your browser and navigate to `http://localhost:5173` (default Vite port)

## 🧪 Testing

Run the integration tests to verify the real-time functionality:

```bash
# From the server directory
cd server
pnpm test
```

## 🚢 Deployment

### Production Build

**Build the client for production:**

```bash
cd client
pnpm run build
```

The built files will be in `client/dist/`.

**Run in production mode:**

The server is configured to serve the built React frontend from `client/dist/` in production:

```bash
cd server
PORT=3000 node server.js
```

### Docker Deployment

The project includes a multi-stage Dockerfile for containerized deployment:

**Build the Docker image:**

```bash
docker build -t nexus-interview-platform .
```

**Run the container:**

```bash
docker run -p 3000:3000 nexus-interview-platform
```

The Dockerfile:

- Stage 1: Builds the React frontend with Vite
- Stage 2: Sets up Node.js backend with production dependencies
- Copies built frontend into backend structure
- Exposes port 3000
- Base image: `node:20-alpine` (lightweight)

**Environment variables:**

```bash
# With custom port
docker run -p 8080:8080 -e PORT=8080 nexus-interview-platform
```

## 📁 Project Structure

```
02-coding-interview/
├── client/                          # React frontend (Vite + React 19)
│   ├── src/
│   │   ├── App.jsx                  # Main component with Socket.IO & Pyodide
│   │   ├── CodeEditor.jsx           # Monaco Editor wrapper with custom theme
│   │   ├── App.css                  # TailwindCSS theme (Nexus color palette)
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template (loads Pyodide CDN)
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Node.js/Express backend
│   ├── server.js                    # Socket.IO server with room logic
│   ├── test/
│   │   │   └── integration.test.js      # Mocha tests for real-time sync
│   └── package.json                 # Backend dependencies
│
├── Dockerfile                       # Multi-stage Docker build configuration
├── .dockerignore                    # Docker build exclusions
├── package.json                     # Root package for concurrent dev workflow
└── .gitignore                       # Git ignore rules
```

## 🔧 How It Works

### Connection Flow

1. **Client Initialization**: React app establishes Socket.IO connection to `http://localhost:3000`
2. **Auto Room Join**: On connection, client automatically emits `join-room` event with room ID
3. **Status Updates**: Connection/disconnection events update the UI status indicator

### Real-time Synchronization

1. **User Types**: `onChange` handler triggers in the React textarea component
2. **Local Update**: Code state updates immediately for the typing user
3. **Broadcast**: Client emits `code-change` event with `{ roomId, code }` payload
4. **Server Distribution**: Server broadcasts `code-update` to all room members except sender
5. **Peer Update**: Other clients receive the update and re-render their code editors

### Code Execution Flow (Python WASM)

1. **Initialization**: Pyodide loads from CDN on component mount (~3MB download, cached)
2. **User Action**: User clicks "Run" button
3. **Stdout Capture**: Pyodide redirects Python `print()` statements to custom handler
4. **Async Execution**: Code runs in `runPythonAsync()` with error handling
5. **Output Display**: Results appear in console with color-coded formatting
   - `>` prefix = Success messages (green)
   - `!` prefix = Error messages (red)
   - `cmd:` prefix = System messages (gray)
6. **Auto-scroll**: Console scrolls to latest output automatically

### Event Architecture

**Client Events (Emitted):**

- `join-room(roomId)` - Join an interview room
- `code-change({ roomId, code })` - Broadcast code changes

**Client Events (Listened):**

- `connect` - Socket connection established
- `disconnect` - Socket connection lost
- `code-update(code)` - Receive code from peers

**Server Events:**

- `connection` - New client connected
- `join-room` - Add client to Socket.IO room
- `code-change` - Relay code to room members
- `disconnect` - Client disconnected

### Production Serving

The server includes static file serving for production deployment:

- Serves built React app from `../client/dist`
- Handles SPA routing (returns index.html for all routes)
- Single-server architecture reduces deployment complexity

## 🎯 Features Implemented

### ✅ Core Functionality

- **Real-time Collaborative Code Editing**: Multiple users can edit code simultaneously with instant synchronization
- **Room-based Interview Sessions**: Users connect to specific interview rooms for isolated sessions
- **WebSocket Communication**: Powered by Socket.IO for low-latency, bidirectional communication
- **Connection Status Indicator**: Visual feedback showing connection state (Connected/Disconnected)

### ✅ Frontend (React)

- **Monaco Editor Integration**: Professional code editor with VS Code features
  - Syntax highlighting for Python and JavaScript
  - Custom "Nexus Slate" dark theme matching overall design
  - Line numbers, auto-indentation, and code folding
  - Font ligatures and smooth scrolling
- **Python WASM Execution Engine**: In-browser Python runtime powered by Pyodide
  - Execute Python code without backend compilation
  - Real-time console output with stdout capture
  - Error handling with formatted error messages
  - Visual feedback during execution (loading states)
- **Custom Nexus UI Theme**: Modern dark mode interface with slate/indigo color scheme
- **Real-time Event Handling**:
  - Automatic room joining on connection
  - Live code broadcasting on user input
  - Incoming code updates from other participants
- **Connection Management**: Proper socket lifecycle with cleanup on component unmount
- **Split-Panel Layout**: Editor and console side-by-side with responsive design

### ✅ Backend (Node.js/Express)

- **Socket.IO Server**: Configured with CORS support for cross-origin connections
- **Room Management**: Users can join specific rooms for isolated sessions
- **Event Broadcasting**: Code changes are broadcast only to users in the same room (excluding sender)
- **Connection Logging**: Console feedback for user connections, room joins, and disconnections
- **Environment Configuration**: Dotenv support for flexible port configuration
- **Production-Ready Serving**: Serves built React frontend for single-server deployment
- **Docker Support**: Multi-stage containerization for efficient deployment

### ✅ Testing Infrastructure

- **Integration Tests**: Mocha-based test suite for real-time functionality
- **Socket.IO Test Setup**: Isolated test server with proper cleanup
- **Enhanced Reliability**:
  - Increased timeout for Windows network stack
  - WebSocket-only transport for faster connections
  - Proper connection synchronization in tests
- **Real-world Scenarios**: Tests verify two-user code synchronization in shared rooms

## 🚧 Current Status

**Working:**

- ✅ Full-stack Socket.IO real-time communication
- ✅ Multi-user code synchronization
- ✅ Monaco Editor with syntax highlighting (Python, JavaScript)
- ✅ Python code execution in browser (Pyodide WASM)
- ✅ Real-time console output with color-coded messages
- ✅ Room-based isolation
- ✅ Connection status monitoring
- ✅ Custom themed UI (Nexus design system)
- ✅ Integration test coverage
- ✅ Concurrent dev workflow (single command starts both servers)
- ✅ Production build pipeline (Vite optimization)
- ✅ Docker containerization with multi-stage builds
- ✅ Single-server deployment (backend serves frontend)

**Current Limitations:**

- Room ID is hardcoded (`interview-room-1`)
- No user identification or authentication
- No persistence (code is lost on refresh)
- Python-only execution (JavaScript support pending)
- No code execution synchronization between users
- Console output is not synced across sessions

## 📝 Future Enhancements

### High Priority

- [ ] Dynamic room creation with shareable links
- [ ] User names and avatars
- [ ] Code persistence (database integration)
- [ ] JavaScript/TypeScript code execution
- [ ] Synchronized console output across users
- [ ] Code execution result sharing

### Medium Priority

- [ ] User authentication and roles (interviewer/candidate)
- [ ] Interview session management (start, end, duration)
- [ ] Cursor position synchronization
- [ ] Code execution environment
- [ ] Interview question library

### Nice to Have

- [ ] Video/audio communication
- [ ] Chat functionality
- [ ] Code history and versioning
- [ ] Recording and playback of interview sessions
- [ ] AI-powered code review suggestions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication capabilities
- React for the frontend framework
- TailwindCSS for styling utilities
