# 🚀 Real-Time Collaboration - Quick Start Guide

## Phase 1: WebSocket Infrastructure ✅ COMPLETE

This guide will help you test the newly implemented real-time collaboration features.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running (for full functionality)
- Two or more browser windows/tabs for testing

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend dependencies (already installed)
cd backend-node
npm install

# Frontend dependencies (already installed)
cd ..
npm install
```

### Step 2: Start the Backend Server

```bash
cd backend-node
npm run dev
```

You should see:
```
✅ Connected to database
🚀 Socket.io server initialized
🚀 Server running on http://localhost:3001
🔗 Collaboration: WebSocket enabled
✨ Real-time collaboration enabled!
```

### Step 3: Start the Frontend Server

In a new terminal:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Step 4: Open the Test Page

Open your browser and navigate to:
```
http://localhost:8080/tests/collaboration.test.html
```

### Step 5: Test Single User Connection

1. **Configure Connection**
   - Server URL: `http://localhost:3001` (default)
   - Auth Token: `test-token-123` (mock token)
   - Project ID: `test-project-001` (default)

2. **Connect to Server**
   - Click the "Connect" button
   - Status should change to "Connected" (green)
   - Event log should show: "✅ Connected to server"

3. **Join a Room**
   - Click the "Join Room" button
   - Event log should show: "✅ Joined room: test-project-001"
   - You should see your user in the "Active Users" list

4. **Test Ping**
   - Click the "Ping Server" button
   - Event log should show latency (e.g., "🏓 Pong! Latency: 15ms")

### Step 6: Test Multi-User Connection

1. **Open Multiple Tabs**
   - Open the test page in 2-3 browser tabs
   - Or use different browsers (Chrome, Firefox, Safari)

2. **Connect All Tabs**
   - In each tab, click "Connect"
   - Then click "Join Room" (use the same Project ID)

3. **Verify Multi-User**
   - Each tab should show all connected users
   - User count should update: "(3)" for 3 users
   - Each user should have a different color

4. **Test User Leave**
   - In one tab, click "Leave Room" or "Disconnect"
   - Other tabs should show: "👋 User left"
   - User count should decrease

### Step 7: Test Reconnection

1. **Simulate Server Disconnect**
   - Stop the backend server (Ctrl+C)
   - Tabs should show "Reconnecting..." status

2. **Restart Server**
   - Start the backend server again: `npm run dev`
   - Tabs should automatically reconnect
   - Event log should show: "🔄 Reconnected"

## What's Working Now

✅ **WebSocket Connection**
- Real-time bidirectional communication
- Automatic reconnection with exponential backoff
- Connection state management

✅ **Room Management**
- Join/leave project rooms
- Multiple users per room
- Automatic room cleanup

✅ **User Presence**
- Track active users
- Unique user colors
- User join/leave notifications

✅ **Event Broadcasting**
- Cursor position updates (sent, not rendered yet)
- Element selection updates (sent, not rendered yet)
- Generic user actions

✅ **Performance**
- Low latency (<100ms for local)
- Supports 8+ concurrent users
- Efficient event broadcasting

## What's Coming Next

### Phase 2: CRDT Integration (Next)
- Yjs document synchronization
- Conflict-free element editing
- Operational transformation
- Real-time state sync

### Phase 3: Presence & Awareness
- Visual cursor rendering
- Selection indicators
- User avatars
- Typing indicators

### Phase 4: Conflict Resolution
- Distributed undo/redo
- Last-write-wins merge
- Conflict UI

### Phase 5: Persistence & History
- Auto-save snapshots
- Version history
- Rollback capability

## Troubleshooting

### Connection Failed
**Problem**: Cannot connect to server  
**Solution**: 
- Verify backend server is running on port 3001
- Check console for error messages
- Ensure no firewall blocking WebSocket connections

### Room Join Failed
**Problem**: "Failed to join room" error  
**Solution**:
- Ensure you're connected first (green status)
- Check that Project ID is not empty
- Verify backend server logs for errors

### Users Not Showing
**Problem**: Other users not visible in Active Users list  
**Solution**:
- Ensure all tabs joined the same Project ID
- Check that all tabs are connected (green status)
- Refresh the page and try again

