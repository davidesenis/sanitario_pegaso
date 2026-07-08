# AGENTS.md — Direttive Globali

Regole operative trasversali per il repository `Sanitario`.

## Gerarchia istruzioni

1. `.github/agents/AGENT_POLICY.md` — regola primaria (leggere sempre prima di operare)
2. Questo file — direttive globali
3. Agent files specifici (`.github/agents/*.agent.md`)

## Regole operative

- **Fai solo ciò che è richiesto** — nessuna funzionalità aggiuntiva non esplicitata
- **Trasparenza**: dichiara motivazione prima di invocare tool/agenti; riporta esito sintetico dopo
- **Documentazione allineata**: se emergono incoerenze codice ↔ docs, correggerle nella stessa task
- **Report finale**: ogni task si chiude con lista file modificati + controlli effettuati

## Struttura progetto

```
Sanitario/
├── sanitario-be/          # Backend Spring Boot 2.7.18 / Java 21
├── sanitario-fe/          # Frontend React 18 + Vite
├── QUICK_START.md         # Avvio rapido e credenziali test
└── .github/agents/        # Agent definitions
```

## Comandi build & run

```bash
# Backend
cd sanitario-be && ./mvnw.cmd clean package -DskipTests
java -jar target/sanitario-be-0.0.1-SNAPSHOT.jar    # → http://localhost:8080

# Frontend
cd sanitario-fe && npm install && npm run dev        # → http://localhost:5173
```

## Agenti disponibili

| Agente | Responsabilità |
|--------|---------------|
| **Orchestratore** | Smista task agli agenti specializzati, coordina |
| **Backend** | Entità JPA, repository, service, controller REST |
| **Frontend** | Componenti React, API integration, styling |
| **Configurazione** | pom.xml, application.properties, classi config |
