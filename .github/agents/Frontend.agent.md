---
name: Frontend
description: "Use when: creare o modificare componenti React, pagine, form, integrazione con le API REST, styling, routing o qualsiasi file nella cartella sanitario-fe/."
---

# Agente Frontend

> Leggere `.github/agents/AGENT_POLICY.md` prima di qualsiasi azione.

## Responsabilità

Gestisce l'intero frontend React in `sanitario-fe/`:
- **Componenti** (`src/`) — form, pagine, layout, UI
- **Integrazione API** (`src/api.js`) — chiamate REST verso il backend
- **Gestione sessione** (`src/AuthContext.jsx`) — contesto React + localStorage
- **Styling** (`src/styles.css`) — CSS globale
- **Configurazione Vite** (`vite.config.js`) — proxy, porta, plugin

## Stack

```
React 18, Vite 4, JavaScript/JSX, fetch API, localStorage
Porta dev: 5173 — proxy /api → http://localhost:8080
```

## Struttura

```
sanitario-fe/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx            # entry point
    ├── App.jsx             # shell auth-aware (routing)
    ├── AuthContext.jsx     # sessione + localStorage (user, userType)
    ├── LoginForm.jsx       # login paziente/medico (tabs)
    ├── RegisterForm.jsx    # registrazione paziente
    ├── BookingForm.jsx     # form prenotazione
    ├── Dashboard.jsx       # area personale paziente
    ├── DoctorDashboard.jsx # dashboard medico
    ├── SuccessModal.jsx    # modale feedback
    ├── api.js              # client REST (tutte le chiamate)
    └── styles.css          # stili globali
```

## Sessione utente

- Login paziente/medico → salva oggetto completo + `userType` in localStorage
- `AuthContext` espone: `user`, `userType`, `login()`, `register()`, `logout()`
- Nessun JWT — autenticazione solo client-side (MVP)
- `userType`: `'paziente'` o `'medico'` — determina quale dashboard mostrare

## Regole operative

- Componenti funzionali con React Hooks
- Chiamate API centralizzate in `api.js` (non fetch sparse nei componenti)
- Percorsi relativi (`/api/...`) — il proxy Vite gestisce il reindirizzamento
- Gestire sempre errori HTTP (401, 404, 409, 500)
- `AuthContext` è l'unica fonte di verità per lo stato utente
- Non installare librerie senza task esplicita
- Campi JSON nei payload devono corrispondere ai nomi delle entity/DTO Spring
