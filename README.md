# Mini Game Hub - Project Overview

This project, **Mini Game Hub**, is a backend system designed to handle **real-time multiplayer interactions** for a mini-game environment. Its main focus is on **tracking player movements and positions**, broadcasting updates, and integrating different services for game logic processing.

---

## Core Functionality

1. **Player Movement Tracking**
   - Players send their movements (position updates) to the server.
   - Each movement is encoded as a **protobuf message** (`MoveMessage`) and sent through Redis channels.
   - The Go service subscribes to Redis, decodes the message, and logs player positions.

2. **Real-time Updates**
   - Redis channels allow messages to flow between Node.js (NestJS/Colyseus) and Go services.
   - Ensures **low-latency communication** between different parts of the system.

3. **Data Consistency**
   - Uses **protobuf definitions** to standardize the structure of messages across languages (Node.js ↔ Go).
   - Provides strong typing for messages like `PlayerPosition` and `MoveMessage`.

4. **Logging**
   - Go service uses **Uber Zap** for structured logging of player actions.
   - Helps monitor and debug the flow of messages in real time.


## High-Level Flow

```
Player Client
      │
      ▼
NestJS / Colyseus Room
      │
      ▼
   Redis Channel
      │
      ▼
   Go Service
      │
      ▼
(Optional) Database / Gateway APIs
```

## Summary

Mini Game Hub is a **microservice-based backend** that:  

- Tracks and logs player positions in real-time.  
- Uses **protobuf + Redis** for communication between Node.js and Go.  
- Provides a foundation for real-time multiplayer mini-games.  

It does **not include the client-side game**, focusing purely on backend message processing and game state management.
