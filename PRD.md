# Product Requirements Document (PRD)

## Nexus Coding Interview Platform

**Version:** 1.0  
**Last Updated:** December 7, 2025  
**Status:** Active Development  
**Owner:** Babatunde Abubakar

---

## 1. Executive Summary

### 1.1 Product Vision

Nexus is a real-time collaborative coding platform designed to facilitate remote technical interviews. It enables interviewers and candidates to write, edit, and execute code together in real-time, providing a seamless interview experience that mimics pair programming.

### 1.2 Problem Statement

Traditional remote technical interviews face challenges:

- **Lack of real-time collaboration**: Screen sharing is one-way and creates latency
- **No code execution**: Candidates must describe code behavior verbally
- **Poor candidate experience**: Switching between multiple tools disrupts flow
- **Limited interviewer insight**: Difficult to observe problem-solving process

### 1.3 Solution Overview

A unified platform that combines:

- Real-time collaborative code editing (like Google Docs for code)
- In-browser code execution (Python WASM)
- Professional IDE features (syntax highlighting, auto-completion)
- Isolated interview rooms for privacy
- Modern, intuitive UI designed for technical interviews

---

## 2. Target Users

### 2.1 Primary Personas

#### **Interviewer (Technical Recruiter/Engineer)**

- **Goals**: Assess candidate's coding skills, problem-solving approach, and communication
- **Pain Points**: Managing multiple tools, tracking candidate progress, technical setup issues
- **Needs**: Real-time code visibility, execution capabilities, easy session management

#### **Candidate (Job Seeker)**

- **Goals**: Demonstrate coding skills, solve problems efficiently, make good impression
- **Pain Points**: Unfamiliar tools, connectivity issues, inability to test code
- **Needs**: Familiar IDE experience, code execution, low-latency collaboration

### 2.2 Secondary Personas

- **Recruiting Coordinators**: Schedule and manage interview sessions
- **Hiring Managers**: Review interview recordings/transcripts

---

## 3. Product Requirements

### 3.1 Core Features (MVP - Implemented)

#### **F1: Real-Time Collaborative Editing**

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**Requirements:**

- Multiple users can edit code simultaneously
- Changes sync in <100ms latency
- No conflicts or data loss during concurrent edits
- Visual indication of cursor positions (future)

**Acceptance Criteria:**

- ✅ User A types code, User B sees it within 100ms
- ✅ Both users can edit without overwriting each other's changes
- ✅ Connection/disconnection handled gracefully
- ✅ Code state persists during session

**Technical Implementation:**

- Socket.IO for WebSocket communication
- Event-based broadcasting (code-change, code-update)
- Room-based isolation

---

#### **F2: Professional Code Editor**

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**Requirements:**

- Syntax highlighting for Python and JavaScript
- Line numbers and code folding
- Auto-indentation
- Monospace font with ligature support
- Dark theme matching platform design

**Acceptance Criteria:**

- ✅ Python keywords highlighted in indigo
- ✅ Strings highlighted in green
- ✅ Comments styled in gray/italic
- ✅ Line numbers visible on left
- ✅ Custom "Nexus Slate" theme applied

**Technical Implementation:**

- Monaco Editor (VS Code engine)
- Custom theme configuration
- React wrapper component

---

#### **F3: In-Browser Python Execution**

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**Requirements:**

- Execute Python code without backend server
- Display stdout output in real-time
- Show syntax and runtime errors
- Execute within 2 seconds for simple scripts

**Acceptance Criteria:**

- ✅ User clicks "Run", code executes in browser
- ✅ `print()` statements appear in console
- ✅ Syntax errors shown with line numbers
- ✅ Runtime errors displayed with stack trace
- ✅ Loading state during Pyodide initialization

**Technical Implementation:**

- Pyodide WASM runtime (v0.25)
- Async execution with error handling
- Custom stdout capture
- CDN loading with caching

---

