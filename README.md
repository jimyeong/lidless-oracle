# Lidless Oracle 🔮

> A multilingual LLM chatbot for mould risk management in UK homes.

[![Demo](https://img.youtube.com/vi/RNT2_tu2s4U/maxresdefault.jpg)](https://youtu.be/RNT2_tu2s4U)

▶ **[Watch the demo (1 min)](https://youtu.be/RNT2_tu2s4U)**

## What this project is

Mould affects ~4% of UK homes (English Housing Survey) and disproportionately impacts social housing tenants and non-native English speakers — those who most need accessible information often face the steepest barriers to it.

**Lidless Oracle** is a chatbot designed to bridge that gap. Users converse in their own language about mould — its causes, prevention, and the present risk in their home — while the system fetches real environmental data from IoT sensors and reasons over it through an LLM (Claude).

## Why a chatbot, why multilingual

- **Conversational over forms**: most mould advice today comes as static guides or symptom-checking forms. People don't speak in form fields.
- **Multilingual by design**: UK housing reaches diverse communities. An advisor that answers in Korean, Polish, Arabic, or Urdu meets users where they are. The LLM handles this natively, without a translation layer.
- **Grounded in real data**: rather than generic advice, the system queries actual sensor readings (humidity, temperature) and assesses risk via the Magnus formula in a separate Python service.

## Demo (May 2026)

The current build demonstrates the core conversation loop:

- User asks in natural language: *"What was last week's mould risk?"* / *"이번 주 곰팡이 위험은?"*
- Claude interprets the time range, calls a backend tool that fetches real IoT data, and replies conversationally with risk score, sample size, and actionable advice.

## Architecture

| Component | Tech | Role |
|-----------|------|------|
| Mobile client | React Native, TypeScript, Apollo Client | Chat UI, auth, GraphQL |
| API gateway | Node.js, Apollo Server, Prisma | LLM orchestration, tool routing |
| LLM | Anthropic Claude (tool_use) | Natural language understanding, multilingual response |
| Mould risk engine | Python | Magnus formula on Zigbee sensor data |
| Auth | Firebase Authentication + Admin SDK | Google Sign-In, ID token verification |
| Database | PostgreSQL | Users, conversations, messages |

## Status & roadmap

🚧 Active personal development.

**Done**
- ✅ Google authentication via Firebase
- ✅ Conversational chat UI
- ✅ LLM tool use loop (Claude ↔ mould risk service)
- ✅ Real IoT data integration (4,000+ sensor readings)

**Next**
- ⏳ Conversation persistence per user (separate sessions)
- ⏳ RAG layer with UK housing health guidance (NHS, HHSRS Cat 1 hazards)
- ⏳ Real-time alerts when risk crosses thresholds
- ⏳ iOS support

## Notable design decisions

- **Multilingual via LLM, not translation layer**: Claude responds in the user's language without an explicit i18n system. The system prompt sets language-matching behaviour; output quality is the LLM's responsibility.
- **Firebase Auth + own DB**: Firebase handles OAuth and token lifecycle; user-domain data lives in Postgres via `firebase_uid` foreign reference. Backend verifies tokens with Firebase Admin SDK on every request.
- **Tool use loop**: The chat resolver maintains a loop that handles arbitrary numbers of tool calls per turn, with an iteration limit for safety.
- **Multi-service backend**: LLM orchestration (Node) is separate from sensor data processing (Python) — each in the language best suited to its job.

## Repo scope

This repository contains the React Native client. The backend (`lidless-hermes`) and IoT subsystem (`lidless-controller`) are private repositories.

---

*Built solo, May 2026.*
