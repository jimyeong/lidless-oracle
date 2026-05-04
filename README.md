# Lidless Oracle 🔮

> AI-powered mould risk advisor for UK homes.

[![Demo](https://img.youtube.com/vi/RNT2_tu2s4U/maxresdefault.jpg)](https://youtu.be/RNT2_tu2s4U)

▶ **[Watch the demo (1 min)](https://youtu.be/RNT2_tu2s4U)**

A React Native chatbot that combines Claude's natural language understanding with real-time IoT sensor data to advise on mould risk in UK homes. Users can ask questions like *"What was last week's mould risk?"* and the system fetches actual sensor readings, calculates the Magnus-formula-based risk score, and responds in natural language.

## What this demonstrates

- **LLM tool use**: Claude decides when to call backend tools, interprets natural-language time ranges, and synthesises results into conversational replies.
- **Multi-service orchestration**: A Node.js GraphQL gateway coordinates Anthropic API calls and a separate Python service that processes IoT sensor data.
- **Production-ready patterns**: Token-based auth (Firebase ID tokens verified server-side), GraphQL with Apollo, Prisma ORM, layered architecture (FSD on the client).

## Architecture

| Component | Tech | Role |
|-----------|------|------|
| Mobile client | React Native, TypeScript, Apollo Client | Chat UI, auth, GraphQL |
| Auth | Firebase Authentication + Admin SDK | Google Sign-In, ID token verification |
| API gateway | Node.js, Apollo Server, Prisma | LLM orchestration, tool routing |
| Mould risk engine | Python | Magnus formula on Zigbee sensor data |
| Database | PostgreSQL | Users, conversations, messages |

## Status

Personal project — not deployed. Built to explore LLM tool use patterns and to support adjacent KTP applications in property tech and healthcare engineering.

## Notable design decisions

- **Firebase Auth + own DB**: Firebase handles OAuth and token lifecycle; user-domain data lives in Postgres via `firebase_uid` foreign reference. Backend verifies tokens with Firebase Admin SDK on every request.
- **Tool use loop**: The chat resolver maintains a loop that handles arbitrary numbers of tool calls per turn, with iteration limit for safety.
- **Stateless LLM, stateful conversation**: Messages persist in Postgres; full history is sent to Claude on each turn (sliding window if needed in future).

---

*Built solo, May 2026.*