#### **F4: Room-Based Sessions**

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented (Hardcoded)

**Requirements:**

- Isolated interview sessions per room
- Users in same room see each other's edits
- No cross-room data leakage
- Simple room joining mechanism

**Acceptance Criteria:**

- ✅ Users in Room A don't see Room B's code
- ✅ Auto-join on connection
- ✅ Room ID visible in UI
- ⚠️ Room ID currently hardcoded

**Technical Implementation:**

- Socket.IO rooms
- join-room event on connection
- Broadcast only to room members

---

#### **F5: Connection Status Indicator**

**Priority:** P1 (High)  
**Status:** ✅ Implemented

**Requirements:**

- Visual indicator of connection state
- Real-time updates on disconnect/reconnect
- Clear color coding (green=connected, red=disconnected)

**Acceptance Criteria:**

- ✅ Green indicator when connected
- ✅ Red indicator when disconnected
- ✅ Updates within 500ms of state change
- ✅ Positioned prominently in header

---

#### **F6: Console Output Panel**

**Priority:** P0 (Critical)  
**Status:** ✅ Implemented

**Requirements:**

- Display execution output in dedicated panel
- Color-coded message types
- Auto-scroll to latest output
- Clear button to reset console

**Acceptance Criteria:**

- ✅ stdout appears in green
- ✅ Errors appear in red
- ✅ System messages in gray
- ✅ Auto-scrolls to bottom
- ✅ Clear button empties console

**Technical Implementation:**

- React state management
- Color coding via Tailwind classes
- Auto-scroll with ref callback

---

### 3.2 Upcoming Features (Planned)

#### **F7: Dynamic Room Creation**

**Priority:** P0 (Critical - Next Sprint)  
**Status:** 🔄 Planned

**Requirements:**

- Generate unique room IDs
- Shareable room links
- Room expiration after interview
- Room access controls

**Acceptance Criteria:**

- User clicks "Create Room", gets unique URL
- Sharing URL allows others to join
- Room expires 24h after creation
- Optional password protection

**User Stories:**

```
As an interviewer,
I want to create a new interview room with one click,
So that I can quickly start an interview session.

As a candidate,
I want to join a room via shared link,
So that I don't need to manually enter room codes.
```

---

#### **F8: User Identification**

**Priority:** P0 (Critical - Next Sprint)  
**Status:** 🔄 Planned

**Requirements:**

- Display user names/avatars
- Show who is typing
- Distinguish between interviewer and candidate
- Anonymous mode option

**Acceptance Criteria:**

- User enters name on join
- Name displayed in participant list
- Cursor shows user name when hovering
- Role badges (Interviewer/Candidate)

---

#### **F9: Code Persistence**

**Priority:** P1 (High)  
**Status:** 🔄 Planned

**Requirements:**

- Save code to database
- Retrieve code on page refresh
- Export code as file
- View past interview code

**Acceptance Criteria:**

- Code survives page refresh
- "Save" button confirms save
- "Export" downloads .py file
- History view shows past sessions

**Technical Implementation:**

- PostgreSQL/MongoDB for storage
- Auto-save every 30 seconds
- Session-based retrieval

---

#### **F10: JavaScript Execution**

**Priority:** P1 (High)  
**Status:** 🔄 Planned

**Requirements:**

- Execute JavaScript code in browser
- Console.log output visible
- Support modern ES6+ syntax
- Same UX as Python execution

**Acceptance Criteria:**

- Language selector switches to JavaScript
- Run button executes JS code
- Console shows output
- Errors displayed clearly

**Technical Implementation:**

- Native browser eval with sandboxing
- Web Workers for isolation
- Error boundary for safety

---

#### **F11: Synchronized Console Output**

**Priority:** P2 (Medium)  
**Status:** 🔄 Planned

**Requirements:**

- When one user runs code, all users see output
- Execution state synced across sessions
- Clear console syncs for all users

