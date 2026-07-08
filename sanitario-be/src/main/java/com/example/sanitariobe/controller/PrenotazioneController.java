package com.example.sanitariobe.controller;

import com.example.sanitariobe.entity.Prenotazione;
import com.example.sanitariobe.service.PrenotazioneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prenotazioni")
@RequiredArgsConstructor
@Tag(name = "Prenotazioni", description = "Gestione delle prenotazioni sanitarie")
public class PrenotazioneController {

    private final PrenotazioneService prenotazioneService;

    @GetMapping("/medico/{medicoId}/in-attesa")
    @Operation(summary = "Ottieni prenotazioni in attesa di un medico", description = "Recupera tutte le prenotazioni in attesa di conferma per un medico specifico")
    @ApiResponse(responseCode = "200", description = "Lista delle prenotazioni in attesa")
    public List<Prenotazione> getByMedicoIdInAttesa(@PathVariable Long medicoId) {
        return prenotazioneService.findByMedicoIdAndStato(medicoId, com.example.sanitariobe.entity.StatoPrenotazione.IN_ATTESA);
    }

    @PutMapping("/{id}/accetta")
    @Operation(summary = "Accetta una prenotazione", description = "Cambia lo stato della prenotazione a CONFERMATA")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Prenotazione accettata"),
        @ApiResponse(responseCode = "404", description = "Prenotazione non trovata")
    })
    public ResponseEntity<Prenotazione> accettaPrenotazione(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(prenotazioneService.accettaPrenotazione(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/rifiuta")
    @Operation(summary = "Rifiuta una prenotazione", description = "Cambia lo stato della prenotazione a RIFIUTATA")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Prenotazione rifiutata"),
        @ApiResponse(responseCode = "404", description = "Prenotazione non trovata")
    })
    public ResponseEntity<Prenotazione> rifiutaPrenotazione(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(prenotazioneService.rifiutaPrenotazione(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/paziente/{pazienteId}")
    @Operation(summary = "Ottieni prenotazioni di un paziente", description = "Recupera tutte le prenotazioni di un paziente specifico")
    @ApiResponse(responseCode = "200", description = "Lista delle prenotazioni del paziente")
    public List<Prenotazione> getByPazienteId(@PathVariable Long pazienteId) {
        return prenotazioneService.findByPazienteId(pazienteId);
    }

    @GetMapping("/medico/{medicoId}")
    @Operation(summary = "Ottieni prenotazioni di un medico", description = "Recupera tutte le prenotazioni di un medico specifico")
    @ApiResponse(responseCode = "200", description = "Lista delle prenotazioni del medico")
    public List<Prenotazione> getByMedicoId(@PathVariable Long medicoId) {
        return prenotazioneService.findByMedicoId(medicoId);
    }

    @GetMapping("/medico/{medicoId}/occupati")
    @Operation(summary = "Ottieni slot occupati del medico", description = "Recupera gli orari gia prenotati per un medico in una specifica data")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista slot occupati recuperata"),
        @ApiResponse(responseCode = "400", description = "Data non valida")
    })
    public ResponseEntity<List<LocalDateTime>> getOccupiedSlotsByMedico(
            @PathVariable Long medicoId,
            @RequestParam("data") String data
    ) {
        try {
            LocalDate localDate = LocalDate.parse(data);
            List<LocalDateTime> slotsOccupati = prenotazioneService.findOccupiedSlotsByMedicoAndDate(medicoId, localDate);
            return ResponseEntity.ok(slotsOccupati);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @Operation(summary = "Crea una nuova prenotazione", description = "Crea una nuova prenotazione collegando un paziente e un medico")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Prenotazione creata con successo"),
        @ApiResponse(responseCode = "400", description = "Dati non validi"),
        @ApiResponse(responseCode = "409", description = "Slot gia occupato")
    })
    public ResponseEntity<?> create(@RequestBody Prenotazione prenotazione) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(prenotazioneService.save(prenotazione));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
    // Endpoint DELETE rimosso: cancellazione non esposta via API pubblica
}
