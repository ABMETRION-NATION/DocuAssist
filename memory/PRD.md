# DocuAssist — Product Requirements Document

## Overview
DocuAssist is a premium React Native (Expo) mobile app that helps users generate real, properly structured documents for everyday situations using guided forms. **No AI text generation** — the app uses deterministic, structured templates only.

## Core Rules
- App must run locally without backend
- Structured templates only (no AI)
- All documents saved locally via AsyncStorage
- Legal disclaimer visible: "This app provides general document assistance and is not legal advice."

## Document Types (5)
1. Credit Dispute Letter (4 steps)
2. Rental / Landlord Letter (3 steps)
3. Simple Agreement (4 steps)
4. Childcare Agreement (5 steps)
5. General Formal Letter (3 steps)

## Screens
- `app/index.tsx` — Home (category cards, recent docs)
- `app/builder/[type].tsx` — Step-by-step guided builder with progress bar & validation
- `app/preview.tsx` — Formal white-paper preview with Copy / Share / PDF / Edit / Delete actions
- `app/saved.tsx` — Searchable list of saved documents
- `app/settings.tsx` — Theme toggle, clear data, social login placeholders, about, disclaimer

## Design
- Deep charcoal background (#141419)
- Muted gold accent (#C5A880) with royal purple (#4A3B69) secondary
- Cormorant Garamond (headings/document) + Manrope (UI)
- White paper preview on dark UI
- lucide-react-native icons

## Data
- Local only via `@react-native-async-storage/async-storage` (key: `docuassist.documents.v1`)
- No backend required

## Integrations
- expo-print → real PDF export
- expo-sharing / React Native Share → native share sheet
- expo-clipboard → copy to clipboard
- @expo-google-fonts → Cormorant Garamond + Manrope

## Future Placeholders (inactive stubs)
- `src/agent_integration/`
- `src/validation_engine/`
- `src/document_packs/`
- `src/premium_features/`
- `src/backend_sync/`
