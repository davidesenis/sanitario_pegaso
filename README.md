# 🏥 Sanitario — Sistema di Prenotazioni Sanitarie

Applicazione full-stack per la gestione delle prenotazioni mediche con registrazione, login, area personale paziente e dashboard medico.

---

## ⚡ Quick Start

👉 Vedi **[QUICK_START.md](QUICK_START.md)** per avviare in 5 minuti.

```bash
# Backend
cd sanitario-be && ./mvnw.cmd clean package -DskipTests
java -jar target/sanitario-be-0.0.1-SNAPSHOT.jar

# Frontend (nuovo terminale)
cd sanitario-fe && npm run dev
```

Apri **http://localhost:5173**

---

## 🎯 Funzionalità

### Paziente
- ✅ **Registrazione** — nome, cognome, email, telefono, password
- ✅ **Login** — email + password (BCrypt)
- ✅ **Dashboard personale** — elenco prenotazioni con stato, cancellazione, nuova prenotazione

### Medico
- ✅ **Login** — con credenziali precaricate
- ✅ **Dashboard medico** — visualizza prenotazioni in attesa, accetta/rifiuta

### Regole Business
- Prenotazioni solo lun-ven 9:00-18:00
- Nessun doppio slot per lo stesso medico
- Email univoca per paziente e medico

---

## 📚 Documentazione

| Documento | Contenuto |
|-----------|-----------|
| **[QUICK_START.md](QUICK_START.md)** | Avvio rapido, credenziali test, comandi essenziali |
| **[Swagger UI](http://localhost:8080/swagger-ui.html)** | Documentazione interattiva API REST (backend avviato) |

---

## 🛠️ Stack Tecnologico

### Backend
- **Spring Boot 2.7.18** / **Java 21**
- **Spring Data JPA** + **Hibernate** (H2 in-memory)
- **Spring Security Crypto** — BCryptPasswordEncoder
- **Springdoc OpenAPI 1.7.0** — Swagger UI
- **Lombok**

### Frontend
- **React 18** + **Vite**
- **JavaScript/JSX**
- Comunicazione via `fetch` + proxy Vite → `localhost:8080`

---

## 📂 Struttura Progetto

```
Sanitario/
├── sanitario-be/              # Backend Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/example/sanitariobe/
│       ├── config/            # SecurityConfig, DataLoader
│       ├── controller/        # REST: Paziente, Medico, Prenotazione
│       ├── service/
│       ├── repository/
│       ├── entity/            # Paziente, Medico, Prenotazione, ENUM
│       └── dto/               # LoginRequestDto
│
└── sanitario-fe/              # Frontend React + Vite
    └── src/
        ├── App.jsx            # Shell auth-aware
        ├── AuthContext.jsx    # Auth provider + localStorage
        ├── LoginForm.jsx
        ├── RegisterForm.jsx
        ├── Dashboard.jsx      # Area personale paziente
        ├── DoctorDashboard.jsx # Dashboard medico
        ├── BookingForm.jsx
        ├── SuccessModal.jsx
        ├── api.js             # Client REST
        └── styles.css
```

---

## 🔐 Sicurezza

| Aspetto | Implementazione |
|---------|----------------|
| Password | BCrypt (non reversibile) |
| Sessione | localStorage (client-side, MVP) |
| CORS | Configurato per localhost:5173 |
| Email | Vincolo UNIQUE nel DB |
| Password nelle API | Mai esposta nelle risposte GET |

---

## 👥 Medici Precaricati

| Nome | Reparto | Email | Password |
|------|---------|-------|----------|
| Mario Rossi | Cardiologia | mario.rossi@ospedale.it | mario.rossi |
| Laura Bianchi | Neurologia | laura.bianchi@ospedale.it | laura.bianchi |
| Giovanni Verdi | Ortopedia | giovanni.verdi@ospedale.it | giovanni.verdi |

---

## 🔗 API Documentation

Swagger UI disponibile su: **http://localhost:8080/swagger-ui.html**

---

## ⚠️ Note

- Database H2 **in-memory**: i dati si azzerano ad ogni riavvio del backend.
- Autenticazione **MVP**: basata su localStorage, senza JWT (roadmap futura).
- `spring-boot-starter-security` **non installato**: solo `spring-security-crypto`.
