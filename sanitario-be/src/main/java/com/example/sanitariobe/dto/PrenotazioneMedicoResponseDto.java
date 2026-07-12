package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Prenotazione;
import com.example.sanitariobe.entity.StatoPrenotazione;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrenotazioneMedicoResponseDto {

    private Long id;
    private LocalDateTime dataOra;
    private StatoPrenotazione stato;
    private PazientePrenotazioneResponseDto paziente;

    public static PrenotazioneMedicoResponseDto from(Prenotazione prenotazione) {
        return new PrenotazioneMedicoResponseDto(
                prenotazione.getId(),
                prenotazione.getDataOra(),
                prenotazione.getStato(),
                PazientePrenotazioneResponseDto.from(prenotazione.getPaziente())
        );
    }
}