**Acceptance Criteria:**

- User A runs code, User B sees output
- Running indicator visible to all
- Console clear affects all participants

---

#### **F12: Multiple Language Support**

**Priority:** P2 (Medium)  
**Status:** 🔄 Future

**Requirements:**

- Support Python, JavaScript, Java, C++, Go
- Language-specific templates
- Appropriate syntax highlighting per language

---

#### **F13: Video/Audio Communication**

**Priority:** P2 (Medium)  
**Status:** 🔄 Future

**Requirements:**

- WebRTC video/audio
- Picture-in-picture mode
- Screen sharing option
- Mute/unmute controls

---

#### **F14: Interview Recording**

**Priority:** P2 (Medium)  
**Status:** 🔄 Future

**Requirements:**

- Record code changes timeline
- Save audio/video (optional)
- Playback with timeline scrubbing
- Export recording

---

#### **F15: AI Code Assistant**

**Priority:** P3 (Low)  
**Status:** 🔄 Future

**Requirements:**

- Suggest code completions
- Explain code snippets
- Identify bugs
- Optional feature (can be disabled)

---

## 4. Non-Functional Requirements

### 4.1 Performance

- **Latency**: Code sync <100ms between users
- **Load Time**: Initial app load <3 seconds
- **Pyodide Load**: Python engine ready <5 seconds
- **Execution**: Simple Python scripts run <2 seconds
- **Concurrent Users**: Support 100 simultaneous rooms (500 users)

### 4.2 Scalability

- Horizontal scaling via load balancers
- Redis for session management (multi-server)
- WebSocket sticky sessions
- CDN for static assets

### 4.3 Security

- HTTPS only in production
- WebSocket over WSS
- CORS configuration restrictive in production
- Room IDs cryptographically random (v4 UUID)
- XSS prevention via sanitization
- Rate limiting on API endpoints

### 4.4 Reliability

- 99.5% uptime SLA
- Auto-reconnect on connection loss
- Graceful degradation (read-only mode if execution fails)
- Error boundaries prevent full app crashes

### 4.5 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Adjustable font sizes

### 4.6 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 15+
- Mobile browsers (limited support)

---

## 5. User Experience Requirements

### 5.1 UI/UX Principles

1. **Minimal Friction**: Zero-click room join for candidates (via link)
2. **Familiar Interface**: IDE-like experience for developers
3. **Visual Hierarchy**: Code editor primary focus, console secondary
4. **Instant Feedback**: All actions provide immediate visual response
5. **Error Recovery**: Clear error messages with suggested actions

### 5.2 Key User Flows

#### **Flow 1: Interviewer Creates Room**

1. Interviewer opens Nexus platform
2. Clicks "Create Interview Room"
3. System generates unique room URL
4. Interviewer copies/shares URL with candidate
5. Dashboard shows room status (waiting for candidate)

**Time to Complete:** <10 seconds

---

#### **Flow 2: Candidate Joins Interview**

1. Candidate receives room link via email
2. Clicks link, opens in browser
3. Enters name (optional)
4. Auto-joins room, sees code editor
5. Interviewer notified of join

**Time to Complete:** <15 seconds

---

#### **Flow 3: Collaborative Coding**

1. Interviewer poses coding problem
2. Candidate starts typing code
3. Interviewer sees code appear in real-time
4. Candidate clicks "Run" to execute
5. Both see output in console
6. Interviewer provides feedback via chat/voice

**Success Metric:** <100ms sync latency

---

#### **Flow 4: Session Conclusion**

1. Interview concludes
2. Interviewer clicks "End Session"
3. Code auto-saved to interviewer's account
4. Optional: Export code as file
5. Room marked as archived

**Time to Complete:** <5 seconds

---

## 6. Technical Architecture

