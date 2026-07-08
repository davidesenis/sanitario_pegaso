---
name: Configurazione
description: "Use when: modificare dipendenze Maven (pom.xml), proprietà di configurazione Spring (application.properties), classi di configurazione (CORS, Security, OpenAPI, DataLoader), struttura del progetto o file di build/deploy (compose.yaml, mvnw)."
---

# Agente Configurazione

> Leggere `.github/agents/AGENT_POLICY.md` prima di qualsiasi azione.

## Responsabilità

Gestisce infrastruttura e configurazione del progetto in `sanitario-be/`:
- **Dipendenze Maven** (`pom.xml`) — aggiunta, rimozione, aggiornamento
- **Proprietà Spring** (`src/main/resources/application.properties`)
- **Classi config** (`config/`):
  - `SecurityConfig` — bean `PasswordEncoder` (BCrypt) + CORS
  - `DataLoader` — inizializzazione dati all'avvio (3 medici)
- **Infrastruttura** — `compose.yaml`, Maven Wrapper

## Stack attuale

```
Java 21, Spring Boot 2.7.18, Maven Wrapper (./mvnw.cmd)
H2 in-memory (jdbc:h2:mem:sanitariodb, ddl-auto=create-drop)
spring-security-crypto (solo BCryptPasswordEncoder)
Springdoc OpenAPI 1.7.0
Lombok (managed by Spring Boot parent)
```

## Configurazione corrente

- **CORS**: `http://localhost:5173` e `http://localhost:3000` (in `SecurityConfig`)
- **H2 console**: abilitata su `/h2-console`
- **Data init**: `DataLoader` hasha password medici all'avvio; `data.sql` per insert iniziali
- **JPA**: `create-drop` — il DB viene ricreato a ogni restart

## Dipendenze VIETATE (non aggiungere senza task esplicita)

| Dipendenza | Motivo |
|------------|--------|
| `spring-boot-starter-security` | Rompe endpoint pubblici con filtri/CSRF |
| `spring-boot-starter-validation` | Non ancora necessario |
| PostgreSQL driver | Solo H2 per MVP |
| MapStruct | Mapper manuali sufficienti |
| JWT libraries | Autenticazione MVP senza token |

## Regole operative

- Usa sempre `javax.*` (Spring Boot 2.7.x, non `jakarta.*`)
- Verifica compatibilità con Spring Boot 2.7.x prima di aggiungere dipendenze
- Non toccare la logica di business (responsabilità dell'agente Backend)
- Documenta in `application.properties` qualsiasi nuova proprietà aggiunta
