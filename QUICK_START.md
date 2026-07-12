# ⚡ Quick Start — Sistema Prenotazioni Sanitarie

## 1️⃣ Avvia il Backend

Assicurati di avere **Java 21 (JDK)** installato. Su Windows, `JAVA_HOME` deve puntare alla directory del JDK (non a una JRE), ad esempio `C:\Program Files\Java\jdk-21.0.10`; dopo la modifica, apri un nuovo terminale.

```bash
cd sanitario-be
./mvnw.cmd clean package -DskipTests
java -jar target/sanitario-be-0.0.1-SNAPSHOT.jar
```

Backend disponibile su: **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**

---

## 2️⃣ Avvia il Frontend (nuovo terminale)

```bash
cd sanitario-fe
npm install   # solo la prima volta
npm run dev
```

Frontend disponibile su: **http://localhost:5173**

---

## 3️⃣ Utilizza l'Applicazione

### Flusso Paziente
1. **Registrati** → nome, cognome, email, telefono, password
2. **Accedi** → email e password
3. **Dashboard** → visualizza e gestisci le tue prenotazioni
4. **Prenota** → seleziona reparto e data/ora (lun-ven, 9-18)

### Flusso Medico
1. **Accedi** → usa le credenziali precaricate (vedi sotto)
2. **Dashboard Medico** → visualizza prenotazioni in attesa
3. **Accetta/Rifiuta** → gestisci le prenotazioni dei pazienti

---

## 👨‍⚕️ Medici Precaricati

| Email | Password | Reparto |
|-------|----------|---------|
| mario.rossi@ospedale.it | mario.rossi | Cardiologia |
| laura.bianchi@ospedale.it | laura.bianchi | Neurologia |
| giovanni.verdi@ospedale.it | giovanni.verdi | Ortopedia |

---

## 🧪 Test Rapido via curl

```bash
# Registrazione paziente
curl -X POST http://localhost:8080/api/pazienti \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mario","cognome":"Test","email":"mario.test@example.com","numeroTelefono":"3331234567","password":"Password123"}'

# Login paziente
curl -X POST http://localhost:8080/api/pazienti/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.test@example.com","password":"Password123"}'

# Lista medici
curl http://localhost:8080/api/medici

# Crea prenotazione (usa gli ID ottenuti dal login e dalla lista medici)
curl -X POST http://localhost:8080/api/prenotazioni \
  -H "Content-Type: application/json" \
  -d '{"pazienteId":1,"medicoId":1,"dataOra":"2026-06-10T10:00:00"}'
```

---

## ⚠️ Note Importanti

- Il database H2 è **in-memory**: i dati vengono persi ad ogni riavvio del backend.
- Le password sono hashate con **BCrypt** e mai esposte nelle API.
- L'autenticazione è gestita tramite **localStorage** (MVP, non JWT).
- Swagger UI: **http://localhost:8080/swagger-ui.html** per testare le API interattivamente.