### 6.1 System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 19 + Vite                                  │  │
│  │  - Monaco Editor (Code)                           │  │
│  │  - Pyodide WASM (Execution)                       │  │
│  │  - Socket.IO Client (Real-time)                   │  │
│  │  - TailwindCSS (Styling)                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │ WSS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Server (Node.js)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express 5 + Socket.IO                            │  │
│  │  - Room Management                                │  │
│  │  - Event Broadcasting                             │  │
│  │  - Static File Serving (Production)               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Future: Database (PostgreSQL)               │
│  - Session persistence                                   │
│  - User accounts                                         │
│  - Code history                                          │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Data Models

#### **Room**

```javascript
{
  id: string,              // UUID v4
  createdAt: timestamp,
  expiresAt: timestamp,
  createdBy: userId,
  participants: [userId],
  status: enum['active', 'ended', 'archived'],
  code: string,
  language: enum['python', 'javascript'],
  metadata: {
    interviewerName: string,
    candidateName: string,
    position: string
  }
}
```

#### **Session**

```javascript
{
  id: string,
  roomId: string,
  userId: string,
  joinedAt: timestamp,
  leftAt: timestamp,
  role: enum['interviewer', 'candidate'],
  socketId: string
}
```

#### **CodeSnapshot**

```javascript
{
  id: string,
  roomId: string,
  code: string,
  language: string,
  executionResults: string,
  savedAt: timestamp,
  savedBy: userId
}
```

---

## 7. Success Metrics

### 7.1 Key Performance Indicators (KPIs)

#### **Adoption Metrics**

- **Daily Active Rooms (DAR)**: Target 50 rooms/day by Month 3
- **User Retention**: 60% of interviewers return within 7 days
- **Session Completion Rate**: 90% of sessions end naturally (not due to errors)

#### **Performance Metrics**

- **Average Sync Latency**: <100ms (p95)
- **Code Execution Success Rate**: >95%
- **Uptime**: 99.5%
- **Page Load Time**: <3s (p95)

#### **User Satisfaction**

- **Net Promoter Score (NPS)**: Target 50+
- **Candidate Satisfaction**: 4.5/5 stars average
- **Interviewer Satisfaction**: 4.5/5 stars average

#### **Business Metrics**

- **Time to First Interview**: <5 minutes from signup
- **Average Session Duration**: 45-60 minutes
- **Conversion Rate**: 30% of free trials to paid plans

---

## 8. Release Plan

### 8.1 Phase 1: MVP (Current - v1.0)

**Status:** ✅ Complete  
**Release Date:** December 2025

**Features:**

- ✅ Real-time collaborative editing
- ✅ Monaco Editor integration
- ✅ Python WASM execution
- ✅ Room-based sessions (hardcoded)
- ✅ Console output
- ✅ Docker deployment
- ✅ Integration tests

---

### 8.2 Phase 2: Core Enhancements (v1.1)

**Target:** January 2026  
**Duration:** 2-3 weeks

**Features:**

- 🔄 Dynamic room creation with URLs
- 🔄 User identification (names/avatars)
- 🔄 Code persistence (database)
- 🔄 JavaScript execution
- 🔄 Session history view
- 🔄 Export code feature

**Success Criteria:**

- Users can create/join rooms via links
- Code survives page refresh
- Both Python and JS executable

---

### 8.3 Phase 3: Collaboration Features (v1.2)

**Target:** February 2026  
**Duration:** 3-4 weeks

**Features:**

- 🔄 Synchronized console output
- 🔄 Cursor position indicators
- 🔄 Text chat panel
- 🔄 User presence indicators (typing, idle)
- 🔄 Multiple language support (Java, C++, Go)

**Success Criteria:**

- Real-time presence awareness
- Multi-language execution working
- Enhanced collaboration UX

---

### 8.4 Phase 4: Professional Features (v2.0)

**Target:** Q2 2026  
**Duration:** 6-8 weeks

**Features:**