### High Latency
**Problem**: Ping shows >100ms latency  
**Solution**:
- This is normal for remote servers
- For local testing, latency should be <50ms
- Check network connection
- Verify server is not overloaded

## API Endpoints

### REST API

**Get Collaboration Stats**
```bash
curl http://localhost:3001/api/collaboration/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "connectedSockets": 3,
    "totalRooms": 1,
    "totalUsers": 3,
    "rooms": [...]
  }
}
```

### WebSocket Events

**Client → Server:**
- `join-room` - Join a project room
- `leave-room` - Leave current room
- `cursor-move` - Update cursor position
- `element-select` - Update element selection
- `user-action` - Send user action
- `ping` - Health check

**Server → Client:**
- `user-joined` - User joined room
- `user-left` - User left room
- `cursor-update` - Cursor position update
- `selection-update` - Selection update
- `user-action` - User action broadcast

## Integration with Main Editor

To integrate collaboration into the main DragNDrop editor:

```javascript
// Import the collaboration client
import { collaborationClient } from './src/collaboration/collaborationClient.js';

// Initialize on app load
collaborationClient.initialize({
  serverUrl: 'http://localhost:3001',
  token: userAuthToken, // Get from Better Auth
  autoConnect: true
});

// Listen for connection
collaborationClient.on('connected', () => {
  console.log('Collaboration enabled!');
});

// Join room when project opens
async function openProject(projectId) {
  // ... existing code ...
  
  // Join collaboration room
  await collaborationClient.joinRoom(projectId);
}

// Leave room when project closes
async function closeProject() {
  // ... existing code ...
  
  // Leave collaboration room
  await collaborationClient.leaveRoom();
}

// Send cursor updates (throttled)
canvas.addEventListener('mousemove', throttle((e) => {
  collaborationClient.updateCursor(e.clientX, e.clientY);
}, 100));

// Send selection updates
function selectElement(elementId) {
  // ... existing code ...
  
  // Broadcast selection
  collaborationClient.updateSelection([elementId]);
}
```

## Performance Tips

1. **Throttle Cursor Updates**: Update cursor max every 100ms
2. **Batch Operations**: Group multiple changes into single events
3. **Optimize Payloads**: Send only necessary data
4. **Use Compression**: Enable WebSocket compression for large payloads
5. **Monitor Latency**: Track ping times and adjust UX accordingly

## Security Notes

⚠️ **Current Implementation**: Uses mock authentication for testing

🔒 **Production Requirements**:
- Integrate with Better Auth session verification
- Implement proper JWT token validation
- Add rate limiting per user
- Enable HTTPS/WSS in production
- Implement permission checks per project
- Add audit logging for all actions

## Database Migration

To apply the collaboration database schema:

```bash
cd backend-node

# Generate migration (already done)
npm run db:generate

# Apply migration
npm run db:migrate

# Or push directly to database
npm run db:push
```

This creates 4 new tables:
- `projectSession` - Collaboration sessions
- `userPresence` - User presence tracking
- `projectSnapshot` - Document snapshots
- `projectOperation` - Operation audit log

## Support & Documentation

- **Full Documentation**: `docs/COLLABORATION_PHASE1_COMPLETE.md`
- **Implementation Plan**: `GITHUB_ISSUE_26_IMPLEMENTATION_PLAN.md`
- **GitHub Issue**: #26
- **Test Page**: `tests/collaboration.test.html`

## Next Steps

1. ✅ **Phase 1 Complete**: WebSocket Infrastructure
2. 🔄 **Phase 2 Next**: CRDT Integration with Yjs
3. ⏳ **Phase 3**: Presence & Awareness (cursors, avatars)
4. ⏳ **Phase 4**: Conflict Resolution
5. ⏳ **Phase 5**: Persistence & History
6. ⏳ **Phase 6**: Performance & Scaling
7. ⏳ **Phase 7**: Security & Authorization
8. ⏳ **Phase 8**: Testing & Documentation

## Feedback

Found a bug or have a suggestion? Please open an issue on GitHub!

---

**Happy Collaborating! 🎉**
