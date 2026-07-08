# Agent Policy — Sanitario

Vincolo imperativo condiviso per **tutti** gli agenti del repository.

## Regola 1: Conformità alla Task

- Fai **solo** ciò che è esplicitamente richiesto.
- Non aggiungere funzionalità non richieste.
- Non anticipare fasi future della roadmap.
- Se ritieni necessario qualcosa di non esplicitato, chiedi prima all'utente.

## Regola 2: Tracciamento e Trasparenza

Tutte le comunicazioni tra orchestratore e agenti devono essere esplicite e visibili in chat.

### Formato invocazione (Orchestratore → Agente)

```
[ORCHESTRATORE 📞] Invocazione agente
├─ Destinatario: {AGENTE}
├─ Task ID: ORCH-YYYYMMDD-HHmmss-XXX
└─ Descrizione: {cosa viene richiesto}
```

### Formato risposta finale (Agente → Orchestratore)

```
[{AGENTE} ✨] Task Completata
├─ Task ID: {stesso dell'invocazione}
├─ Status: ✅ successo | ⚠️ avvertenze | ❌ fallito
├─ File modificati: {lista}
├─ File creati: {lista se applicabile}
└─ Note: {se significative}
```

### Comunicazione inter-agente

Gli agenti **non comunicano direttamente**. Se un agente necessita del supporto di un altro:
1. Dichiara la richiesta all'orchestratore
2. L'orchestratore smista al secondo agente
3. Il risultato torna tramite l'orchestratore

## Regola 3: Lingua

- **Italiano** per tutte le comunicazioni tracciabili (dichiarazioni, report, motivazioni)
- Codice sorgente: lingua del linguaggio (Java, JavaScript, SQL)

## Validità

Queste regole valgono per tutti gli agenti presenti e futuri in `.github/agents/`.