- 🔄 Video/audio communication (WebRTC)
- 🔄 Interview recording & playback
- 🔄 Question library/templates
- 🔄 User authentication & accounts
- 🔄 Team workspaces
- 🔄 Analytics dashboard

**Success Criteria:**

- Enterprise-ready feature set
- Monetization enabled
- Team collaboration tools

---

## 9. Risks & Mitigation

### 9.1 Technical Risks

#### **Risk: WebSocket Connection Instability**

**Impact:** High  
**Probability:** Medium  
**Mitigation:**

- Auto-reconnect with exponential backoff
- Offline mode with local state
- Connection status prominently displayed
- Periodic heartbeat checks

#### **Risk: WASM Execution Performance**

**Impact:** Medium  
**Probability:** Low  
**Mitigation:**

- Pyodide CDN caching
- Progressive loading strategy
- Timeout limits on execution
- Fallback to server-side execution (future)

#### **Risk: Concurrent Edit Conflicts**

**Impact:** High  
**Probability:** Low  
**Mitigation:**

- Operational Transform algorithm (future)
- Last-write-wins for MVP
- Conflict resolution UI
- Regular state synchronization

---

### 9.2 Business Risks

#### **Risk: Low User Adoption**

**Impact:** High  
**Probability:** Medium  
**Mitigation:**

- Beta testing with target users
- Integration with ATS platforms
- Free tier to reduce barrier
- Marketing to developer communities

#### **Risk: Competitor Advantage**

**Impact:** Medium  
**Probability:** Medium  
**Mitigation:**

- Unique feature: In-browser execution
- Focus on UX simplicity
- Fast iteration based on feedback
- Open-source community building

---

## 10. Dependencies & Constraints

### 10.1 Technical Dependencies

- **Pyodide**: External CDN, ~3MB download
- **Monaco Editor**: External package, regular updates
- **Socket.IO**: Server and client library versions must match
- **Node.js**: v18+ required for server
- **Docker**: For containerized deployment

### 10.2 Business Constraints

- **Budget**: Bootstrapped/limited initial budget
- **Team Size**: Small engineering team (1-3 developers)
- **Timeline**: MVP must launch by end of 2025 ✅
- **Infrastructure**: Must run on affordable hosting (AWS/GCP/Heroku)

### 10.3 Legal/Compliance

- **GDPR**: User data privacy (EU users)
- **CCPA**: California privacy requirements
- **Terms of Service**: Code ownership clarification
- **Data Retention**: 90-day default retention policy

---

## 11. Open Questions

1. **Authentication Strategy**: OAuth (Google/GitHub) vs custom auth vs magic links?
2. **Pricing Model**: Freemium vs subscription vs per-seat licensing?
3. **Data Retention**: How long should interview code be stored?
4. **Code Ownership**: Who owns the code written during interviews?
5. **Enterprise Features**: What do large companies need (SSO, SAML, audit logs)?
6. **Mobile Support**: Is mobile interview experience necessary?
7. **API Access**: Should we provide API for integration with ATS systems?

---

## 12. Appendix

### 12.1 Glossary

- **ATS**: Applicant Tracking System
- **MVP**: Minimum Viable Product
- **P0/P1/P2/P3**: Priority levels (0=critical, 3=nice-to-have)
- **WASM**: WebAssembly
- **SLA**: Service Level Agreement
- **WebRTC**: Web Real-Time Communication
- **CDN**: Content Delivery Network

### 12.2 References

- Monaco Editor Documentation: https://microsoft.github.io/monaco-editor/
- Pyodide Documentation: https://pyodide.org/
- Socket.IO Documentation: https://socket.io/docs/
- React Documentation: https://react.dev/

### 12.3 Revision History

| Version | Date        | Author             | Changes              |
| ------- | ----------- | ------------------ | -------------------- |
| 1.0     | Dec 7, 2025 | Babatunde Abubakar | Initial PRD creation |

---

**Document Status:** Living Document - Updated as requirements evolve  
**Next Review:** January 15, 2026
