package com.example.sanitariobe.service;

import com.example.sanitariobe.entity.Prenotazione;
import com.example.sanitariobe.entity.StatoPrenotazione;
import com.example.sanitariobe.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrenotazioneService {

    private final PrenotazioneRepository prenotazioneRepository;


    public List<Prenotazione> findByPazienteId(Long pazienteId) {
        return prenotazioneRepository.findByPazienteId(pazienteId);
    }

    public List<Prenotazione> findByMedicoId(Long medicoId) {
        return prenotazioneRepository.findByMedicoId(medicoId);
    }

    public List<Prenotazione> findByMedicoIdAndStato(Long medicoId, StatoPrenotazione stato) {
        return prenotazioneRepository.findByMedicoIdAndStato(medicoId, stato);
    }

    @Transactional
    public Prenotazione save(Prenotazione prenotazione) {
        if (prenotazione.getMedico() == null || prenotazione.getMedico().getId() == null || prenotazione.getDataOra() == null) {
            throw new IllegalArgumentException("Dati prenotazione non validi");
        }

        validateThirtyMinuteSlot(prenotazione.getDataOra());

        boolean slotOccupato = prenotazioneRepository.existsByMedicoIdAndDataOra(
                prenotazione.getMedico().getId(),
                prenotazione.getDataOra()
        );

        if (slotOccupato) {
            throw new IllegalStateException("Slot non disponibile per il medico selezionato");
        }

        // Imposta lo stato iniziale a IN_ATTESA
        if (prenotazione.getStato() == null) {
            prenotazione.setStato(StatoPrenotazione.IN_ATTESA);
        }

        Prenotazione savedPrenotazione = prenotazioneRepository.save(prenotazione);
        
        // Ricarica la prenotazione con join esplicito per ottenere paziente e medico completamente idratati
        Prenotazione fullPrenotazione = prenotazioneRepository.findByIdWithJoin(savedPrenotazione.getId()).get();

        return fullPrenotazione;
    }

    public List<LocalDateTime> findOccupiedSlotsByMedicoAndDate(Long medicoId, LocalDate data) {
        LocalDateTime start = data.atStartOfDay();
        LocalDateTime end = data.plusDays(1).atStartOfDay();

        return prenotazioneRepository.findByMedicoIdAndDataOraBetween(medicoId, start, end)
                .stream()
                .map(Prenotazione::getDataOra)
                .collect(Collectors.toList());
    }


    public Prenotazione accettaPrenotazione(Long id) {
        Optional<Prenotazione> prenotazione = prenotazioneRepository.findById(id);
        if (prenotazione.isEmpty()) {
            throw new IllegalArgumentException("Prenotazione non trovata");
        }
        Prenotazione p = prenotazione.get();
        p.setStato(StatoPrenotazione.CONFERMATA);
        Prenotazione updated = prenotazioneRepository.save(p);

        return updated;
    }

    public Prenotazione rifiutaPrenotazione(Long id) {
        Optional<Prenotazione> prenotazione = prenotazioneRepository.findById(id);
        if (prenotazione.isEmpty()) {
            throw new IllegalArgumentException("Prenotazione non trovata");
        }
        Prenotazione p = prenotazione.get();
        p.setStato(StatoPrenotazione.RIFIUTATA);
        Prenotazione updated = prenotazioneRepository.save(p);

        return updated;
    }

    // Metodo di cancellazione rimosso: le prenotazioni non vanno eliminate via servizio pubblico

    private void validateThirtyMinuteSlot(LocalDateTime dataOra) {
        int minute = dataOra.getMinute();
        if (minute != 0 && minute != 30) {
            throw new IllegalArgumentException("L'orario deve essere in slot da 30 minuti");
        }
    }
}

