package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Medico;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoPrenotazioneResponseDto {

    private String nome;
    private String cognome;
    private String numeroTelefono;
    private String reparto;

    public static MedicoPrenotazioneResponseDto from(Medico medico) {
        return new MedicoPrenotazioneResponseDto(
                medico.getNome(),
                medico.getCognome(),
                medico.getNumeroTelefono(),
                medico.getReparto()
        );
    }
}