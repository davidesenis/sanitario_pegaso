---
name: Backend
description: "Use when: creare o modificare qualsiasi componente Java/Spring Boot del backend — entità JPA, repository, DTO, mapper, service, controller REST, endpoint API."
---

# Agente Backend

> Leggere `.github/agents/AGENT_POLICY.md` prima di qualsiasi azione.

## Responsabilità

Gestisce l'intero backend Java/Spring Boot in `sanitario-be/`:
- **Entità JPA** (`entity/`) — annotazioni `javax.persistence.*` + Lombok
- **Repository** (`repository/`) — interfacce `JpaRepository<Entity, Long>`
- **Service** (`service/`) — logica di business
- **Controller** (`controller/`) — endpoint REST con Swagger annotations
- **DTO** (`dto/`) — oggetti di trasferimento dati

## Dominio attuale

```
Paziente          → id, nome, cognome, email (UNIQUE), password (BCrypt), numeroTelefono
Medico            → id, nome, cognome, email (UNIQUE), password (BCrypt), numeroTelefono, reparto
Prenotazione      → id, paziente (ManyToOne EAGER), medico (ManyToOne EAGER), dataOra, stato
StatoPrenotazione → ENUM: IN_ATTESA, CONFERMATA, RIFIUTATA
```

## Endpoint REST attuali

```
POST   /api/pazienti              → registrazione (201) | 409 email duplicata
POST   /api/pazienti/login        → login (200 + Paziente) | 401
GET    /api/pazienti              → lista (200)
GET    /api/pazienti/{id}         → singolo (200) | 404

POST   /api/medici/login          → login (200 + Medico) | 401
GET    /api/medici                → lista (200)

POST   /api/prenotazioni          → crea (201) | 409 slot occupato
DELETE /api/prenotazioni/{id}     → elimina (204)
GET    /api/prenotazioni/paziente/{id}            → per paziente (200)
GET    /api/prenotazioni/medico/{id}              → per medico (200)
GET    /api/prenotazioni/medico/{id}/occupati?data={data} → slot occupati (200)
PUT    /api/prenotazioni/{id}/accetta             → accetta (200)
PUT    /api/prenotazioni/{id}/rifiuta             → rifiuta (200)
```

## Regole operative

- Usa **Lombok** (`@Getter/@Setter/@NoArgsConstructor/@AllArgsConstructor/@RequiredArgsConstructor`)
- Usa **constructor injection** (via `@RequiredArgsConstructor`)
- Usa `javax.*` per tutte le annotazioni (Spring Boot 2.7.x, non `jakarta.*`)
- Documenta ogni endpoint con `@Operation` e `@ApiResponse`
- Password hashate con bean `PasswordEncoder` (BCrypt) — mai in chiaro
- Password mai nei JSON di risposta (`@JsonIgnore` o `WRITE_ONLY`)
- **No `@Valid`** — Hibernate Validator non è in classpath
- **Errori inline** — `try/catch` + `ResponseEntity` (no `GlobalExceptionHandler`)
- **No `spring-boot-starter-security`** — solo `spring-security-crypto`
- Slot prenotazione: 30 minuti, lun-ven 9:00-18:00
