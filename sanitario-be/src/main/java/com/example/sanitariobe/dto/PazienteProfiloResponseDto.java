package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Paziente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PazienteProfiloResponseDto {

    private Long id;
    private String nome;
    private String cognome;
    private String email;
    private String numeroTelefono;

    public static PazienteProfiloResponseDto from(Paziente paziente) {
        return new PazienteProfiloResponseDto(
                paziente.getId(),
                paziente.getNome(),
                paziente.getCognome(),
                paziente.getEmail(),
                paziente.getNumeroTelefono()
        );
    }
}