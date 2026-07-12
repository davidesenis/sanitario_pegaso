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
public class PrenotazionePazienteResponseDto {

    private Long id;
    private LocalDateTime dataOra;
    private StatoPrenotazione stato;
    private MedicoPrenotazioneResponseDto medico;

    public static PrenotazionePazienteResponseDto from(Prenotazione prenotazione) {
        return new PrenotazionePazienteResponseDto(
                prenotazione.getId(),
                prenotazione.getDataOra(),
                prenotazione.getStato(),
                MedicoPrenotazioneResponseDto.from(prenotazione.getMedico())
        );
    }
}