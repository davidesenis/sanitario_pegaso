package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Paziente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PazientePrenotazioneResponseDto {

    private String nome;
    private String cognome;
    private String email;
    private String numeroTelefono;

    public static PazientePrenotazioneResponseDto from(Paziente paziente) {
        return new PazientePrenotazioneResponseDto(
                paziente.getNome(),
                paziente.getCognome(),
                paziente.getEmail(),
                paziente.getNumeroTelefono()
        );
    }
}