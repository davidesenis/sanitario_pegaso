package com.example.sanitariobe.dto;

import com.example.sanitariobe.entity.Medico;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoProfiloResponseDto {

    private Long id;
    private String nome;
    private String cognome;
    private String email;
    private String numeroTelefono;
    private String reparto;

    public static MedicoProfiloResponseDto from(Medico medico) {
        return new MedicoProfiloResponseDto(
                medico.getId(),
                medico.getNome(),
                medico.getCognome(),
                medico.getEmail(),
                medico.getNumeroTelefono(),
                medico.getReparto()
        );
    }
}